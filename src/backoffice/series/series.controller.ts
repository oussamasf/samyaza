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
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { updateSeriesRequestBody } from './constants/swagger';

/**
 * Controller responsible for Series endpoints, requiring access token backoffice authentication.
 */
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_BACKOFFICE))
@ApiTags('Backoffice/series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  /**
   * Endpoint to create a new series.
   * @param createSeriesDto The data to create a series.
   * @returns The created series.
   */
  @Post()
  @ApiBody({ type: CreateSeriesDto })
  @ApiResponse({ status: 201, description: 'Series created successfully' })
  create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.create(createSeriesDto);
  }

  /**
   * Endpoint to create multiple series.
   * @returns An array of created series.
   */
  @Post('/seed')
  createMultiple() {
    return this.seriesService.createMultiple(seriesSeeds);
  }

  /**
   * Endpoint to find series based on query parameters.
   * @param queryParams Query parameters for pagination.
   * @param search Search query parameters for filtering series.
   * @param sort Sort query parameters for sorting series.
   * @returns An array of found series and their count.
   */
  @Get()
  @ApiQuery({ name: 'queryParams', type: QueryParamsDto })
  @ApiQuery({ name: 'search', type: SearchQuerySeriesDto })
  @ApiQuery({ name: 'sort', type: SortQuerySeriesDto })
  @ApiResponse({
    status: 200,
    description: 'List of series retrieved successfully',
  })
  findAll(
    @Query() queryParams: QueryParamsDto,
    @SearchQuery() search: SearchQuerySeriesDto,
    @SortQuery() sort: SortQuerySeriesDto,
  ) {
    return this.seriesService.findAll(queryParams, search, sort);
  }
  /**
   * Endpoint to find a specific series by its ID.
   * @param _id The ID of the series to find.
   * @returns The found series.
   */
  @Get(':id')
  async findOne(@Param('id') _id: string) {
    return await this.seriesService.findOneWithException(_id);
  }

  /**
   * Endpoint to update a series by its ID.
   * @param id The ID of the series to update.
   * @param updateSeriesDto The data to update the series.
   * @returns The updated series.
   */
  @Patch(':id')
  @ApiBody({ schema: updateSeriesRequestBody })
  update(@Param('id') id: string, @Body() updateSeriesDto: UpdateSeriesDto) {
    return this.seriesService.update(id, updateSeriesDto);
  }
}
