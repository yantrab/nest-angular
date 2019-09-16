import { genSalt, hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
export const cryptPassword = async password => {
    const salt = await genSalt(10);
    return hash(password, salt);
};

export const getRandomToken = async () => {
    const buffer = await randomBytes(48);
    return buffer.toString();
};
