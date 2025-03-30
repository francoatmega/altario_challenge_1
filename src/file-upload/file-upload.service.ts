import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { mkdirSync } from 'fs';
import { existsSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { FileProcessingService } from './file-processing.service';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly uploadDir: string;
  private concurrentUploads = 0;

  constructor(
    private readonly configService: ConfigService,
    private readonly pinoLogger: PinoLogger,
    private readonly fileProcessingService: FileProcessingService,
  ) {
    this.uploadDir = join(process.cwd(), 'upload');
    this.logger.log(`Upload directory path: ${this.uploadDir}`);
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory() {
    try {
      if (!existsSync(this.uploadDir)) {
        this.logger.log(`Creating upload directory at: ${this.uploadDir}`);
        mkdirSync(this.uploadDir, { recursive: true });
        this.logger.log('Upload directory created successfully');
      } else {
        this.logger.log(`Upload directory already exists at: ${this.uploadDir}`);
      }
    } catch (error) {
      this.logger.error(`Failed to create upload directory: ${error.message}`);
      throw error;
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<void> {
    if (this.concurrentUploads >= this.configService.get('MAX_CONCURRENT_UPLOADS')) {
      throw new BadRequestException('Maximum concurrent processing limit reached');
    }

    try {
      this.concurrentUploads++;
      await this.fileProcessingService.processFile(file);
    } finally {
      this.concurrentUploads--;
    }
  }
} 