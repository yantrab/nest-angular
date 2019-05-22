import { Injectable, ForbiddenException } from '@nestjs/common';
import { User, App, hasPermission, Permission, signinRequest } from 'shared';
import { Repository, RepositoryFactory } from 'mongo-nest';
import { genSalt, hash, compare } from 'bcrypt';
import * as NodeCache from 'node-cache';
import { randomBytes } from 'crypto';
import { ObjectId } from 'bson';
import { cryptPassword } from '../utils';

// const generateToken = (): Promise<string> =>
//     new Promise(resolve => randomBytes(48, (err, buffer) => resolve(buffer.toString('hex'))));

const comparePassword = (plainPass, hashword) => {
    return compare(plainPass, hashword);
};

@Injectable()
export class UserService {
    userRepo: Repository<User>;
    // remove object after 10 minute
    private cache = new NodeCache({ stdTTL: 60 * 60 * 12 });

    constructor(private repositoryFactory: RepositoryFactory) {
        this.userRepo = this.repositoryFactory.getRepository<User>(User, 'users');
    }

    async validateUser(email, password) {
        const user = (await this.userRepo.collection.findOne({
            email,
        })) as User;
        if (!user || !(await comparePassword(password, user.password))) {
            throw new Error('something wrong');
        }
        delete user.password;
        // TODO use token instead id.
        setTimeout(() => this.cache.set(user._id.toString(), user));
        return user;
    }

    async saveUser(user: User): Promise<{ ok: number }> {
        return (await this.userRepo.saveOrUpdateOne(user)).result;
    }

    async getUserAuthenticated(id): Promise<User> {
        if (!id) {
            return undefined;
        }
        const foundUser = this.cache.get<User>(id);
        if (!foundUser) {
            return undefined;
        }

        setTimeout(() => this.cache.set(foundUser._id.toString(), foundUser));
        return foundUser;
    }

    async getUsers(query: Partial<User>) {
        return this.userRepo.collection
            .find<User>(query)
            .project({ password: 0 })
            .toArray();
    }

    saveUserToekn(email: string, token: string) {
        this.cache.set(email, token);
    }
    async changePassword(user: signinRequest) {
        const cacheToken = this.cache[user.email];
        if (!cacheToken || cacheToken != user.token) {
            //  throw new ForbiddenException();
        }
        const password = await cryptPassword(user.password);
        try {
            const a = await this.userRepo.collection.updateOne({ email: user.email }, { $set: { password } });
        } catch (e) {
            console.log(e);
        }
        return {};
    }
}
