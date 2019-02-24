import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from '../services/user.service';
import { LocalStrategy } from './passport';
import { ROUTE_PREFIX } from 'shared';
import { authenticate } from 'passport';
import { RepositoryFactory } from 'services/repo';
import { MongoClient } from 'mongodb';
//import { DBService } from 'services/db.service';

@Module({
  controllers: [AuthController],
  providers: [UserService, LocalStrategy,
    // {
    //   provide: 'MONGO_CONNECTION',
    //   useFactory: async () => await new MongoClient('mongodb://localhost:27017').connect(),
    // }, RepositoryFactory
  ]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(authenticate('local-signin', { session: true }))
      .forRoutes({ path: `${ROUTE_PREFIX}/auth/login`, method: RequestMethod.POST } as any);
  }
}
