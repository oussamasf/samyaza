import { Injectable } from '@nestjs/common';

// Services & repos
import { SeriesRepository } from './repositories/series.repository';
import { CommonService } from '../../common/common.service';
import { Series } from './schemas/series.schema';

// DTOS
import { QueryParamsDto } from '../../common/dto';
import {
  SearchQuerySeriesDto,
  SortQuerySeriesDto,
  CreateSeriesDto,
  UpdateSeriesDto,
} from './dto';

// Constants & Types
import { series as seriesErrorMessages } from '../../common/constants/errorMessages';
import { FindAllReturn } from 'src/common/types';

@Injectable()
export class SeriesService {
  constructor(
    readonly seriesRepository: SeriesRepository,
    readonly commonService: CommonService,
  ) {}

  /**
   * Creates a new series information entry based on the provided DTO.
   *
   * @param {CreateSeriesDto} createSeriesDto - The DTO containing  information for creation.
   * @throws {ConflictException} If an series with the same name already exists.
   * @returns {Promise<SeriesInformation>} A Promise that resolves to the created series information.
   */
  async create(createSeriesDto: CreateSeriesDto): Promise<Series> {
    const { name } = createSeriesDto;

    await this.commonService.findWithConflictException(
      () => this.findSeriesByName(name),
      seriesErrorMessages.SERIES_NAME_ALREADY_EXISTS,
    );

    return await this.seriesRepository.create(createSeriesDto);
  }

  async createMultiple(createSeriesDto: CreateSeriesDto[]): Promise<Series[]> {
    return await this.seriesRepository.createMultiple(createSeriesDto);
  }

  /**
   * Retrieves a list of series information entries based on specified query parameters.
   *
   * @param {QueryParamsDto} query - The query parameters for pagination (e.g., limit, skip).
   * @param {SearchQuerySeriesDto} search - The search criteria to filter agencies (optional).
   * @param {SortQuerySeriesDto} sort - The sorting criteria for the result (optional).
   * @returns {Promise<FindAllReturn<series>>} A Promise that resolves to a paginated list of series information entries.
   */
  async findAll(
    query: QueryParamsDto,
    search: SearchQuerySeriesDto,
    sort: SortQuerySeriesDto,
  ): Promise<FindAllReturn<Series>> {
    const { limit, skip } = query;

    const findQuery = { limit, skip, search, sort };

    return await this.seriesRepository.find(findQuery);
  }

  /**
   * Retrieves a single series information entry by its unique id (_idNumber).
   *
   * @param {string} _id - The unique id of the series information entry to find.
   * @returns {Promise<series | undefined>} A Promise that resolves to the found series information entry,
   * or undefined if no series with the specified _id exists.
   */
  findOne(_id: string): Promise<Series | null> {
    return this.seriesRepository.findOne({ _id });
  }

  /**
   * Retrieves a single series information entry by its unique id (_idNumber) and throws a "Not Found" exception if not found.
   *
   * @param {string} _id - The unique id of the series information entry to find.
   * @throws {NotFoundException} If no series with the specified _idNumber is found.
   * @returns {Promise<series>} A Promise that resolves to the found series information entry.
   */
  async findOneWithException(_id: string): Promise<Series | void> {
    return await this.commonService.findWithNotFoundException(
      () => this.findOne(_id),
      seriesErrorMessages.SERIES_NOT_FOUND,
    );
  }

  /**
   * Retrieves an series information entry by its name.
   *
   * @param {string} name - The name of the series to find.
   * @returns {Promise<series | null>} A Promise that resolves to the found series information entry,
   * or undefined if no series with the specified name exists.
   */
  async findSeriesByName(name: string): Promise<Series | null> {
    return await this.seriesRepository.findOne({ name });
  }

  /**
   * Retrieves an series information entry by its name.
   *
   * @param {string} name - The name of the series to find.
   * @returns {Promise<series | null>} A Promise that resolves to the found series information entry,
   * or undefined if no series with the specified name exists.
   */
  async findSeriesById(_id: number): Promise<Series | null> {
    return await this.seriesRepository.findOne({ _id });
  }

  /**
   * Updates an series information entry with the specified changes based on its unique id (idNumber).
   *
   * @param {string} idNumber - The unique id of the series information entry to update.
   * @param {UpdateSeriesDto} updateSeriesDto - The data containing the changes to apply to the series information entry.
   * @throws {DuplicatedMongoException} If the proposed changes result in a duplicate series name.
   * @returns {Promise<series>} A Promise that resolves when the series information entry is successfully updated.
   */
  async update(id: string, updateSeriesDto: UpdateSeriesDto): Promise<Series> {
    return await this.commonService.duplicatedMongo(
      () => this.seriesRepository.updateById(id, updateSeriesDto),
      seriesErrorMessages.SERIES_NAME_ALREADY_EXISTS,
    );
  }
}
