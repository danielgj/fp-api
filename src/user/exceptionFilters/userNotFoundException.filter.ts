import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UserNotFoundError } from '../errors/userNotFound.error';

@Catch(UserNotFoundError)
export class UserNotFoundExceptionFilter implements ExceptionFilter {
  catch(userNotFoundError: UserNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: userNotFoundError.message,
      error: 'Not Found',
    });
  }
}
