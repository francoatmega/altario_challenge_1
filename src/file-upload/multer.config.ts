import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';

export const MULTER_CONFIG_SERVICE = 'MulterConfigService';

@Injectable()
export class MulterConfigService {
  private readonly logger = new Logger(MulterConfigService.name);

  constructor() {
    this.logger.log('MulterConfigService initialized');
  }

  getMulterConfig() {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './upload');
        },
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: {
        files: 1,
      },
      fileFilter: (req, file, cb) => {
        this.logger.debug({
          event: 'FILE_UPLOAD_ATTEMPT',
          filename: file.originalname,
          size: file.size,
          requestId: req.id,
        });
        cb(null, true);
      },
    };
  }
} 