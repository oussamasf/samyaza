import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
// import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { MovieService as BackofficeMovieService } from '../../backoffice/movie/movie.service';
import { SeriesService as BackofficeSeriesService } from '../../backoffice/series/series.service';
import { FavoriteRepository } from './repositories/favorite.repository';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly backofficeMovieService: BackofficeMovieService,
    private readonly backofficeSeriesService: BackofficeSeriesService,
    private readonly favoriteRepository: FavoriteRepository,
  ) {}
  create(createFavoriteDto: CreateFavoriteDto) {
    return createFavoriteDto;
  }

  async addToFavoriteMovie(id: string, client) {
    const item = await this.backofficeMovieService.findOne(id);
    if (!item) throw new NotFoundException('Movie not found');

    const favorite = await this.favoriteRepository.findOne({
      favoriteItem: id,
      userId: client.id,
    });
    if (favorite)
      throw new ConflictException('Movie is already in favorite list');

    return this.favoriteRepository.create({
      favoriteItem: id,
      onModel: 'Movie',
      userId: client.id,
    });
  }

  async addToFavoriteSeries(id: string, client) {
    const item = await this.backofficeSeriesService.findOne(id);
    if (!item) throw new NotFoundException('Series not found');

    const favorite = await this.favoriteRepository.findOne({
      favoriteItem: id,
      userId: client.id,
    });
    if (favorite)
      throw new ConflictException('Series is already in favorite list');

    return this.favoriteRepository.create({
      favoriteItem: id,
      onModel: 'Series',
      userId: client.id,
    });
  }

  async getFavoriteMovieList(client) {
    return await this.favoriteRepository.findMovies(client.id);
  }

  async getFavoriteSeriesList(client) {
    return await this.favoriteRepository.findSeries(client.id);
  }

  async remove(id: string, client) {
    const favorite = await this.favoriteRepository.findOne({
      favoriteItem: id,
      userId: client.id,
    });

    if (!favorite)
      throw new ConflictException('You can not perform this action');

    return await this.favoriteRepository.deleteItemById(id);
  }
}
