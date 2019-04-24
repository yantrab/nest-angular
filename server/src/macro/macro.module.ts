import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MacroController } from './macro.controller';
import { GuardMiddleware } from '../middlewares/guard.middleware';
import { App } from 'shared';
import { CompressionMiddleware } from '@nest-middlewares/compression';
import { MacroService } from './macro.service';
@Module({
  controllers: [MacroController],
  providers: [MacroService],
})
export class MacroModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(new GuardMiddleware(App.macro).resolve).forRoutes(
      {
        path: '/rest/macro',
        method: RequestMethod.ALL,
      },
    );
    consumer.apply(CompressionMiddleware).forRoutes( '*' );
  }
}
