import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

// DB actor
import { ClientAuthRepository } from './repository/client.auth.repository';

// DTOS
import { CreateClientUserDto, LoginDto } from './dto/';

// Constants
import { global as globalErrorMessages } from '../../common/constants/errorMessages';
import { CommonService } from '../../common/common.service';
import { Client } from './schemas/client.schema';
import { LoginRes, Tokens } from '../../common/types';

/**
 * Injectable service class for managing client authentication.
 * @class
 */
@Injectable()
export class ClientAuthService {
  /**
   * Constructor for the ClientAuthService class.
   *
   * @constructor
   * @param {ClientAuthRepository} private readonly clientRepository - The client repository.
   * @param {JwtService} private readonly jwtService - The JWT service for token generation.
   * @param {CommonService} private readonly commonService - The common service for utility functions.
   * @param {ConfigService} private readonly configService - The configuration service.
   */
  constructor(
    private readonly clientRepository: ClientAuthRepository,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Find a client by ID.
   *
   * @param {string} _id - The ID of the client to find.
   * @returns {Promise<Client>} A promise that resolves to the found client.
   */
  findOne(
    _id: string, //:  Promise<User>
  ) {
    return this.clientRepository.findOne({ _id });
  }

  /**
   * Find a client by email.
   *
   * @param {string} email - The email of the client to find.
   * @returns {Promise<Client>} A promise that resolves to the found client.
   */
  async getUserByName(username: string) {
    return await this.clientRepository.findOne({ username });
  }

  /**
   * Sign up a new client.
   *
   * @param {CreateClientUserDto} payload - The payload containing client information.
   * @returns {Promise<Tokens>} A promise that resolves to the generated access and refresh tokens.
   */
  async signup(payload: CreateClientUserDto): Promise<Tokens> {
    const { email } = payload;

    await this.commonService.findWithConflictException(
      () => this.getUserByName(email),
      globalErrorMessages.EMAIL_ALREADY_EXISTS,
    );

    const { username } = await this.clientRepository.create({
      ...payload,
    });

    const [access_token, refresh_token] = await Promise.all([
      this.getAccessToken(email, username),
      this.getRefreshToken(email, username),
    ]);
    await this.updateRefreshTokenHash(email, refresh_token);
    return { access_token, refresh_token };
  }

  /**
   * Log in a client.
   *
   * @param {LoginDto} loginDto - The login DTO containing email and password.
   * @returns {Promise<LoginRes<Client>>} A promise that resolves to the login response including tokens and user information.
   */
  async login(loginDto: LoginDto): Promise<LoginRes<Client>> {
    const { username, password } = loginDto;

    const user = await this.commonService.findWithNotFoundException(
      () => this.getUserByName(username),
      globalErrorMessages.USER_NOT_FOUND,
    );

    await this.commonService.validatePassword(
      password,
      user.password,
      globalErrorMessages.INVALID_PASSWORD,
    );
    const [access_token, refresh_token] = await Promise.all([
      this.getAccessToken(user.email, user.username),
      this.getRefreshToken(user.email, user.username),
    ]);
    await this.updateRefreshTokenHash(user.email, refresh_token);

    user.password = undefined;
    user.refreshToken = undefined;
    return {
      access_token,
      refresh_token,
      user,
    };
  }

  /**
   * Log out a client by removing the refresh token.
   *
   * @param {string} email - The email of the client to log out.
   * @returns {Promise<void>} A promise that resolves when the client is logged out.
   */
  async logout(email: string) {
    return await this.clientRepository.findOneAndUpdate(
      { email },
      { $unset: { refreshToken: 1 } },
    );
  }

  /**
   * Refresh the access token for a client.
   *
   * @param {Client} user - The client user for whom to refresh the access token.
   * @returns {Promise<{ access_token: string }>} A promise that resolves to the new access token.
   */
  async refresh(user: Client) {
    const access_token = await this.getAccessToken(user.email, user.username);
    return { access_token };
  }

  /**
   * Generate an access token for a client.
   *
   * @param {string} email - The email of the client.
   * @param {string} username - The username of the client.
   * @returns {Promise<string>} A promise that resolves to the generated access token.
   */
  async getAccessToken(email: string, username: string): Promise<string> {
    return await this.jwtService.signAsync(
      { email, username },
      {
        expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION_TIME),
        secret: this.configService.get('ACCESS_TOKEN_SECRET_CLIENT'),
      },
    );
  }

  /**
   * Generate a refresh token for a client.
   *
   * @param {string} email - The email of the client.
   * @param {string} username - The username of the client.
   * @returns {Promise<string>} A promise that resolves to the generated refresh token.
   */
  async getRefreshToken(email: string, username: string): Promise<string> {
    return await this.jwtService.signAsync(
      { email, username },
      {
        expiresIn: parseInt(
          this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
        ),
        secret: this.configService.get('REFRESH_TOKEN_SECRET_CLIENT'),
      },
    );
  }

  /**
   * Update the hash of the refresh token for a client.
   *
   * @param {string} email - The email of the client.
   * @param {string} refreshToken - The refresh token to be hashed and updated.
   * @returns {Promise<void>} A promise that resolves when the refresh token is updated.
   */
  async updateRefreshTokenHash(
    email: string,
    refreshToken: string,
  ): Promise<Client> {
    return await this.clientRepository.findOneAndUpdate(
      { email },
      {
        refreshToken: await bcrypt.hash(
          refreshToken,
          parseInt(`${this.configService.get('CRYPTO_SALT_ROUNDS')}`),
        ),
      },
    );
  }
}
