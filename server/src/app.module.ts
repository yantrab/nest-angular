import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { FrontendMiddleware } from 'middlewares/frontend.middleware';
import { MongoRepoModule } from 'mongo-nest';
import { EventsModule } from './webRTC/events.module';
import { App1Module } from './app1/app1.module';
@Module({
  imports: [AuthModule, AdminModule, App1Module,
    MongoRepoModule.forRoot('mongodb://localhost:27017'),
    EventsModule],
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
