import { Controller, Get, Res } from '@nestjs/common';

@Controller('site')
export class AppController {
    @Get('*')
    async root(@Res() res) {
        res.sendFile('index.html');
    }
}
