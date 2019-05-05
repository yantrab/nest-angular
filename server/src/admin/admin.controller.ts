import { Controller, Post, Get, Body, Req } from '@nestjs/common'
@Controller('rest/admin')
export class AdminController {
    @Get('/')
    getUsersData() {
        return [];
    }

    @Get('/suppress')
    getUsersData2(){
        return [];
    }
}
