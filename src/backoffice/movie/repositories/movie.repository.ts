import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Movie, MovieDocument } from '../schemas/movie.schema';
import { FindAllDto } from '../../../common/dto';
import { CreateMovieDto, UpdateMovieDto } from '../dto';
import { FindAllReturn } from '../../../common/types/findAll.types';

/**
 * MovieRepository class handling operations related to the 'Movie' entity.
 * Implements CRUD functionalities and other operations for movies.
 */
@Injectable()
export class MovieRepository {
  constructor(
    @InjectModel(Movie.name) private EntityModel: Model<MovieDocument>,
  ) {}

  /**
   * Creates a new movie in the database.
   * @param genre Details of the movie to be created.
   * @returns Promise resolving to the created movie.
   */
  async create(genre: CreateMovieDto): Promise<Movie> {
    const newUser = new this.EntityModel(genre);
    return newUser.save();
  }

  /**
   * Creates multiple movies in the database.
   * @param genres Array of objects containing movie details to be created.
   * @returns Promise resolving to an array of created movies.
   */
  async createMultiple(genres: CreateMovieDto[]): Promise<Movie[]> {
    const newUsers = await this.EntityModel.insertMany(genres);
    return newUsers;
  }

  /**
   * Finds a single movie based on the provided query.
   * @param userFilterQuery The query object used to find a movie.
   * @returns Promise resolving to a single movie if found.
   */
  async findOne(userFilterQuery: FilterQuery<Movie>): Promise<Movie> {
    return this.EntityModel.findOne(userFilterQuery);
  }

  /**
   * Finds multiple movies based on the provided query.
   * @param userFilterQuery The query object used to find movies.
   * @returns Promise resolving to an array of movies.
   */
  async findMany(userFilterQuery: FilterQuery<Movie>): Promise<Movie[]> {
    return this.EntityModel.find(userFilterQuery);
  }

  /**
   * Finds movies based on provided filters, with pagination support.
   * @param usersFilterQuery Filters and pagination parameters.
   * @returns Promise resolving to an object containing found movies and count.
   */
  async find(usersFilterQuery: FindAllDto): Promise<FindAllReturn<Movie>> {
    usersFilterQuery.sort ? usersFilterQuery.sort : { _id: 1 };
    const [results, count] = await Promise.all([
      this.EntityModel.find(usersFilterQuery.search)
        .limit(usersFilterQuery.limit)
        .skip(usersFilterQuery.skip)
        .sort(usersFilterQuery.sort)
        .select('-password'),

      this.EntityModel.countDocuments(usersFilterQuery.search),
    ]);
    return { results, count };
  }

  /**
   * Retrieves top-rated movies based on a predefined query.
   * @returns Promise resolving to an array of top-rated movies.
   */
  async getTopRated(): Promise<Movie[]> {
    return await this.EntityModel.find()
      .limit(5)
      .skip(0)
      .sort({ voteAverage: -1 });
  }

  /**
   * Updates a movie by its ID.
   * @param _id The ID of the movie to be updated.
   * @param updateMovieDto Updated movie details.
   * @returns Promise resolving to the updated movie.
   */
  async updateById(
    _id: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    const updatedItem = await this.EntityModel.findOneAndUpdate(
      { _id },
      updateMovieDto,
      { new: true },
    );

    return updatedItem;
  }

  /**
   * Finds and updates a movie based on the provided query and update object.
   * @param userFilterQuery The query object to find the movie.
   * @param updateQuery The update object for the movie.
   * @returns Promise resolving to the updated movie.
   */
  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Movie>,
    updateQuery: UpdateQuery<Movie>,
  ): Promise<Movie> {
    return this.EntityModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }
}
