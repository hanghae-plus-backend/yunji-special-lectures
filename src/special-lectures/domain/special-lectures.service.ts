import { Inject, Injectable } from '@nestjs/common';

import { DataAccessor } from '../interfaces/data-accessor.interface';
import { SpecialLecturesRepository } from '../interfaces/repository/special-lectures.repository.interface';
import { SpecialLecturesUsersRepository } from '../interfaces/repository/special-lectures-users.repository.interface';
import { SpecialLecturesApplicationsRepository } from '../interfaces/repository/special-lectures-applications.repository.interface';
import { SpecialLecturesStudentsRepository } from '../interfaces/repository/special-lectures-students.repository.interface';
import { ApplicationDto } from '../dto/special-lectures-application.dto';
import { ApplicationStatus } from '../interfaces/entities/special-lectures-applications.entity';
import { UserNotFoundError } from '../../common/exceptions/UserNotFoundError';
import { LectureNotFoundError } from '../../common/exceptions/LectureNotFoundError';
import { LectureNotBeginError } from '../../common/exceptions/LectureNotBeginError';
import { DupliateAplicationNotPossibleError } from '../../common/exceptions/DupliateAplicationNotPossibleError';
import { StudentCapacityOverError } from '../../common/exceptions/StudentCapacityOverError';
import { ApplicationNotFoundError } from '../../common/exceptions/ApplicationNotFoundError';

@Injectable()
export class SpecialLecturesService {
  constructor(
    @Inject('SpecialLecturesRepository')
    private specialLecturesRepository: SpecialLecturesRepository,
    @Inject('SpecialLecturesUsersRepository')
    private specialLecturesUsersRepository: SpecialLecturesUsersRepository,
    @Inject('SpecialLecturesApplicationsRepository')
    private specialLecturesApplicationsRepository: SpecialLecturesApplicationsRepository,
    @Inject('SpecialLecturesStudentsRepository')
    private specialLecturesStudentsRepository: SpecialLecturesStudentsRepository,
    @Inject('DataAccessor')
    private dataAccessor: DataAccessor,
  ) {}

  async getSpecialLectures() {
    let queryRunner = null;

    try {
      queryRunner = await this.dataAccessor.connect();
      return this.specialLecturesRepository.findAllLecture(queryRunner);
    } catch (error) {
      throw error;
    } finally {
      await this.dataAccessor.releaseQueryRunner(queryRunner);
    }
  }

  async getUser(userId: number) {
    let queryRunner = null;

    try {
      queryRunner = await this.dataAccessor.connect();
      const resultFindUser =
        await this.specialLecturesUsersRepository.findUserById(
          userId,
          queryRunner,
        );
      if (!resultFindUser) {
        // 존재하지 않는 유저
        throw new UserNotFoundError();
      } else return resultFindUser;
    } catch (error) {
      throw error;
    } finally {
      await this.dataAccessor.releaseQueryRunner(queryRunner);
    }
  }

  async getApplicationStatusOneBy(applicationBody: ApplicationDto) {
    let queryRunner = null;

    try {
      queryRunner = await this.dataAccessor.connect();
      const resultFindUser =
        await this.specialLecturesUsersRepository.findUserById(
          applicationBody.userId,
          queryRunner,
        );
      if (!resultFindUser) {
        // 존재하지 않는 유저
        throw new UserNotFoundError();
      }

      const resultFindLecture =
        await this.specialLecturesRepository.findLectureById(
          applicationBody.lectureId,
          queryRunner,
        );
      if (!resultFindLecture) {
        // 존재하지 않는 강의
        throw new LectureNotFoundError();
      }

      const resultFindApplication =
        await this.specialLecturesApplicationsRepository.findApplicationByLectureAndUser(
          applicationBody.lectureId,
          applicationBody.userId,
          queryRunner,
        );
      if (!resultFindApplication) {
        // 존재하지 않는 신청 내역
        throw new ApplicationNotFoundError();
      }

      return resultFindApplication;
    } catch (error) {
      throw error;
    } finally {
      await this.dataAccessor.releaseQueryRunner(queryRunner);
    }
  }

  async apply(applicationBody: ApplicationDto) {
    let queryRunner = null;

    try {
      queryRunner = await this.dataAccessor.connect();
      await this.dataAccessor.startTransaction(queryRunner, 'SERIALIZABLE');

      const resultFindUser =
        await this.specialLecturesUsersRepository.findUserById(
          applicationBody.userId,
          queryRunner,
          { mode: 'pessimistic_write' },
        );
      if (!resultFindUser) {
        // 존재하지 않는 유저
        throw new UserNotFoundError();
      }

      const resultFindLecture =
        await this.specialLecturesRepository.findLectureById(
          applicationBody.lectureId,
          queryRunner,
          { mode: 'pessimistic_write' },
        );
      if (!resultFindLecture) {
        // 존재하지 않는 강의
        throw new LectureNotFoundError();
      }

      const resultLectureBegined =
        await this.specialLecturesRepository.isLectureBegined(
          applicationBody.lectureId,
          new Date(),
          queryRunner,
          { mode: 'pessimistic_write' },
        );

      if (!resultLectureBegined) {
        // 오픈하지 않은 강의
        throw new LectureNotBeginError();
      }

      const resultFindStudent =
        await this.specialLecturesStudentsRepository.findStudentByUserAndLecture(
          applicationBody.userId,
          applicationBody.lectureId,
          queryRunner,
          { mode: 'pessimistic_write' },
        );
      if (resultFindStudent) {
        // 중복 지원 불가
        throw new DupliateAplicationNotPossibleError();
      }

      const applicationData = {
        userId: applicationBody.userId,
        specialLectureId: applicationBody.lectureId,
        date_created: new Date(),
      };

      const resultCountLecture =
        await this.specialLecturesStudentsRepository.countStudentsByLecture(
          applicationBody.lectureId,
          queryRunner,
          { mode: 'pessimistic_write' },
        );
      if (resultCountLecture >= resultFindLecture.student_capacity) {
        // 수강 정원 초과
        const resultCreateApplication =
          await this.specialLecturesApplicationsRepository.createApplication(
            {
              ...applicationData,
              status: ApplicationStatus.FAIL,
            },
            queryRunner,
          );
        throw new StudentCapacityOverError();
      }

      const resultCreateApplication =
        await this.specialLecturesApplicationsRepository.createApplication(
          {
            ...applicationData,
            status: ApplicationStatus.ENROLLED,
          },
          queryRunner,
        );

      const resultCreateStudent =
        await this.specialLecturesStudentsRepository.createStudent(
          {
            ...applicationData,
          },
          queryRunner,
        );

      await this.dataAccessor.commitTransaction(queryRunner);
      return resultCreateApplication;
    } catch (error) {
      if (error instanceof StudentCapacityOverError) {
        await this.dataAccessor.commitTransaction(queryRunner);
      } else {
        await this.dataAccessor.rollbackTransaction(queryRunner);
      }
      throw error;
    } finally {
      await this.dataAccessor.releaseQueryRunner(queryRunner);
    }
  }
}
