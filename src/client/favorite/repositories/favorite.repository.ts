import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Favorite, FavoriteDocument } from '../schemas/favorite';
import { CreateFavoriteDto, UpdateFavoriteDto } from '../dto';
import { FindAllReturn } from '../../../common/types/findAll.types';

/**
 * Repository handling operations related to favorites.
 */
@Injectable()
export class FavoriteRepository {
  constructor(
    @InjectModel(Favorite.name) private EntityModel: Model<FavoriteDocument>,
  ) {}

  /**
   * Creates a new favorite entry.
   * @param genre The favorite item details to create.
   * @returns A promise that resolves to the created favorite item.
   */
  async create(genre: CreateFavoriteDto): Promise<Favorite> {
    const newUser = new this.EntityModel(genre);
    return newUser.save();
  }

  /**
   * Finds a favorite item based on the provided filter query.
   * @param userFilterQuery The filter query to search for a favorite item.
   * @returns A promise that resolves to the found favorite item.
   */
  async findOne(userFilterQuery: FilterQuery<Favorite>): Promise<Favorite[]> {
    return this.EntityModel.findOne(userFilterQuery);
  }

  /**
   * Finds movies favorite by a specific user.
   * @param userId The ID of the user whose favorite movies are being retrieved.
   * @returns A promise that resolves to an array of favorite movies and their count.
   */
  async findMovies(userId: string): Promise<FindAllReturn<Favorite>> {
    const [results, count] = await Promise.all([
      this.EntityModel.find({ onModel: 'Movie', userId }).populate({
        path: 'favoriteItem',
        select: 'title overview releaseDate voteAverage',
      }),
      this.EntityModel.countDocuments({ onModel: 'Movie', userId }),
    ]);
    return { results, count };
  }

  /**
   * Finds series favorite by a specific user.
   * @param userId The ID of the user whose favorite series are being retrieved.
   * @returns A promise that resolves to an array of favorite series and their count.
   */
  async findSeries(userId: string): Promise<FindAllReturn<Favorite>> {
    const [results, count] = await Promise.all([
      this.EntityModel.find({ onModel: 'Series', userId }).populate({
        path: 'favoriteItem',
        select: 'name originalLanguage originCountry firstAirDate voteAverage',
      }),
      this.EntityModel.countDocuments({ onModel: 'Series', userId }),
    ]);
    return { results, count };
  }

  /**
   * Finds and updates a favorite item based on the provided filter query and update query.
   * @param userFilterQuery The filter query to find the favorite item.
   * @param updateQuery The update query to apply to the favorite item.
   * @returns A promise that resolves to the updated favorite item.
   */
  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Favorite>,
    updateQuery: UpdateQuery<Favorite>,
  ): Promise<Favorite> {
    return this.EntityModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }

  /**
   * Updates a favorite item by its ID.
   * @param _id The ID of the favorite item to update.
   * @param updateMovieDto The updated details of the favorite item.
   * @returns A promise that resolves to the updated favorite item.
   */
  async updateById(
    _id: string,
    updateMovieDto: UpdateFavoriteDto,
  ): Promise<Favorite> {
    const updatedItem = await this.EntityModel.findOneAndUpdate(
      { _id },
      updateMovieDto,
      { new: true },
    );

    return updatedItem;
  }

  /**
   * Deletes a favorite item by its ID.
   * @param id The ID of the favorite item to delete.
   */
  async deleteItemById(id) {
    await this.EntityModel.deleteOne({ favoriteItem: id });
  }
}
