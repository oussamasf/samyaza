import { Injectable } from '@nestjs/common';

// Services & repos
import { GenreRepository } from './repositories/genre.repository';
import { CommonService } from '../../common/common.service';
import { Genre } from './schemas/genre.schema';

// DTOS
import { QueryParamsDto } from '../../common/dto';
import {
  SearchQueryGenreDto,
  SortQueryGenreDto,
  CreateGenreDto,
  UpdateGenreDto,
} from './dto';

// Constants & Types
import { genre as genreErrorMessages } from '../../common/constants/errorMessages';
import { FindAllReturn } from 'src/common/types';

@Injectable()
export class GenreService {
  constructor(
    readonly genreRepository: GenreRepository,
    readonly commonService: CommonService,
  ) {}

  /**
   * Creates a new genre information entry based on the provided DTO.
   *
   * @param {CreateGenreDto} createGenreDto - The DTO containing genre information for creation.
   * @throws {ConflictException} If an genre with the same name already exists.
   * @returns {Promise<GenreInformation>} A Promise that resolves to the created genre information.
   */
  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const { name } = createGenreDto;

    await this.commonService.findWithConflictException(
      () => this.findGenreByName(name),
      genreErrorMessages.AGENCY_NAME_ALREADY_EXISTS,
    );

    return await this.genreRepository.create(createGenreDto);
  }

  /**
   * Retrieves a list of genre information entries based on specified query parameters.
   *
   * @param {QueryParamsDto} query - The query parameters for pagination (e.g., limit, skip).
   * @param {SearchQueryGenreDto} search - The search criteria to filter agencies (optional).
   * @param {SortQueryGenreDto} sort - The sorting criteria for the result (optional).
   * @returns {Promise<FindAllReturn<Genre>>} A Promise that resolves to a paginated list of genre information entries.
   */
  async findAll(
    query: QueryParamsDto,
    search: SearchQueryGenreDto,
    sort: SortQueryGenreDto,
  ): Promise<FindAllReturn<Genre>> {
    const { limit, skip } = query;

    const findQuery = { limit, skip, search, sort };

    return await this.genreRepository.find(findQuery);
  }

  /**
   * Retrieves a single genre information entry by its unique identifier (_id).
   *
   * @param {string} _id - The unique identifier of the genre information entry to find.
   * @returns {Promise<Genre | undefined>} A Promise that resolves to the found genre information entry,
   * or undefined if no genre with the specified _id exists.
   */
  findOne(_id: string): Promise<Genre | null> {
    return this.genreRepository.findOne({ _id });
  }

  /**
   * Retrieves a single genre information entry by its unique identifier (_id) and throws a "Not Found" exception if not found.
   *
   * @param {string} _id - The unique identifier of the genre information entry to find.
   * @throws {NotFoundException} If no genre with the specified _id is found.
   * @returns {Promise<Genre>} A Promise that resolves to the found genre information entry.
   */
  async findOneWithException(_id: string): Promise<Genre | void> {
    return await this.commonService.findWithNotFoundException(
      () => this.findOne(_id),
      genreErrorMessages.AGENCY_NOT_FOUND,
    );
  }

  /**
   * Retrieves an genre information entry by its name.
   *
   * @param {string} name - The name of the genre to find.
   * @returns {Promise<Genre | null>} A Promise that resolves to the found genre information entry,
   * or undefined if no genre with the specified name exists.
   */
  async findGenreByName(name: string): Promise<Genre | null> {
    return await this.genreRepository.findOne({ name });
  }

  /**
   * Retrieves an genre information entry by its name.
   *
   * @param {string} name - The name of the genre to find.
   * @returns {Promise<Genre | null>} A Promise that resolves to the found genre information entry,
   * or undefined if no genre with the specified name exists.
   */
  async findGenreByIdNumber(idNumber: number): Promise<Genre | null> {
    return await this.genreRepository.findOne({ idNumber });
  }

  /**
   * Updates an genre information entry with the specified changes based on its unique identifier (id).
   *
   * @param {string} id - The unique identifier of the genre information entry to update.
   * @param {UpdateGenreDto} updateGenreDto - The data containing the changes to apply to the genre information entry.
   * @throws {DuplicatedMongoException} If the proposed changes result in a duplicate genre name.
   * @returns {Promise<Genre>} A Promise that resolves when the genre information entry is successfully updated.
   */
  async update(id: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    return await this.commonService.duplicatedMongo(
      () => this.genreRepository.updateById(id, updateGenreDto),
      genreErrorMessages.AGENCY_NAME_ALREADY_EXISTS,
    );
  }
}
