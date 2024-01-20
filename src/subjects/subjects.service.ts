import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { ReceiveSubjectDto } from './dto/receive-subject.dto';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { TopicsService } from '../topics/topics.service';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject) private subjectsRepository: Repository<Subject>,
    private configService: ConfigService,
    private topicsService: TopicsService,
  ) {}

  openai = new OpenAI({
    apiKey: this.configService.get<string>('OPENAI_SECRET_KEY'),
  });

  async getAllSubjects() {
    return this.subjectsRepository.find();
  }

  async receiveSubjectAndGenerateTopics(
    receiveSubjectDto: ReceiveSubjectDto,
  ): Promise<ReceiveSubjectDto> {
    const { name } = receiveSubjectDto;
    let receivedTopics: string[] = [];

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
        throw new Error('No response from OpenAI API');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error generating response from OpenAI API');
    }

    const returnSubject: ReceiveSubjectDto = {
      name,
      topics: receivedTopics,
    };

    return returnSubject;
  }

  async saveSubjectAndTopics(receivedSubject: ReceiveSubjectDto) {
    const { name, topics } = receivedSubject;

    const subject = await this.subjectsRepository.save({
      name,
    });

    await this.topicsService.createTopics(topics, subject);

    return 'subject saved';
  }
}