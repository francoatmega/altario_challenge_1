import { IsString, IsOptional } from 'class-validator';

export class FileUploadDto {
  @IsString()
  @IsOptional()
  description?: string;
} 