import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Client, ClientDocument } from '../schemas/client.schema';

/**
 * Repository handling operations related to client authentication.
 */
@Injectable()
export class ClientAuthRepository {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  /**
   * Finds a client based on the provided filter query.
   * @param userFilterQuery The filter query to search for a client.
   * @returns A promise that resolves to the found client.
   */
  async findOne(userFilterQuery: FilterQuery<Client>): Promise<Client> {
    return this.clientModel.findOne(userFilterQuery);
  }

  /**
   * Finds clients based on the provided filter query.
   * @param usersFilterQuery The filter query to search for clients.
   * @returns A promise that resolves to an array of clients.
   */
  async find(usersFilterQuery: FilterQuery<Client>): Promise<Client[]> {
    return this.clientModel.find(usersFilterQuery);
  }

  /**
   * Creates a new client.
   * @param user The client data to create.
   * @returns A promise that resolves to the created client.
   */
  async create(user): Promise<Client> {
    const newUser = new this.clientModel(user);
    return newUser.save();
  }

  /**
   * Finds and updates a client based on the provided filter query and update query.
   * @param userFilterQuery The filter query to find the client.
   * @param updateQuery The update query to apply to the client.
   * @returns A promise that resolves to the updated client.
   */
  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Client>,
    updateQuery: UpdateQuery<Client>,
  ): Promise<Client> {
    return this.clientModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }

  /**
   * Finds a client by email and updates it based on the provided update query.
   * @param email The email of the client to find.
   * @param updateQuery The update query to apply to the client.
   * @returns A promise that resolves to the updated client.
   */
  async findByEmailAndUpdate(
    email: string,
    updateQuery: UpdateQuery<Client>,
  ): Promise<Client> {
    return await this.clientModel.findOneAndUpdate({ email }, updateQuery, {
      new: true,
    });
  }
}
