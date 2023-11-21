import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  idNumber: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  adult: boolean;

  @IsNumber({}, { each: true })
  @ApiProperty()
  genreIds: number[];

  @IsString()
  @ApiProperty()
  originalLanguage: string;

  @IsString()
  @ApiProperty()
  originalTitle: string;

  @IsString()
  @ApiProperty()
  overview: string;

  @IsNumber()
  @ApiProperty()
  popularity: number;

  @IsString()
  @ApiProperty()
  releaseDate: string;

  @IsBoolean()
  @ApiProperty()
  video: boolean;

  @IsNumber()
  @ApiProperty()
  voteAverage: number;

  @IsNumber()
  @ApiProperty()
  voteCount: number;
}
