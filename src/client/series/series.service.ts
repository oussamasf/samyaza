import { Injectable } from '@nestjs/common';
import { SeriesService as BackofficeSeriesService } from '../../backoffice/series/series.service';

import { QueryParamsDto } from '../../common/dto';
import {
  SearchQuerySeriesDto,
  SortQuerySeriesDto,
} from '../../backoffice/series/dto';
import { FindAllReturn } from '../../common/types';
import { Series } from '../../backoffice/series/schemas/series.schema';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SeriesService {
  constructor(
    private readonly backofficeSeriesService: BackofficeSeriesService,
    private readonly httpService: HttpService,
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

  /**
   * Get the trailer for a specific series.
   * @param _id - The ID of the movie for which the trailer is requested.
   * @returns {Promise<Record<any, any>>} A Promise that resolves to the trailer information.
   */
  async getTrailer(_id: string): Promise<Record<any, any>> {
    const series = (await this.backofficeSeriesService.findOneWithException(
      _id,
    )) as Series;

    const url = `https://api.themoviedb.org/3/tv/${series.idNumber}/videos`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_JWT}`,
      },
    };

    const {
      data: { results },
    } = await this.httpService.axiosRef.get(url, options);
    const items = results.filter((el) => el.type === 'Trailer');
    return items;
  }
}
