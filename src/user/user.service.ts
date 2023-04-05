import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDTO } from "./dtos/CreateUser.dto";
import { User } from "./entities/user.entity";
import { UserNotFoundError } from "./errors/userNotFound.error";
import { Repository } from "typeorm";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)private readonly usersRepository: Repository<User>
    ) {}

    
    async findAllUsers(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findUserById(id: string):Promise<User> {
        const user = await this.usersRepository.findOneBy({id});
        if (!user) {
            throw new UserNotFoundError(id);
        }
        return user;
    }

    async registerUser(user: CreateUserDTO): Promise<User> {
        const newUser = this.usersRepository.create({
            isPro: false,
            isAdmin: false,
            ...user
        });
        await this.usersRepository.save(newUser);
        return newUser;
    }
}