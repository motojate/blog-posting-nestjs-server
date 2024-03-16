import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/public/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

interface IUserRequest {
  user: {
    id: number;
  };
}
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body('createUserDto') createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async findUserByEmail(@Query('email') email: string) {
    return this.userService.findUserByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('name')
  async getUserName(@Req() req: ExpressRequest & IUserRequest) {
    const id = req.user.id;

    return this.userService.findUserName(id);
  }
}
