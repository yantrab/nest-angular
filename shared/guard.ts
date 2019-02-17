
import {Role, User} from './'
export class RolesGuard  {
    constructor(private roles:Role[], private userFunc:() => Promise<User>){}
    async canActivate(context:any) {
     // const request = context.switchToHttp().getRequest();
      const user = await this.userFunc();
      const hasRole = () => user.roles.some((role) => this.roles.includes(role));
      return user && user.roles && hasRole();
    }   
  }