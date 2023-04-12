import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError } from './errors/authentication.error';
import { UserMockData } from '../mock/user.mock';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  
  const token = "validtoken";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
            provide: UserService,
            useValue: {
              findAllUsers: jest.fn().mockResolvedValue(UserMockData.users),
              findUserById: jest.fn().mockImplementation((id: string) => UserMockData.users.find((item) => item.id == id)),
              findUserByEmail: jest.fn().mockImplementation((email: string) => UserMockData.users.find((item) => item.email == email)),
              registerUser: jest.fn().mockResolvedValue(UserMockData.users[0]),
              updateLastActiveAt: jest.fn().mockResolvedValue(UserMockData.users[0]),
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

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('Sign In with no existing email throws error', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass1: string, pass2: string) => pass1 == pass2);
    await expect(authService.signIn("wrong", "idontcare")).rejects.toThrow(AuthenticationError);
  });
  
  it('Sign In with wrong password throws error', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass1, pass2) => pass1 == pass2);
    await expect(authService.signIn(UserMockData.users[0].email, "wrong")).rejects.toThrow(AuthenticationError);
  });

  it('Sign In with valid credentials returns access token', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass1, pass2) => pass1 == pass2);
    await expect(authService.signIn(UserMockData.users[0].email, UserMockData.users[0].password)).resolves.toEqual({
        access_token: token
    });
  });

  it('Validate with no existing email throws error', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass1: string, pass2: string) => pass1 == pass2);
    await expect(authService.validateUser("wrong", "idontcare")).resolves.toBeNull();
  });

  it('Validate with wrong password throws error', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass1, pass2) => pass1 == pass2);
    await expect(authService.validateUser(UserMockData.users[0].email, "wrong")).rejects.toThrow(AuthenticationError);
  });

  it('Sign In with valid credentials returns user', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass1, pass2) => pass1 == pass2);
    await expect(authService.validateUser(UserMockData.users[0].email, UserMockData.users[0].password)).resolves.toEqual(UserMockData.users[0]);
  });
});