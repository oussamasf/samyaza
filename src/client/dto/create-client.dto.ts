import { IsString, MinLength } from 'class-validator';

export class CreateSearchMovieDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(2)
  overview: string;
}
