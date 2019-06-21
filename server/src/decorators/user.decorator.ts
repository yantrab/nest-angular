import { createParamDecorator } from '@nestjs/common';
import { User } from 'shared/models';

export const ReqUser = createParamDecorator((data, req) => {
    return req.user as User;
});
