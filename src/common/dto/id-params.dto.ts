import { IsMongoId, IsOptional } from 'class-validator';

export class IdParamsDto {
  @IsMongoId()
  @IsOptional()
  id: string;

  @IsMongoId()
  @IsOptional()
  hotelId: string;

  @IsMongoId()
  @IsOptional()
  roomId: string;
}
