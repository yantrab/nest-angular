import { Module } from '@nestjs/common';
import { TadorController } from './tador.controller';
@Module({
  controllers: [TadorController],
})
export class TadorModule {}
