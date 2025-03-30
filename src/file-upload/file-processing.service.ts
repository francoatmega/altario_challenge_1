import { Injectable } from '@nestjs/common';
import { FileUploadDto } from './dto/file-upload.dto';

@Injectable()
export class FileProcessingService {
  async processFile(file: Express.Multer.File, description?: string): Promise<void> {
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
} 