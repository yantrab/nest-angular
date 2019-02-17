import { Module, NestModule ,MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FrontendMiddleware } from 'middlewares/frontend.middleware';

@Module({
  imports: [AuthModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(FrontendMiddleware).forRoutes(
      {
        path: '/**', // For all routes
        method: RequestMethod.ALL, // For all methods
      },
    );
  }
}
