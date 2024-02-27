import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { ReceiveSubjectDto } from './dto/receive-subject.dto';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { TopicsService } from '../topics/topics.service';

import { User } from '../users/user.entity';

@Injectable()
export class SubjectsService {
  private readonly logger = new Logger(SubjectsService.name);
  constructor(
    @InjectRepository(Subject) private subjectsRepository: Repository<Subject>,
    private configService: ConfigService,
    private topicsService: TopicsService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  openai = new OpenAI({
    apiKey: this.configService.get<string>('OPENAI_SECRET_KEY'),
  });

  async getAllSubjects(user) {
    const { userId } = user;

    const receivedUser = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const query = this.subjectsRepository.createQueryBuilder('subject');
    query.where('subject.userId = :userId', { userId: receivedUser.id });
    return query.getMany();
  }

  async getSubject(user, id: string) {
    const { userId } = user;

    const receivedUser = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const query = this.subjectsRepository.createQueryBuilder('subject');
    query
      .leftJoinAndSelect('subject.topics', 'topic')
      .where('subject.id = :id', { id: id })
      .andWhere('subject.userId = :userId', { userId: receivedUser.id })
      .orderBy('topic.order', 'ASC');

    const receivedSubject = await query.getMany();

    return receivedSubject;
  }

  async receiveSubjectAndGenerateTopics(
    receiveSubjectDto: ReceiveSubjectDto,
    user,
  ): Promise<ReceiveSubjectDto> {
    const { name } = receiveSubjectDto;
    let receivedTopics: string[] = [];
    const { userId } = user;

    this.logger.log(
      `Generating topics for subject ${name} for user: ${userId} using OpenAI API`,
    );

    try {
      const prompt_subject = `Me de topicos de estudo que devo estudar sobre ${name} 
      (por favor chat gere os topicos com apenas um contrabarra)`;

      //   "Quais são os pontos chave que devo estudar sobre o seguinte assunto: " +
      //   message;
      const completion = await this.openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt: prompt_subject,
        max_tokens: 2000,
        n: 1,
        temperature: 0.3,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      if (completion.choices && completion.choices.length > 0) {
        receivedTopics = completion.choices[0].text.split('\n');
        receivedTopics = receivedTopics.filter((subject) => subject !== '');
      } else {
        this.logger.error(
          `No response from OpenAI API for topics generation for subject ${name} of ${userId}`,
        );
        throw new Error('No response from OpenAI API');
      }
    } catch (error) {
      this.logger.error(`Error generating response from OpenAI API: ${error}`);
      throw new Error('Error generating response from OpenAI API');
    }

    const returnSubject: ReceiveSubjectDto = {
      name,
      topics: receivedTopics,
    };

    this.logger.log(`Subject ${name} and topics generated for user: ${userId}`);
    return returnSubject;
  }

  async saveSubjectAndTopics(receivedSubject: ReceiveSubjectDto, user) {
    const { name, topics } = receivedSubject;
    const { userId } = user;

    const receivedUser = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const subject = await this.subjectsRepository.save({
      name,
      user: receivedUser,
    });

    this.logger.log(`Subject ${name} and topics created for user: ${userId}`);
    await this.topicsService.createTopics(topics, subject);
  }

  async deleteSubject(id: string, user) {
    const receivedSubject = await this.getSubject(user, id);

    receivedSubject[0].topics.forEach(async (topic) => {
      await this.topicsService.deleteTopic(topic.id);
    });

    await this.subjectsRepository.delete(id);
  }
}
