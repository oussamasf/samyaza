import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { SortQueryCommonDto } from 'src/common/dto/query-params.dto';

export class SearchQueryMovieDto {
  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  voteAverage: number;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  originalLanguage: string;

  @IsString()
  @IsOptional()
  originalTitle: string;

  @IsString()
  @IsOptional()
  releaseDate: string;
}

export class SortQueryMovieDto extends SortQueryCommonDto {}
