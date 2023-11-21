import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MovieModule as BackofficeMovieModule } from '../../backoffice/movie/movie.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  imports: [BackofficeMovieModule, HttpModule],
})
export class MovieModule {}
