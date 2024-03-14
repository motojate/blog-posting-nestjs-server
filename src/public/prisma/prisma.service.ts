import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const loggingOptions = {
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    } satisfies Prisma.PrismaClientOptions;
    super(loggingOptions);

    this.$on('query', (e) => {
      console.log(' ');
      console.log('\x1b[34mQuery: \x1b[0m' + e.query); // 콘솔 창을 가독성 있게 보여주기 위해 Ansi Code 추가
      console.log('\x1b[32mParams: \x1b[0m' + e.params);
      console.log('\x1b[33m%s\x1b[0m', 'Duration: ' + e.duration + 'ms');
    });
    this.$on('error', async (e) => {
      console.log(' ');
      console.log('\x1b[31mMessage: \x1b[0m' + e.message);
      console.log('Target: ' + e.target);
      console.log('\x1b[33m%s\x1b[0m', 'TiemStamp: ' + e.timestamp);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
