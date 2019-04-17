import { Controller, Get, Req, Post, Body } from '@nestjs/common';
import { InitialData, DataRequest, Data, Category } from 'shared/models/macro.model';
import { MacroService } from './macro.service';
// import * as data from '../../../../macro/data/data.json';
// import * as categories from '../../../../macro/data/categories.json';
// import * as serias from '../../../../macro/data/serias.json';

@Controller('rest/macro')
export class MacroController {
    constructor(private service: MacroService) {
         this.service.update();
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
