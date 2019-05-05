import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from './pipes/validation.pipe';
import { join } from 'path';
import { readFileSync } from 'fs';
const staticFolder = join(__dirname, '../../client/dist');
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      http2: true,
      https: {
        allowHTTP1: true, // fallback support for HTTP1
        cert: readFileSync(join(__dirname, '../../../localhost.pem')),
        key: readFileSync(join(__dirname, '../../../localhost-key.pem')),
      },
    }),
  );

  // enable cors for static angular site.
  const corsOptions = {
    origin: 'https://localhost:4200',
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
