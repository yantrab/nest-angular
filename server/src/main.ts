import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from './pipes/validation.pipe';
import { readFileSync } from 'fs';

// import { AuthorizeInterceptor } from 'middlewares/authorize.middleware';
// import { AuthModule } from 'auth/auth.module';
// import { UserService } from 'services/user.service';
import { join } from 'path';
import { FrontendMiddleware } from './middlewares/frontend.middleware';
const clientPath = join(__dirname, '../../client/dist');
async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        process.env.NODE_ENV === 'prudaction'
            ? new FastifyAdapter({
                  http2: true,
                  https: {
                      allowHTTP1: true, // fallback support for HTTP1
                      cert: readFileSync(join(__dirname, '../../../localhost.pem')),
                      key: readFileSync(join(__dirname, '../../../localhost-key.pem')),
                  },
              })
            : new FastifyAdapter(),
    );

    // enable cors for static angular site.
    const corsOptions = {
        origin: [
            'https://localhost:4200',
            'http://localhost:4200',
            'http://localhost:3200',
            'http://128.199.41.162:4200'
        ],
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
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
        }),
    );

    app.useStaticAssets({ root: clientPath });
    await app.listen(3000, '0.0.0.0');
}
bootstrap();
