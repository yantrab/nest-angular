import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserService } from '../services/user.service';
import { MailerService } from '../services/mailer.service';
@Module({
    controllers: [AdminController],
    providers: [UserService, MailerService],
})
export class AdminModule {}
