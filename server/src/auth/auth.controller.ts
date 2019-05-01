import { Controller, Post, Get, Body, Req, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { LoginRequest, User } from 'shared';
import { UserService } from 'services/user.service';
import * as NodeCache from 'node-cache';
import { randomBytes } from 'crypto';
const generateToken = (): Promise<string> => new Promise(resolve => randomBytes(48, (err, buffer) => resolve(buffer.toString('hex'))));

@Controller('rest/auth')
export class AuthController {
    private chache = new NodeCache({ stdTTL: 60 * 60 * 12 });
    constructor(private readonly authService: UserService) { }

    @Post('login')
    async login(@Body() user: LoginRequest, @Res() reply): Promise<User> {
        const foundUser = await this.authService.validateUser(user.email, user.password);
        const token = await generateToken();
        reply.setCookie('t', token, { path: '/' });
        setTimeout(() => this.chache.set(token, foundUser));
        return foundUser;
    }

    @Get('getUserAuthenticated')
    async getUserAuthenticated(@Req() req): Promise<{ user: User }> {

        // setTimeout(() => this.chache.set(token, foundUser));
        return { user: req.user };
    }
}
