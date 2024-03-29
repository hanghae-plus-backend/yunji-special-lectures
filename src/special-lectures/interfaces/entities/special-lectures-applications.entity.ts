import { SpecialLecturesUsers } from './special-lectures-users.entity';
import { SpecialLectures } from './special-lectures.entity';

export enum ApplicationStatus {
  ENROLLED = 'enrolled',
  FAIL = 'fail',
  WAITING = 'waiting',
  CANCELED = 'canceled',
}

export interface SpecialLecturesApplications {
  id: number;

  date_created: Date;

  specialLecture?: SpecialLectures;

  specialLectureId: number;

  userId: number;

  user?: SpecialLecturesUsers;

  status: ApplicationStatus;
}
