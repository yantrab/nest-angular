import * as sql from 'mssql';
import { macroConf } from '../../../../macro/config';
import { Logger } from '@nestjs/common';
import { writeFile } from 'utils';
import { createWriteStream } from 'fs';
import { Category, Series } from './macro.model';
const dataPath = '../../macro/data/';
export class DataService {
    private readonly logger = new Logger('DataService');

    async update() {
        await Promise.all([
            //this.updateData(),
            this.updateCategoriesAndSerias(),
        ]);
    }

    private async updateData() {
        return new Promise(async (resolve, reject) => {
            const pool = new sql.ConnectionPool(macroConf.db);
            const path = dataPath + 'data.json';
            const writeStream = createWriteStream(path);
            await writeFile(path, '');
            writeStream.write('{');
            pool.on('error', err => { this.logger.error('sql errors', err); });
            try {
                await pool.connect();
                const ids = (await pool.request().query('select distinct pasp_id as id from [dbMacro].[dbo].[prData]'))
                    .recordset
                    .map(row => row.id);
                await Promise.all(ids.map(async id => {
                    const query =
                        `
                        SELECT pasp_id as id, LEFT(CONVERT(VARCHAR, report_date, 120), 7)  as d, data_value as v
                        FROM [dbMacro].[dbo].[prData]
                        WHERE pasp_id = '${id}'
                        `;
                    const dbData = (await pool.request().query(query)).recordset;
                    const data = [];
                    dbData
                        .forEach(d => {
                            data.push([d.d, d.v]);
                        });
                    writeStream.write(`"${id}": ${JSON.stringify(data)},`);
                }));
                writeStream.write('}');
                resolve(true);
            } catch (err) {
                reject(err);
                this.logger.error(err);
            } finally {
                pool.close();
                writeStream.close();
            }
        });
    }
    private async updateCategoriesAndSerias() {
        return new Promise(async (resolve, reject) => {
            const pool = new sql.ConnectionPool(macroConf.db);
            try {
                const categoriesPath = dataPath + 'categories.json';
                const seriasPath = dataPath + 'serias.json';
                await pool.connect();
                const categories: Category[] =
                    (await pool.request().query(`
                        select catg_id as CatgID,
                            name_hebrew as NameHebrew,
                            name_english as NameEnglish
                        from prCatg
                        `))
                        .recordset;
                categories.forEach(category => {
                    if (category.CatgID.length === 1) {
                        categories.push(category);
                        return;
                    }
                    const node = this.findNode(categories, category.CatgID.substring(0, category.CatgID.length - 1));
                    if (!node.Children) { node.Children = []; }
                    node.Children.push(category);
                });

                await writeFile(categoriesPath, JSON.stringify(categories));

                const serias: Series[] = (await pool.request().query(`
                SELECT  t1.catg_id as id, t1.name_hebrew as hebName,
                    t2.name_hebrew as hebTypeName, t1.first_trading_date as startDate,
                    t1.last_trading_date  as endDate,t4.SOURCE_NAME as sourceEnName, t3.UNIT_NAME as unitEnName
                FROM [dbMacro].[dbo].[prPasp] t1
                join [dbMacro].[dbo].[prType] t2 on t1.[type_id] = t2.[type_id]
                join [dbMacro].[dbo].tblUnit t3 on t1.unit_id = t3.UNIT_ID
                join [dbMacro].[dbo].tblSource t4 on t1.source_id = t4.source_id
                where t1.catg_id is not null
            `))
                    .recordset;
                serias.forEach(s => {
                    s.catalogPath = '';
                    for (let i = 1; i <= 3; i++) {
                        const subId = s.id.slice(0, i);
                        s.catalogPath += categories.find(c => c.CatgID === subId).NameHebrew;

                        if (i !== 3) {
                            s.catalogPath += ' | ';
                        }
                    }
                });
                await writeFile(seriasPath, JSON.stringify(serias));

                resolve(true);
            } catch (err) {
                reject(err);
                this.logger.error(err);
            } finally {
                pool.close();
            }
        });
    }

    private findNode(nodes: Category[], id: string): Category {
        let res = nodes.find(n => n.CatgID === id);
        if (res) { return res; }
        for (const n of nodes) {
            res = this.findNode(n.Children, id);
            if (res) { return res; }
        }
    }
}
