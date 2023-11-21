import { IsString, MinLength, IsEmail } from 'class-validator';

export class CreateBackofficeDto {
  @IsString()
  @MinLength(2)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;
}
