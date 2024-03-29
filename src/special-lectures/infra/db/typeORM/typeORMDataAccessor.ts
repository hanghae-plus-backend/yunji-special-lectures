import { Injectable } from '@nestjs/common';
import { EntityManager, QueryRunner } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DataAccessor } from 'src/special-lectures/interfaces/data-accessor.interface';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

@Injectable()
export class TypeORMDataAccessor implements DataAccessor {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}

  async connect(): Promise<QueryRunner> {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    return queryRunner;
  }

  async startTransaction(
    queryRunner: QueryRunner,
    isolationLevel?: IsolationLevel,
  ): Promise<void> {
    await queryRunner.startTransaction(isolationLevel);
  }

  async commitTransaction(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.commitTransaction();
  }

  async rollbackTransaction(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.rollbackTransaction();
  }

  async releaseQueryRunner(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.release();
  }
}

export type LockOption =
  | {
      mode: 'optimistic';
      version: number | Date;
    }
  | {
      mode:
        | 'pessimistic_read'
        | 'pessimistic_write'
        | 'dirty_read'
        | 'pessimistic_partial_write'
        | 'pessimistic_write_or_fail'
        | 'for_no_key_update'
        | 'for_key_share';
      tables?: string[];
      onLocked?: 'nowait' | 'skip_locked';
    };
