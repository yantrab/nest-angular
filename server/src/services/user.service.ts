import { Injectable, ForbiddenException } from '@nestjs/common';
import { User, App, hasPermission, Permission } from 'shared';
import { Repository, RepositoryFactory } from 'mongo-nest';
import { genSalt, hash, compare } from 'bcrypt';
import * as NodeCache from 'node-cache';
import { randomBytes } from 'crypto';
import { UpdateWriteOpResult } from 'mongodb';

// const generateToken = (): Promise<string> =>
//     new Promise(resolve => randomBytes(48, (err, buffer) => resolve(buffer.toString('hex'))));

const cryptPassword = async password => {
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
    private cache = new NodeCache({ stdTTL: 60 * 10 });

    constructor(private repositoryFactory: RepositoryFactory) {
        this.userRepo = this.repositoryFactory.getRepository<User>(User, 'users');
        this.userRepo.collection.countDocuments().then(async usersCount => {
            if (usersCount) {
                return;
            }
            const user = new User({
                email: 'admin@admin.com',
                phone: '0555555',
                fName: 'yoyo',
                lName: 'toto',
                roles: [{ app: App.admin, permission: Permission.user }],
            });
            user.password = await cryptPassword('123456');
            this.userRepo.saveOrUpdateOne(user).then();
        });
    }

    async validateUser(email, password) {
        const user = (await this.userRepo.collection.findOne({
            _id: email,
        })) as User;
        if (!user || !(await comparePassword(password, user.password))) {
            throw new Error('something wrong');
        }
        delete user.password;
        // TODO use token instead id.
        setTimeout(() => this.cache.set(user._id, user));
        return user;
    }
    async saveFisrtUser(user: User): Promise<{ ok: number; n: number; nModified: number }> {
        const usersCount = await this.userRepo.collection.count();
        if (usersCount) {
            return;
        }
        user.password = await cryptPassword('123456');
        return (await this.userRepo.saveOrUpdateOne(user)).result;
    }

    async saveUser(user: User): Promise<{ ok: number; n: number; nModified: number }> {
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

        setTimeout(() => this.cache.set(foundUser._id, foundUser));
        return foundUser;
    }

    async getUsers(query: Partial<User>) {
        return this.userRepo.collection
            .find<User>(query)
            .project({ password: 0 })
            .toArray();
    }
}
