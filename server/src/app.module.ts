import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { FrontendMiddleware } from 'middlewares/frontend.middleware';
import { MongoRepoModule } from 'mongo-nest';
import { EventsModule } from './webRTC/events.module';
import { App1Module } from './app1/app1.module';
import { MacroModule } from './macro/macro.module';
import {AppController} from './app.controller'
import { PassportInitializeMiddleware, PassportSessionMiddleware } from '@nest-middlewares/passport';
@Module({
  imports: [AuthModule, AdminModule, App1Module, MacroModule,
    MongoRepoModule.forRoot('mongodb://localhost:27017'),
    EventsModule],
    // controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    // consumer.apply(FrontendMiddleware).forRoutes('*');

    consumer
    .apply(PassportInitializeMiddleware)
    .forRoutes('*')
    .apply(PassportSessionMiddleware)
    .forRoutes('*');
  }
}
