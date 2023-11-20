import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGenreDto {
  @IsNotEmpty()
  @IsNumber()
  idNumber: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
