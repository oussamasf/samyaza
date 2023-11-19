import { Admin } from '../schemas/admin.schema';

export class AuthResponse {
  token: string;
  user: Omit<Admin, 'password'>;
}
