import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Client } from '../schemas/client.schema';

const AuthUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const client = request.user as Client;
  client.password = undefined;
  return client;
});

export default AuthUser;
