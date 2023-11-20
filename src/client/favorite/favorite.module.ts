import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { MovieModule as BackofficeMovieModule } from '../../backoffice/movie/movie.module';
import { SeriesModule as BackofficeSeriesModule } from '../../backoffice/series/series.module';
import { Favorite, FavoriteSchema } from './schemas/favorite';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriteRepository } from './repositories/favorite.repository';

@Module({
  imports: [
    BackofficeMovieModule,
    BackofficeSeriesModule,
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema },
    ]),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository],
})
export class FavoriteModule {}
