import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Genre, GenreDocument } from '../schemas/genre.schema';
import { FindAllDto } from '../../../common/dto';
import { CreateGenreDto, UpdateGenreDto } from '../dto';
import { FindAllReturn } from '../../../common/types/findAll.types';

@Injectable()
export class GenreRepository {
  constructor(
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
  ) {}

  /**
   * Creates a new genre.
   * @param genre The genre object to be created.
   * @returns A Promise resolving to the created genre.
   */
  async create(genre: CreateGenreDto): Promise<Genre> {
    const newItem = new this.genreModel(genre);
    return newItem.save();
  }

  /**
   * Creates multiple new genres.
   * @param genres An array of genre objects to be created.
   * @returns A Promise resolving to an array of created genres.
   */
  async createMultiple(genres: CreateGenreDto[]): Promise<Genre[]> {
    const newItems = await this.genreModel.insertMany(genres);
    return newItems;
  }

  /**
   * Finds a single genre based on the provided filter query.
   * @param userFilterQuery The filter query to search for a genre.
   * @returns A Promise resolving to the found genre.
   */
  async findOne(userFilterQuery: FilterQuery<Genre>): Promise<Genre> {
    return this.genreModel.findOne(userFilterQuery);
  }

  /**
   * Finds genres based on the provided filter query and pagination options.
   * @param usersFilterQuery The filter query and pagination options.
   * @returns A Promise resolving to an object containing results and count of genres.
   */
  async find(usersFilterQuery: FindAllDto): Promise<FindAllReturn<Genre>> {
    usersFilterQuery.sort ? usersFilterQuery.sort : { _id: 1 };
    const [results, count] = await Promise.all([
      this.genreModel
        .find(usersFilterQuery.search)
        .limit(usersFilterQuery.limit)
        .skip(usersFilterQuery.skip)
        .sort(usersFilterQuery.sort)
        .select('-password'),

      this.genreModel.countDocuments(usersFilterQuery.search),
    ]);
    return { results, count };
  }

  /**
   * Updates a genre by its ID.
   * @param id The ID of the genre to be updated.
   * @param updateGenreDto The data to update the genre.
   * @returns A Promise resolving to the updated genre.
   */
  async updateById(id: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const updatedItem = await this.genreModel.findOneAndUpdate(
      { _id: id },
      updateGenreDto,
      { new: true },
    );

    return updatedItem;
  }

  /**
   * Finds a single genre and updates it based on the provided filter query and update query.
   * @param userFilterQuery The filter query to find the genre to update.
   * @param updateQuery The update query to be applied.
   * @returns A Promise resolving to the updated genre.
   */
  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Genre>,
    updateQuery: UpdateQuery<Genre>,
  ): Promise<Genre> {
    return this.genreModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }
}
