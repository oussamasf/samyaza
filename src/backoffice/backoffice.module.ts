import { Module } from '@nestjs/common';
import { BackofficeAuthModule } from './account/auth.module';
import { RouterModule } from '@nestjs/core';
import { GenreModule } from './genre/genre.module';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    BackofficeAuthModule,
    GenreModule,
    MovieModule,

    RouterModule.register([
      {
        path: 'backoffice/account',
        module: BackofficeAuthModule,
      },
      {
        path: 'backoffice/genre',
        module: GenreModule,
      },
      {
        path: 'backoffice/movie',
        module: MovieModule,
      },
    ]),
  ],
})
export class BackofficeModule {}
