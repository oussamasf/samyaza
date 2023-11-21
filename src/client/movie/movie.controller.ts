import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import { CreateSearchMovieDto, UpdateSearchMovieDto } from '../dto';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * Controller responsible for handling HTTP requests related to movies.
 */
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_CLIENT))
@ApiTags('Client/movie')
export class MovieController {
  /**
   * Constructor for the MovieController class.
   *
   * @param movieService - The service responsible for managing movies data.
   */
  constructor(private readonly movieService: MovieService) {}

  /**
   * Retrieve a list of movies based on specified query parameters.
   *
   * @param queryParams - The query parameters for filtering and pagination.
   * @param search - The search query for movie data.
   * @param sort - The sorting criteria for the retrieved movies.
   * @returns A list of movies matching the specified criteria.
   */
  @Get()
  @ApiQuery({ name: 'queryParams', type: QueryParamsDto })
  @ApiQuery({ name: 'search', type: SearchQueryMovieDto })
  @ApiQuery({ name: 'sort', type: SortQueryMovieDto })
  @ApiResponse({
    status: 200,
    description: 'List of movies retrieved successfully',
  })
  findAll(
    @Query() queryParams: QueryParamsDto,
    @SearchQuery() search: SearchQueryMovieDto,
    @SortQuery() sort: SortQueryMovieDto,
  ) {
    return this.movieService.findAll(queryParams, search, sort);
  }

  /**
   * Perform an advanced search for movies based on provided criteria.
   *
   * @param createMovieDto - The DTO containing parameters for the advanced movie search.
   * @returns A list of movies matching the advanced search criteria.
   */
  @Post('search')
  @ApiBody({
    description: 'Input data for advanced search',
    type: CreateSearchMovieDto, // intentionally made like that cause swagger cant parse type utility Partial
  })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  async advancedSearch(@Body() createMovieDto: UpdateSearchMovieDto) {
    return await this.movieService.search(createMovieDto);
  }

  /**
   * Retrieve the top-rated movies.
   *
   * @returns A list of top-rated movies.
   */
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
   * Retrieve the trailer information for a single movie by its unique identifier.
   *
   * @param id - The unique identifier of the movie for which the trailer is to be retrieved.
   * @returns The trailer information for the movie if found.
   */
  @Get(':id/trailer')
  async findTrailer(@Param() { id }: IdParamsDto) {
    return await this.movieService.getTrailer(id);
  }
}
