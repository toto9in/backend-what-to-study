import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { TopicDoneStatus } from '../topic-done-status.enum';

export class UpdateDoneStatusDto {
  @IsEnum(TopicDoneStatus)
  done: TopicDoneStatus;
}
