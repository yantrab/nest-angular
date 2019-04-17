import * as sql from 'mssql';
import { Injectable } from '@nestjs/common';
import { macroConf } from '../../../../macro/config';
import { Logger } from '@nestjs/common';
import { Category, Series, Data, DataRequest } from 'shared/models/macro.model';
import { Repository, RepositoryFactory } from 'mongo-nest';
@Injectable()
export class MacroService {
    private readonly logger = new Logger('DataService');
    private categoryRepo: Repository<Category>;
    private seriesRepo: Repository<Series>;
    private dataRepo: Repository<Data>;
    constructor(private repositoryFactory: RepositoryFactory) {
        this.categoryRepo = this.repositoryFactory.getRepository<Category>(Category, 'DBMacro');
        this.seriesRepo = this.repositoryFactory.getRepository<Series>(Series, 'DBMacro');
        this.dataRepo = this.repositoryFactory.getRepository<Data>(Data, 'DBMacro');
    }

    async update() {
        await Promise.all([
            this.updateData(),
            this.updateCategoriesAndSerias(),
        ]);
    }

    private async updateData() {
        return new Promise(async (resolve, reject) => {
            await this.dataRepo.collection.deleteMany({});
            const pool = new sql.ConnectionPool(macroConf.db);
            pool.on('error', err => { this.logger.error('sql errors', err); });
            try {
                await pool.connect();
                const ids = (await pool.request().query('select distinct pasp_id as id from [dbMacro].[dbo].[prData]'))
                    .recordset
                    .map(row => row.id);
                await Promise.all(ids.map(async id => {
                    const query =
                        `
                        SELECT pasp_id as id, report_date  as d, data_value as v
                        FROM [dbMacro].[dbo].[prData]
                        WHERE pasp_id = '${id}'
                        `;
                    const dbData = (await pool.request().query(query)).recordset;
                    const data: any = [];
                    dbData
                        .forEach(d => {
                            data.push({ date: d.d, value: d.v });
                        });
                    await this.dataRepo.saveOrUpdateOne({ _id: id, data });
                }));

                resolve(true);
            } catch (err) {
                reject(err);
                this.logger.error(err);
            } finally {
                pool.close();
            }
        });
    }
    private async updateCategoriesAndSerias() {
        const getChildren = (categories, category) => {
            const children =
                categories
                    .filter(c => c._id.length === category._id.length + 1 && c._id.slice(0, category._id.length) === category._id);
            if (!children.length) { return undefined; }
            children.forEach(child => child.children = getChildren(categories, child));
            return children;
        };

        return new Promise(async (resolve, reject) => {
            const pool = new sql.ConnectionPool(macroConf.db);
            try {
                await pool.connect();
                const categoriesDB: Category[] =
                    (await pool.request().query(`
                        select catg_id as _id,
                            name_hebrew as name,
                            name_english as NameEnglish
                        from prCatg
                        `)).recordset;
                const categories = categoriesDB.filter(category => category._id.length === 1);

                categories.forEach(category => {
                    category.children = getChildren(categoriesDB, category);
                });
                await this.categoryRepo.collection.deleteMany({});
                await this.categoryRepo.saveOrUpdateMany(categories);

                const serias: Series[] = (await pool.request().query(`
                SELECT t1.pasp_id as _id, t1.catg_id as categoryId, t1.name_hebrew as name,
                    t2.name_hebrew as hebTypeName, t1.first_trading_date as startDate,
                    t1.last_trading_date  as endDate,t4.SOURCE_NAME as sourceEnName, t3.UNIT_NAME as unitEnName
                FROM [dbMacro].[dbo].[prPasp] t1
                left join [dbMacro].[dbo].[prType] t2 on t1.[type_id] = t2.[type_id]
                left join [dbMacro].[dbo].tblUnit t3 on t1.unit_id = t3.UNIT_ID
                left join [dbMacro].[dbo].tblSource t4 on t1.source_id = t4.source_id
                where t1.catg_id is not null
            `))
                    .recordset;
                serias.forEach(s => {
                    s.catalogPath = '';
                    for (let i = 1; i <= 3; i++) {
                        const subId = s.categoryId.slice(0, i);
                        // s.catalogPath += categoriesDB.find(c => c._id === subId).name;

                        if (i !== 3) {
                            s.catalogPath += ' | ';
                        }
                    }
                });
                await this.seriesRepo.collection.deleteMany({});
                await this.seriesRepo.saveOrUpdateMany(serias);

                resolve(true);
            } catch (err) {
                reject(err);
                this.logger.error(err);
            } finally {
                pool.close();
            }
        });
    }

    async getCategories() {
        return this.categoryRepo.findMany();
    }

    async getSeries() {
        return this.seriesRepo.findMany();
    }

    async getData(req: DataRequest): Promise<Data[]> {
        return this
            .dataRepo
            .collection
            .find(
                {
                    _id: { $in: req.seriasIds },
                    // $and: [{ 'data.date': { $gt: req.from } }, { 'data.date': { $gt: req.from } }],
                }).toArray() as Promise<Data[]>;
    }
}
