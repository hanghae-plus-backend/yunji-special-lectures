import { Test, TestingModule } from '@nestjs/testing';
import { SpecialLecturesService } from './special-lectures.service';
import { SpecialLecturesRepository } from '../interfaces/repository/special-lectures.repository.interface';
import { SpecialLecturesUsersRepository } from '../interfaces/repository/special-lectures-users.repository.interface';
import { SpecialLecturesApplicationsRepository } from '../interfaces/repository/special-lectures-applications.repository.interface';
import { SpecialLecturesStudentsRepository } from '../interfaces/repository/special-lectures-students.repository.interface';
import { DataAccessor } from '../interfaces/data-accessor.interface';
import { ApplicationDto } from '../dto/special-lectures-application.dto';
import { SpecialLecturesUsers } from '../interfaces/entities/special-lectures-users.entity';
import { UserNotFoundError } from '../../common/exceptions/UserNotFoundError';
import { LectureNotFoundError } from '../../common/exceptions/LectureNotFoundError';
import { StudentCapacityOverError } from '../../common/exceptions/StudentCapacityOverError';
import { ApplicationStatus } from '../interfaces/entities/special-lectures-applications.entity';
import { SpecialLectures } from '../interfaces/entities/special-lectures.entity';
import { DupliateAplicationNotPossibleError } from '../../common/exceptions/DupliateAplicationNotPossibleError';
import { LectureNotBeginError } from '../../common/exceptions/LectureNotBeginError';

describe('SpecialLecturesService', () => {
  let service: SpecialLecturesService;
  let mockUsersRepository: jest.Mocked<SpecialLecturesUsersRepository>;
  let mockLecturesRepository: jest.Mocked<SpecialLecturesRepository>;
  let mockApplicationsRepository: jest.Mocked<SpecialLecturesApplicationsRepository>;
  let mockStudentsRepository: jest.Mocked<SpecialLecturesStudentsRepository>;
  let mockDataAccessor: jest.Mocked<DataAccessor>;

  let tempUserInfo: SpecialLecturesUsers = {
    id: 1,
    email: 'test@test.com',
    name: 'test',
    phone_number: '010-0000-0000',
    date_created: new Date(),
  };

  let tempLectureInfo: SpecialLectures = {
    id: 1,
    title: 'test lecture',
    date_created: new Date(),
    begin_date: new Date(),
    student_capacity: 30,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpecialLecturesService,
        {
          provide: 'SpecialLecturesUsersRepository',
          useValue: { findUserById: jest.fn() },
        },
        {
          provide: 'SpecialLecturesRepository',
          useValue: { findLectureById: jest.fn(), isLectureBegined: jest.fn() },
        },
        {
          provide: 'SpecialLecturesApplicationsRepository',
          useValue: {
            findApplicationByLectureAndUser: jest.fn(),
            createApplication: jest.fn(),
          },
        },
        {
          provide: 'SpecialLecturesStudentsRepository',
          useValue: {
            findStudentByUserAndLecture: jest.fn(),
            countStudentsByLecture: jest.fn(),
            createStudent: jest.fn(),
          },
        },
        {
          provide: 'DataAccessor',
          useValue: {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            releaseQueryRunner: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SpecialLecturesService>(SpecialLecturesService);
    mockLecturesRepository = module.get('SpecialLecturesRepository');
    mockUsersRepository = module.get('SpecialLecturesUsersRepository');
    mockApplicationsRepository = module.get(
      'SpecialLecturesApplicationsRepository',
    );
    mockStudentsRepository = module.get('SpecialLecturesStudentsRepository');
    mockDataAccessor = module.get('DataAccessor');
  });

  it('유저가 존재하지 않을 시 UserNotFoundError 발생', async () => {
    mockUsersRepository.findUserById.mockResolvedValueOnce(null);
    await expect(service.apply(new ApplicationDto())).rejects.toThrow(
      UserNotFoundError,
    );
  });

  it('강의가 존재하지 않을 시 LectureNotFoundError 발생', async () => {
    mockUsersRepository.findUserById.mockResolvedValueOnce(tempUserInfo);
    mockLecturesRepository.findLectureById.mockResolvedValueOnce(null);
    await expect(service.apply(new ApplicationDto())).rejects.toThrow(
      LectureNotFoundError,
    );
  });

  it('강의 오픈 시작 전에 신청 시 LectureNotBeginError 발생', async () => {
    const tryBeginDate = new Date('2025-02-30 00:00');
    mockUsersRepository.findUserById.mockResolvedValueOnce(tempUserInfo);
    mockLecturesRepository.findLectureById.mockResolvedValueOnce({
      ...tempLectureInfo,
      begin_date: tryBeginDate,
    });
    mockLecturesRepository.isLectureBegined.mockResolvedValueOnce(false);
    await expect(service.apply(new ApplicationDto())).rejects.toThrow(
      LectureNotBeginError,
    );
  });

  it('등록한 강의를 중복해서 신청할 때 DupliateAplicationNotPossibleError 발생', async () => {
    mockUsersRepository.findUserById.mockResolvedValueOnce(tempUserInfo);
    mockLecturesRepository.findLectureById.mockResolvedValueOnce(
      tempLectureInfo,
    );
    mockLecturesRepository.isLectureBegined.mockResolvedValueOnce(true);
    mockStudentsRepository.findStudentByUserAndLecture.mockResolvedValueOnce({
      id: 1,
      date_created: new Date(),
      specialLectureId: tempLectureInfo.id,
      userId: tempUserInfo.id,
    });
    await expect(service.apply(new ApplicationDto())).rejects.toThrow(
      DupliateAplicationNotPossibleError,
    );
  });

  it('강의에 이미 등록한 사람 수가 정원을 초과했을 때 StudentCapacityOverError 발생', async () => {
    mockUsersRepository.findUserById.mockResolvedValueOnce(tempUserInfo);
    mockLecturesRepository.findLectureById.mockResolvedValueOnce(
      tempLectureInfo,
    );
    mockLecturesRepository.isLectureBegined.mockResolvedValueOnce(true);
    mockStudentsRepository.findStudentByUserAndLecture.mockResolvedValueOnce(
      null,
    );
    mockStudentsRepository.countStudentsByLecture.mockResolvedValueOnce(30);
    await expect(service.apply(new ApplicationDto())).rejects.toThrow(
      StudentCapacityOverError,
    );
  });
});
