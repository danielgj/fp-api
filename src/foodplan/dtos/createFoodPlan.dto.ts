import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFoodPlanDTO {
  @ApiProperty()
  @IsString()
  name: string;
}
