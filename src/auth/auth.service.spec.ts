import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError } from './errors/authentication.error';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  const userArray = [
    {
      id: '#1',
      name: 'name #1',
      email: '1@mail.com',
      password: 'strongPass',
      isPro: false,
      isAdmin: false,
    },
    {
        id: '#2',
        name: 'name #2',
        email: '2@mail.com',
        password: 'strongPass',
        isPro: false,
        isAdmin: false,
    },
  ];
  
  const token = "validtoken";


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
            provide: UserService,
            useValue: {
              findAllUsers: jest.fn().mockResolvedValue(userArray),
              findUserById: jest.fn().mockImplementation((id: string) => userArray.find((item) => item.id == id)),
              findUserByEmail: jest.fn().mockImplementation((email: string) => userArray.find((item) => item.email == email)),
              registerUser: jest.fn().mockResolvedValue(userArray[0]),
              updateLastActiveAt: jest.fn().mockResolvedValue(userArray[0]),
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
    await expect(authService.signIn(userArray[0].email, "wrong")).rejects.toThrow(AuthenticationError);
  });

  it('Sign In with valid credentials returns access token', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass1, pass2) => pass1 == pass2);
    await expect(authService.signIn(userArray[0].email, userArray[0].password)).resolves.toEqual({
        access_token: token
    });
  });

  it('Validate with no existing email throws error', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass1: string, pass2: string) => pass1 == pass2);
    await expect(authService.validateUser("wrong", "idontcare")).resolves.toBeNull();
  });

  it('Validate with wrong password throws error', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass1, pass2) => pass1 == pass2);
    await expect(authService.validateUser(userArray[0].email, "wrong")).rejects.toThrow(AuthenticationError);
  });

  it('Sign In with valid credentials returns user', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass1, pass2) => pass1 == pass2);
    await expect(authService.validateUser(userArray[0].email, userArray[0].password)).resolves.toEqual(userArray[0]);
  });
});