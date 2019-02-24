import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { FrontendMiddleware } from 'middlewares/frontend.middleware';
//import { DBService } from 'services/db.service';
import { MongoRepoModule } from 'services/repo';
import { MongoClient } from 'mongodb';
import { RepositoryFactory } from 'services/repo';

@Module({
  imports: [AuthModule, AdminModule, MongoRepoModule.forRoot('mongodb://localhost:27017')],
  // providers: [{
  //   provide: 'MONGO_CONNECTION',
  //   useFactory: async () => await new MongoClient('mongodb://localhost:27017').connect(),
  // }, RepositoryFactory],
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
