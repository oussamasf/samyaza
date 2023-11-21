import { PartialType } from '@nestjs/mapped-types';
import { CreateSearchMovieDto } from './create-client.dto';

export class UpdateSearchMovieDto extends PartialType(CreateSearchMovieDto) {}
