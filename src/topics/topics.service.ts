import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './topic.entity';
import { Repository } from 'typeorm';
import { Subject } from '../subjects/subject.entity';
import { UpdateDoneStatusDto } from './dto/update-done-status.dto';
import { TopicDoneStatus } from './topic-done-status.enum';

@Injectable()
export class TopicsService {
  private readonly logger = new Logger(TopicsService.name);
  constructor(
    @InjectRepository(Topic) private topicsRepository: Repository<Topic>,
  ) {}

  async createTopics(topics: string[], receivedSubject: Subject) {
    this.logger.log(
      `Creating topics for subject ${receivedSubject.name}-${receivedSubject.id} for user ${receivedSubject.user.id}`,
    );
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      await this.topicsRepository.save({
        description: topic,
        subject: receivedSubject,
        done: TopicDoneStatus.OPEN,
        order: i,
      });
    }
  }

  async updateDoneStatus(id: string, updateDoneStatusDto: UpdateDoneStatusDto) {
    const topic = await this.topicsRepository.findOne({ where: { id: id } });
    topic.done = updateDoneStatusDto.done;
    await this.topicsRepository.save(topic);
    return topic;
  }

  async deleteTopic(id: string) {
    const result = await this.topicsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
