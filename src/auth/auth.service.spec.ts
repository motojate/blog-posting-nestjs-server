import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/public/prisma/prisma.service';

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
            refreshToken: {
              create: jest.fn().mockResolvedValue({
                token: 'abcdefg',
                userId: 1,
              }),
            },
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createRefreshToken', () => {
    it('should create a refrsh token', async () => {
      const createRefreshTokenDto = {
        token: 'abcdefg',
        userId: 1,
      };
    });
  });
});
