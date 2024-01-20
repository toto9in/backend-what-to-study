import { IsNotEmpty, IsOptional } from 'class-validator';

export class ReceiveSubjectDto {
  @IsNotEmpty()
  name: string;
  @IsOptional()
  topics: string[];
}
