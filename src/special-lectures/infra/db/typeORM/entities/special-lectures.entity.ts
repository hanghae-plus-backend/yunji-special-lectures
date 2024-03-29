import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SpecialLecturesApplicationsTypeORM } from './special-lectures-applications.entity';
import { SpecialLecturesStudentsTypeORM } from './special-lectures-students.entity';
import { SpecialLectures } from 'src/special-lectures/interfaces/entities/special-lectures.entity';

@Entity('special_lectures')
export class SpecialLecturesTypeORM implements SpecialLectures {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  date_created: Date;

  @Column({ type: 'varchar', length: 512 })
  title: string;

  @Column({ type: 'datetime' })
  begin_date: Date;

  @Column({ type: 'int', nullable: true })
  student_capacity: number | null;

  @OneToMany(
    () => SpecialLecturesApplicationsTypeORM,
    (application) => application.specialLecture,
  )
  applications: SpecialLecturesApplicationsTypeORM[];

  @OneToMany(
    () => SpecialLecturesStudentsTypeORM,
    (student) => student.specialLecture,
  )
  students: SpecialLecturesStudentsTypeORM[];
}
