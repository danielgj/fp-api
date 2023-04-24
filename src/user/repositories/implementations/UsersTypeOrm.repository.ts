import { User } from '../../model/user.model';
import { UserRepository } from '../users.repository.interface';
import { Repository } from 'typeorm';

export class UsersTypeOrmRepository implements UserRepository {
  constructor(private usersRepository: Repository<User>) {}

  async create(user: any) {
    const userCreated = await this.usersRepository.create(user)[0];
    this.usersRepository.save(userCreated);
    return userCreated;
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findBy(query: any) {
    return this.usersRepository.findOneBy(query);
  }

  async update(user: User) {
    return this.usersRepository.save(user);
  }
}
