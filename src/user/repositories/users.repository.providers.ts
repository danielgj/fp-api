import { Injectable, Provider } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER_REPOSITORY_TOKEN } from './users.repository.interface';
import { User } from '../model/user.model';
import { UsersTypeOrmRepository } from './implementations/UsersTypeOrm.repository';
import { UsersInMemoryRepository } from './implementations/UsersInMemory.repository';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from '../../data/constants';

export function provideUsersRepository(): Provider[] {
  return [
    {
      provide: USER_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: UsersRepoDependenciesProvider) =>
        provideUsersRepositoryFactory(dependenciesProvider),
      inject: [UsersRepoDependenciesProvider],
    },
    UsersRepoDependenciesProvider,
  ];
}

async function provideUsersRepositoryFactory(
  dependenciesProvider: UsersRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;

  switch (process.env.USERS_DATASOURCE) {
    case DataSource.TYPEORM:
      return new UsersTypeOrmRepository(dependenciesProvider.typeOrmRepository);
    case DataSource.MEMORY:
      return new UsersInMemoryRepository();
    default:
      return new UsersInMemoryRepository();
  }
}

@Injectable()
export class UsersRepoDependenciesProvider {
  constructor(
    @InjectRepository(User)
    public typeOrmRepository: Repository<User>,
  ) {}
}
