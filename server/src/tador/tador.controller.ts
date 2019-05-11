import { Controller, Get, Post, Param, Body } from '@nestjs/common';

@Controller('tador')
export class TadorController {
    @Get('getInitialData')
    async getInitialData() {}

    writeItem: number;
    page: number;
    @Get('testNumber/:str')
    // http://localhost:3000/tador/testNumber/test%208
    testNumber(@Param('str') str: string) {
        return str.replace('test', '').trim();
    }

    // @Post('testNumberPost')
    // // http://localhost:3000/tador/testNumberPost    json = "test 5"
    // testNumberPost(@Body() str: string) {
    //     return str.replace('test', '').trim();
    // }
    @Get('write/:str')
    // http://localhost:3000/tador/write/7
    write(@Param('str') str: number) {
        this.writeItem = str;
        return 'ok';
    }

    // @Post('writePost')
    // // http://localhost:3000/tador/write   json = "7"
    // writePost(@Body() str: number) {
    //     this.writeItem = str;
    //     return 'ok';
    // }

    @Get('read')
    // http://localhost:3000/tador/read
    read() {
        return this.writeItem;
    }

    // @Post('readPost')
    // // http://localhost:3000/tador/read
    // readPost() {
    //     return this.writeItem;
    // }

    @Get('writePage/:str')
    // http://localhost:3000/tador/writePage/7
    writePage(@Param('str') str: string) {
        this.page = +str;
        return 'ok';
    }

    // @Post('writePagePost')
    // // http://localhost:3000/tador/writePage   json = "7"
    // writePagePost(@Body() str: string) {
    //     this.page = +str;
    //     return 'ok';
    // }

    @Get('readPage')
    // http://localhost:3000/tador/readPage
    readPage() {
        return (
            new Array(this.page).fill(String.fromCharCode(0)).join('') +
            new Array(255 - this.page)
                .fill('0')
                .map((_, i) => String.fromCharCode(i))
                .join('')
        );
    }

    // @Post('readPagePost')
    // // http://localhost:3000/tador/readPage
    // readPagePost() {
    //     return (
    //         new Array(this.page).fill(String.fromCharCode(0)).join('') +
    //         new Array(255 - this.page)
    //             .fill('0')
    //             .map((_, i) => String.fromCharCode(i))
    //             .join('')
    //     );
    // }
}
