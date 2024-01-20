import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Topic } from '../topics/topic.entity';
import { User } from '../users/user.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @OneToMany((_key) => Topic, (topic) => topic.subject, { eager: true })
  topics: Topic[];
  @OneToMany((_key) => User, (user) => user.subjects, { eager: true })
  user: User;
}
