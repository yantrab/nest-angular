import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { InitialData, DataRequest, Data } from 'shared/models/macro.model';
import { MacroService } from './macro.service';
import { AuthorizeInterceptor } from 'middlewares/authorize.middleware';
import { App } from 'shared';

@UseInterceptors(AuthorizeInterceptor)
@Controller('rest/macro')
export class MacroController {
  static app = App.macro;

  constructor(private service: MacroService) {
    // this.service.update();
  }
  @Get()
  async getInitialData(@Req() req): Promise<InitialData> {
    return {
      categories: await this.service.getCategories(),
      serias: await this.service.getSeries(),
    };
  }

  @Post('/data')
  getData(@Body() form: DataRequest): Promise<Data[]> {
    return this.service.getData(form);
  }
}
