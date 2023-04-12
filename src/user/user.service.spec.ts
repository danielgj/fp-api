import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { UserMockData } from '../mock/user.mock';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dtos/createUser.dto';
import { UserAlreadyExistingError } from './errors/userAlreadyExisting.error';

describe('UserService', () => {
  
  let userService: UserService;
  let userRepo: Repository<User>;

  const token = "validtoken";
  const mockedSignUpResponse = { 
    access_token: token,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
            provide: getRepositoryToken(User),
            useValue: {
                find: jest.fn().mockResolvedValue(UserMockData.users),
                findOneBy: jest.fn().mockImplementation((query) => { 
                    if (query.id) {
                        return UserMockData.users.find((item) => item.id == query.id);
                    }
                    if (query.email) {
                        return UserMockData.users.find((item) => item.email == query.email);
                    }
                    return null;
                }),
                create: jest.fn().mockImplementation((input) => {
                    return {
                        isPro: false,
                        isAdmin: false,
                        lastActiveAt: new Date().toISOString(),
                        ...input
                    }
                }),
                save: jest.fn().mockImplementation((input) => {
                    return {
                        id: 'foo-id',
                        ...input
                    }
                }),
                // as these do not actually use their return values in our sample
                // we just make sure that their resolve is true to not crash
                update: jest.fn().mockResolvedValue(true),
                // as these do not actually use their return values in our sample
                // we just make sure that their resolve is true to not crash
                delete: jest.fn().mockResolvedValue(true),
            },
        },
        {
            provide: JwtService,
            useValue: {
              signAsync: jest.fn().mockResolvedValue(token),
            },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
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
    const result = await userService.findUserByEmail(UserMockData.users[0].email);
    expect(result).toBe(UserMockData.users[0]);
  });
  
  it('findUserByEmail with valid Id removes password from entry', async () => {
    const result = await userService.findUserByEmail(UserMockData.users[0].email);
    expect(result).not.toContain('password');
  });

  it('Register a new user returns access_token', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass1, pass2) => "hashed_password");
    const createUserDto: CreateUserDTO = {
        name: "Daniel",
        email: "new@mail.com",
        password: "foo"
    };
    await expect(userService.registerUser(createUserDto)).resolves.toEqual(mockedSignUpResponse);
  });

  it('Register a new user with existing email throws error', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass1, pass2) => "hashed_password");
    const createUserDto: CreateUserDTO = {
        name: "Daniel",
        email: UserMockData.users[0].email,
        password: "foo"
    };
    await expect(userService.registerUser(createUserDto)).rejects.toThrow(UserAlreadyExistingError);
  });

});