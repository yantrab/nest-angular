import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import passport = require('passport');

//import {join} from 'path'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useStaticAssets(join(__dirname, '../../', 'client/dist'));
  //app.setGlobalPrefix('rest');
  app.useGlobalPipes(new ValidationPipe());
  app.use(require('cookie-parser')());
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
