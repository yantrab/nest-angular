import { promisify } from 'util';
import { writeFile as wf } from 'fs';
export const writeFile = promisify(wf);
export * from '../../shared/utils';
import { genSalt, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
export const cryptPassword = async password => {
    const salt = await genSalt(10);
    return hash(password, salt);
};

export const getRandomToken = async () => {
    const buffer = await randomBytes(48);
    return buffer.toString('hex');
};
