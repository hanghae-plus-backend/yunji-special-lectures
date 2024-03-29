import { Inject, Injectable } from '@nestjs/common';
import {
  Between,
  EntityManager,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  QueryRunner,
  Repository,
} from 'typeorm';
import { SpecialLecturesTypeORM } from '../entities/special-lectures.entity';
import { SpecialLecturesRepository } from 'src/special-lectures/interfaces/repository/special-lectures.repository.interface';
import { LockOption } from '../typeORMDataAccessor';

@Injectable()
export class SpecialLecturesRepositoryTypeORM
  implements SpecialLecturesRepository
{
  constructor(
    // private readonly ormRepository: Repository<SpecialLecturesTypeORM>,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async createLecture(
    lectureData: Partial<SpecialLecturesTypeORM>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesTypeORM> {
    const lecture = queryRunner.manager.create(
      SpecialLecturesTypeORM,
      lectureData,
    );
    return queryRunner.manager.save(lecture);
  }

  async findLectureById(
    id: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesTypeORM> {
    return queryRunner.manager.findOne(SpecialLecturesTypeORM, {
      lock: lockOption,
      where: { id },
    });
  }

  async findLecturesBybeginDateBetween(
    fromDate: Date | string,
    toDate: Date | string,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesTypeORM[]> {
    return queryRunner.manager.find(SpecialLecturesTypeORM, {
      lock: lockOption,
      where: {
        begin_date: Between(
          typeof fromDate === 'string' ? new Date(fromDate) : fromDate,
          typeof toDate === 'string' ? new Date(toDate) : toDate,
        ),
      },
    });
  }

  async findLecturesBybeginDateMoreThanDate(
    date: Date,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesTypeORM[]> {
    return queryRunner.manager.find(SpecialLecturesTypeORM, {
      lock: lockOption,
      where: {
        begin_date: MoreThan(date),
      },
    });
  }

  async findLecturesBybeginDateLessThanOrEqualDate(
    date: Date,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesTypeORM[]> {
    return queryRunner.manager.find(SpecialLecturesTypeORM, {
      lock: lockOption,
      where: {
        begin_date: LessThanOrEqual(date),
      },
    });
  }

  async isLectureBegined(
    id: number,
    date: Date,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<Boolean> {
    console.log(date);

    return queryRunner.manager.exists(SpecialLecturesTypeORM, {
      lock: lockOption,
      where: {
        id,
        begin_date: LessThanOrEqual(date),
      },
    });
  }

  async findAllLecture(
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesTypeORM[]> {
    return queryRunner.manager.find(SpecialLecturesTypeORM, {
      lock: lockOption,
    });
  }

  async updateLecture(
    id: number,
    lectureData: Partial<SpecialLecturesTypeORM>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesTypeORM> {
    await queryRunner.manager.update(SpecialLecturesTypeORM, id, lectureData);
    return this.findLectureById(id, queryRunner);
  }

  async deleteLecture(id: number, queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(SpecialLecturesTypeORM, id);
  }
}
