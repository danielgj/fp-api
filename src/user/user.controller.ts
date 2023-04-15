import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { UserNotFoundExceptionFilter } from './exceptionFilters/userNotFoundException.filter';
import { User } from './entities/user.entity';
import { UserAlreadyExistExceptionFilter } from './exceptionFilters/userAlreadyExistException.filter';
import { Public } from '../auth/decorators/public.decorator';
import { Admin } from '../auth/decorators/admin.decorator';

@Controller('user')
@UseFilters(UserNotFoundExceptionFilter)
@UseFilters(UserAlreadyExistExceptionFilter)
export class UserController {

    constructor(
     private userService: UserService
    ) {}

    @Admin()
    @Get()
    async findAllUsers(): Promise<User[]> {
        return this.userService.findAllUsers();
    }

    @Get(':id')
    async findUserById(@Param('id') id: string): Promise<User> {
        return this.userService.findUserById(id);
    }

    @Public()
    @Post()
    async registerUser(@Body() user: CreateUserDTO): Promise<any> {
        return this.userService.registerUser(user);
    }

}