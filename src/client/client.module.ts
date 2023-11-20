import { Module } from '@nestjs/common';
import { ClientAuthModule } from './account/client.auth.module';
import { RouterModule } from '@nestjs/core';
import { MovieModule } from './movie/movie.module';
import { SeriesModule } from './series/series.module';

@Module({
  imports: [
    ClientAuthModule,
    MovieModule,
    SeriesModule,
    RouterModule.register([
      {
        path: 'client/account',
        module: ClientAuthModule,
      },
      {
        path: 'client/movie',
        module: MovieModule,
      },
      {
        path: 'client/series',
        module: SeriesModule,
      },
    ]),
  ],
})
export class ClientModule {}
