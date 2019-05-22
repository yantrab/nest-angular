import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { smtp } from '../../../../config';
import * as Mail from 'nodemailer/lib/mailer';
@Injectable()
export class MailerService {
    private transporter: Mail;
    constructor() {
        this.transporter = createTransport(smtp);
    }

    async send(mailOptions: Mail.Options) {
        try {
            await this.transporter.sendMail(mailOptions);
        } catch (e) {
            Logger.error(e);
        }
    }
}
