import { Module, MiddlewareConsumer } from '@nestjs/common';
import { CompressionMiddleware } from '@nest-middlewares/compression';
import { AdminModule } from './admin/admin.module';
import { MongoRepoModule } from 'mongo-nest';
import { TadorModule } from './tador/tador.module';
import { AppController } from 'app.controller';
import { mongoUrl } from '../../../config';
@Module({
    imports: [AdminModule, TadorModule, MongoRepoModule.forRoot(mongoUrl)],
    controllers: [AppController],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(CompressionMiddleware).forRoutes('*');
    }
}
