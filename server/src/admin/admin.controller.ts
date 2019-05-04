import { Controller, Post, Get, Body, Req, UseInterceptors } from '@nestjs/common';
import { App } from 'shared';
import { AuthorizeInterceptor } from 'middlewares/authorize.middleware';

@UseInterceptors(AuthorizeInterceptor)
@Controller('rest/admin')
export class AdminController {
    @Get('/')
    getUsersData() {
        return [];
    }
}
