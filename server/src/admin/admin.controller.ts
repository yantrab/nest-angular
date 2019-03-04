import { Controller, Post, Get, Body, Req } from '@nestjs/common';
const funds1 = require('./funds.json')
const funds2 = require('./funds.json')
@Controller('rest/admin')
export class AdminController {
    @Get('/')
    async getUsersData(): Promise<any> {
        return funds1;
    }

    @Get('/suppress')
    async getUsersData2(): Promise<any> {
        return funds2;
    }
}
