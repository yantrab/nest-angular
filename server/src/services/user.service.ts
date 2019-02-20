import { Injectable } from '@nestjs/common';
import { User, Role } from 'shared';
import { DBService, Repository } from './db.service';

@Injectable()
export class UserService {
    userRepo: Repository<User>;
    constructor(private db: DBService) {
        db.getConnection.subscribe(db => {
            this.userRepo = db.getRepository<User>(User, 'users')
            this.userRepo.saveOrUpdate({ _id: 'admin@admin.com', fName: 'yoyo', lName: 'toto', roles: [Role.Admin] })
        });
    }

    public async validateUser(email, password) {
        const user = await this.userRepo.collection.findOne({ _id: email });
        return user;
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
