import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import {MFController } from './mf.controller';
import { App } from 'shared';
import { MFService } from './mf.service';
import { FundService } from 'services/fund.service';
import { UserService } from 'services/user.service';
@Module({
  controllers: [MFController],
  providers: [MFService, FundService, UserService],
})
export class MFModule {
  constructor(private userService: UserService) {}
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req, res, next) => {
        await this.userService.checkAuthorization(req.cookies.t, App.mf);
        next();
      })
      .forRoutes({
        path: '/rest/mf',
        method: RequestMethod.ALL,
      });
  }
}
