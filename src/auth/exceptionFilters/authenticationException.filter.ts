import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationError } from '../errors/authentication.error';

@Catch(AuthenticationError)
export class AuthenticationExceptionFilter implements ExceptionFilter {
  catch(userAlreadyExistsError: AuthenticationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.FORBIDDEN).json({
      statusCode: HttpStatus.FORBIDDEN,
      message: userAlreadyExistsError.message,
      error: 'User not authenticated',
    });
  }
}
