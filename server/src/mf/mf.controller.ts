import { Body, Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import { App, User } from 'shared';
import { FundService } from 'services/fund.service';
import { MFService } from './mf.service';
import { UserSettings } from 'shared/models/mf.model';
import { NormelizeInterceptor } from '../middlewares/normelize.middleware';
import { AuthorizeInterceptor } from '../middlewares/authorize.middleware';
import { InitialData } from 'shared/models/mf.model';
import { ReqUser } from '../decorators/user.decorator';
import { InsertOneWriteOpResult } from 'mongodb';

// @ControllerRole(App.mf)
// @UseInterceptors(new NormelizeInterceptor())
@UseInterceptors(AuthorizeInterceptor)
@Controller('rest/mf')
export class MFController {
    constructor(private fundService: FundService, private mfService: MFService) {}
    static app = App.mf;
    @Get()
    async getInitialData(@ReqUser() user: User): Promise<InitialData> {
        const mfSettings = await this.mfService.getSettings();
        const userSettings: UserSettings =
            (await this.mfService.getUserSettings(user.email)) || new UserSettings({ email: user.email });
        if (!userSettings.userFilters) {
            userSettings.userFilters = [mfSettings.defaultUserFilter];
        }

        if (!userSettings.tableSettings) {
            userSettings.tableSettings = mfSettings.tableSettings;
            userSettings.gridSettings = mfSettings.gridSettings;
        }
        const a = (await this.mfService.saveUserSettings(userSettings)) as InsertOneWriteOpResult;
        userSettings._id = a.insertedId;
        return {
            funds: await this.fundService.getFunds(),
            userSetting: userSettings,
        };
    }

    @Post('saveUserSettings')
    saveUserSettings(@Body() userSettings: UserSettings) {
        return this.mfService.saveUserSettings(userSettings);
    }
}
