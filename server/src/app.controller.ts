import { Controller, Get, Res } from '@nestjs/common';

@Controller('')
export class AppController {
    @Get('')
    async root2(@Res() res) {
        res.sendFile('index.html');
    }
    @Get('intercom-admin')
    async root(@Res() res) {
        res.sendFile('index.html');
    }

    @Get('signin/:system/:token')
    async signin(@Res() res) {
        res.sendFile('index.html');
    }

    @Get('login/:system')
    async login(@Res() res) {
        res.sendFile('index.html');
    }

    @Get('admin/:system')
    async admin(@Res() res) {
        res.sendFile('index.html');
    }
}
