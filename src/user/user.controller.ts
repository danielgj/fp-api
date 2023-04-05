import { Body, Controller, Get, Param, ParseIntPipe, Post, UseFilters } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dtos/CreateUser.dto';
import { UserService } from './user.service';
import { UserNotFoundExceptionFilter } from './exceptionFilters/userNotFoundException.filter';
import { User } from './entities/user.entity';

@Controller('user')
@UseFilters(UserNotFoundExceptionFilter)
export class UserController {

    constructor(
     private userService: UserService
    ) {}

    @Get()
    async findAllUsers(): Promise<User[]> {
        return this.userService.findAllUsers();
    }

    @Get(':id')
    async findUserById(@Param('id') id: string): Promise<User> {
        return this.userService.findUserById(id);
    }

    @Post()
    async registerUser(@Body() user: CreateUserDTO): Promise<User> {
        return this.userService.registerUser(user);
    }

}