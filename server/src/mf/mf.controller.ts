import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { InitialData, App } from 'shared';
import { FundService } from 'services/fund.service';
import { MFService } from './mf.service';
import { UserSettings } from 'shared';
import { NormelizeInterceptor } from '../middlewares/normelize.middleware';
import { AuthorizeInterceptor } from '../middlewares/authorize.middleware';

@UseInterceptors(new NormelizeInterceptor())
@UseInterceptors(AuthorizeInterceptor)
@Controller('rest/mf')
export class MFController {
  constructor(private fundService: FundService, private mfService: MFService) {}
  static app = App.mf;
  @Get()
  async getInitialData(@Req() req): Promise<any> {
    const userSettings: UserSettings =
      (await this.mfService.getUserSettings(req.cookies.t)) ||
      new UserSettings();
    if (!userSettings.userFilters) {
      userSettings.userFilters = [
        (await this.mfService.getSettings()).defaultUserFilter,
      ];
    }

    return {
      funds: await this.fundService.getFunds(),
      userSetting: userSettings,
    };
  }
}
