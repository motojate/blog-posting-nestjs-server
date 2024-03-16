import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../public/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue({
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                password: 'hashedPassword',
              }),
              findUnique: jest.fn().mockImplementation(({ where, select }) => {
                if (where.id && select.name) {
                  return Promise.resolve({ name: 'Test User' });
                } else if (where.email) {
                  return Promise.resolve({
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                  });
                }
              }),
            },
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const result = await userService.createUser(createUserDto);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: expect.any(String),
        },
      });
    });
  });

  describe('findUserName', () => {
    it('should return a user name', async () => {
      const userId = 1;
      const result = await userService.findUserName(userId);
      expect(result).toEqual({ name: 'Test User' });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: { name: true },
      });
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user', async () => {
      const userEmail = 'test@example.com';
      const result = await userService.findUserByEmail(userEmail);
      expect(result).toEqual({ id: 1, name: 'Test User', email: userEmail });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: userEmail },
      });
    });
  });
});
