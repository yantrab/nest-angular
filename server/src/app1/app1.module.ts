import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AdminController } from './app1.controller';
import { GuardMiddleware } from '../middlewares/guard.middleware';
import { SuppressMiddleware } from '../middlewares/suppress.middleware';
import { Role } from 'shared';
import { CompressionMiddleware } from '@nest-middlewares/compression';
@Module({
  controllers: [AdminController],
  providers: [],
})
export class App1Module {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(new GuardMiddleware([Role.Admin, Role.app1]).resolve).forRoutes(
      {
        path: '/rest/app1',
        method: RequestMethod.ALL,
      },
    );
    consumer.apply(CompressionMiddleware).forRoutes( '*' );
    consumer.apply(new SuppressMiddleware().resolve).forRoutes(
      {
        path: '/rest/app1',
        method: RequestMethod.ALL,
      },
    );
  }
}
