import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { LoginRequest, User } from 'shared';
import { UserService } from 'services/user.service';
import { LoginInterceptor } from '../middlewares/login.middleware';

@Controller('rest/auth')
export class AuthController {
  constructor(private readonly authService: UserService) {}

  @Post('login')
  @UseInterceptors(new LoginInterceptor())
  async login(@Body() user: LoginRequest): Promise<User> {
    return this.authService.validateUser(user.email, user.password);
  }

  @Get('getUserAuthenticated')
  async getUserAuthenticated(@Req() req): Promise<User> {
    return this.authService.getUserAuthenticated(req.cookies.t);
  }
}
