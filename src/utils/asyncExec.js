import { promisify } from 'util';
import { exec } from 'child_process';

export const asyncExec = promisify(exec);

export default { };
