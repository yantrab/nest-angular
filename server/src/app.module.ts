import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { MongoRepoModule } from 'mongo-nest';
import { EventsModule } from './webRTC/events.module';
import { App1Module } from './app1/app1.module';
import { MacroModule } from './macro/macro.module';
@Module({
  imports: [
    AdminModule, AuthModule, 
    // App1Module, MacroModule,
     MongoRepoModule.forRoot('mongodb://localhost:27017'),
    //EventsModule, AuthModule
  ]
  ,
})
export class AppModule {
}
