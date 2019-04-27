import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { App1Controller } from './app1.controller';
import { GuardMiddleware } from '../middlewares/guard.middleware';
import { SuppressMiddleware } from '../middlewares/suppress.middleware';
import { App } from 'shared';
import { CompressionMiddleware } from '@nest-middlewares/compression';
import { MFService } from './mf.service';
import { FundService } from 'services/fund.service';
@Module({
  controllers: [App1Controller],
  providers: [MFService, FundService],
})
export class App1Module {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(new GuardMiddleware(App.app1).use).forRoutes(
      {
        path: '/rest/app1',
        method: RequestMethod.ALL,
      },
    );
    consumer.apply(CompressionMiddleware).forRoutes( '*' );
    consumer.apply(new SuppressMiddleware().use).forRoutes(
      {
        path: '/rest/app1',
        method: RequestMethod.ALL,
      },
    );
  }
}
