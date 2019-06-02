import { Injectable } from '@nestjs/common';
import { Fund } from 'shared';
import { Repository, RepositoryFactory } from 'mongo-nest';
import { mfConf } from '../../../../config';
import * as sql from 'mssql';

@Injectable()
export class FundService {
    private fundRepo: Repository<Fund>;
    private funds;
    constructor(private repositoryFactory: RepositoryFactory) {
        this.fundRepo = this.repositoryFactory.getRepository<Fund>(Fund, 'DBFunds');
        this.update();
    }

    async getFunds(query?: Partial<Fund>): Promise<any[]> {
        return this.funds;
        // return this.fundRepo.findMany(query || {});
    }

    async update() {
        const pool = new sql.ConnectionPool(mfConf.db);
        try {
            await pool.connect();
            this.funds = (await pool.request().query(
                `
                    SELECT *
                    FROM [dbMutualFund].[dbo].[vwMetaData] a
                    JOIN [dbMutualFund].[dbo].[vwK303] b on a.id = b.FundID
                `,
            )).recordset;
            this.funds.forEach(f => {
                Object.keys(f).forEach(key => {
                    if (f[key] === null) {
                        delete f[key];
                    }
                });
            });
        } catch (e) {
            // console.log(e);
        }
    }
}
