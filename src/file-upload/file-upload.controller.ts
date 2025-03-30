import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BasicAuthGuard } from '../auth/auth.guard';
import { LoggingService } from '../logging/logging.service';
import { Request } from 'express';
import { ParseFilePipeBuilder } from '@nestjs/common';

@Controller('upload')
@UseGuards(ThrottlerGuard, BasicAuthGuard)
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly loggingService: LoggingService,
  ) {}

  private activeUploads = 0;
  private readonly MAX = 5;

  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(csv)$/i,
        })
        .addMaxSizeValidator({
          maxSize: 250 * 1024 * 1024, // 250MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    this.activeUploads++;

    if (this.activeUploads >= this.MAX) {
      throw new Error('Max concurrent uploads reached');
    }

    const startTime = Date.now();
    this.loggingService.logFileUploadStart(file, req.id as string);

    try {
      await this.fileUploadService.uploadFile(file);
      const duration = Date.now() - startTime;
      this.loggingService.logFileUploadSuccess(file, duration, req.id as string);
      return { message: 'File uploaded and processed successfully' };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.loggingService.logFileUploadError(error, file, duration, req.id as string);
      throw error;
    } finally {
      this.activeUploads--;
    }
  }
} 