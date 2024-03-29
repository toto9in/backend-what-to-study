import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Topic } from '../topics/topic.entity';
import { User } from '../users/user.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @OneToMany((_key) => Topic, (topic) => topic.subject, {
    eager: true,
    onDelete: 'CASCADE',
  })
  topics: Topic[];

  @ManyToOne((_key) => User, (user) => user.subjects)
  @JoinColumn({ name: 'userId' })
  user: User;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
}
