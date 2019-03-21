import { Injectable } from '@nestjs/common';
import { Fund } from 'shared';
import { Repository, RepositoryFactory } from 'mongo-nest';
@Injectable()
export class FundService {
    private fundRepo: Repository<Fund>;
    constructor(private repositoryFactory: RepositoryFactory) {
        this.fundRepo = this.repositoryFactory.getRepository<Fund>(Fund, 'DBFunds');
        this.fundRepo.saveOrUpdateMany(require('./funds.json'));
    }

    async getFunds(query?: Partial<Fund>): Promise<Fund[]> {
        return this.fundRepo.findMany(query || {});
    }
}
