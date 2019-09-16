import axios from 'axios';
import * as sql from 'mssql';
import { holdingsConf } from '../../../../../config';
import { readFile, utils } from 'xlsx';
import { xml2js } from 'xml-js';
import { format, addHours } from 'date-fns';
import { resolve } from 'path';
interface ImportItem {
    Group_ID: string;
    Report_date: Date;
    URL: string;
}
const importSec = async () => {
    const pool = new sql.ConnectionPool(holdingsConf.db);
    try {
        await pool.connect();
        const file = resolve(__dirname + '\\SecLinks.xlsx');
        const toImport: ImportItem[] = utils.sheet_to_json(readFile(file, { cellDates: true }).Sheets['Sheet1']);
        await Promise.all(
            toImport.map(async item => {
                const xmlData = (await axios.get(item.URL)).data;
                const jsonData: any[] = (xml2js(xmlData, { compact: true }) as any).informationTable.infoTable;
                const date = addHours(item.Report_date, 5);
                await pool
                    .request()
                    .query(
                        `delete GroupEdgarHoldings where Group_id =  ${item.Group_ID} AND Report_date = '${format(
                            date,
                            'YYYY-MM-DD',
                        )}'`,
                    );
                const table = new sql.Table('GroupEdgarHoldings');
                table.columns.add('Group_id', sql.Int, { nullable: true });
                table.columns.add('Report_date', sql.Date, { nullable: true });
                table.columns.add('nameOfIssuer', sql.NVarChar(sql.MAX), { nullable: true });
                table.columns.add('titleOfClass', sql.NVarChar(sql.MAX), { nullable: true });
                table.columns.add('cusip', sql.NVarChar(sql.MAX), { nullable: true });
                table.columns.add('value', sql.Float, { nullable: true });
                table.columns.add('shrsOrPrnAmt', sql.NVarChar(sql.MAX), { nullable: true });
                table.columns.add('sshPrnamt', sql.Float, { nullable: true });
                table.columns.add('sshPrnamtType', sql.NVarChar(sql.MAX), { nullable: true });
                table.columns.add('investmentDiscretion', sql.NVarChar(sql.MAX), { nullable: true });
                table.columns.add('otherManager', sql.NVarChar(sql.MAX), { nullable: true });
                table.columns.add('votingAuthority', sql.NVarChar(sql.MAX), { nullable: true });
                table.columns.add('Sole', sql.Float, { nullable: true });
                table.columns.add('Shared', sql.NVarChar(sql.MAX), { nullable: true });
                table.columns.add('None', sql.NVarChar(sql.MAX), { nullable: true });

                jsonData.forEach(row => {
                    table.rows.add(
                        item.Group_ID || '',
                        date,
                        row.nameOfIssuer._text || '',
                        row.titleOfClass._text || '',
                        row.cusip._text || '',
                        row.value._text || '',
                        '',
                        row.shrsOrPrnAmt.sshPrnamt._text || '',
                        row.shrsOrPrnAmt.sshPrnamtType._text || '',
                        row.investmentDiscretion._text || '',
                        row.otherManager ? row.otherManager._text : '',
                        '',
                        row.votingAuthority.Sole._text || '',
                        row.votingAuthority.Shared._text || '',
                        row.votingAuthority.None._text || '',
                    );
                });
                await pool.request().bulk(table);
            }),
        );
    } catch (e) {
        console.log(e);
    }
    {
        await pool.close();
    }
};

importSec();
