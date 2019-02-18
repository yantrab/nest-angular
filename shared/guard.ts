
import { Role, User } from './'
export const canActivate =
  (user: User, roles: Role[]) =>
    user &&
    user.roles &&
    user.roles.some((role) => roles.includes(role))