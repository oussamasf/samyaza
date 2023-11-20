import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateSeriesDto {
  @IsNotEmpty()
  @IsBoolean()
  adult: boolean;

  @IsArray()
  @IsNumber({}, { each: true })
  genreIds: number[];

  @IsNotEmpty()
  @IsNumber()
  idNumber: number;

  @IsArray()
  @IsString({ each: true })
  originCountry: string[];

  @IsNotEmpty()
  @IsString()
  originalLanguage: string;

  @IsNotEmpty()
  @IsString()
  originalName: string;

  @IsNotEmpty()
  @IsString()
  overview: string;

  @IsNotEmpty()
  @IsNumber()
  popularity: number;

  @IsNotEmpty()
  @IsString()
  firstAirDate: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  voteAverage: number;

  @IsNotEmpty()
  @IsNumber()
  voteCount: number;
}
