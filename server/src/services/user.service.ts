import { Injectable } from '@nestjs/common';
import { User, AddUserDTO, App } from 'shared';
import { Repository, RepositoryFactory } from 'mongo-nest';
import { genSalt, hash, compare } from 'bcrypt';
const cryptPassword = async (password) => {
    const salt = await genSalt(10);
    return hash(password, salt);
};

const comparePassword = (plainPass, hashword) => {
    return compare(plainPass, hashword);
};

@Injectable()
export class UserService {
    userRepo: Repository<User>;
    constructor(private repositoryFactory: RepositoryFactory) {
        this.userRepo = this.repositoryFactory.getRepository<User>(User, 'users');
        this.saveUser({ _id: 'admin@admin.com', fName: 'yoyo', lName: 'toto', roles: [{ app: App.admin }], password: '123456' } as AddUserDTO);
    }

    async validateUser(email, password) {
        const user = await this.userRepo.collection.findOne({ _id: email }) as AddUserDTO;
        if (!user || (!(await comparePassword(password, user.password)))) { throw new Error('somthing wrong'); }
        delete user.password;
        return user;
    }

    async saveUser(user: AddUserDTO) {
        user.password = await cryptPassword(user.password);
        this.userRepo.saveOrUpdateOne(user);
    }
}
