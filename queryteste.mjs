import { promisify } from 'util';
import { exec, spawn } from 'child_process';
const asyncExec = promisify(exec);



const { stdout, stderr } = await asyncExec(query);
const reg1 = new RegExp('(?<="node": {).*?(?=})', 'g')

const separatedbyData = stdout.matchAll(/(?<=\{"node":).*?(?=}[\],])/g);

const teste = [];
for (const match of separatedbyData) {
  teste.push(JSON.parse(match[0]))
}

const filteredPRS = teste.filter((PR) => PR.author.login.includes('alangmartini')
  && (
    PR.baseRefName === 'master'
    || PR.baseRefName === 'main'
  ));

console.log(filteredPRS);
