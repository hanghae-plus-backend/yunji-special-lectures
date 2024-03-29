import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SpecialLecturesModule } from '../src/special-lectures/special-lectures.module';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SpecialLecturesTypeORM } from '../src/special-lectures/infra/db/typeORM/entities/special-lectures.entity';
import { SpecialLecturesUsersTypeORM } from '../src/special-lectures/infra/db/typeORM/entities/special-lectures-users.entity';
import { SpecialLecturesApplicationsTypeORM } from '../src/special-lectures/infra/db/typeORM/entities/special-lectures-applications.entity';
import { SpecialLecturesStudentsTypeORM } from '../src/special-lectures/infra/db/typeORM/entities/special-lectures-students.entity';
import { ApplicationStatus } from '../src/special-lectures/interfaces/entities/special-lectures-applications.entity';

describe('SpecialLectures (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        SpecialLecturesModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USER_NAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DATABASE,
          entities: [
            SpecialLecturesTypeORM,
            SpecialLecturesUsersTypeORM,
            SpecialLecturesApplicationsTypeORM,
            SpecialLecturesStudentsTypeORM,
          ],
          synchronize: false,
          logging: false,
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('/special-lectures/apply (POST)', () => {
    it('동시에 특강 신청 요청 시 순차적으로 처리 후 선착순 정원 마감되면 에러 발생', async () => {
      const usePromises = [];

      for (let i = 1; i <= 35; i++) {
        usePromises.push(
          request(app.getHttpServer())
            .post(`/special-lectures/apply`)
            .send({ userId: i, lectureId: 4 }),
        );
      }

      const results = await Promise.allSettled(usePromises);

      const successResponses = results.filter((result) => {
        return (
          result.status === 'fulfilled' && result.value.res.statusCode === 201
        );
      });

      const failResponses = results.filter((result) => {
        return (
          result.status === 'rejected' ||
          (result.status === 'fulfilled' && result.value.res.statusCode >= 400)
        );
      });

      expect(successResponses.length).toBe(30);
      expect(failResponses.length).toBe(5);
    }, 60000);
  });

  afterAll(async () => {
    await app.close();
  });
});
