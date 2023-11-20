import { Client } from '../schemas/client.schema';

export class AuthResponse {
  token: string;
  user: Omit<Client, 'password'>;
}
