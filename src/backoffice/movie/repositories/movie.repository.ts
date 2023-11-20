import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Movie, MovieDocument } from '../schemas/movie.schema';
import { FindAllDto } from '../../../common/dto';
import { CreateMovieDto, UpdateMovieDto } from '../dto';
import { FindAllReturn } from '../../../common/types/findAll.types';

@Injectable()
export class MovieRepository {
  constructor(
    @InjectModel(Movie.name) private genreModel: Model<MovieDocument>,
  ) {}

  async findOne(userFilterQuery: FilterQuery<Movie>): Promise<Movie> {
    return this.genreModel.findOne(userFilterQuery);
  }

  async find(usersFilterQuery: FindAllDto): Promise<FindAllReturn<Movie>> {
    usersFilterQuery.sort ? usersFilterQuery.sort : { _idNumber: 1 };
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

  async create(genre: CreateMovieDto): Promise<Movie> {
    const newUser = new this.genreModel(genre);
    return newUser.save();
  }

  async updateById(
    _id: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    const updatedItem = await this.genreModel.findOneAndUpdate(
      { _id },
      updateMovieDto,
      { new: true },
    );

    return updatedItem;
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Movie>,
    updateQuery: UpdateQuery<Movie>,
  ): Promise<Movie> {
    return this.genreModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }

  async createMultiple(genres: CreateMovieDto[]): Promise<Movie[]> {
    const newUsers = await this.genreModel.insertMany(genres);
    return newUsers;
  }
}