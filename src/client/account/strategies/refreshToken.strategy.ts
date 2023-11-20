import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ClientAuthService } from '../client.auth.service';
import { Request } from 'express';
import AUTH_GUARD from '../../../common/constants/authGuards';
import * as bcrypt from 'bcrypt';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_GUARD.REFRESH_TOKEN_CLIENT,
) {
  constructor(private readonly clientAuthService: ClientAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET_CLIENT,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { username: string }) {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) throw new UnauthorizedException();

    const user = await this.clientAuthService.getUserByName(payload.username);
    const isValid = await bcrypt.compare(refreshToken, `${user?.refreshToken}`);
    if (!isValid) throw new UnauthorizedException();

    return user;
  }
}
