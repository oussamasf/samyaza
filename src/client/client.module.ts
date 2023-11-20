import { Module } from '@nestjs/common';
import { ClientAuthModule } from './account/client.auth.module';
import { RouterModule } from '@nestjs/core';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    ClientAuthModule,
    MovieModule,
    RouterModule.register([
      {
        path: 'client/account',
        module: ClientAuthModule,
      },
      {
        path: 'client/movie',
        module: MovieModule,
      },
    ]),
  ],
})
export class ClientModule {}
