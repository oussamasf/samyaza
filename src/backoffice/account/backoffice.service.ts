import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

// DB actor
import { AdminsRepository } from './repositories/backoffice.account.repository';
import { CommonService } from '../../common/common.service';
import { Admin } from './schemas/admin.schema';

// DTOS
import { CreateBackofficeDto } from '../dto';
import { LoginDto } from './dto';

// Constants
import { BACKOFFICE_ROLES } from './constants/roles';
import { global as globalErrorMessages } from '../../common/constants/errorMessages';
import { AccessToken, LoginRes } from '../../common/types';

/**
 * Service responsible for managing backoffice admin accounts and authentication.
 */
@Injectable()
export class BackofficeService {
  /**
   * Constructor for the BackofficeService class.
   *
   * @param adminsRepository - The repository for backoffice admin data.
   * @param jwtService - The JWT service for token generation and validation.
   * @param commonService - The common service for error handling and utility functions.
   * @param configService - The service for accessing configuration settings.
   */
  constructor(
    private readonly adminsRepository: AdminsRepository,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Find a backoffice admin by their unique identifier.
   *
   * @param _id - The unique identifier of the admin to retrieve.
   * @returns The admin object if found.
   */
  findOne(_id: string): Promise<Admin> {
    return this.adminsRepository.findOne({ _id });
  }

  /**
   * Find a backoffice admin by their email address.
   *
   * @param email - The email address of the admin to retrieve.
   * @returns The admin object if found.
   */
  async getUserByEmail(email: string): Promise<Admin> {
    return await this.adminsRepository.findOne({ email });
  }

  /**
   * Create a new backoffice admin.
   *
   * This method handles the creation of a new backoffice admin with the provided payload data.
   * It first checks if an admin with the same email already exists to avoid duplication.
   * Then, it generates a refresh token and creates the admin with appropriate roles and hashed refresh token.
   *
   * @param payload - The data required to create a new admin.
   * @returns The created admin object.
   */
  async create(payload: CreateBackofficeDto): Promise<Admin> {
    const { email, username } = payload;

    await this.commonService.findWithConflictException(
      () => this.getUserByEmail(email),
      globalErrorMessages.EMAIL_ALREADY_EXISTS,
    );

    const refresh_token = await this.getRefreshToken(email, username);

    const userBody = {
      roles: [BACKOFFICE_ROLES.ADMIN],
      refreshToken: await bcrypt.hash(
        refresh_token,
        parseInt(`${this.configService.get('CRYPTO_SALT_ROUNDS')}`),
      ),
      ...payload,
    };

    const user = await this.adminsRepository.create(userBody);

    return user;
  }

  /**
   * Authenticate a backoffice admin by performing a login operation.
   *
   * This method verifies the login credentials (email and password) provided in the `loginDto`.
   * It checks if a user with the provided email exists and if the password is valid.
   * If authentication is successful, it generates access and refresh tokens for the user,
   * updates the refresh token hash, and returns a login response.
   *
   * @param loginDto - The login credentials of the admin.
   * @returns A promise that resolves to a login response containing access and refresh tokens and user details.
   */
  async login(loginDto: LoginDto): Promise<LoginRes<Admin>> {
    const { email, password } = loginDto;

    const user = await this.commonService.findWithNotFoundException(
      () => this.getUserByEmail(email),
      globalErrorMessages.USER_NOT_FOUND,
    );

    await this.commonService.validatePassword(
      password,
      user.password,
      globalErrorMessages.INVALID_PASSWORD,
    );

    const [access_token, refresh_token] = await Promise.all([
      this.getAccessToken(email, user.username),
      this.getRefreshToken(email, user.username),
    ]);

    await this.updateRefreshTokenHash(email, refresh_token);

    user.password = undefined;
    user.refreshToken = undefined;
    return {
      access_token,
      refresh_token,
      user,
    };
  }

  /**
   * Generate an access token for a backoffice admin.
   *
   * This method creates an access token with the provided email and username.
   *
   * @param email - The email of the admin for whom the access token is generated.
   * @param username - The username of the admin for whom the access token is generated.
   * @returns A promise that resolves to the generated access token.
   */
  async getAccessToken(email: string, username: string): Promise<string> {
    return await this.jwtService.signAsync(
      { email, username },
      {
        expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION_TIME),
        secret: this.configService.get('ACCESS_TOKEN_SECRET_BACKOFFICE'),
      },
    );
  }

  /**
   * Generate a refresh token for a backoffice admin.
   *
   * This method creates a refresh token with the provided email and username.
   *
   * @param email - The email of the admin for whom the refresh token is generated.
   * @param username - The username of the admin for whom the refresh token is generated.
   * @returns A promise that resolves to the generated refresh token.
   */
  async getRefreshToken(email: string, username: string): Promise<string> {
    console.log(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME_CLIENT);
    return await this.jwtService.signAsync(
      { email, username },
      {
        expiresIn: parseInt(
          this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
        ),
        secret: this.configService.get('REFRESH_TOKEN_SECRET_BACKOFFICE'),
      },
    );
  }

  /**
   * Update the hash of a refresh token for a backoffice admin.
   *
   * This method updates the hash of the refresh token associated with the provided email.
   *
   * @param email - The email of the admin for whom the refresh token hash is updated.
   * @param refreshToken - The new refresh token to be hashed and stored.
   * @returns A promise that resolves when the refresh token hash is successfully updated.
   */
  async updateRefreshTokenHash(
    email: string,
    refreshToken: string,
  ): Promise<Admin> {
    return await this.adminsRepository.findOneAndUpdate(
      { email },
      {
        refreshToken: await bcrypt.hash(
          refreshToken,
          parseInt(`${this.configService.get('CRYPTO_SALT_ROUNDS')}`),
        ),
      },
    );
  }

  /**
   * Logout a backoffice admin by unsetting their refresh token.
   *
   * This method removes the refresh token for the admin with the provided email.
   *
   * @param email - The email of the admin to be logged out.
   * @returns A promise that resolves when the admin is successfully logged out.
   */
  async logout(email: string): Promise<Admin> {
    return await this.adminsRepository.findOneAndUpdate(
      { email },
      { $unset: { refreshToken: 1 } },
    );
  }

  /**
   * Refresh an admin's access token.
   *
   * This method generates a new access token for the provided user.
   *
   * @param user - The user for whom the access token is refreshed.
   * @returns An object containing the new access token.
   */
  async refresh(user: Admin): Promise<AccessToken> {
    const access_token = await this.getAccessToken(user.email, user.username);
    return { access_token };
  }
}
