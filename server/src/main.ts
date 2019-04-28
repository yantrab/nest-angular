import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';
import passport = require('passport');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, FastifyAdapter);
  // app.useStaticAssets(join(__dirname, '../../', 'client/dist'));
  // app.setGlobalPrefix('rest');
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
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

  await app.listen(3000);
}
bootstrap();
