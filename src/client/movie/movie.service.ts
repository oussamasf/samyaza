import { Injectable } from '@nestjs/common';
import { MovieService as BackofficeMovieService } from '../../backoffice/movie/movie.service';

import { QueryParamsDto } from '../../common/dto';
import {
  SearchQueryMovieDto,
  SortQueryMovieDto,
} from '../../backoffice/movie/dto';
import { FindAllReturn } from '../../common/types';
import { Movie } from '../../backoffice/movie/schemas/movie.schema';

@Injectable()
export class MovieService {
  constructor(
    private readonly backofficeMovieService: BackofficeMovieService,
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
}
