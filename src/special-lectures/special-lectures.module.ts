import { Module } from '@nestjs/common';
import { SpecialLecturesRepositoryTypeORM } from './infra/db/typeORM/repository/special-lectures.repository';

import { SpecialLecturesController } from './special-lectures.controller';
import { SpecialLecturesUsersRepositoryTypeORM } from './infra/db/typeORM/repository/special-lectures-users.repository';
import { SpecialLecturesStudentRepositoryTypeORM } from './infra/db/typeORM/repository/special-lectures-students.repository';
import { TypeORMDataAccessor } from './infra/db/typeORM/typeORMDataAccessor';
import { SpecialLecturesService } from './domain/special-lectures.service';
import { SpecialLecturesTypeORM } from './infra/db/typeORM/entities/special-lectures.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialLecturesUsersTypeORM } from './infra/db/typeORM/entities/special-lectures-users.entity';
import { SpecialLecturesStudentsTypeORM } from './infra/db/typeORM/entities/special-lectures-students.entity';
import { SpecialLecturesApplicationsTypeORM } from './infra/db/typeORM/entities/special-lectures-applications.entity';
import { SpecialLecturesApplicationsRepositoryTypeORM } from './infra/db/typeORM/repository/special-lectures-applications.repository';
import SpecialLecturesEntitiesTypeORM from './infra/db/typeORM/entities';

@Module({
  imports: [TypeOrmModule.forFeature()],
  controllers: [SpecialLecturesController],
  providers: [
    SpecialLecturesService,
    {
      provide: 'SpecialLecturesRepository',
      useClass: SpecialLecturesRepositoryTypeORM,
    },
    {
      provide: 'SpecialLecturesUsersRepository',
      useClass: SpecialLecturesUsersRepositoryTypeORM,
    },
    {
      provide: 'SpecialLecturesApplicationsRepository',
      useClass: SpecialLecturesApplicationsRepositoryTypeORM,
    },
    {
      provide: 'SpecialLecturesStudentsRepository',
      useClass: SpecialLecturesStudentRepositoryTypeORM,
    },
    {
      provide: 'DataAccessor',
      useClass: TypeORMDataAccessor,
    },
  ],
})
export class SpecialLecturesModule {}
