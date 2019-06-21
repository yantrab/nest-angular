import { Module } from '@nestjs/common';
import { TadorController } from './tador.controller';
import { TadorService } from './tador.service';
@Module({
    providers: [TadorService],
    controllers: [TadorController],
})
export class TadorModule {}
