import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session'

//import {join} from 'path'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useStaticAssets(join(__dirname, '../../', 'client/dist'));
  //app.setGlobalPrefix('rest');
  app.useGlobalPipes(new ValidationPipe());
  app.use(session({
    secret: "mysecretkey",
    resave: true,
    saveUninitialized: true,
    maxAge: 36000,
    cookie: {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: null
    }
  }))

  await app.listen(3000);
}
bootstrap();
