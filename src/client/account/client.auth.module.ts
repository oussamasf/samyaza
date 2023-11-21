import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

// Controller
import { ClientAuthController } from './client.auth.controller';

// Services
import { ClientAuthService } from './client.auth.service';

//
import { ClientAuthRepository } from './repository/client.auth.repository';

// Schema
import { Client, ClientSchema } from './schemas/client.schema';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    JwtModule.register({}),
  ],
  controllers: [ClientAuthController],
  providers: [
    ClientAuthService,
    ClientAuthRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class ClientAuthModule {}
