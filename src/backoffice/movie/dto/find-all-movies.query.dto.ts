import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsIn } from 'class-validator';
import { SortQueryCommonDto } from 'src/common/dto/query-params.dto';

export class SearchQueryMovieDto {
  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @ApiProperty()
  voteAverage: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  originalLanguage: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  originalTitle: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  releaseDate: string;
}

export class SortQueryMovieDto extends SortQueryCommonDto {
  @IsIn([1, -1], { message: 'Value must be either 1 or -1' })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  title: string;

  @IsIn([1, -1], { message: 'Value must be either 1 or -1' })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  popularity: number;

  @IsIn([1, -1], { message: 'Value must be either 1 or -1' })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  voteAverage: number;

  @IsIn([1, -1], { message: 'Value must be either 1 or -1' })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  voteCount: number;
}
