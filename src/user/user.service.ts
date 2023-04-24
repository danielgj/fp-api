import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { UserNotFoundError } from './errors/userNotFound.error';
import { UserAlreadyExistingError } from './errors/userAlreadyExisting.error';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  USER_REPOSITORY_TOKEN,
  UserRepository,
} from './repositories/users.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private usersRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return (await this.usersRepository.findAll()).map((item) => {
      delete item.password;
      return item;
    });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findBy({ id });
    if (!user) {
      throw new UserNotFoundError(id);
    }
    delete user.password;
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findBy({ email });
    return user;
  }

  async registerUser(user: CreateUserDTO): Promise<any> {
    const existingUser = await this.findUserByEmail(user.email);
    if (existingUser) {
      throw new UserAlreadyExistingError(user.email);
    }
    const hashedPassword = await bcrypt.hash(
      user.password,
      +process.env.SALT_ROUNDS,
    );
    const createUserDto = {
      isPro: false,
      isAdmin: false,
      lastActiveAt: new Date().toISOString(),
      password: hashedPassword,
      ...user,
    };
    const newUser = await this.usersRepository.create(createUserDto);

    const payload = {
      id: newUser.id,
      email: newUser.email,
      isPro: newUser.isPro,
      isAdmin: newUser.isAdmin,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }

  async updateLastActiveAt(id: string): Promise<User> {
    const userToUpdate = await this.findUserById(id);
    userToUpdate.lastActiveAt = new Date().toISOString();
    await this.usersRepository.update(userToUpdate);
    return userToUpdate;
  }
}
