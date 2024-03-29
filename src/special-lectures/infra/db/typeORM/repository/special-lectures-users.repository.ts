import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { SpecialLecturesUsers } from '../../../../interfaces/entities/special-lectures-users.entity';
import { SpecialLecturesUsersRepository } from 'src/special-lectures/interfaces/repository/special-lectures-users.repository.interface';
import { SpecialLecturesUsersTypeORM } from '../entities/special-lectures-users.entity';
import { LockOption } from '../typeORMDataAccessor';

@Injectable()
export class SpecialLecturesUsersRepositoryTypeORM
  implements SpecialLecturesUsersRepository
{
  constructor(
    // private readonly ormRepository: Repository<SpecialLecturesUsers>,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async createUsers(
    userData: Partial<SpecialLecturesUsersTypeORM>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesUsersTypeORM> {
    const user = queryRunner.manager.create(
      SpecialLecturesUsersTypeORM,
      userData,
    );
    return queryRunner.manager.save(user);
  }

  async findUserByphone_number(
    phone_number: string,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesUsersTypeORM> {
    return queryRunner.manager.findOne(SpecialLecturesUsersTypeORM, {
      lock: lockOption,
      where: { phone_number },
    });
  }

  async findUserByEmail(
    email: string,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesUsersTypeORM> {
    return queryRunner.manager.findOne(SpecialLecturesUsersTypeORM, {
      lock: lockOption,
      where: { email },
    });
  }

  async findUserById(
    id: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesUsersTypeORM> {
    return queryRunner.manager.findOne(SpecialLecturesUsersTypeORM, {
      lock: lockOption,
      where: { id },
    });
  }

  async findUser(
    name: string,
    email: string,
    phone_number: string,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesUsers> {
    return queryRunner.manager.findOne(SpecialLecturesUsersTypeORM, {
      lock: lockOption,
      where: {
        name,
        email,
        phone_number,
      },
    });
  }

  async updateUser(
    id: number,
    userData: Partial<SpecialLecturesUsersTypeORM>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesUsersTypeORM> {
    await queryRunner.manager.update(SpecialLecturesUsersTypeORM, id, userData);
    return this.findUserById(id, queryRunner);
  }

  async deleteUser(id: number, queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(SpecialLecturesUsersTypeORM, id);
  }
}
