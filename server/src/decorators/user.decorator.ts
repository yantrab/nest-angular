import { createParamDecorator } from '@nestjs/common';

export const ReqUser = createParamDecorator((data, req) => {
  return req.user;
});
