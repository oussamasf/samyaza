import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Controller
import { BackofficeAuthController } from './backoffice.auth.controller';

// Service
import { BackofficeService } from './backoffice.service';
import { AdminsRepository } from './repositories/backoffice.account.repository';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies/';

// Schema
import { Admin, AdminSchema } from './schemas/admin.schema';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    JwtModule.register({}),
  ],
  controllers: [BackofficeAuthController],
  providers: [
    BackofficeService,
    AdminsRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class BackofficeAuthModule {}
