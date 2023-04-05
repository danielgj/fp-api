import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/dtos/CreateUser.dto';
import { User } from 'src/model/User';

@Controller('user')
export class UserController {

    private users: User[] = [
        {
            id: 1,
            name: "Daniel",
            email: "danielgj@gmail.com",
            password: "pass1234",           
            isPro: true
        },
        {
            id: 2,
            name: "Lucía",
            email: "lucia.aragon@gmail.com",
            password: "pass1234",           
            isPro: false
        }
    ];

    @Get()
    findAllUsers(): User[] {
        return this.users;
    }

    @Get(':id')
    findUserById(@Param('id', ParseIntPipe) id: number): User {
        return this.users.find(user => user.id == id);
    }

    @Post()
    registerUser(@Body() user: CreateUserDTO): User {
        const newUser: User = {
            id: this.users.length,
            isPro: false,
            ...user
        };
        this.users.push(newUser);
        return newUser;
    }

}