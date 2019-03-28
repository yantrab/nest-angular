import { Controller, Get, Req } from '@nestjs/common';
import { InitialData } from 'shared';
import { FundService } from 'services/fund.service';
import { MFService } from './mf.service';
import { UserSettings } from 'shared';

@Controller('rest/mf')
export class App1Controller {
    constructor(private fundService: FundService, private mfService: MFService) { }

    @Get()
    async getInitialData(@Req() req): Promise<InitialData> {
        const userSettings: UserSettings = (await this.mfService.getUserSettings(req.user._id)) || new UserSettings();
        if (!userSettings.userFilters) {
            userSettings.userFilters = [(await this.mfService.getSettings()).defaultUserFilter];
        }
        return {
            funds: (await this.fundService.getFunds()),
            userSetting: userSettings,
        };
    }
}
