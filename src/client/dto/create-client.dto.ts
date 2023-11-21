import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateSearchMovieDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  title: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  overview: string;
}

// TODO this shouldn't be here (irrelevant path)
