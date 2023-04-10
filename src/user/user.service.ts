import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDTO } from "./dtos/CreateUser.dto";
import { User } from "./entities/user.entity";
import { UserNotFoundError } from "./errors/userNotFound.error";
import { UserAlreadyExistingError } from "./errors/userAlreadyExisting.error";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

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
    
    async findUserByEmail(email: string):Promise<User> {
        const user = await this.usersRepository.findOneBy({email});
        if (!user) {
            throw new UserNotFoundError(email);
        }
        return user;
    }

    async registerUser(user: CreateUserDTO): Promise<User> {

        const existingUser = await this.findUserByEmail(user.email);
        if (existingUser) {
            throw new UserAlreadyExistingError(user.email);
        }
        const hashedPassword = await bcrypt.hash(user.password, +process.env.SALT_ROUNDS);
        var newUser = this.usersRepository.create({
            isPro: false,
            isAdmin: false,
            ...user
        });
        newUser.password = hashedPassword;
        await this.usersRepository.save(newUser);
        delete newUser.password;
        return newUser;
    }
}