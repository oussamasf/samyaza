import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Favorite, FavoriteDocument } from '../schemas/favorite';
import { CreateFavoriteDto, UpdateFavoriteDto } from '../dto';
import { FindAllReturn } from '../../../common/types/findAll.types';

@Injectable()
export class FavoriteRepository {
  constructor(
    @InjectModel(Favorite.name) private EntityModel: Model<FavoriteDocument>,
  ) {}

  async findOne(userFilterQuery: FilterQuery<Favorite>): Promise<Favorite> {
    return this.EntityModel.findOne(userFilterQuery);
  }

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

  async create(genre: CreateFavoriteDto): Promise<Favorite> {
    const newUser = new this.EntityModel(genre);
    return newUser.save();
  }

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

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Favorite>,
    updateQuery: UpdateQuery<Favorite>,
  ): Promise<Favorite> {
    return this.EntityModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }

  async deleteItemById(id) {
    await this.EntityModel.deleteOne({ favoriteItem: id });
  }
}
