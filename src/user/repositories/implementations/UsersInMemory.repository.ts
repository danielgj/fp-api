import { User } from '../../model/user.model';
import { UserRepository } from '../users.repository.interface';
import { v4 as uuid } from 'uuid';

export class UsersInMemoryRepository implements UserRepository {
  private users: User[] = [];

  async create(user: any) {
    const id = uuid();
    const userCreated = {
      id,
      ...user,
    };
    this.users.push(userCreated);
    return userCreated;
  }

  async findAll() {
    return this.users;
  }

  async findBy(query: any) {
    if (query.email) {
      return this.users.find((u) => u.email == query.email);
    }
    if (query.id) {
      return this.users.find((u) => u.id == query.id);
    }
    return null;
  }

  async update(user: User) {
    this.users = this.users.map((u) => (u.id !== user.id ? u : user));
    return user;
  }
}
