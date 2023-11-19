import { PartialType } from '@nestjs/mapped-types';
import { CreateBackofficeDto } from './create-backoffice.dto';

export class UpdateBackofficeDto extends PartialType(CreateBackofficeDto) {}
