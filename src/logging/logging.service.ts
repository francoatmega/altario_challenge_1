import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(LoggingService.name);
  }

  logFileUploadStart(file: any, requestId: string) {
    this.logger.log({
      requestId,
      event: 'FILE_UPLOAD_START',
      timestamp: new Date().toISOString(),
      fileInfo: {
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
      metrics: {
        startTime: Date.now(),
      },
    });
  }

  logFileUploadSuccess(file: any, duration: number, requestId: string) {
    this.logger.log({
      requestId,
      event: 'FILE_UPLOAD_SUCCESS',
      timestamp: new Date().toISOString(),
      fileInfo: {
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
      metrics: {
        duration,
        endTime: Date.now(),
      },
    });
  }

  logFileUploadError(error: Error, file: any, duration: number, requestId: string) {
    this.logger.error({
      requestId,
      event: 'FILE_UPLOAD_ERROR',
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
      },
      fileInfo: {
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
      metrics: {
        duration,
        endTime: Date.now(),
      },
    });
  }
} 