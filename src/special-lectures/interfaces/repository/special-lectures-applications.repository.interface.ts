import { SpecialLecturesApplications } from '../entities/special-lectures-applications.entity';

type QueryRunner = any;
type LockOption = any;
export interface SpecialLecturesApplicationsRepository {
  createApplication(
    applicationData: Partial<SpecialLecturesApplications>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesApplications>;

  findApplicationById(
    id: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesApplications>;

  findApplicationsByUser(
    userId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesApplications[]>;

  findApplicationsByLecture(
    lectureId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesApplications[]>;

  findErolledApplicationsByLecture(
    lectureId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesApplications[]>;

  countErolledApplicationsByLecture(
    lectureId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<number>;

  findApplicationByLectureAndUser(
    lectureId: number,
    userId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesApplications>;

  updateApplication(
    id: number,
    applicationData: Partial<SpecialLecturesApplications>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesApplications>;

  deleteApplication(id: number, queryRunner: QueryRunner): Promise<void>;
}
