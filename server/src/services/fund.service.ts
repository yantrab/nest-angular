import { Injectable } from '@nestjs/common';
import { Fund } from 'shared';
import { Repository, RepositoryFactory } from 'mongo-nest';
import { comparePassword, cryptPassword } from './crypt';
@Injectable()
export class FundService {
    private fundRepo: Repository<Fund>;
    constructor(private repositoryFactory: RepositoryFactory) {
        this.fundRepo = this.repositoryFactory.getRepository<Fund>(Fund, 'users');
        this.fundRepo.saveOrUpdateMany(require('./funds.json'));
    }

    // getFunds(query:) {
    //     return this.fundRepo.collection.find()
    // }
}
