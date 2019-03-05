import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { FrontendMiddleware } from 'middlewares/frontend.middleware';
import { MongoRepoModule } from 'mongo-nest';
import { EventsModule } from './webRTC/events.module';
@Module({
  imports: [AuthModule, AdminModule,
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
