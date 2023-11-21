import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  adult: boolean;

  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty()
  genreIds: number[];

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  idNumber: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  originCountry: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  originalLanguage: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  originalName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  overview: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  popularity: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstAirDate: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  voteAverage: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  voteCount: number;
}
