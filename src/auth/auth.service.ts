import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/public/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 토큰을 생성합니다.
   * @param id 데이터베이스 내 유저의 id 값
   * @param option 토큰의 유효기간
   * @returns string형 토큰값
   */
  private createToken(id: number, option?: { expiresIn: string }) {
    const payload = { id };
    return this.jwtService.sign(payload, option);
  }

  /**
   * 리프레시 토큰을 저장하거나 갱신합니다.
   * @param token 토큰 값
   * @param userId 데이터베이스 내 유저의 id 값
   */
  private upsertRefreshToken(token: string, userId: number) {
    return this.prisma.refreshToken.upsert({
      where: {
        userId,
      },
      create: {
        token,
        userId,
      },
      update: {
        token,
      },
    });
  }

  private async getTokens(id: number) {
    const accessToken = this.createToken(id);

    // 리프레시 토큰 생성 로직 추가. 유효기간 15일
    const refreshToken = this.createToken(id, { expiresIn: '15d' });

    // 리프레시 토큰 db에 저장 로직 추가.
    await this.upsertRefreshToken(refreshToken, id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });
    if (!user) throw new Error('존재하지 않는 유저입니다.');

    const isVerifyPassword = bcrypt.compare(password, user.password);
    if (!isVerifyPassword) throw new Error('비밀번호가 일치하지 않습니다.');

    return this.getTokens(user.id);
  }

  async refreshToken(id: number) {
    return this.getTokens(id);
  }

  async revokeRefreshToken(token: string) {
    return this.prisma.refreshToken.update({
      where: {
        token,
      },
      data: {
        isRevoke: true,
      },
    });
  }
}
