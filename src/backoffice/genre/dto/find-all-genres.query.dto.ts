import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { SortQueryCommonDto } from 'src/common/dto/query-params.dto';

export class SearchQueryGenreDto {
  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  idNumber: number;

  @IsString()
  @IsOptional()
  name: string;
}

export class SortQueryGenreDto extends SortQueryCommonDto {}
