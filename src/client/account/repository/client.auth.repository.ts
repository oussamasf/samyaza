import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Client, ClientDocument } from '../schemas/client.schema';

@Injectable()
export class ClientAuthRepository {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async findOne(userFilterQuery: FilterQuery<Client>): Promise<Client> {
    return this.clientModel.findOne(userFilterQuery);
  }

  async find(usersFilterQuery: FilterQuery<Client>): Promise<Client[]> {
    return this.clientModel.find(usersFilterQuery);
  }

  async create(user): Promise<Client> {
    const newUser = new this.clientModel(user);
    return newUser.save();
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Client>,
    updateQuery: UpdateQuery<Client>,
  ): Promise<Client> {
    return this.clientModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }

  async findByEmailAndUpdate(
    email: string,
    updateQuery: UpdateQuery<Client>,
  ): Promise<Client> {
    return await this.clientModel.findOneAndUpdate({ email }, updateQuery, {
      new: true,
    });
  }
}
