import { SpecialLecturesStudents } from '../entities/special-lectures-students.entity';

type QueryRunner = any;
type LockOption = any;
export interface SpecialLecturesStudentsRepository {
  createStudent(
    studentData: Partial<SpecialLecturesStudents>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesStudents>;

  findStudentById(
    id: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesStudents>;

  findStudentByUserAndLecture(
    userId: number,
    lectureId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesStudents>;

  findStudentsByLecture(
    lectureId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesStudents[]>;

  countStudentsByLecture(
    lectureId: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<number>;

  findAllStudent(
    id: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesStudents[]>;

  updateStudent(
    id: number,
    studentData: Partial<SpecialLecturesStudents>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesStudents>;

  deleteStudent(id: number, queryRunner: QueryRunner): Promise<void>;
}
