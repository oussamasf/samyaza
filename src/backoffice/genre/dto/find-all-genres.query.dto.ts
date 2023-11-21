import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsIn } from 'class-validator';
import { SortQueryCommonDto } from 'src/common/dto/query-params.dto';

export class SearchQueryGenreDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  idNumber?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;
}

export class SortQueryGenreDto extends SortQueryCommonDto {
  @ApiProperty()
  @IsIn([1, -1], { message: 'Value must be either 1 or -1' })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  idNumber?: number;
}
