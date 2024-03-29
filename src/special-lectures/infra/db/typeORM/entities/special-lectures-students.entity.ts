import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SpecialLecturesUsersTypeORM } from './special-lectures-users.entity';
import { SpecialLecturesTypeORM } from './special-lectures.entity';
import { SpecialLecturesStudents } from 'src/special-lectures/interfaces/entities/special-lectures-students.entity';

@Entity('special_lectures_students')
export class SpecialLecturesStudentsTypeORM implements SpecialLecturesStudents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  date_created: Date;

  @Column({ name: 'special_lecture_id' })
  specialLectureId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(
    () => SpecialLecturesTypeORM,
    (specialLecture) => specialLecture.students,
  )
  @JoinColumn({ name: 'special_lecture_id' })
  specialLecture: SpecialLecturesTypeORM;

  @ManyToOne(() => SpecialLecturesUsersTypeORM)
  @JoinColumn({ name: 'user_id' })
  user: SpecialLecturesUsersTypeORM;
}
