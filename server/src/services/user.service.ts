import { Injectable } from '@nestjs/common';
import { User, Role, AddUserDTO } from 'shared';
import { DBService, Repository } from './db.service';
import {comparePassword,cryptPassword} from './crypt'
@Injectable()
export class UserService {
    userRepo: Repository<User>;
    constructor(private db: DBService) {
        db.getConnection.subscribe(db => {
            this.userRepo = db.getRepository<User>(User,'user')
            this.saveUser(<AddUserDTO>{ _id: 'admin@admin.com', fName: 'yoyo', lName: 'toto', roles: [Role.Admin],password:'123456'})
        });
    }

    async validateUser(email, password) {
        const user = <AddUserDTO>await this.userRepo.collection.findOne({ _id: email });
        if (!user || (!(await comparePassword(password, user.password)))) throw 'somthing wrong'
        delete user.password;
        return user;
    }

    async saveUser(user:AddUserDTO){
        user.password = await cryptPassword(user.password)
        this.userRepo.saveOrUpdate(user);
    }

}
