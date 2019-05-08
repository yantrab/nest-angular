import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TadorModule } from './tador/tador.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from './pipes/validation.pipe';
import { join } from 'path';
import { readFileSync } from 'fs';
import { AuthorizeInterceptor } from 'middlewares/authorize.middleware';
import { AuthModule } from 'auth/auth.module';
import { UserService } from 'services/user.service';
async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
         AppModule,
        //TadorModule,
        //new FastifyAdapter());
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

    // const corsOptions = {
    //     origin: '*',
    //     optionsSuccessStatus: 200,
    //     credentials: true,
    //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // };
    app.register(require('fastify-cors'), corsOptions);

    // enable cookie for auth.
    app.register(require('fastify-cookie'));

    // validate types and extra
    app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));

    // app.useGlobalInterceptors(new AuthorizeInterceptor(app.select(AuthModule).get(UserService)));

    await app.listen(3000);
}
bootstrap();
