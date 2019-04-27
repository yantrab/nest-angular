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
  const app = await NestFactory.create(AppModule);
  //const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    credentials: true,
  };
  app.use(require('cors')(corsOptions));
  app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    proxy: true,
  }));

  // app.useStaticAssets({
  //   root: resolve('../../../client/dist')
  // });
  // app.useStaticAssets(resolve('../../', 'client/dist'));
  // app.setGlobalPrefix('rest');

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
  // app.enableCors();
  app.use(require('cookie-parser')());
  app.use(require('body-parser').urlencoded({ extended: true }));

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000, '0.0.0.0');

}
bootstrap();
