import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../users/user.entity';

export const GetUser = createParamDecorator(
  (data: any, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request.user);

    //{ userId: '3d3ea45b-de73-4e8d-9c43-c60750769d50', username: 'toto9' }
    return request.user;
  },
);
