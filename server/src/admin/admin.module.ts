import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { GuardMiddleware } from 'middlewares/guard.middleware';
import { App } from 'shared';
@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {
  // configure(consumer: MiddlewareConsumer): void {
  //   consumer.apply(new GuardMiddleware(App.admin).use).forRoutes(
  //     {
  //       path: '/rest/admin',
  //       method: RequestMethod.ALL,
  //     },
  //   );
  // }
  //   consumer.apply(CompressionMiddleware).forRoutes( '*' );
  //   consumer.apply(new SuppressMiddleware().use).forRoutes(
  //     {
  //       path: '/rest/admin',
  //       method: RequestMethod.ALL,
  //     },
  //   );
  // }
}
