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

  private createToken(id: number, option?: { expiresIn: string }): string {
    const payload = { id };
    return this.jwtService.sign(payload, option);
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });
    if (!user) throw new Error('존재하지 않는 유저입니다.');

    const isVerifyPassword = bcrypt.compare(password, user.password);
    if (!isVerifyPassword) throw new Error('비밀번호가 일치하지 않습니다.');

    return this.createToken(user.id);
  }
}
