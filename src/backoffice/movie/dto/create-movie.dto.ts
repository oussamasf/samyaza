import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsNumber()
  idNumber: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  adult: boolean;

  @IsNumber({}, { each: true })
  genreIds: number[];

  @IsString()
  originalLanguage: string;

  @IsString()
  originalTitle: string;

  @IsString()
  overview: string;

  @IsNumber()
  popularity: number;

  @IsString()
  releaseDate: string;

  @IsBoolean()
  video: boolean;

  @IsNumber()
  voteAverage: number;

  @IsNumber()
  voteCount: number;
}
