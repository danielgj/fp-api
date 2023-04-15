import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserMockData } from '../mock/user.mock';
import { UserNotFoundError } from './errors/userNotFound.error';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserAlreadyExistingError } from './errors/userAlreadyExisting.error';

describe('UserController', () => {
  let userController: UserController;

  const mockedSignInResponse = {
    access_token: "foo"
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [
        {
            provide: UserService,
            useValue: {
              findAllUsers: jest.fn().mockResolvedValue(UserMockData.users),
              findUserById: jest.fn().mockImplementation((id: string) => {
                const user = UserMockData.users.find((item) => item.id == id);
                if (!user) {
                    throw new UserNotFoundError(id);
                }
                return user;
              }),
              findUserByEmail: jest.fn().mockImplementation((email: string) => {
                const user = UserMockData.users.find((item) => item.id == email);
                if (!user) {
                    throw new UserNotFoundError(email);
                }
                return user;
              }),
              registerUser: jest.fn().mockImplementation((user: CreateUserDTO) => {
                const existingUser = UserMockData.users.find((item) => item.email == user.email);
                if (existingUser) {
                    throw new UserAlreadyExistingError(user.email);
                }
                return mockedSignInResponse;
              }),
              updateLastActiveAt: jest.fn().mockResolvedValue(UserMockData.users[0]),
            }
        }        
      ]
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('findAllUsers retrieves all users', async () => {
    await expect(userController.findAllUsers()).resolves.toEqual(UserMockData.users);
  });

  it('findUserById with valid id retrieves expected users', async () => {
    await expect(userController.findUserById(UserMockData.users[0].id)).resolves.toEqual(UserMockData.users[0]);
  });

  it('findUserById with invalid id throws error', async () => {
    await expect(userController.findUserById('wrong')).rejects.toThrow(UserNotFoundError);
  });

  it('Register user with existing email throws error', async () => {
    await expect(userController.registerUser({
        name: UserMockData.users[0].name,
        email: UserMockData.users[0].email,
        password: 'foo'
    })).rejects.toThrow(UserAlreadyExistingError);
  });

  it('Register user with non existing email returns token', async () => {
    await expect(userController.registerUser({
        name: UserMockData.users[0].name,
        email: 'new@mail.com',
        password: 'foo'
    })).resolves.toEqual(mockedSignInResponse);
  });

});
