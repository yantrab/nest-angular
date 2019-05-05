import { Module } from '@nestjs/common';
import { MFController } from './mf.controller';
import { MFService } from './mf.service';
import { FundService } from 'services/fund.service';
import { UserService } from 'services/user.service';
@Module({
  controllers: [MFController],
  providers: [MFService, FundService, UserService],
})
export class MFModule {}
