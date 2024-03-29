import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/public/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateHashedPassword(password: string) {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const hashedPassword = await this.generateHashedPassword(password);
    return this.prisma.user.create({
      data: {
        email: email,
        name: createUserDto.name,
        password: hashedPassword,
      },
    });
  }

  async findUserName(id: number): Promise<Pick<User, 'name'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { name: true },
    });
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
