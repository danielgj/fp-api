import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticationError } from './errors/authentication.error';

describe('AuthController', () => {
  let authController: AuthController;

  const mockedSignInResponse = {
    access_token: "foo"
  };

  const wrongBody = {
    email: "wrong@mail.com",
    password: "foo"
  };

  const validBody = {
    email: "valid@mail.com",
    password: "foo"
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        {
            provide: AuthService,
            useValue: {
                signIn: jest.fn().mockImplementation((email: string, pass: string) => {
                    if (email == validBody.email) {
                        return Promise.resolve(mockedSignInResponse);
                    } else {
                        return Promise.reject(new AuthenticationError());
                    }                    
                }),
                validateUser: jest.fn().mockImplementation((email: string, pass: string) =>
                    Promise.resolve({
                        id: "foo",
                        name: "dani",
                        email: "d@d.es",
                        password: "secret",
                        isPro: false,
                        isAdmin: false
                    }),
                ),
            }
        }        
      ]
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('Should throw an error if body is wrong', async () => {
    await expect(authController.signIn(wrongBody)).rejects.toThrow(AuthenticationError)
  });

  it('Returns access token if body is valid', async () => {
    await expect(authController.signIn(validBody)).resolves.toEqual(mockedSignInResponse);
  });

});
