import { PartialType } from '@nestjs/mapped-types';
import { CreateSeriesDto } from './create-series.dto';

export class UpdateSeriesDto extends PartialType(CreateSeriesDto) {}
