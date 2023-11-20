import { Module } from '@nestjs/common';
import { ClientAuthModule } from './account/client.auth.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ClientAuthModule,
    RouterModule.register([
      {
        path: 'client/account',
        module: ClientAuthModule,
      },
    ]),
  ],
})
export class ClientModule {}
