import { IsInt, Min, IsOptional, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryParamsDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => Number.parseInt(value))
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number.parseInt(value))
  limit?: number;

  @IsOptional()
  sort?: any;

  @IsOptional()
  query?: any;
}

export class FindAllDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => Number.parseInt(value))
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number.parseInt(value))
  limit?: number;

  @IsOptional()
  sort?: any;

  @IsOptional()
  search?: any;
}

export class SortQueryCommonDto {
  @IsIn([1, -1], { message: 'Value must be either 1 or -1' })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  createdAt: number;

  @IsIn([1, -1], { message: 'Value must be either 1 or -1' })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  updatedAt: number;
}
