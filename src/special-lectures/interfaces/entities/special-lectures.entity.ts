import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SpecialLecturesApplications } from './special-lectures-applications.entity';
import { SpecialLecturesStudents } from './special-lectures-students.entity';

export interface SpecialLectures {
  id: number;

  date_created: Date;

  title: string;

  begin_date: Date;

  student_capacity: number | null;

  applications?: SpecialLecturesApplications[];

  students?: SpecialLecturesStudents[];
}
