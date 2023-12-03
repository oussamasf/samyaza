import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

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
import { ElasticsearchService } from 'src/search/search.service';

@Injectable()
export class MovieService {
  readonly INDEX = 'movies' as const;

  constructor(
    readonly movieRepository: MovieRepository,
    readonly commonService: CommonService,
    readonly elasticsearchService: ElasticsearchService,
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

  /**
   * Creates multiple movies at once.
   * @param createMovieDto Array of movie details to be created.
   * @returns Promise that resolves to an array of created movies.
   */
  async createMultiple(createMovieDto: CreateMovieDto[]): Promise<Movie[]> {
    let results;
    try {
      results = await this.movieRepository.createMultiple(createMovieDto);
    } catch (error) {
      throw new ConflictException('already seeded');
    }
    return results;
  }

  /**
   * Creates or updates an index in Elasticsearch.
   * @param index The name of the index to create or update.
   * @returns Promise that resolves after creating or updating the index in Elasticsearch.
   */
  async createIndex() {
    return await this.elasticsearchService.createOrUpdateIndex(this.INDEX);
  }

  /**
   * Maps an array of documents to Elasticsearch.
   * @param docs An array of documents to be mapped to Elasticsearch.
   * @returns Promise<void>
   */
  async mapDoc(docs: CreateMovieDto[]) {
    const mappingArray = [];
    docs.forEach(async (element) => {
      mappingArray.push(
        this.elasticsearchService.createdDoc(
          `${element.idNumber}`,
          this.INDEX,
          element,
        ),
      );
    });
    try {
      await Promise.all(mappingArray);
    } catch (error) {
      if (error.message === 'version_conflict_engine_exception')
        throw new ConflictException('already mapped');
    }
  }

  /**
   * Maps an array of documents to Elasticsearch.
   * @param docs An array of documents to be mapped to Elasticsearch.
   * @returns Promise<void>
   */
  async deleteMoviesFromEs() {
    try {
      await this.elasticsearchService.deleteAllDocuments(this.INDEX);
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
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
   * Finds multiple movies based on an array of movie IDs.
   * @param id Array of movie IDs to search for.
   * @returns Promise that resolves to an array of movies found by their IDs.
   */
  async findMany(id: number[]): Promise<Movie[]> {
    const findQuery = { idNumber: { $in: id } };
    return await this.movieRepository.findMany(findQuery);
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
   * Retrieves top 5 rated movies
   * @returns {Promise<Movie | null>} A Promise that resolves to the found movie information entry,
   * or undefined if no movie with the specified name exists.
   */
  async getTopRated(): Promise<Movie[]> {
    return await this.movieRepository.getTopRated();
  }

  /**
   * Updates an movie information entry with the specified changes based on its unique id (idNumber).
   *
   * @param {string} id - The unique id of the movie information entry to update.
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

  /**
   * Search for movies based on title and/or overview using Elasticsearch.
   *
   * This asynchronous function searches for movies based on the provided title and overview using Elasticsearch. It constructs a query that searches for movies where either the title matches with fuzziness or the overview has at least 50% of 2 words in common with the provided overview. It then performs the search operation in Elasticsearch and returns the search results as an array of records.
   *
   * @param {string} title - The title of the movie to search for (optional).
   * @param {string} overview - The overview or description of the movie to search for (optional).
   *
   * @throws {NotFoundException} Throws a NotFoundException if an error occurs during the search operation in Elasticsearch.
   *
   * @returns {Promise<Record<any, any>[]>} A Promise that resolves to an array of records representing the search results based on the provided title and/or overview.
   */
  async searchMovie(
    title: string = '',
    overview: string = '',
  ): Promise<Record<any, any>[]> {
    const body = {
      query: {
        bool: {
          should: [
            {
              match: {
                title: {
                  query: title,
                  fuzziness: 'AUTO',
                },
              },
            },
            {
              match: {
                overview: {
                  query: overview,
                  minimum_should_match: '2<50%',
                },
              },
            },
            {
              fuzzy: {
                title: {
                  value: title,
                  fuzziness: 'AUTO',
                },
              },
            },
          ],
        },
      },
    };
    try {
      return await this.elasticsearchService.search(this.INDEX, body);
    } catch (error) {
      // Handle error
      throw new NotFoundException(error);
    }
  }
}
