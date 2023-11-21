import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { MovieService as BackofficeMovieService } from '../../backoffice/movie/movie.service';
import { SeriesService as BackofficeSeriesService } from '../../backoffice/series/series.service';
import { FavoriteRepository } from './repositories/favorite.repository';
import {
  movie as movieErrorMessages,
  series as seriesErrorMessages,
  global as globalErrorMessages,
} from 'src/common/constants/errorMessages';
import { onModelEnum } from './constants';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly backofficeMovieService: BackofficeMovieService,
    private readonly backofficeSeriesService: BackofficeSeriesService,
    private readonly favoriteRepository: FavoriteRepository,
  ) {}

  /**
   * Add a movie to the user's favorites list
   * @param id - ID of the movie
   * @param client - User/client object
   * @returns Created favorite movie item
   */
  async addToFavoriteMovie(id: string, client) {
    const item = await this.backofficeMovieService.findOne(id);
    if (!item) throw new NotFoundException(movieErrorMessages.MOVIE_NOT_FOUND);

    const favorite = await this.favoriteRepository.findOne({
      favoriteItem: new Types.ObjectId(id),
      userId: client.id,
    });

    if (favorite)
      throw new ConflictException(
        movieErrorMessages.MOVIE_IS_ALREADY_IN_FAVORITE_LIST,
      );

    return this.favoriteRepository.create({
      favoriteItem: new Types.ObjectId(id),
      onModel: onModelEnum.MOVIE,
      userId: client.id,
    });
  }

  /**
   * Add a series to the user's favorites list
   * @param id - ID of the series
   * @param client - User/client object
   * @returns Created favorite series item
   */
  async addToFavoriteSeries(id: string, client) {
    const item = await this.backofficeSeriesService.findOne(id);
    if (!item)
      throw new NotFoundException(seriesErrorMessages.SERIES_NOT_FOUND);

    const favorite = await this.favoriteRepository.findOne({
      favoriteItem: new Types.ObjectId(id),
      userId: client.id,
    });

    if (favorite)
      throw new ConflictException(
        seriesErrorMessages.SERIES_IS_ALREADY_IN_FAVORITE_LIST,
      );

    return this.favoriteRepository.create({
      favoriteItem: new Types.ObjectId(id),
      onModel: onModelEnum.SERIES,
      userId: client.id,
    });
  }

  /**
   * Get the list of favorite movies for the user
   * @param client - User/client object
   * @returns List of favorite movies
   */
  async getFavoriteMovieList(client) {
    return await this.favoriteRepository.findMovies(client.id);
  }

  /**
   * Get the list of favorite series for the user
   * @param client - User/client object
   * @returns List of favorite series
   */
  async getFavoriteSeriesList(client) {
    return await this.favoriteRepository.findSeries(client.id);
  }

  /**
   * Remove a favorite item from the user's favorites list
   * @param id - ID of the favorite item to remove
   * @param client - User/client object
   * @returns Deletion status
   */
  async remove(id: string, client) {
    const favorite = await this.favoriteRepository.findOne({
      favoriteItem: new Types.ObjectId(id),
      userId: client.id,
    });

    if (!favorite)
      throw new ConflictException(globalErrorMessages.SOMETHING_WENT_WRONG);

    return await this.favoriteRepository.deleteItemById(new Types.ObjectId(id));
  }
}
