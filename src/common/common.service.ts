import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
/**
 * Injectable service providing common utility functions and error handling.
 */
@Injectable()
export class CommonService {
  /**
   * Handle errors caused by duplicated keys in a MongoDB document.
   *
   * @param operation - A function that performs a MongoDB operation.
   * @param message - The error message to throw in case of duplication.
   * @returns The result of the operation if successful.
   * @throws ConflictException if a duplication error occurs.
   */
  async duplicatedMongo<T>(
    operation: () => Promise<T>,
    message: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(message);
      }
      throw error;
    }
  }

  /**
   * Handle errors caused by conflict naming.
   *
   * @param operation - A function that performs an operation.
   * @param message - The error message to throw in case of conflict.
   * @returns The result of the operation if successful.
   * @throws ConflictException if a conflict occurs.
   */
  async findWithConflictException<T>(
    operation: () => Promise<T>,
    message: string,
  ): Promise<T> {
    const item = await operation();
    if (item) {
      throw new ConflictException(message);
    }
    return item;
  }

  /**
   * Handle errors caused by not finding a document.
   *
   * @param operation - A function that performs a search operation.
   * @param message - The error message to throw if the document is not found.
   * @returns The result of the search operation if the document is found.
   * @throws NotFoundException if the document is not found.
   */
  async findWithNotFoundException<T>(
    operation: () => Promise<T>,
    message: string,
  ): Promise<T> {
    const item = await operation();
    if (!item) {
      throw new NotFoundException(message);
    }
    return item;
  }

  /**
   * Validate a password by comparing it to a hashed password.
   *
   * @param password - The plain text password to validate.
   * @param hashedPassword - The hashed password to compare with.
   * @param message - The error message to throw if the passwords do not match.
   * @throws UnauthorizedException if the passwords do not match.
   */
  async validatePassword(
    password: string,
    hashedPassword: string,
    message: string,
  ): Promise<void> {
    const validatePassword = await bcrypt.compare(password, hashedPassword);

    if (!validatePassword) {
      throw new UnauthorizedException(message);
    }
  }
}
