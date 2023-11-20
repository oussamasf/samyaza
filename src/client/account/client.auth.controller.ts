import {
  Controller,
  Get,
  Post,
  Body,
  Version,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBody } from '@nestjs/swagger';

// Service
import { ClientAuthService } from './client.auth.service';

// Schemas
import { Client } from './schemas/client.schema';
import { loginSchema, signupSchema } from './constants/swagger';

// DTOS
import { LoginDto, CreateClientUserDto } from './dto';

// Constants
import AUTH_GUARD from '../../common/constants/authGuards';
import { LoginRes } from 'src/common/types';

//? Controller class
@Controller()
@ApiTags('Client/account')
export class ClientAuthController {
  /**
   * Constructor for ClientAuthController
   * @param clientService - The ClientAuthService instance used for authentication and user management.
   */
  constructor(private readonly clientService: ClientAuthService) {}

  /**
   * Client login endpoint.
   * @param loginDto - The LoginDto containing user login information.
   * @returns A Promise that resolves to a LoginRes<Client> with user information upon successful login.
   */
  @Version('1')
  @Post('/login')
  @ApiBody({ schema: loginSchema })
  async login(@Body() loginDto: LoginDto): Promise<LoginRes<Client>> {
    return await this.clientService.login(loginDto);
  }

  /**
   * Client signup endpoint.
   * @param createClientUserDto - The CreateClientUserDto containing user registration information.
   */
  @Post('/signup')
  @ApiBody({ schema: signupSchema })
  create(@Body() createClientUserDto: CreateClientUserDto) {
    return this.clientService.signup(createClientUserDto);
  }

  /**
   * Endpoint to retrieve the profile of the currently logged-in client.
   * @param req - The HTTP request object.
   * @returns A Promise that resolves to a Client object representing the logged-in client's profile.
   */
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_CLIENT))
  @Get('/profile')
  async getLoggedUser(@Req() req: any): Promise<Client> {
    return req.user;
  }

  /**
   * Client logout endpoint.
   * @param req - The HTTP request object.
   */
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_CLIENT))
  @Get('/logout')
  async logout(@Req() req: any) {
    await this.clientService.logout(req.user.email);
  }

  /**
   * Client token refresh endpoint.
   * @param req - The HTTP request object.
   * @returns A Promise that resolves to updated authentication tokens.
   */
  @UseGuards(AuthGuard(AUTH_GUARD.REFRESH_TOKEN_CLIENT))
  @Get('/refresh')
  async refresh(@Req() req: any) {
    return await this.clientService.refresh(req.user);
  }
}
