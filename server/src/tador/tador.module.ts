import { Module } from '@nestjs/common';
import { TadorController } from './tador.controller';
import { TadorGateway } from './tador.gateway';
@Module({
  providers:[TadorGateway],
  controllers: [TadorController],
})
export class TadorModule {}
