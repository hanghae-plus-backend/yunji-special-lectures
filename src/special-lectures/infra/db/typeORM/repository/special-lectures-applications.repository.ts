import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { SpecialLecturesApplicationsRepository } from 'src/special-lectures/interfaces/repository/special-lectures-applications.repository.interface';
import { SpecialLecturesApplicationsTypeORM } from '../entities/special-lectures-applications.entity';
import {
  ApplicationStatus,
  SpecialLecturesApplications,
} from '../../../../../special-lectures/interfaces/entities/special-lectures-applications.entity';
import { LockOption } from '../typeORMDataAccessor';

@Injectable()
export class SpecialLecturesApplicationsRepositoryTypeORM
  implements SpecialLecturesApplicationsRepository
{
  constructor(
    // private readonly ormRepository: Repository<SpecialLecturesApplicationTypeORM>,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async createApplication(
    applicationData: Partial<SpecialLecturesApplicationsTypeORM>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesApplicationsTypeORM> {
    const application = queryRunner.manager.create(
      SpecialLecturesApplicationsTypeORM,
      applicationData,
    );
    return queryRunner.manager.save(application);
  }

  async findApplicationById(
    id: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesApplicationsTypeORM> {
    return queryRunner.manager.findOne(SpecialLecturesApplicationsTypeORM, {
      lock: lockOption,
      where: { id },
    });
  }

  async findApplicationsByUser(
    userId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesApplicationsTypeORM[]> {
    return queryRunner.manager.find(SpecialLecturesApplicationsTypeORM, {
      lock: lockOption,
      relations: {
        user: true,
      },
      where: { user: { id: userId } },
      order: {
        date_created: 'ASC',
      },
    });
  }

  async findApplicationsByLecture(
    lectureId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesApplicationsTypeORM[]> {
    return queryRunner.manager.find(SpecialLecturesApplicationsTypeORM, {
      lock: lockOption,
      relations: {
        specialLecture: true,
      },
      where: { specialLecture: { id: lectureId } },
      order: {
        date_created: 'ASC',
      },
    });
  }

  async findApplicationByLectureAndUser(
    lectureId: number,
    userId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesApplications> {
    return queryRunner.manager.findOne(SpecialLecturesApplicationsTypeORM, {
      lock: lockOption,
      relations: {
        specialLecture: true,
        user: true,
      },
      where: { specialLecture: { id: lectureId }, user: { id: userId } },
      order: {
        date_created: 'ASC',
      },
    });
  }

  async findErolledApplicationsByLecture(
    lectureId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesApplicationsTypeORM[]> {
    return queryRunner.manager.find(SpecialLecturesApplicationsTypeORM, {
      lock: lockOption,
      relations: {
        specialLecture: true,
      },
      where: {
        status: ApplicationStatus.ENROLLED,
        specialLecture: { id: lectureId },
      },
      order: {
        date_created: 'ASC',
      },
    });
  }

  async countErolledApplicationsByLecture(
    lectureId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<number> {
    return queryRunner.manager.count(SpecialLecturesApplicationsTypeORM, {
      lock: lockOption,
      relations: {
        specialLecture: true,
      },
      where: {
        status: ApplicationStatus.ENROLLED,
        specialLecture: { id: lectureId },
      },
    });
  }

  async updateApplication(
    id: number,
    applicationData: Partial<SpecialLecturesApplicationsTypeORM>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesApplicationsTypeORM> {
    await queryRunner.manager.update(
      SpecialLecturesApplicationsTypeORM,
      id,
      applicationData,
    );
    return this.findApplicationById(id, queryRunner);
  }

  async deleteApplication(id: number, queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(SpecialLecturesApplicationsTypeORM, id);
  }
}
