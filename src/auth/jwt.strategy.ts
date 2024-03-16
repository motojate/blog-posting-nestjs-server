import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

export interface IAuthTokenPayload {
  id: number;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies['access_token'];
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: IAuthTokenPayload) {
    const { id } = payload;
    return { id };
  }
}
