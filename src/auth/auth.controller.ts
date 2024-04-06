import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response as ExpressResponse, Request } from 'express';
import { JwtAuthGuard } from 'src/public/guards/jwt-auth.guard';
import { UserData } from 'src/public/decorators/user.decorator';

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

  /**
   * 로그아웃 API
   * @returns 토큰 초기화
   */
  @Post('logout')
  @HttpCode(201)
  async logout(@Req() req: Request, @Res() res: ExpressResponse) {
    const refreshToken = req.cookies['refresh_token'];
    await this.authService.revokeRefreshToken(refreshToken);
    res.cookie('access_token', '', { httpOnly: true, expires: new Date(0) });
    res.cookie('refresh_token', '', { httpOnly: true, expires: new Date(0) });
    res.send();
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async refresh(@UserData('id') userId: number, @Res() res: ExpressResponse) {
    const token = await this.authService.getTokens(userId);
    res.cookie('access_token', token.accessToken, { httpOnly: true });
    res.cookie('refresh_token', token.refreshToken, { httpOnly: true });
    res.send();
  }
}
