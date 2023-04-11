import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        JwtModule
      ],
      controllers: [AuthController],
      providers: [AuthService]
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  /*
  it('Should throw an error if body is wrong', () => {
    const wrongBody = {
        email: "",
        password: ""
    };
    expect(authController.signIn(wrongBody)).toThrowError()
  })
  */
});
