import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit {
  [key: string]: any;

  public prisma: any = new (PrismaClient as any)();

  async onModuleInit() {
    await this.prisma.$connect();
  }
}
