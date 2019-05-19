import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { App, User, Permission } from 'shared/models';
import { UserService } from '../services/user.service';
import { genSalt, hash, compare } from 'bcrypt';
const cryptPassword = async password => {
    const salt = await genSalt(10);
    return hash(password, salt);
};

@Controller('rest/admin')
export class AdminController {
    constructor(private userService: UserService) {
        this.userService.userRepo.collection.countDocuments().then(async usersCount => {
            if (usersCount) {
                return;
            }
            const user = new User({
                email: 'admin@admin.com',
                phone: '0555555',
                fName: 'yoyo',
                lName: 'toto',
                roles: [{ app: App.admin, permission: Permission.user }],
            });
            user.password = await cryptPassword('123456');
            this.saveUser(user).then();
        });
    }
    @Get('users/:app')
    async users(@Param('app') app: App): Promise<User[]> {
        return this.userService.getUsers({});
    }

    @Post('saveUser')
    async saveUser(@Body() user: User): Promise<{ ok: number}> {
        return this.userService.saveUser(user) as any;
    }
}
