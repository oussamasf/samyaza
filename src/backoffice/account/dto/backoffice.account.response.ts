import { ApiProperty } from '@nestjs/swagger';
import { Admin } from '../schemas/admin.schema';

export class AuthResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: Omit<Admin, 'password'>;
}
