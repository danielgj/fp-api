import { Injectable } from "@nestjs/common";
import { CreateUserDTO } from "src/dtos/CreateUser.dto";
import { User } from "src/model/User";

@Injectable()
export class UserService {

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

    findAllUsers(): User[] {
        return this.users;
    }

    findUserById(id: number): User {
        return this.users.find(user => user.id == id);
    }

    registerUser(user: CreateUserDTO): User {
        const newUser: User = {
            id: this.users.length,
            isPro: false,
            ...user
        };
        this.users.push(newUser);
        return newUser;
    }
}