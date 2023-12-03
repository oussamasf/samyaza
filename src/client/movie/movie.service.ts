import { Injectable } from '@nestjs/common';
import { MovieService as BackofficeMovieService } from '../../backoffice/movie/movie.service';

import { QueryParamsDto } from '../../common/dto';
import {
  SearchQueryMovieDto,
  SortQueryMovieDto,
} from '../../backoffice/movie/dto';
import { FindAllReturn } from '../../common/types';
import { Movie } from '../../backoffice/movie/schemas/movie.schema';
import { HttpService } from '@nestjs/axios';
import { ElasticsearchService } from 'src/search/search.service';
import { UpdateSearchMovieDto } from '../dto';

@Injectable()
export class MovieService {
  constructor(
    private readonly backofficeMovieService: BackofficeMovieService,
    private readonly httpService: HttpService,
    readonly elasticsearchService: ElasticsearchService,
  ) {}

  /**
   * Find and retrieve a list of movies based on query parameters.
   *
   * @param query - The query parameters for filtering and pagination.
   * @param search - The search query for movie data.
   * @param sort - The sorting criteria for the retrieved movies.
   * @returns A promise that resolves to a list of movies matching the specified criteria.
   */
  async findAll(
    query: QueryParamsDto,
    search: SearchQueryMovieDto,
    sort: SortQueryMovieDto,
  ): Promise<FindAllReturn<Movie>> {
    return await this.backofficeMovieService.findAll(query, search, sort);
  }

  /**
   * Find and retrieve a single movie by its unique identifier.
   *
   * @param _id - The unique identifier of the movie to be retrieved.
   * @returns A promise that resolves to the movie object if found.
   */
  async findOne(_id: string) {
    return await this.backofficeMovieService.findOneWithException(_id);
  }

  /**
   * Retrieves top 5 rated movies
   * @returns {Promise<Movie | null>} A Promise that resolves to the found movie information entry,
   * or undefined if no movie with the specified name exists.
   */
  async getTopRated() {
    return await this.backofficeMovieService.getTopRated();
  }

  /**
   * Get the trailer for a specific movie.
   * @param _id - The ID of the movie for which the trailer is requested.
   * @returns {Promise<Record<any, any>>} A Promise that resolves to the trailer information.
   */
  async getTrailer(_id: string): Promise<Record<any, any>> {
    const movie = (await this.backofficeMovieService.findOneWithException(
      _id,
    )) as Movie;

    const url = `https://api.themoviedb.org/3/movie/${movie.idNumber}/videos`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_JWT}`,
      },
    };

    const {
      data: { results },
    } = await this.httpService.axiosRef.get(url, options);
    const items = results.filter((el) => el.type === 'Trailer');
    return items;
  }

  /**
   * Search for movies based on the specified criteria.
   * @param createClientDto - The criteria to search movies.
   * @returns A Promise that resolves to the list of movies matching the search criteria.
   */
  async search(createClientDto: UpdateSearchMovieDto) {
    const ids = (
      (await this.backofficeMovieService.searchMovie(
        createClientDto.title,
        createClientDto.overview,
      )) as any
    ).map((el) => parseInt(el._id));
    return this.backofficeMovieService.findMany(ids);
  }
}
