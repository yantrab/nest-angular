import { Controller, Get, Req, Post, Body, UseInterceptors } from '@nestjs/common';
import { InitialData, DataRequest, Data, UserSettings } from 'shared/models/macro.model';
import { MacroService } from './macro.service';
import { AuthorizeInterceptor } from 'middlewares/authorize.middleware';
import { App, User } from 'shared';
import { ReqUser } from '../decorators/user.decorator';
import { ControllerRole } from 'auth/roles.decorator';
//@ControllerRole(App.macro)
@UseInterceptors(AuthorizeInterceptor)
@Controller('rest/macro')
export class MacroController {
    static app = App.macro;
    
    constructor(private service: MacroService) {
          // this.service.update();
    }
    @Get()
    async getInitialData(@ReqUser() user: User): Promise<InitialData> {
        return {
            categories: await this.service.getCategories(),
            series: await this.service.getSeries(),
            userSettings: await this.service.getUserSettings(user._id),
        };
    }

    @Post('data')
    getData(@Body() form: DataRequest): Promise<Data[]> {
        return this.service.getData(form);
    }

    @Post('saveUserSettings')
    saveUserSettings(@Body() userSettings: UserSettings) {
         this.service.saveUserSettings(userSettings);
    }
}
