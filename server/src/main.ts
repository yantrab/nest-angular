import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//import {join} from 'path'
async function bootstrap() {
  const app = await NestFactory.create(AppModule, FastifyAdapter);
  //app.useStaticAssets(join(__dirname, '../../', 'client/dist'));
  //app.setGlobalPrefix('rest');
  //app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
