import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserService } from '../services/user.service';
@Module({
    controllers: [AdminController],
    providers: [UserService],
})
export class AdminModule {}
