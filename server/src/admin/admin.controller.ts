import { Controller, Post, Get, Body, Req } from '@nestjs/common';

@Controller('rest/admin')
export class AdminController {
    @Post('/')
    async getUsersData(): Promise<any> {
        const duplicate = { _id: 1, content: 'content' };
        const test = new Array(100000).fill({ a: { c: { b: duplicate } }, b: { c: { d: { b: duplicate } } } });
        return test;
    }

    @Post('/suppress')
    async getUsersData2(): Promise<any> {
        const duplicate = { _id: 1, content: 'content' };
        const test = new Array(100000).fill({ a: { c: { b: duplicate } }, b: { c: { d: { b: duplicate } } } });
        return test;
    }
}
