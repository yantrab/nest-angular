import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from './pipes/validation.pipe';
import passport = require('passport');
import { join, resolve } from 'path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    credentials: true,
    methods:[ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  };
  app.use(require('fastify-cors'), corsOptions);

  // app.register(require('fastify-cookie'));
  // app.register(require('fastify-session'), {
  //   secret: 'keyboard cat bla bla bla bla 32 #char',
  //   resave: true,
  //   saveUninitialized: true,
  //   proxy: true,
  // });

  // app.useStaticAssets({
  //   root: resolve('../../../client/dist')
  // });
  // app.useStaticAssets(resolve('../../', 'client/dist'));
  // app.setGlobalPrefix('rest');

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
<<<<<<< HEAD
  const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    credentials: true,
  };
  app.enableCors(corsOptions);
  app.use(require('cookie-parser')());
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    proxy: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
=======
  // app.enableCors();
  // app.use(require('cookie-parser')());
  // app.use(require('body-parser').urlencoded({ extended: true }));

  // app.use(passport.initialize());
  // app.use(passport.session());
>>>>>>> update-nest

  await app.listen(3000);

}
bootstrap();
