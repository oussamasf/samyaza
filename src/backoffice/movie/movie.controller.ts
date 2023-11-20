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

// TODO swagger

@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_BACKOFFICE))
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Post('/seed')
  createMultiple() {
    return this.movieService.createMultiple(moviesSeeds);
  }

  @Get()
  findAll(
    @Query() queryParams: QueryParamsDto,
    @SearchQuery() search: SearchQueryMovieDto,
    @SortQuery() sort: SortQueryMovieDto,
  ) {
    return this.movieService.findAll(queryParams, search, sort);
  }

  @Get(':id')
  async findOne(@Param('id') _id: string) {
    return await this.movieService.findOneWithException(_id);
  }

  @Patch(':id')
  update(
    @Param('id') idNumber: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.movieService.update(idNumber, updateMovieDto);
  }
}
