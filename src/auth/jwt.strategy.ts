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
        const token = req.cookies['access_token'];
        if (!token) throw new Error('토큰이 없습니다.');
        else return token;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: IAuthTokenPayload) {
    const { id } = payload;
    return { id };
  }
}
