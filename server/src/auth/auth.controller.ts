import { Controller, Post, Get, Body, Req, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { LoginRequest, User } from 'shared';
import { UserService } from 'services/user.service';
import { randomBytes } from 'crypto';
// const generateToken = (): Promise<string> => new Promise(resolve => randomBytes(48, (err, buffer) => resolve(buffer.toString('hex'))));

@Controller('rest/auth')
export class AuthController {
    constructor(private readonly authService: UserService) { }

    @Post('login')
    async login(@Body() user: LoginRequest, @Res() reply): Promise<User> {
        const foundUser = await this.authService.validateUser(user.email, user.password);
        reply.setCookie('t', foundUser._id, { path: '/' });
        // reply.send(foundUser);
        return foundUser;
    }

    @Get('getUserAuthenticated')
    async getUserAuthenticated(@Req() req): Promise<{ user?: User }> {
        return this.authService.getUserAuthenticated(req.cookies.t);
    }
}
