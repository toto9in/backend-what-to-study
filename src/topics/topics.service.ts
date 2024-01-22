import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './topic.entity';
import { Repository } from 'typeorm';
import { Subject } from '../subjects/subject.entity';
import { UpdateDoneStatusDto } from './dto/update-done-status.dto';
import { TopicDoneStatus } from './topic-done-status.enum';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic) private topicsRepository: Repository<Topic>,
  ) {}

  async createTopics(topics: string[], receivedSubject: Subject) {
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      await this.topicsRepository.save({
        description: topic,
        subject: receivedSubject,
        done: TopicDoneStatus.OPEN,
        order: i, // definir o campo de ordem
      });
    }
  }

  async updateDoneStatus(id: string, updateDoneStatusDto: UpdateDoneStatusDto) {
    const topic = await this.topicsRepository.findOne({ where: { id: id } });
    topic.done = updateDoneStatusDto.done;
    await this.topicsRepository.save(topic);
    return topic;
  }
}
