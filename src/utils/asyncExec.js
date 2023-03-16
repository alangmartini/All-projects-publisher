const { promisify } = require('util');
const { exec } = require('child_process');

const asyncExec = promisify(exec);

module.exports = {
  asyncExec,
};
