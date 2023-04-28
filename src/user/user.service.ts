import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dtos/createUser.dto';
import { User } from './entities/user.entity';
import { UserNotFoundError } from './errors/userNotFound.error';
import { UserAlreadyExistingError } from './errors/userAlreadyExisting.error';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return (await this.usersRepository.find()).map((item) => {
      delete item.password;
      return item;
    });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new UserNotFoundError(id);
    }
    delete user.password;
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
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
    const newUser = this.usersRepository.create({
      isPro: false,
      isAdmin: false,
      lastActiveAt: new Date().toISOString(),
      ...user,
    });
    newUser.password = hashedPassword;
    await this.usersRepository.save(newUser);

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
    await this.usersRepository.save(userToUpdate);
    return userToUpdate;
  }
}
