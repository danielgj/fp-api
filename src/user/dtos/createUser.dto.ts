import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    description: 'Name of the user',
  })
  @IsString()
  name: string;
  @ApiProperty({
    description: "User's email, used to log in",
  })
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}
