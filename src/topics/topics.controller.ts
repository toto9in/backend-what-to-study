import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateDoneStatusDto } from './dto/update-done-status.dto';
import { TopicsService } from './topics.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('topics')
@UseGuards(JwtAuthGuard)
export class TopicsController {
  constructor(private topicsService: TopicsService) {}
  @Patch('/:id')
  async updateDoneStatus(
    @Param('id') id: string,
    @Body() updateDoneStatusDto: UpdateDoneStatusDto,
  ) {
    return this.topicsService.updateDoneStatus(id, updateDoneStatusDto);
  }
}
