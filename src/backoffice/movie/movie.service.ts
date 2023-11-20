import { Injectable } from '@nestjs/common';

// Services & repos
import { MovieRepository } from './repositories/movie.repository';
import { CommonService } from '../../common/common.service';
import { Movie } from './schemas/movie.schema';

// DTOS
import { QueryParamsDto } from '../../common/dto';
import {
  SearchQueryMovieDto,
  SortQueryMovieDto,
  CreateMovieDto,
  UpdateMovieDto,
} from './dto';

// Constants & Types
import { movie as movieErrorMessages } from '../../common/constants/errorMessages';
import { FindAllReturn } from 'src/common/types';

@Injectable()
export class MovieService {
  constructor(
    readonly movieRepository: MovieRepository,
    readonly commonService: CommonService,
  ) {}

  /**
   * Creates a new movie information entry based on the provided DTO.
   *
   * @param {CreateMovieDto} createMovieDto - The DTO containing  information for creation.
   * @throws {ConflictException} If an movie with the same name already exists.
   * @returns {Promise<MovieInformation>} A Promise that resolves to the created movie information.
   */
  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { title } = createMovieDto;

    await this.commonService.findWithConflictException(
      () => this.findMovieByTitle(title),
      movieErrorMessages.MOVIE_TITLE_ALREADY_EXISTS,
    );

    return await this.movieRepository.create(createMovieDto);
  }

  async createMultiple(createMovieDto: CreateMovieDto[]): Promise<Movie[]> {
    return await this.movieRepository.createMultiple(createMovieDto);
  }

  /**
   * Retrieves a list of movie information entries based on specified query parameters.
   *
   * @param {QueryParamsDto} query - The query parameters for pagination (e.g., limit, skip).
   * @param {SearchQueryMovieDto} search - The search criteria to filter agencies (optional).
   * @param {SortQueryMovieDto} sort - The sorting criteria for the result (optional).
   * @returns {Promise<FindAllReturn<Movie>>} A Promise that resolves to a paginated list of movie information entries.
   */
  async findAll(
    query: QueryParamsDto,
    search: SearchQueryMovieDto,
    sort: SortQueryMovieDto,
  ): Promise<FindAllReturn<Movie>> {
    const { limit, skip } = query;

    const findQuery = { limit, skip, search, sort };

    return await this.movieRepository.find(findQuery);
  }

  /**
   * Retrieves a single movie information entry by its unique id (_idNumber).
   *
   * @param {string} _id - The unique id of the movie information entry to find.
   * @returns {Promise<Movie | undefined>} A Promise that resolves to the found movie information entry,
   * or undefined if no movie with the specified _id exists.
   */
  findOne(_id: string): Promise<Movie | null> {
    return this.movieRepository.findOne({ _id });
  }

  /**
   * Retrieves a single movie information entry by its unique id (_idNumber) and throws a "Not Found" exception if not found.
   *
   * @param {string} _id - The unique id of the movie information entry to find.
   * @throws {NotFoundException} If no movie with the specified _idNumber is found.
   * @returns {Promise<Movie>} A Promise that resolves to the found movie information entry.
   */
  async findOneWithException(_id: string): Promise<Movie | void> {
    return await this.commonService.findWithNotFoundException(
      () => this.findOne(_id),
      movieErrorMessages.MOVIE_NOT_FOUND,
    );
  }

  /**
   * Retrieves an movie information entry by its name.
   *
   * @param {string} name - The name of the movie to find.
   * @returns {Promise<Movie | null>} A Promise that resolves to the found movie information entry,
   * or undefined if no movie with the specified name exists.
   */
  async findMovieByTitle(title: string): Promise<Movie | null> {
    return await this.movieRepository.findOne({ title });
  }

  /**
   * Retrieves an movie information entry by its name.
   *
   * @param {string} name - The name of the movie to find.
   * @returns {Promise<Movie | null>} A Promise that resolves to the found movie information entry,
   * or undefined if no movie with the specified name exists.
   */
  async findMovieById(_id: number): Promise<Movie | null> {
    return await this.movieRepository.findOne({ _id });
  }

  /**
   * Updates an movie information entry with the specified changes based on its unique id (idNumber).
   *
   * @param {string} idNumber - The unique id of the movie information entry to update.
   * @param {UpdateMovieDto} updateMovieDto - The data containing the changes to apply to the movie information entry.
   * @throws {DuplicatedMongoException} If the proposed changes result in a duplicate movie name.
   * @returns {Promise<Movie>} A Promise that resolves when the movie information entry is successfully updated.
   */
  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    return await this.commonService.duplicatedMongo(
      () => this.movieRepository.updateById(id, updateMovieDto),
      movieErrorMessages.MOVIE_TITLE_ALREADY_EXISTS,
    );
  }
}