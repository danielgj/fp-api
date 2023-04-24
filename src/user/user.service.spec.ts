import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { UserMockData } from '../mock/user.mock';
import * as bcrypt from 'bcryptjs';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserAlreadyExistingError } from './errors/userAlreadyExisting.error';
import { USER_REPOSITORY_TOKEN } from './repositories/users.repository.interface';

describe('UserService', () => {
  let userService: UserService;

  const token = 'validtoken';
  const mockedSignUpResponse = {
    access_token: token,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue(token),
          },
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn().mockImplementation((input) => {
              return {
                id: 'foo-id',
                isPro: false,
                isAdmin: false,
                lastActiveAt: new Date().toISOString(),
                ...input,
              };
            }),
            update: jest.fn().mockImplementation((input) => {
              return {
                lastActiveAt: new Date().toISOString(),
                ...input,
              };
            }),
            findAll: jest.fn().mockResolvedValue(UserMockData.users),
            findBy: jest.fn().mockImplementation((query) => {
              if (query.id) {
                return UserMockData.users.find((item) => item.id == query.id);
              }
              if (query.email) {
                return UserMockData.users.find(
                  (item) => item.email == query.email,
                );
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('findAllUsers return an array of users', async () => {
    const result = await userService.findAllUsers();
    expect(result.length).toBe(UserMockData.users.length);
  });

  it('findAllUsers removes password from each entry', async () => {
    const result = await userService.findAllUsers();
    expect(result[0]).not.toContain('password');
  });

  it('findUserById with valid Id returns expected entry', async () => {
    const result = await userService.findUserById(UserMockData.users[0].id);
    expect(result).toBe(UserMockData.users[0]);
  });

  it('findUserById with valid Id removes password from entry', async () => {
    const result = await userService.findUserById(UserMockData.users[0].id);
    expect(result).not.toContain('password');
  });

  it('findUserByEmail with valid Id returns expected entry', async () => {
    const result = await userService.findUserByEmail(
      UserMockData.users[0].email,
    );
    expect(result).toBe(UserMockData.users[0]);
  });

  it('findUserByEmail with valid Id removes password from entry', async () => {
    const result = await userService.findUserByEmail(
      UserMockData.users[0].email,
    );
    expect(result).not.toContain('password');
  });

  it('Register a new user returns access_token', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => 'hashed_password');
    const createUserDto: CreateUserDTO = {
      name: 'Daniel',
      email: 'new@mail.com',
      password: 'foo',
    };
    await expect(userService.registerUser(createUserDto)).resolves.toEqual(
      mockedSignUpResponse,
    );
  });

  it('Register a new user with existing email throws error', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => 'hashed_password');
    const createUserDto: CreateUserDTO = {
      name: 'Daniel',
      email: UserMockData.users[0].email,
      password: 'foo',
    };
    await expect(userService.registerUser(createUserDto)).rejects.toThrow(
      UserAlreadyExistingError,
    );
  });
});
