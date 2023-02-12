import { promisify } from 'util';
import { exec } from 'child_process';

const asyncExec = promisify(exec);

export default asyncExec;
