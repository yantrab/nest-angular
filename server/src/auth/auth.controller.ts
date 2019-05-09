import { Controller, Post, Get, Body, Req, UseInterceptors } from '@nestjs/common';
import { LoginRequest, User } from 'shared';
import { UserService } from 'services/user.service';
import { LoginInterceptor, GetUserAuthenticatedInterceptor } from '../middlewares/login.middleware';
import { ReqUser } from 'decorators/user.decorator';

@Controller('rest/auth')
export class AuthController {
    constructor(private readonly authService: UserService) {}

    @Post('login')
    @UseInterceptors(LoginInterceptor)
    async login(@Body() user: LoginRequest): Promise<User> {
        return this.authService.validateUser(user.email, user.password);
    }
    @UseInterceptors(GetUserAuthenticatedInterceptor)
    @Get('getUserAuthenticated')
    async getUserAuthenticated(@ReqUser() user: User): Promise<User> {
        return user;
    }
}
