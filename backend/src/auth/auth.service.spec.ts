import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    prisma: {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    },
  };

  const jwtMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: JwtService,
          useValue: jwtMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('registers a user with a hashed password', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    prismaMock.prisma.user.create.mockResolvedValue({ id: 1, email: 'admin@aquaops.local' });
    jwtMock.sign.mockReturnValue('signed-token');

    await expect(
      service.register({
        firstName: 'Aqua',
        lastName: 'Admin',
        email: 'admin@aquaops.local',
        password: 'Password123!',
      }),
    ).resolves.toEqual({ access_token: 'signed-token' });

    expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
    expect(prismaMock.prisma.user.create).toHaveBeenCalledWith({
      data: {
        firstName: 'Aqua',
        lastName: 'Admin',
        email: 'admin@aquaops.local',
        passwordHash: 'hashed-password',
      },
    });
    expect(jwtMock.sign).toHaveBeenCalledWith({ sub: 1, email: 'admin@aquaops.local' });
  });

  it('returns a JWT when login credentials are valid', async () => {
    prismaMock.prisma.user.findUnique.mockResolvedValue({
      id: 2,
      email: 'user@aquaops.local',
      passwordHash: 'hashed-password',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtMock.sign.mockReturnValue('login-token');

    await expect(service.login('user@aquaops.local', 'Password123!')).resolves.toEqual({
      access_token: 'login-token',
    });

    expect(bcrypt.compare).toHaveBeenCalledWith('Password123!', 'hashed-password');
    expect(jwtMock.sign).toHaveBeenCalledWith({ sub: 2, email: 'user@aquaops.local' });
  });

  it('rejects invalid login credentials', async () => {
    prismaMock.prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.login('missing@aquaops.local', 'Password123!')).rejects.toThrow(
      'Invalid credentials',
    );
  });
});
