import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SearchQuery = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query?.query;
    return query;
  },
);

export const SortQuery = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query?.sort;
    return query;
  },
);
