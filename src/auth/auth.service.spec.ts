import { AuthService } from './auth.service';
import { PrismaService } from 'src/public/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockImplementation(({ where }) => {
                if (where.email === 'test@example.com') {
                  return Promise.resolve({
                    id: 1,
                    email: 'test@example.com',
                    password: 'hashedPassword',
                  });
                }
                return null;
              }),
            },
            refreshToken: {
              create: jest.fn().mockResolvedValue({
                token: 'testToken',
                userId: 1,
              }),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('testToken'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.spyOn(bcrypt, 'compare').mockImplementation((password) => {
      return password === 'password';
    });
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  it('성공적인 로그인 시, 액세스 토큰과 리프레시 토큰을 반환해야 합니다.', async () => {
    const loginDto = { email: 'test@example.com', password: 'password' };
    const result = await authService.login(loginDto);

    expect(result).toHaveProperty('accessToken', 'testToken');
    expect(result).toHaveProperty('refreshToken', 'testToken');
    expect(prismaService.refreshToken.create).toHaveBeenCalledWith({
      data: {
        userId: 1,
        token: 'testToken',
      },
    });
  });

  it('존재하지 않는 유저에 대해 로그인을 시도하면 에러를 반환해야 합니다.', async () => {
    const loginDto = {
      email: 'no-test-user@example.com',
      password: 'password',
    };
    await expect(authService.login(loginDto)).rejects.toThrow(
      '존재하지 않는 유저입니다.',
    );
  });

  it('비밀번호가 일치하지 않으면 에러를 던져야 한다', async () => {
    const loginDto = { email: 'test@example.com', password: 'wrongPassword' };

    await expect(authService.login(loginDto)).rejects.toThrow(
      '비밀번호가 일치하지 않습니다.',
    );
  });
});
