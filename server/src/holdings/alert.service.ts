import axios from 'axios';

import * as sql from 'mssql';
import * as queries from './queries';
import { holdingsConf } from '../../../../config';
import { Alert } from './model';
import { MailerService } from '../services/mailer.service';
const from = '"Praedicta Holdings" <info@praedicta.com>';
const mailer = new MailerService();

const getHtml = (email: string) => {
    return `
     <div style="font-family: arial;" dir="rtl">
       שלום ${email.split('@')[0]},
                <br><br>
פורסמו במערכת אחזקות נתוני אסיפה כללית של חברת אלרוב נדלן מתאריך 09/07/2019.                
                <br><br>
מצ"ב קובץ אקסל עם פירוט הנתונים.                
                <br><br>
למעבר למערכת יש ללחוץ כאן.                
                <br><br>  <br><br>
                פרדיקטה דטה (1989) בע"מ
                <br>
                טלפון: 02-6528490
     </div>
`;
};

const sendNewMeetings = async (pool, newMeetingIds: number[], emails: string[]) => {
    return newMeetingIds.map(async id => {
        const data = await axios.post('http://localhost:9090/Holdings/GetGeneralMeetaing', {
            id: 198010,
            date: '2019-07-09T00:00:00',
        });
        console.log(data.data);
        mailer.send({
            html: getHtml(''),
            from,
            subject: 'התראה ממערכת אחזקות פרדיקטה: אסיפה כללית - אלרוב נדלן',
            to: emails,
        });
    });
};
const sendNewBonds = async (pool, newMeetingIds: number[], emails: string[]) => {};

const checkAlerts = async () => {
    const pool = new sql.ConnectionPool(holdingsConf.db);
    try {
        await pool.connect();
        const ids = (await pool.request().query(queries.getIds)).recordset as Alert[];
        const userToSendNewMeeting = (await pool.request().query(queries.userToSendNewMeeting)).recordset.map(r => r.email);
        const userToSendNewBonds = (await pool.request().query(queries.userToSendNewBonds)).recordset.map(r => r.email);
        await sendNewMeetings(pool, ids.filter(id => id.type === 'NewMeeting').map(id => id.securityId), userToSendNewMeeting);
        await sendNewBonds(pool, ids.filter(id => id.type === 'NewBond').map(id => id.securityId), userToSendNewBonds);
    } catch (e) {
        console.log(e);
    }
    {
        await pool.close();
        setTimeout(() => checkAlerts(), holdingsConf.alertNewMeetingFreq * 1000 * 60);
    }
};

checkAlerts();
