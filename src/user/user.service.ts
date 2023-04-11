import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDTO } from "../user/dtos/createUser.dto";
import { User } from "../user/entities/user.entity";
import { UserNotFoundError } from "../user/errors/userNotFound.error";
import { UserAlreadyExistingError } from "../user/errors/userAlreadyExisting.error";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)private readonly usersRepository: Repository<User>
    ) {}

    
    async findAllUsers(): Promise<User[]> {
        return (await this.usersRepository.find()).map((item) => {
            delete item.password
            return item;
        });
    }

    async findUserById(id: string):Promise<User> {
        const user = await this.usersRepository.findOneBy({id});
        if (!user) {
            throw new UserNotFoundError(id);
        }
        delete user.password;
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
            lastActiveAt: new Date().toISOString(),
            ...user
        });
        newUser.password = hashedPassword;
        await this.usersRepository.save(newUser);
        delete newUser.password;
        return newUser;
    }

    async updateLastActiveAt(id: string): Promise<User> {
        const userToUpdate = await this.findUserById(id);
        userToUpdate.lastActiveAt = new Date().toISOString();
        await this.usersRepository.save(userToUpdate);
        return userToUpdate;
    }
}