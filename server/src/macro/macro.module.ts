import { Module } from '@nestjs/common';
import { MacroController } from './macro.controller';
import { MacroService } from './macro.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [MacroController],
  providers: [MacroService],
  imports: [AuthModule]
})
export class MacroModule {}
