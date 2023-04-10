import { Body, Controller, Post, HttpCode, HttpStatus, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dtos/SignIn.dto';
import { AuthenticationExceptionFilter } from './exceptionFilters/authenticationException.filter';

@Controller('auth')
@UseFilters(AuthenticationExceptionFilter)
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    signIn(@Body() signInDto: SignInDTO) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

}
