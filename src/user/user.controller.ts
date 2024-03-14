import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

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

  // 해당 컨트롤러는 모든 유저 데이터를 가지고 오는 내용이니, 이번에만 사용하고 추후 제거하도록 하겠습니다.
  @Get('list')
  async findUserList() {
    return this.userService.findUserList();
  }
}
