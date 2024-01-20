import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './topic.entity';
import { Repository } from 'typeorm';
import { Subject } from '../subjects/subject.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic) private topicsRepository: Repository<Topic>,
  ) {}

  async createTopics(topics: string[], receivedSubject: Subject) {
    for (const topic of topics) {
      console.log(topic);
      this.topicsRepository.save({
        description: topic,
        subject: receivedSubject,
      });
    }
  }
}
