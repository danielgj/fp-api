import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from 'express';
import { UserAlreadyExistingError } from "../errors/userAlreadyExisting.error";


@Catch(UserAlreadyExistingError)
export class UserAlreadyExistExceptionFilter implements ExceptionFilter {
    catch(userAlreadyExistsError: UserAlreadyExistingError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response
        .status(HttpStatus.BAD_REQUEST)
        .json({
            statusCode: HttpStatus.BAD_REQUEST,
            message: userAlreadyExistsError.message,
            error: 'User Already Exists'
        });
    }
}

