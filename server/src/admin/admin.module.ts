import { Module, CanActivate, ExecutionContext, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { APP_GUARD } from '@nestjs/core';
import {GuardMiddleware} from '../middlewares/guard.middleware';
import { Role } from 'shared';
@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(new GuardMiddleware([Role.Admin]).resolve).forRoutes(
      {
        path: '/admin',
        method: RequestMethod.ALL,
      },
    );
  }
}
