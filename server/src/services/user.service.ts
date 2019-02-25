import { Injectable } from '@nestjs/common';
import { User, Role, AddUserDTO } from 'shared';
import { Repository, RepositoryFactory } from 'mongo-nest';
import { comparePassword, cryptPassword } from './crypt';
@Injectable()
export class UserService {
    userRepo: Repository<User>;
    constructor(private repositoryFactory: RepositoryFactory) {
        this.userRepo = this.repositoryFactory.getRepository<User>(User, 'users');
        this.saveUser({ _id: 'admin@admin.com', fName: 'yoyo', lName: 'toto', roles: [Role.Admin], password: '123456'} as AddUserDTO);
    }

    async validateUser(email, password) {
        const user = await this.userRepo.collection.findOne({ _id: email }) as AddUserDTO;
        if (!user || (!(await comparePassword(password, user.password)))) { throw new Error('somthing wrong'); }
        delete user.password;
        return user;
    }

    async saveUser(user: AddUserDTO) {
        user.password = await cryptPassword(user.password);
        this.userRepo.saveOrUpdate(user);
    }
}
