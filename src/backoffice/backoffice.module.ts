import { Module } from '@nestjs/common';
import { BackofficeAuthModule } from './account/auth.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    BackofficeAuthModule,

    RouterModule.register([
      {
        path: 'backoffice/account',
        module: BackofficeAuthModule,
      },
    ]),
  ],
})
export class BackofficeModule {}
