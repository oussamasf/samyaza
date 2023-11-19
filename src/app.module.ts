import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { configOptions } from '../utils/config/env/';
import { BackofficeModule } from './backoffice/backoffice.module';
import { RemovePasswordFieldInterceptor } from './interceptors/passwordRemover.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingMiddleware } from './middlewares/http-logging.middleware';
import { CommonModule } from './common/common.module';
import { CommonService } from './common/common.service';

@Module({
  imports: [
    BackofficeModule,

    ConfigModule.forRoot(configOptions),
    MongooseModule.forRoot(process.env.MONGO_URL),

    //? rate limiter
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),

    CommonModule,
    EventEmitterModule.forRoot({ verboseMemoryLeak: true }),
  ],
  controllers: [AppController],
  providers: [
    CommonService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RemovePasswordFieldInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggingMiddleware).forRoutes('*');
  }
}
