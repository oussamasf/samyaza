import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Admin, AdminDocument } from '../schemas/admin.schema';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async findOne(userFilterQuery: FilterQuery<Admin>): Promise<Admin> {
    return this.adminModel.findOne(userFilterQuery);
  }

  async find(usersFilterQuery: FilterQuery<Admin>): Promise<Admin[]> {
    return this.adminModel.find(usersFilterQuery);
  }

  async create(user: Admin): Promise<Admin> {
    const newUser = new this.adminModel(user);
    return newUser.save();
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Admin>,
    updateQuery: UpdateQuery<Admin>,
  ): Promise<Admin> {
    return this.adminModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }
}
