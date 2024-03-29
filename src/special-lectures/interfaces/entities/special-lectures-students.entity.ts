import { SpecialLecturesUsers } from './special-lectures-users.entity';
import { SpecialLectures } from './special-lectures.entity';

export interface SpecialLecturesStudents {
  id: number;

  date_created: Date;

  specialLectureId: number;

  userId: number;

  specialLecture: SpecialLectures;

  user: SpecialLecturesUsers;
}
