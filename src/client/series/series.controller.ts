import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { SeriesService } from './series.service';
import { IdParamsDto, QueryParamsDto } from '../../common/dto';
import {
  SearchQuerySeriesDto,
  SortQuerySeriesDto,
} from '../../backoffice/series/dto';
import {
  SearchQuery,
  SortQuery,
} from '../../common/decorators/query.param.decorator';
import { AuthGuard } from '@nestjs/passport';
import AUTH_GUARD from '../../common/constants/authGuards';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * Controller responsible for handling HTTP requests related to series.
 */
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_CLIENT))
@ApiTags('Client/series')
export class SeriesController {
  /**
   * Constructor for the SeriesController class.
   *
   * @param seriesService - The service responsible for managing series data.
   */
  constructor(private readonly seriesService: SeriesService) {}

  /**
   * Retrieve a list of series based on query parameters.
   *
   * @param queryParams - The query parameters for filtering and pagination.
   * @param search - The search query for series data.
   * @param sort - The sorting criteria for the retrieved series.
   * @returns A list of series matching the specified criteria.
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
   * Retrieve Top rated 5 series .
   *
   * @returns The series object[] if found.
   */
  @Get('top-rated')
  async getTop() {
    return await this.seriesService.getTopRated();
  }

  /**
   * Retrieve information about a single series by its unique identifier.
   *
   * @param id - The unique identifier of the series to be retrieved.
   * @returns The series object if found.
   */
  @Get(':id')
  async findSeries(@Param() { id }: IdParamsDto) {
    return await this.seriesService.findOne(`${id}`);
  }

  /**
   * Retrieve information about a single movie by its unique identifier.
   *
   * @param id - The unique identifier of the movie to be retrieved.
   * @returns The movie object if found.
   */
  @Get(':id/trailer')
  async findTrailer(@Param() { id }: IdParamsDto) {
    return await this.seriesService.getTrailer(id);
  }
}
