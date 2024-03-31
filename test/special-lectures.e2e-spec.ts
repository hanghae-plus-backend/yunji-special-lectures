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
import {
  ApplicationStatus,
  SpecialLecturesApplications,
} from '../src/special-lectures/interfaces/entities/special-lectures-applications.entity';
import { SpecialLectures } from 'src/special-lectures/interfaces/entities/special-lectures.entity';
import { ApplicationNotFoundError } from '../src/common/exceptions/ApplicationNotFoundError';
import { LectureNotFoundError } from '../src/common/exceptions/LectureNotFoundError';
import { UserNotFoundError } from '../src/common/exceptions/UserNotFoundError';
import { LectureNotBeginError } from '../src/common/exceptions/LectureNotBeginError';
import { DupliateAplicationNotPossibleError } from '../src/common/exceptions/DupliateAplicationNotPossibleError';

describe('SpecialLectures (e2e)', () => {
  let app: INestApplication;
  const userId = 1;
  const routePath = '/special-lectures';
  const lectureId = 5;
  const lectureIdForMutexTest = 4;
  const studentCapacityForMutexTest = 30;

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

  describe('/specialLectures (GET)', () => {
    test('실행 시 정상적으로 강의 목록을 조회함', async () => {
      const response = await request(app.getHttpServer()).get(
        `${routePath}/specialLectures`,
      );

      expect(response.statusCode).toBe(200);

      response.body.forEach((lecture: SpecialLectures) => {
        expect(lecture).toEqual({
          id: expect.any(Number),
          date_created: expect.any(String),
          title: expect.any(String),
          begin_date: expect.any(String),
          student_capacity: expect.any(Number || null),
        });
      });
    });
  });

  describe('/apply (POST)', () => {
    test('유효하지 않은 request body로 요청 시 요청 실패함', async () => {
      const response = await request(app.getHttpServer())
        .post(`${routePath}/apply`)
        .send({ userId: userId });

      expect(response.status).toBe(400);
    });

    test('유효하지 않는 유저 아이디로 조회 시도 시 에러 발생', async () => {
      const response = await request(app.getHttpServer())
        .post(`${routePath}/apply`)
        .send({ userId: userId * 100, lectureId: lectureId });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(new UserNotFoundError().message);
    });

    test('유효하지 않는 강의 아이디로 조회 시도 시 에러 발생', async () => {
      const response = await request(app.getHttpServer())
        .post(`${routePath}/apply`)
        .send({ userId: userId, lectureId: lectureId * 100 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(new LectureNotFoundError().message);
    });

    test('수강 신청 시작 일시 전에 시도 시 에러 발생', async () => {
      const response = await request(app.getHttpServer())
        .post(`${routePath}/apply`)
        .send({ userId: userId, lectureId: 1 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(new LectureNotBeginError().message);
    });

    test('실행 시 정상적으로 강의에 등록함', async () => {
      const response = await request(app.getHttpServer())
        .post(`${routePath}/apply`)
        .send({ userId: userId, lectureId: lectureId });

      expect(response.statusCode).toBe(201);

      expect(response.body).toEqual({
        id: expect.any(Number),
        date_created: expect.any(String),
        specialLectureId: lectureId,
        userId: userId,
        status: ApplicationStatus.ENROLLED,
      });
    });

    test('이미 등록한 강의일 시 에러 발생', async () => {
      const response = await request(app.getHttpServer())
        .post(`${routePath}/apply`)
        .send({ userId: userId, lectureId: lectureId });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        new DupliateAplicationNotPossibleError().message,
      );
    });

    test('동시에 특강 신청 요청 시 순차적으로 처리 후 선착순 정원 마감되면 에러 발생', async () => {
      const tryFailStudentCount = 5;
      const usePromises = [];

      for (
        let i = 1;
        i <= studentCapacityForMutexTest + tryFailStudentCount;
        i++
      ) {
        usePromises.push(
          request(app.getHttpServer())
            .post(`${routePath}/apply`)
            .send({ userId: i, lectureId: lectureIdForMutexTest }),
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

      expect(successResponses.length).toBe(studentCapacityForMutexTest);
      expect(failResponses.length).toBe(tryFailStudentCount);
    }, 60000);
  });

  describe('/applicationStatus (GET)', () => {
    test('실행 시 정상적으로 강의 신청 내역을 조회함', async () => {
      const response = await request(app.getHttpServer())
        .get(`${routePath}/applicationStatus`)
        .query({ userId, lectureId });

      expect(response.statusCode).toBe(200);

      expect(response.body).toEqual({
        id: expect.any(Number),
        date_created: expect.any(String),
        specialLectureId: lectureId,
        specialLecture: {
          id: expect.any(Number),
          date_created: expect.any(String),
          begin_date: expect.any(String),
          student_capacity: expect.any(Number),
          title: expect.any(String),
        },
        userId: userId,
        status: expect.any(String),
      });
    });

    test('유효하지 않는 유저 아이디로 조회 시도 시 에러 발생', async () => {
      const response = await request(app.getHttpServer())
        .get(`${routePath}/applicationStatus`)
        .query({ userId: userId * 100, lectureId });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(new UserNotFoundError().message);
    });

    test('유효하지 않는 강의 아이디로 조회 시도 시 에러 발생', async () => {
      const response = await request(app.getHttpServer())
        .get(`${routePath}/applicationStatus`)
        .query({ userId, lectureId: lectureId * 100 });

      console.log(response.body);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(new LectureNotFoundError().message);
    });

    test('해당 유저 아이디에 대한 강의 신청 내역이 존재하지 않을 시 에러 발생', async () => {
      const response = await request(app.getHttpServer())
        .get(`${routePath}/applicationStatus`)
        .query({ userId, lectureId: 1 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        new ApplicationNotFoundError().message,
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
