import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { InitialData } from 'shared';
import { FundService } from 'services/fund.service';
import { MFService } from './mf.service';
import { UserSettings } from 'shared';
import { NormelizeInterceptor } from '../middlewares/normelize.middleware';

@UseInterceptors(new NormelizeInterceptor())
@Controller('rest/mf')
export class MFController {
    constructor(private fundService: FundService, private mfService: MFService) { }
    @Get()
    async getInitialData(@Req() req): Promise<InitialData> {
        const userSettings: UserSettings = (await this.mfService.getUserSettings(req.cookies.t)) || new UserSettings();
        if (!userSettings.userFilters) {
            userSettings.userFilters = [(await this.mfService.getSettings()).defaultUserFilter];
        }
        return {
            funds: (await this.fundService.getFunds()),
            userSetting: userSettings,
        };
    }
}
