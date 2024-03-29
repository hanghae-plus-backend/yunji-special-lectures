import { SpecialLecturesUsers } from 'src/special-lectures/interfaces/entities/special-lectures-users.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('special_lectures_users')
export class SpecialLecturesUsersTypeORM implements SpecialLecturesUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  date_created: Date;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'varchar', length: 16 })
  phone_number: string;

  @Column({ type: 'varchar', length: 256 })
  email: string;
}
