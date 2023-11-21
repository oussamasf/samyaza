import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../schemas/client.schema';

export class AuthResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: Omit<Client, 'password'>;
}
