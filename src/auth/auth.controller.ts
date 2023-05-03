import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dtos/SignIn.dto';
import { AuthenticationExceptionFilter } from './exceptionFilters/authenticationException.filter';
import { Public } from './decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
@UseFilters(AuthenticationExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInDTO) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
