import { Controller, Post, Get, Body, UseInterceptors } from '@nestjs/common';
import { LoginRequest, User, signinRequest } from 'shared';
import { UserService } from 'services/user.service';
import { LoginInterceptor, GetUserAuthenticatedInterceptor } from '../middlewares/login.middleware';
import { ReqUser } from 'decorators/user.decorator';
import { AuthorizeInterceptor } from '../middlewares/authorize.middleware';

@Controller('rest/auth')
export class AuthController {
    constructor(private readonly authService: UserService) {}

    @Post('login')
    @UseInterceptors(LoginInterceptor)
    async login(@Body() user: LoginRequest): Promise<{ status: number }> {
        return this.authService.validateUser(user.email, user.password) as any;
    }

    @Post('logout')
    @UseInterceptors(AuthorizeInterceptor)
    async logout(@ReqUser() user: User): Promise<{ status: number }> {
        return this.authService.logout(user) as any;
    }

    @Post('signin')
    async signin(@Body() user: signinRequest): Promise<any> {
        return this.authService.changePassword(user);
    }

    @UseInterceptors(GetUserAuthenticatedInterceptor)
    @Get('getUserAuthenticated')
    async getUserAuthenticated(@ReqUser() user: User): Promise<User> {
        return user;
    }
}
