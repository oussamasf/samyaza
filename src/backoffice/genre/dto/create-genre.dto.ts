import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGenreDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  idNumber: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
