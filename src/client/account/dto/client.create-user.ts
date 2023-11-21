import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  username: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  firstName: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  lastName: string;

  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty()
  phoneNumber?: string;

  @IsString()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}
