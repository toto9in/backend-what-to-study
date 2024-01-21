import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../users/user.entity';

export const GetUser = createParamDecorator(
  (data: any, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
