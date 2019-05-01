import { Module} from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {
  // configure(consumer: MiddlewareConsumer): void {
  //   consumer.apply(new GuardMiddleware(App.admin).use).forRoutes(
  //     {
  //       path: '/rest/admin',
  //       method: RequestMethod.ALL,
  //     },
  //   );
  //   consumer.apply(CompressionMiddleware).forRoutes( '*' );
  //   consumer.apply(new SuppressMiddleware().use).forRoutes(
  //     {
  //       path: '/rest/admin',
  //       method: RequestMethod.ALL,
  //     },
  //   );
  // }
}
