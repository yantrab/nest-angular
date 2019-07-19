import { Controller, Get, Param, Post, Body, Req, UseInterceptors } from '@nestjs/common';
import { App, User, Permission, Role } from 'shared/models/user.model';
import { UserService } from '../services/user.service';
import { cryptPassword, getRandomToken } from '../utils';
import { MailerService } from '../services/mailer.service';
import { exec } from 'child_process';
import { AuthorizeInterceptor } from '../middlewares/authorize.middleware';
@Controller('rest/admin')
@UseInterceptors(AuthorizeInterceptor)
export class AdminController {
    constructor(private userService: UserService, private mailer: MailerService) {
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
            this.addUser(user).then();
        });
    }

    // @Post('restart')
    // async restart(): Promise<any> {
    //     return exec('pm2 restart server');
    // }
    @Get('users/:app')
    async users(@Param('app') app: App): Promise<User[]> {
        return this.userService.getUsers({ 'roles.app': app } as any);
    }

    @Post('addUser')
    async addUser(@Body() user: User, @Req() req?) {
        const existUser = await this.userService.userRepo.findOne({ email: user.email });
        let newRole: Role;
        if (existUser) {
            newRole = user.roles.find(r => !existUser.roles.find(rr => rr.permission === r.permission && rr.app == r.app));
            if (newRole) existUser.roles.push(newRole);
        }
        const result = (await this.userService.saveUser(existUser || user)) as any;
        if (req && (newRole || !existUser)) {
            const token = await getRandomToken();
            this.userService.saveUserToekn(user.email, token);
            this.mailer.send({
                from: '"Praedicta holdings management" <info@praedicta.com>',
                to: user.email,
                subject: 'הרשאות למערכות פרדיקטה',
                html: `<div dir="rtl">
                            <h1>שלום</h1>
                            <h2>יש לך הרשאות עבור מערכת ${req.headers.referer.split('/')[4]}</h2>
                            <a href="${req.headers.referer.replace('admin/', 'signin/')}/${token}">
                                 היכנס
                            </a>
                       </div>`,
            });
        }
        return result;
    }
}
