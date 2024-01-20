import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from '../subjects/subject.entity';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  description: string;
  @ManyToOne((_key) => Subject, (subject) => subject.topics, { eager: false })
  subject: Subject;
}
