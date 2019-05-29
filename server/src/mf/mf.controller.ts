import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { App } from 'shared';
import { FundService } from 'services/fund.service';
import { MFService } from './mf.service';
import { UserSettings } from 'shared';
// import { ControllerRole } from 'auth/roles.decorator';
import { NormelizeInterceptor } from '../middlewares/normelize.middleware';
import { AuthorizeInterceptor } from '../middlewares/authorize.middleware';
import { InitialData } from 'shared/models/mf.model';

// @ControllerRole(App.mf)
// @UseInterceptors(new NormelizeInterceptor())
@UseInterceptors(AuthorizeInterceptor)
@Controller('rest/mf')
export class MFController {
    constructor(private fundService: FundService, private mfService: MFService) {}
    static app = App.mf;
    @Get()
    async getInitialData(@Req() req): Promise<InitialData> {
        const mfSettings = await this.mfService.getSettings();
        const userSettings: UserSettings = (await this.mfService.getUserSettings(req.cookies.t)) || new UserSettings();
        if (!userSettings.userFilters) {
            userSettings.userFilters = [mfSettings.defaultUserFilter];
        }

        if (!userSettings.tableSettings) {
            userSettings.tableSettings = mfSettings.tableSettings;
            userSettings.gridSettings = mfSettings.gridSettings;
        }

        return {
            funds: await this.fundService.getFunds(),
            userSetting: userSettings,
        };
    }
}
