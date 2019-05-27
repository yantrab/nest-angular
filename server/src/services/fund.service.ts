import { Injectable } from '@nestjs/common';
import { Fund } from 'shared';
import { Repository, RepositoryFactory } from 'mongo-nest';
import { mfConf } from '../../../../config';
import * as sql from 'mssql';

@Injectable()
export class FundService {
    private fundRepo: Repository<Fund>;
    constructor(private repositoryFactory: RepositoryFactory) {
        this.fundRepo = this.repositoryFactory.getRepository<Fund>(Fund, 'DBFunds');
        // this.fundRepo.saveOrUpdateMany(require('./funds.json'));
    }

    async getFunds(query?: Partial<Fund>): Promise<any[]> {
        const pool = new sql.ConnectionPool(mfConf.db);
        try {
            await pool.connect();
            return (await pool.request().query('select * FROM [dbo].[vwMetaData]')).recordset;
        } catch (e) {
            console.log(e);
        }
        // return this.fundRepo.findMany(query || {});
    }
}
