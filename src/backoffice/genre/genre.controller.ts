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
// TODO swagger
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_BACKOFFICE))
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Post('/seed')
  createMultiple() {
    return this.genreService.createMultiple(genresSeeds);
  }

  @Get()
  findAll(
    @Query() queryParams: QueryParamsDto,
    @SearchQuery() search: SearchQueryGenreDto,
    @SortQuery() sort: SortQueryGenreDto,
  ) {
    return this.genreService.findAll(queryParams, search, sort);
  }

  @Get(':id')
  async findOne(@Param('id') _id: string) {
    return await this.genreService.findOneWithException(_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(id, updateGenreDto);
  }
}
