import { Injectable } from '@nestjs/common';
import { User, Role } from 'shared';

@Injectable()
export class AuthService {
    public async login(email, password) {
        return <User>{fName:'yaniv',lName:'trabelsi',roles:[Role.app1]};
        //     return await this.userService.findOne({email: email})
        //     .then(async user => {
        //       return await this.cryptoService.checkPassword(user.password, password)
        //       ? Promise.resolve(user)
        //       : Promise.reject(new UnauthorizedException('Invalid password'))
        //     })
        //     .catch(err => Promise.reject(err))
        //   }
    }
}
