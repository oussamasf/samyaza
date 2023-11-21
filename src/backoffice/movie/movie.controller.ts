import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Service
import { MovieService } from './movie.service';

// decorator
import {
  SearchQuery,
  SortQuery,
} from '../../common/decorators/query.param.decorator';

// DTOS
import {
  CreateMovieDto,
  UpdateMovieDto,
  SearchQueryMovieDto,
  SortQueryMovieDto,
} from './dto';
import { QueryParamsDto } from '../../common/dto';

// Constants
import AUTH_GUARD from '../../common/constants/authGuards';
import { moviesSeeds } from './seeds';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { updateGenreRequestBody } from './constants/swagger';

/**
 * Controller handling movie-related HTTP requests.
 */
@Controller()
@ApiTags('Backoffice/movie')
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_BACKOFFICE))
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  /**
   * Creates a new movie.
   * @param createMovieDto Details of the movie to be created.
   */
  @Post()
  @ApiBody({ type: CreateMovieDto })
  @ApiResponse({ status: 201, description: 'Movie created successfully' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  /**
   * Creates multiple movies at once.
   */
  @Post('/seed')
  createMultiple() {
    return this.movieService.createMultiple(moviesSeeds);
  }

  /**
   * Maps seeds docs into elasticSearch.
   */
  // TODO make it dynamic mapping later
  @Post('/map')
  async mapDoc() {
    this.movieService.mapDoc(moviesSeeds);
  }

  /**
   * Finds movies based on provided filters.
   * @param queryParams Query parameters for pagination.
   * @param search Search parameters for movies.
   * @param sort Sorting parameters for movies.
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
   * Finds a movie by ID.
   * @param _id ID of the movie to be found.
   */
  @Get(':id')
  async findOne(@Param('id') _id: string) {
    return await this.movieService.findOneWithException(_id);
  }

  /**
   * Updates a movie by ID.
   * @param idNumber ID of the movie to be updated.
   * @param updateMovieDto Updated movie details.
   */
  @Patch(':id')
  @ApiBody({ schema: updateGenreRequestBody })
  update(
    @Param('id') idNumber: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.movieService.update(idNumber, updateMovieDto);
  }
}
