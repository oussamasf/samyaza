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
import { GenreService } from './genre.service';

// decorator
import {
  SearchQuery,
  SortQuery,
} from '../../common/decorators/query.param.decorator';

// DTOS
import {
  CreateGenreDto,
  UpdateGenreDto,
  SearchQueryGenreDto,
  SortQueryGenreDto,
} from './dto';
import { QueryParamsDto } from '../../common/dto';

// Constants
import AUTH_GUARD from '../../common/constants/authGuards';
import { genresSeeds } from './seeds';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  createGenreRequestBody,
  updateGenreRequestBody,
} from './constants/swagger';
@Controller()
@ApiTags('Backoffice/genre')
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_BACKOFFICE))
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  /**
   * Creates a new genre.
   * @param createGenreDto The data to create a genre.
   * @returns The created genre.
   */
  @Post()
  @ApiBody({ schema: createGenreRequestBody })
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  /**
   * Creates multiple new genres.
   * @returns An array of created genres.
   */
  @Post('/seed')
  createMultiple() {
    return this.genreService.createMultiple(genresSeeds);
  }

  /**
   * Finds all genres based on query parameters, search, and sorting criteria.
   * @param queryParams The query parameters for pagination.
   * @param search The search query criteria.
   * @param sort The sorting criteria.
   * @returns A list of genres based on the query.
   */
  @Get()
  @ApiQuery({ name: 'queryParams', type: QueryParamsDto })
  @ApiQuery({ name: 'search', type: SearchQueryGenreDto })
  @ApiQuery({ name: 'sort', type: SortQueryGenreDto })
  @ApiResponse({
    status: 200,
    description: 'List of genres retrieved successfully',
  })
  findAll(
    @Query() queryParams: QueryParamsDto,
    @SearchQuery() search: SearchQueryGenreDto,
    @SortQuery() sort: SortQueryGenreDto,
  ) {
    return this.genreService.findAll(queryParams, search, sort);
  }

  /**
   * Finds a genre by ID.
   * @param _id The ID of the genre to find.
   * @returns The found genre.
   */
  @Get(':id')
  async findOne(@Param('id') _id: string) {
    return await this.genreService.findOneWithException(_id);
  }

  /**
   * Updates a genre by ID.
   * @param id The ID of the genre to update.
   * @param updateGenreDto The data to update the genre.
   * @returns The updated genre.
   */
  @Patch(':id')
  @ApiBody({ schema: updateGenreRequestBody })
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(id, updateGenreDto);
  }
}
