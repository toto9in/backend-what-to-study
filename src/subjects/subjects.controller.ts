import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { ReceiveSubjectDto } from './dto/receive-subject.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';

@Controller('subjects')
@UseGuards(JwtAuthGuard)
export class SubjectsController {
  constructor(private subsjecsService: SubjectsService) {}

  @Get()
  async getAllSubjects(@GetUser() user: User) {
    return this.subsjecsService.getAllSubjects(user);
  }

  @Get('/:id')
  async getSubject(@Param('id') id: string, @GetUser() user: User) {
    return this.subsjecsService.getSubject(user, id);
  }
  @Post()
  async receiveSubjectAndGenerateTopics(
    @Body() receivedSubject: ReceiveSubjectDto,
    @GetUser() user: User,
  ): Promise<ReceiveSubjectDto> {
    return this.subsjecsService.receiveSubjectAndGenerateTopics(
      receivedSubject,
      user,
    );
  }

  @Post('/save')
  async saveSubjectAndTopics(
    @Body() receivedSubject: ReceiveSubjectDto,
    @GetUser() user: User,
  ) {
    return this.subsjecsService.saveSubjectAndTopics(receivedSubject, user);
  }

  @Delete('/:id')
  async deleteSubject(@Param('id') id: string, @GetUser() user: User) {
    return this.subsjecsService.deleteSubject(id, user);
  }
}
