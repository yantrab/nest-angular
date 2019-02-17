import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './passport';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {
}
