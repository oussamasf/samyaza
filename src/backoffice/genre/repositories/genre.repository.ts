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

  async findOne(userFilterQuery: FilterQuery<Genre>): Promise<Genre> {
    return this.genreModel.findOne(userFilterQuery);
  }

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

  async create(genre: CreateGenreDto): Promise<Genre> {
    const newUser = new this.genreModel(genre);
    return newUser.save();
  }

  async updateById(id: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const updatedItem = await this.genreModel.findOneAndUpdate(
      { _id: id },
      updateGenreDto,
      { new: true },
    );

    return updatedItem;
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Genre>,
    updateQuery: UpdateQuery<Genre>,
  ): Promise<Genre> {
    return this.genreModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }

  async createMultiple(genres: CreateGenreDto[]): Promise<Genre[]> {
    const newUsers = await this.genreModel.insertMany(genres);
    return newUsers;
  }
}
