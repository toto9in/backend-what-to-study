import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { ReceiveSubjectDto } from './dto/receive-subject.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private subsjecsService: SubjectsService) {}

  @Get()
  async getAllSubjects() {
    return this.subsjecsService.getAllSubjects();
  }

  @Post()
  async receiveSubjectAndGenerateTopics(
    @Body()
    receivedSubject: ReceiveSubjectDto,
  ): Promise<ReceiveSubjectDto> {
    return this.subsjecsService.receiveSubjectAndGenerateTopics(
      receivedSubject,
    );
  }

  @Post('/save')
  async saveSubjectAndTopics(@Body() receivedSubject: ReceiveSubjectDto) {
    return this.subsjecsService.saveSubjectAndTopics(receivedSubject);
  }
}
