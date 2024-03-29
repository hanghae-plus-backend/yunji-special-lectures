import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { SpecialLecturesStudentsRepository } from 'src/special-lectures/interfaces/repository/special-lectures-students.repository.interface';
import { SpecialLecturesStudentsTypeORM } from '../entities/special-lectures-students.entity';
import { SpecialLecturesStudents } from 'src/special-lectures/interfaces/entities/special-lectures-students.entity';
import { LockOption } from '../typeORMDataAccessor';

@Injectable()
export class SpecialLecturesStudentRepositoryTypeORM
  implements SpecialLecturesStudentsRepository
{
  constructor(
    // private readonly ormRepository: Repository<SpecialLecturesStudentsTypeORM>,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async createStudent(
    studentData: Partial<SpecialLecturesStudentsTypeORM>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesStudentsTypeORM> {
    const student = queryRunner.manager.create(
      SpecialLecturesStudentsTypeORM,
      studentData,
    );
    return queryRunner.manager.save(student);
  }

  async findStudentById(
    id: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesStudentsTypeORM> {
    return queryRunner.manager.findOne(SpecialLecturesStudentsTypeORM, {
      lock: lockOption,
      where: { id },
    });
  }

  findStudentByUserAndLecture(
    userId: number,
    lectureId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesStudentsTypeORM> {
    return queryRunner.manager.findOne(SpecialLecturesStudentsTypeORM, {
      lock: lockOption,
      relations: {
        user: true,
        specialLecture: true,
      },
      where: { user: { id: userId }, specialLecture: { id: lectureId } },
    });
  }

  async findStudentsByLecture(
    lectureId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesStudentsTypeORM[]> {
    return queryRunner.manager.find(SpecialLecturesStudentsTypeORM, {
      lock: lockOption,
      relations: {
        specialLecture: true,
      },
      where: { specialLecture: { id: lectureId } },
    });
  }

  async countStudentsByLecture(
    lectureId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<number> {
    return queryRunner.manager.count(SpecialLecturesStudentsTypeORM, {
      lock: lockOption,
      relations: {
        specialLecture: true,
      },
      where: { specialLecture: { id: lectureId } },
    });
  }

  async findAllStudent(
    id: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesStudentsTypeORM[]> {
    return queryRunner.manager.find(SpecialLecturesStudentsTypeORM, {
      lock: lockOption,
    });
  }

  async updateStudent(
    id: number,
    studentData: Partial<SpecialLecturesStudentsTypeORM>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesStudentsTypeORM> {
    await queryRunner.manager.update(
      SpecialLecturesStudentsTypeORM,
      id,
      studentData,
    );
    return this.findStudentById(id, queryRunner);
  }

  async deleteStudent(id: number, queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(SpecialLecturesStudentsTypeORM, id);
  }
}
