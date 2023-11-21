import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Admin, AdminDocument } from '../schemas/admin.schema';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  /**
   * Creates a new admin.
   * @param user The admin object to be created.
   * @returns A Promise resolving to the created admin.
   */
  async create(user: Admin): Promise<Admin> {
    const newUser = new this.adminModel(user);
    return newUser.save();
  }

  /**
   * Finds a single admin based on the provided filter query.
   * @param userFilterQuery The filter query to search for an admin.
   * @returns A Promise resolving to the found admin.
   */
  async findOne(userFilterQuery: FilterQuery<Admin>): Promise<Admin> {
    return this.adminModel.findOne(userFilterQuery);
  }

  /**
   * Finds admins based on the provided filter query.
   * @param usersFilterQuery The filter query to search for admins.
   * @returns A Promise resolving to an array of found admins.
   */
  async find(usersFilterQuery: FilterQuery<Admin>): Promise<Admin[]> {
    return this.adminModel.find(usersFilterQuery);
  }

  /**
   * Finds a single admin and updates it based on the provided filter query and update query.
   * @param userFilterQuery The filter query to find the admin to update.
   * @param updateQuery The update query to be applied.
   * @returns A Promise resolving to the updated admin.
   */
  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Admin>,
    updateQuery: UpdateQuery<Admin>,
  ): Promise<Admin> {
    return this.adminModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }
}
