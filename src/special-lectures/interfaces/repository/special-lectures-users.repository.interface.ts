import { SpecialLecturesUsers } from '../entities/special-lectures-users.entity';

type QueryRunner = any;
type LockOption = any;
export interface SpecialLecturesUsersRepository {
  createUsers(
    userData: Partial<SpecialLecturesUsers>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesUsers>;

  findUserByphone_number(
    phone_number: string,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesUsers>;

  findUserByEmail(
    email: string,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesUsers>;

  findUserById(
    id: number,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesUsers>;

  findUser(
    name: string,
    email: string,
    phone_number: string,
    queryRunner: QueryRunner,
    lockOption?: LockOption,
  ): Promise<SpecialLecturesUsers>;

  updateUser(
    id: number,
    userData: Partial<SpecialLecturesUsers>,
    queryRunner: QueryRunner,
  ): Promise<SpecialLecturesUsers>;

  deleteUser(id: number, queryRunner: QueryRunner): Promise<void>;
}
