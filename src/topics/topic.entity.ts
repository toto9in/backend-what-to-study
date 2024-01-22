import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subject } from '../subjects/subject.entity';
import { TopicDoneStatus } from './topic-done-status.enum';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  description: string;
  @ManyToOne((_key) => Subject, (subject) => subject.topics, { eager: false })
  subject: Subject;
  @Column()
  done: TopicDoneStatus;
  @Column()
  order: number;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
}
