import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { configOptions } from '../utils/config/env/';

import { RemovePasswordFieldInterceptor } from './interceptors/passwordRemover.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingMiddleware } from './middlewares/http-logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    MongooseModule.forRoot(process.env.MONGO_URL),

    //? rate limiter
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    EventEmitterModule.forRoot({ verboseMemoryLeak: true }),
  ],
  controllers: [AppController],
  providers: [
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
