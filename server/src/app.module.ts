import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { FrontendMiddleware } from 'middlewares/frontend.middleware';
import { MongoRepoModule } from 'mongo-nest';

@Module({
  imports: [AuthModule, AdminModule, MongoRepoModule.forRoot('mongodb://localhost:27017')],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(FrontendMiddleware).forRoutes(
      {
        path: '/**',
        method: RequestMethod.ALL,
      },
    );
  }
}
