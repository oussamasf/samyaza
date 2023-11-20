import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Series, SeriesDocument } from '../schemas/series.schema';
import { FindAllDto } from '../../../common/dto';
import { CreateSeriesDto, UpdateSeriesDto } from '../dto';
import { FindAllReturn } from '../../../common/types/findAll.types';

@Injectable()
export class SeriesRepository {
  constructor(
    @InjectModel(Series.name) private EntityModel: Model<SeriesDocument>,
  ) {}

  async findOne(userFilterQuery: FilterQuery<Series>): Promise<Series> {
    return this.EntityModel.findOne(userFilterQuery);
  }

  async find(usersFilterQuery: FindAllDto): Promise<FindAllReturn<Series>> {
    usersFilterQuery.sort ? usersFilterQuery.sort : { _idNumber: 1 };
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

  async create(genre: CreateSeriesDto): Promise<Series> {
    const newUser = new this.EntityModel(genre);
    return newUser.save();
  }

  async updateById(
    _id: string,
    updateSeriesDto: UpdateSeriesDto,
  ): Promise<Series> {
    const updatedItem = await this.EntityModel.findOneAndUpdate(
      { _id },
      updateSeriesDto,
      { new: true },
    );

    return updatedItem;
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Series>,
    updateQuery: UpdateQuery<Series>,
  ): Promise<Series> {
    return this.EntityModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }

  async createMultiple(genres: CreateSeriesDto[]): Promise<Series[]> {
    const newUsers = await this.EntityModel.insertMany(genres);
    return newUsers;
  }

  async getTopRated(): Promise<Series[]> {
    return await this.EntityModel.find()
      .limit(5)
      .skip(0)
      .sort({ voteAverage: -1 });
  }
}
