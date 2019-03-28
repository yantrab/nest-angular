import { promisify } from 'util';
import { writeFile as wf } from 'fs';
export const writeFile = promisify(wf);
export * from '../../shared/utils';
