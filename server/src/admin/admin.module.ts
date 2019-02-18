import { Module, CanActivate, ExecutionContext } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService]
})
export class AuthModule {
}
