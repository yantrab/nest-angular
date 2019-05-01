import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // enable cors for static angular site.
  const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  };
  app.register(require('fastify-cors'), corsOptions);

  // enable cookie for auth.
  app.register(require('fastify-cookie'));

  // validate types and extra
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));

  await app.listen(3000);
}
bootstrap();
