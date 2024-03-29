import { SpecialLectures } from '../entities/special-lectures.entity';

type QueryRunner = any;
type LockOption = any;
export interface SpecialLecturesRepository {
  createLecture(
    lectureData: Partial<SpecialLectures>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLectures>;

  findLectureById(
    id: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLectures>;

  findLecturesBybeginDateBetween(
    fromDate: Date | string,
    toDate: Date | string,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLectures[]>;

  findLecturesBybeginDateMoreThanDate(
    date: Date | string,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLectures[]>;

  findLecturesBybeginDateLessThanOrEqualDate(
    date: Date | string,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLectures[]>;

  isLectureBegined(
    id: number,
    date: Date,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<Boolean>;

  findAllLecture(
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLectures[]>;

  updateLecture(
    id: number,
    lectureData: Partial<SpecialLectures>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLectures>;

  deleteLecture(id: number, queryRunner: QueryRunner): Promise<void>;
}
