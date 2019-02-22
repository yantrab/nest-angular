import { Controller, Post, Get, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginRequest, User } from 'shared';

@Controller('rest/auth')
export class AuthController {
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() user: LoginRequest, @Req() req): Promise<User> {
        return req.user;
    }

    @Get('getUserAuthenticated')
    async getUserAuthenticated(@Req() req): Promise<{ user: User }> {
        return { user: req.user };
    }
}
