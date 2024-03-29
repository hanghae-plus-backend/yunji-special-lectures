type QueryRunner = any;
export interface DataAccessor {
  connect(option?: any): Promise<QueryRunner>;
  startTransaction(
    queryRunner: QueryRunner,
    isolationLevel?: string,
  ): Promise<void>;
  commitTransaction(queryRunner: QueryRunner): Promise<void>;
  rollbackTransaction(queryRunner: QueryRunner): Promise<void>;
  releaseQueryRunner(queryRunner: QueryRunner): Promise<void>;
}
