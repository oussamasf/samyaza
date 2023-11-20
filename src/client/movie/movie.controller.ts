import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { IdParamsDto, QueryParamsDto } from '../../common/dto';
import {
  SearchQueryMovieDto,
  SortQueryMovieDto,
} from '../../backoffice/movie/dto';
import {
  SearchQuery,
  SortQuery,
} from '../../common/decorators/query.param.decorator';
import { AuthGuard } from '@nestjs/passport';
import AUTH_GUARD from '../../common/constants/authGuards';

/**
 * Controller responsible for handling HTTP requests related to movies.
 */
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_CLIENT))
export class MovieController {
  /**
   * Constructor for the MovieController class.
   *
   * @param movieService - The service responsible for managing movies data.
   */
  constructor(private readonly movieService: MovieService) {}

  /**
   * Retrieve a list of movies based on query parameters.
   *
   * @param queryParams - The query parameters for filtering and pagination.
   * @param search - The search query for movie data.
   * @param sort - The sorting criteria for the retrieved movies.
   * @returns A list of movies matching the specified criteria.
   */
  @Get()
  findAll(
    @Query() queryParams: QueryParamsDto,
    @SearchQuery() search: SearchQueryMovieDto,
    @SortQuery() sort: SortQueryMovieDto,
  ) {
    return this.movieService.findAll(queryParams, search, sort);
  }

  @Get('top-rated')
  async getTop() {
    return await this.movieService.getTopRated();
  }

  /**
   * Retrieve information about a single movie by its unique identifier.
   *
   * @param id - The unique identifier of the movie to be retrieved.
   * @returns The movie object if found.
   */
  @Get(':id')
  async findMovie(@Param() { id }: IdParamsDto) {
    return await this.movieService.findOne(`${id}`);
  }

  /**
   * Retrieve information about a single movie by its unique identifier.
   *
   * @param id - The unique identifier of the movie to be retrieved.
   * @returns The movie object if found.
   */
  @Get(':id/trailer')
  async findTrailer(@Param() { id }: IdParamsDto) {
    return await this.movieService.getTrailer(id);
  }
}
