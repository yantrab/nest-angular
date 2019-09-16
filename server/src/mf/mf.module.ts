import { Module } from '@nestjs/common';
import { MFController } from './mf.controller';
import { MFService } from './mf.service';
import { FundService } from 'services/fund.service';
import { AuthModule } from '../auth/auth.module';
@Module({
    controllers: [MFController],
    providers: [MFService, FundService],
    imports: [AuthModule],
})
export class MFModule {}
