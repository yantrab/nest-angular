import { Controller, Post, Get, Body,Req } from '@nestjs/common';
import { LoginRequest, User } from 'shared'

@Controller('rest/auth')
export class AuthController {
    @Post('login')
    async login(@Body() user: LoginRequest): Promise<User> {
        console.log(user)
        const result = new User();
        result.fName = 'yaniv1'
        result.lName = 'trabelsi'
        return result
    }

    @Get('isAuthenticatd')
    async isAuthenticatd(@Req() req) {
        return { isAuthenticatd: !!req.user };
    }

}
