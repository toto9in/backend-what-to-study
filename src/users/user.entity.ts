import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from '../subjects/subject.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @OneToMany((_type) => Subject, (subject) => subject.user)
  subjects: Subject[];
}
