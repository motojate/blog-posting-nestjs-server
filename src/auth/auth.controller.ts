import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(201)
  async login(@Body() loginDto: LoginDto, @Res() res: ExpressResponse) {
    const token = await this.authService.login(loginDto);
    res.cookie('access_token', token, { httpOnly: true });
    res.send();
  }
}
