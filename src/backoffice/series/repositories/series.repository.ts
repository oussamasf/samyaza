import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Series, SeriesDocument } from '../schemas/series.schema';
import { FindAllDto } from '../../../common/dto';
import { CreateSeriesDto, UpdateSeriesDto } from '../dto';
import { FindAllReturn } from '../../../common/types/findAll.types';

/**
 * Service responsible for handling Series operations in the database.
 */
@Injectable()
export class SeriesRepository {
  constructor(
    @InjectModel(Series.name) private EntityModel: Model<SeriesDocument>,
  ) {}

  /**
   * Creates a new series.
   * @param genre The series data to be created.
   * @returns A Promise that resolves to the created series.
   */
  async create(genre: CreateSeriesDto): Promise<Series> {
    const newItem = new this.EntityModel(genre);
    return newItem.save();
  }

  /**
   * Creates multiple series.
   * @param genres An array of series data to be created.
   * @returns A Promise that resolves to an array of created series.
   */
  async createMultiple(genres: CreateSeriesDto[]): Promise<Series[]> {
    const newItems = await this.EntityModel.insertMany(genres);
    return newItems;
  }

  /**
   * Finds a series based on the filter query.
   * @param userFilterQuery The filter query to find a series.
   * @returns A Promise that resolves to the found series.
   */
  async findOne(userFilterQuery: FilterQuery<Series>): Promise<Series> {
    return this.EntityModel.findOne(userFilterQuery);
  }

  /**
   * Finds series based on the filter query.
   * @param usersFilterQuery The filter query to find series.
   * @returns A Promise that resolves to an array of found series and the count.
   */
  async find(usersFilterQuery: FindAllDto): Promise<FindAllReturn<Series>> {
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
   * Retrieves the top-rated series.
   * @returns A Promise that resolves to an array of top-rated series.
   */
  async getTopRated(): Promise<Series[]> {
    return await this.EntityModel.find()
      .limit(5)
      .skip(0)
      .sort({ voteAverage: -1 });
  }

  /**
   * Updates a series by its ID.
   * @param _id The ID of the series to update.
   * @param updateSeriesDto The data to update the series.
   * @returns A Promise that resolves to the updated series.
   */
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

  /**
   * Finds and updates a series based on the filter query.
   * @param userFilterQuery The filter query to find a series.
   * @param updateQuery The data to update the series.
   * @returns A Promise that resolves to the updated series.
   */
  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Series>,
    updateQuery: UpdateQuery<Series>,
  ): Promise<Series> {
    return this.EntityModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }
}
