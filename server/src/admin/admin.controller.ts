import { Controller, Get, Param } from '@nestjs/common';
import { App, User } from 'shared/models';
import { UserService } from '../services/user.service';

@Controller('rest/admin')
export class AdminController {
    constructor(private userService: UserService) {}
    @Get('users/:app')
    async users(@Param('app') app: App): Promise<User[]> {
        return this.userService.getUsers({});
    }
}
