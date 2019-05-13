import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
const clientPath = join(__dirname, '../../client/dist');
@Controller()
export class AppController {
    @Get('macro')
    async root(@Res() res) {
        res.sendFile("index.html");
    }
}
