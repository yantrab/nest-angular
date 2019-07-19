import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { MailerService } from '../services/mailer.service';
import { AuthModule } from '../auth/auth.module';
@Module({
    controllers: [AdminController],
    providers: [MailerService],
    imports: [AuthModule],
})
export class AdminModule {}
