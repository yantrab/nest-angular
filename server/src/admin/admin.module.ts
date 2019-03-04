import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { GuardMiddleware } from '../middlewares/guard.middleware';
import { SuppressMiddleware } from '../middlewares/suppress.middleware';
import { Role } from 'shared';
import { CompressionMiddleware } from '@nest-middlewares/compression';
@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(new GuardMiddleware([Role.Admin]).resolve).forRoutes(
      {
        path: '/rest/admin',
        method: RequestMethod.ALL,
      },
    );
    consumer.apply(CompressionMiddleware).forRoutes( '*' );
    consumer.apply(new SuppressMiddleware().resolve).forRoutes(
      {
        path: '/rest/admin/suppress',
        method: RequestMethod.ALL,
      },
    );
  }
}
