import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { FileUploadModule } from './file-upload/file-upload.module';
import { HealthModule } from './health/health.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { LoggingModule } from './logging/logging.module';
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    FileUploadModule,
    HealthModule,
    ThrottlerModule.forRoot([{
      ttl: 10000,
      limit: 2,
      skipIf: (context) => {
        const request = context.switchToHttp().getRequest();
        return request.url === '/health';
      },
    }]),
    AuthModule,
    LoggingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware)
      .forRoutes('*');
  }
} 