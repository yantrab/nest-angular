import { Controller, Get, Res } from '@nestjs/common';

@Controller('')
export class AppController {
    @Get('macro')
    async root(@Res() res) {
        res.sendFile('index.html');
    }
}
