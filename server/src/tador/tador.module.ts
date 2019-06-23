import { Module } from '@nestjs/common';
import { TadorController } from './tador.controller';
import { TadorService } from './tador.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    providers: [TadorService],
    controllers: [TadorController],
    imports: [AuthModule],
})
export class TadorModule {}
