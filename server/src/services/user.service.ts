import { Injectable } from '@nestjs/common';
import { User, Role } from 'shared';
import { DBService, Repository, FindConditions } from './db.service';

@Injectable()
export class UserService {
    userRepo:Repository<FindConditions<User>>;
    constructor(private db:DBService){
        this.userRepo = db.getRepository<User>(User,'users')
        this.userRepo.updateOne({},{},{upsert:true})
    }

    public async validateUser(email, password) {
        const user = this.userRepo.findOne({_id:email});
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
