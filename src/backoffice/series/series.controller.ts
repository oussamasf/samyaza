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
import { SeriesService } from './series.service';

// decorator
import {
  SearchQuery,
  SortQuery,
} from '../../common/decorators/query.param.decorator';

// DTOS
import {
  CreateSeriesDto,
  UpdateSeriesDto,
  SearchQuerySeriesDto,
  SortQuerySeriesDto,
} from './dto';
import { QueryParamsDto } from '../../common/dto';

// Constants
import AUTH_GUARD from '../../common/constants/authGuards';
import { seriesSeeds } from './seeds';

// TODO swagger

@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_BACKOFFICE))
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.create(createSeriesDto);
  }

  @Post('/seed')
  createMultiple() {
    return this.seriesService.createMultiple(seriesSeeds);
  }

  @Get()
  findAll(
    @Query() queryParams: QueryParamsDto,
    @SearchQuery() search: SearchQuerySeriesDto,
    @SortQuery() sort: SortQuerySeriesDto,
  ) {
    return this.seriesService.findAll(queryParams, search, sort);
  }

  @Get(':id')
  async findOne(@Param('id') _id: string) {
    return await this.seriesService.findOneWithException(_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateSeriesDto) {
    return this.seriesService.update(id, updateMovieDto);
  }
}
