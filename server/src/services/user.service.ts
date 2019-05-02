import { Injectable } from '@nestjs/common';
import { User, AddUserDTO, App } from 'shared';
import { Repository, RepositoryFactory } from 'mongo-nest';
import { genSalt, hash, compare } from 'bcrypt';
import * as NodeCache from 'node-cache';

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
    // remove object after 10 minute
    private chache = new NodeCache({ stdTTL: 60 * 10 });

    constructor(private repositoryFactory: RepositoryFactory) {
        this.userRepo = this.repositoryFactory.getRepository<User>(User, 'users');
        this.saveUser({ _id: 'admin@admin.com', fName: 'yoyo', lName: 'toto', roles: [{ app: App.admin }], password: '123456' } as AddUserDTO);
    }

    async validateUser(email, password) {
        const user = await this.userRepo.collection.findOne({ _id: email }) as AddUserDTO;
        if (!user || (!(await comparePassword(password, user.password)))) { throw new Error('somthing wrong'); }
        delete user.password;
        setTimeout(() => this.chache.set(user._id, user));
        return user;
    }

    async saveUser(user: AddUserDTO) {
        user.password = await cryptPassword(user.password);
        this.userRepo.saveOrUpdateOne(user);
    }
    async getUserAuthenticated(id): Promise<{ user?: User }> {
        if (!id) { return {}; }
        let foundUser = this.chache.get<User>(id);
        if (!foundUser) {
            foundUser = await this.userRepo.findOne({ _id: id });
        }
        setTimeout(() => this.chache.set(foundUser._id, foundUser));
        return { user: foundUser };
    }
}
