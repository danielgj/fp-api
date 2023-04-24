import { User } from '../entities/user.entity';

export interface UserRepository {
  create(user: any): Promise<User>;
  update(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findBy(query: any): Promise<User>;
}

export const USER_REPOSITORY_TOKEN = 'user-repository-token';
