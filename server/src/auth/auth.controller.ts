import { Controller, Post, Get, Body,Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginRequest, User } from 'shared'
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('rest/auth')
export class AuthController {
    constructor(){}
    @Post('login')
    @UseGuards(AuthGuard('local'))
    @HttpCode(HttpStatus.OK)
    async login(@Body() user: LoginRequest, @Req() req): Promise<User> {
        return req.user;
    }

    @Get('isAuthenticatd')
    async isAuthenticatd(@Req() req) {
        return { isAuthenticatd: !!req.user };
    }
}
