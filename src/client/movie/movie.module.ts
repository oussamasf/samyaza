import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MovieModule as BackofficeMovieModule } from '../../backoffice/movie/movie.module';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  imports: [BackofficeMovieModule],
})
export class MovieModule {}
