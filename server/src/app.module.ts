import { Module, NestModule ,MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { FrontendMiddleware } from 'middlewares/frontend.middleware';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [AuthModule, AdminModule,PassportModule.register({ session: true })],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(FrontendMiddleware).forRoutes(
      {
        path: '/**', 
        method: RequestMethod.ALL,
      },
    );
    consumer.apply(new FrontendMiddleware().resolve)
  }
}
