import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { AuthService } from '../auth/auth.service';
import { LoggingService } from '../logging/logging.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigModule } from './multer.module';

@Module({
  imports: [
    MulterConfigModule,
    MulterModule.registerAsync({
      imports: [MulterConfigModule],
      useFactory: (multerConfigService) => multerConfigService.getMulterConfig(),
      inject: ['MulterConfigService'],
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService, AuthService, LoggingService],
})
export class FileUploadModule {} 