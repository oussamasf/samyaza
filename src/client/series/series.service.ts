import { Injectable } from '@nestjs/common';
import { SeriesService as BackofficeSeriesService } from '../../backoffice/series/series.service';

import { QueryParamsDto } from '../../common/dto';
import {
  SearchQuerySeriesDto,
  SortQuerySeriesDto,
} from '../../backoffice/series/dto';
import { FindAllReturn } from '../../common/types';
import { Series } from '../../backoffice/series/schemas/series.schema';

@Injectable()
export class SeriesService {
  constructor(
    private readonly backofficeSeriesService: BackofficeSeriesService,
  ) {}

  /**
   * Find and retrieve a list of series based on query parameters.
   *
   * @param query - The query parameters for filtering and pagination.
   * @param search - The search query for series data.
   * @param sort - The sorting criteria for the retrieved series.
   * @returns A promise that resolves to a list of series matching the specified criteria.
   */
  async findAll(
    query: QueryParamsDto,
    search: SearchQuerySeriesDto,
    sort: SortQuerySeriesDto,
  ): Promise<FindAllReturn<Series>> {
    return await this.backofficeSeriesService.findAll(query, search, sort);
  }

  /**
   * Find and retrieve a single series by its unique identifier.
   *
   * @param _id - The unique identifier of the series to be retrieved.
   * @returns A promise that resolves to the series object if found.
   */
  async findOne(_id: string) {
    return await this.backofficeSeriesService.findOneWithException(_id);
  }

  /**
   * Retrieves top 5 rated movies
   * @returns {Promise<Movie | null>} A Promise that resolves to the found movie information entry,
   * or undefined if no movie with the specified name exists.
   */
  async getTopRated() {
    return await this.backofficeSeriesService.getTopRated();
  }
}
