import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, FastifyAdapter);
  app.setGlobalPrefix('rest');
  //app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
