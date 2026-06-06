import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  const prismaMock = {
    prisma: {
      user: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns users from Prisma', async () => {
    prismaMock.prisma.user.findMany.mockResolvedValue([{ id: 1, firstName: 'Aqua', lastName: 'Admin' }]);

    await expect(service.getUsers()).resolves.toEqual([{ id: 1, firstName: 'Aqua', lastName: 'Admin' }]);
    expect(prismaMock.prisma.user.findMany).toHaveBeenCalledTimes(1);
  });

  it('hashes passwords before creating a user', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    prismaMock.prisma.user.create.mockResolvedValue({ id: 1, firstName: 'Aqua', lastName: 'Admin' });

    await expect(
      service.createUser({
        firstName: 'Aqua',
        lastName: 'Admin',
        email: 'admin@aquaops.local',
        password: 'Password123!',
      }),
    ).resolves.toEqual({
      message: 'User created successfully',
      user: { id: 1, firstName: 'Aqua', lastName: 'Admin' },
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
    expect(prismaMock.prisma.user.create).toHaveBeenCalledWith({
      data: {
        firstName: 'Aqua',
        lastName: 'Admin',
        email: 'admin@aquaops.local',
        passwordHash: 'hashed-password',
      },
    });
  });
});
