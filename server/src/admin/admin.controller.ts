import { Controller, Post, Get, Body, Req } from '@nestjs/common'
@Controller('rest/admin')
export class AdminController {
    @Get('/')
    async getUsersData(): Promise<any> {
        return [];
    }

    @Get('/suppress')
    async getUsersData2(): Promise<any> {
        return [];
    }
}
