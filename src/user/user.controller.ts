import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/dtos/CreateUser.dto';
import { User } from 'src/model/User';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
     private userService: UserService
    ) {}

    @Get()
    findAllUsers(): User[] {
        return this.userService.findAllUsers();
    }

    @Get(':id')
    findUserById(@Param('id', ParseIntPipe) id: number): User {
        return this.userService.findUserById(id);
    }

    @Post()
    registerUser(@Body() user: CreateUserDTO): User {
        return this.userService.registerUser(user);
    }

}