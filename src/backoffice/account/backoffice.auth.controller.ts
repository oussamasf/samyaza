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
import { Request } from 'express';

// Service
import { BackofficeService } from './backoffice.service';

// Schemas
import { loginSchema } from './constants/swagger';

// DTOS
import { CreateBackofficeDto } from '../dto';
import { LoginDto } from './dto';

//Guards
import { RoleGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

// Constants
import AUTH_GUARD from '../../common/constants/authGuards';
import { BACKOFFICE_ROLES } from './constants/roles';
import { Admin } from './schemas/admin.schema';
import { LoginRes } from 'src/common/types';

/**
 * Controller handling authentication and management of backoffice accounts.
 */
@Controller()
@ApiTags('Backoffice/account')
export class BackofficeAuthController {
  /**
   * Constructor for the BackofficeAuthController class.
   *
   * @param backofficeService - The service responsible for backoffice account operations.
   */
  constructor(private readonly backofficeService: BackofficeService) {}

  /**
   * Authenticate a backoffice admin by performing a login operation.
   *
   * @param loginDto - The login credentials of the backoffice admin.
   * @returns A promise that resolves to an authentication response.
   */
  @Version('1')
  @Post('/login')
  @ApiBody({ schema: loginSchema })
  async login(@Body() loginDto: LoginDto): Promise<LoginRes<Admin>> {
    return await this.backofficeService.login(loginDto);
  }

  /**
   * Create a new backoffice admin with super admin role.
   *
   * @param createBackofficeDto - The data required to create a new backoffice admin.
   * @returns The created backoffice admin.
   */
  @Roles(BACKOFFICE_ROLES.SUPER_ADMIN)
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_BACKOFFICE), RoleGuard)
  @Post('/admin')
  create(@Body() createBackofficeDto: CreateBackofficeDto) {
    return this.backofficeService.create(createBackofficeDto);
  }

  /**
   * Retrieve the profile information of the currently logged-in backoffice admin.
   *
   * @param req - The HTTP request object.
   * @returns The profile information of the logged-in backoffice admin.
   */
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_BACKOFFICE))
  @Get('/profile')
  async getLoggedUser(@Req() req: Request) {
    return req.user;
  }

  /**
   * Logout a backoffice client by revoking their access token.
   *
   * @param req - The HTTP request object containing user information.
   */
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_BACKOFFICE))
  @Get('/logout')
  async logout(@Req() req: any) {
    await this.backofficeService.logout(req.user.email);
  }

  /**
   * Refresh the access token for a backoffice client.
   *
   * @param req - The HTTP request object containing user information.
   * @returns An object containing the new access token.
   */
  @UseGuards(AuthGuard(AUTH_GUARD.REFRESH_TOKEN_BACKOFFICE))
  @Get('/refresh')
  async refresh(@Req() req: any) {
    return await this.backofficeService.refresh(req.user);
  }
}
