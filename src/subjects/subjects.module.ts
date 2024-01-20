import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { AuthModule } from '../auth/auth.module';
import { TopicsModule } from '../topics/topics.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subject]), AuthModule, TopicsModule],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
