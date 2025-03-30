import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService, MULTER_CONFIG_SERVICE } from './multer.config';

@Module({
  providers: [
    {
      provide: MULTER_CONFIG_SERVICE,
      useClass: MulterConfigService,
    },
  ],
  exports: [MULTER_CONFIG_SERVICE],
})
export class MulterConfigModule {} 