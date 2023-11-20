import {
  IsString,
  MinLength,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateClientUserDto {
  @IsString()
  @MinLength(2)
  username: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;
}
