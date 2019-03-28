import { Controller, Get, Req, Post, Body } from '@nestjs/common';
import { InitialData, DataRequest, DataResult } from './macro.model';

// tslint:disable-next-line: no-var-requires
const data = require('../../../../macro/data/data.json');
// tslint:disable-next-line: no-var-requires
const categories = require('../../../../macro/data/categories.json');
// tslint:disable-next-line: no-var-requires
const serias = require('../../../../macro/data/serias.json');

@Controller('rest/macro')
export class MacroController {
    @Get()
    getInitialData(@Req() req): InitialData {
        return {
            categories,
            serias,
        };
    }

    @Post('/data')
    getData(@Body() form: DataRequest): DataResult[] {
        return [];
    }
}
