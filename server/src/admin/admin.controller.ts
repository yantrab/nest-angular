import { Controller, Post, Get, Body, Req } from '@nestjs/common';

@Controller('rest/admin')
export class AdminController {
    @Get()
    async getUsersData(): Promise<any> {
       return {apps: [{name: 'app1', id: 1}], users: [{name: 'asd'}]};
    }
}
