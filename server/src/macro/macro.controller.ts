import { Controller, Get, Req, Post, Body } from '@nestjs/common';
import { InitialData, DataRequest, DataResult } from 'shared/models/macro.model';
import * as data from '../../../../macro/data/data.json';
import * as categories from '../../../../macro/data/categories.json';
import * as serias from '../../../../macro/data/serias.json';

@Controller('rest/macro')
export class MacroController {
    @Get()
    getInitialData(@Req() req): InitialData {
        const c = categories;
        return {
            categories: categories as any,
            serias: serias as any,
        };
    }

    @Post('/data')
    getData(@Body() form: DataRequest): DataResult[] {
        return [];
    }
}
