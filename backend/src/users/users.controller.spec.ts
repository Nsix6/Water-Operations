import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  const usersServiceMock = {
    getUsers: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates getUsers to UsersService', async () => {
    usersServiceMock.getUsers.mockResolvedValue([{ id: 1 }]);

    await expect(controller.getUsers()).resolves.toEqual([{ id: 1 }]);
    expect(usersServiceMock.getUsers).toHaveBeenCalledTimes(1);
  });

  it('delegates createUser to UsersService', async () => {
    usersServiceMock.createUser.mockResolvedValue({ message: 'User created successfully', user: { id: 1 } });

    await expect(
      controller.createUser({
        firstName: 'Aqua',
        lastName: 'Admin',
        email: 'admin@aquaops.local',
        password: 'Password123!',
      }),
    ).resolves.toEqual({ message: 'User created successfully', user: { id: 1 } });

    expect(usersServiceMock.createUser).toHaveBeenCalledWith({
      firstName: 'Aqua',
      lastName: 'Admin',
      email: 'admin@aquaops.local',
      password: 'Password123!',
    });
  });
});
