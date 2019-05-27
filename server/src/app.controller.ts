import { Controller, Get, Res } from '@nestjs/common';

@Controller('')
export class AppController {
    @Get('macro')
    async root(@Res() res) {
        res.sendFile('index.html');
    }

    @Get('mf')
    async mf(@Res() res) {
        res.sendFile('index.html');
    }
    @Get('praedicta')
    async praedicta(@Res() res) {
        res.sendFile('index.html');
    }

    @Get('signin/*')
    async signin(@Res() res) {
        res.sendFile('index.html');
    }
    @Get('login')
    async login(@Res() res) {
        res.sendFile('index.html');
    }
    @Get('admin')
    async admin(@Res() res) {
        res.sendFile('index.html');
    }

    @Get('admin/macro')
    async adminMacro(@Res() res) {
        res.sendFile('index.html');
    }

    @Get('test')
    async test() {
        return {};
    }
}
