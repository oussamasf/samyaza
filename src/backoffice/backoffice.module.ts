import { Module } from '@nestjs/common';
import { BackofficeAuthModule } from './account/auth.module';
import { RouterModule } from '@nestjs/core';
import { GenreModule } from './genre/genre.module';

@Module({
  imports: [
    BackofficeAuthModule,
    GenreModule,

    RouterModule.register([
      {
        path: 'backoffice/account',
        module: BackofficeAuthModule,
      },
      {
        path: 'backoffice/genre',
        module: GenreModule,
      },
    ]),
  ],
})
export class BackofficeModule {}
