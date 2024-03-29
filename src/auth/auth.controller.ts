import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그인 API
   * @Body 유저의 아이디 및 비밀번호
   */
  @Post('login')
  @HttpCode(201)
  async login(@Body() loginDto: LoginDto, @Res() res: ExpressResponse) {
    const token = await this.authService.login(loginDto);
    res.cookie('access_token', token.accessToken, { httpOnly: true });
    res.cookie('refresh_token', token.refreshToken, { httpOnly: true });
    res.send();
  }
}
