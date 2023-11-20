import { Module } from '@nestjs/common';
import { BackofficeAuthModule } from './account/auth.module';
import { RouterModule } from '@nestjs/core';
import { GenreModule } from './genre/genre.module';
import { MovieModule } from './movie/movie.module';
import { SeriesModule } from './series/series.module';

@Module({
  imports: [
    BackofficeAuthModule,
    GenreModule,
    MovieModule,
    SeriesModule,

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
      {
        path: 'backoffice/series',
        module: SeriesModule,
      },
    ]),
  ],
})
export class BackofficeModule {}
