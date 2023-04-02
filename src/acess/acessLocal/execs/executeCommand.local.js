const { promisify } = require('util');
const { exec } = require('child_process');
const { spawn } = require('child_process');

const asyncExec = promisify(exec);

const asyncSpawn = async (
  mainCommand,
  arrayOfCommands,
  CWD = './',
) => new Promise((resolve, reject) => {
  const processInfo = spawn(
    mainCommand,
    arrayOfCommands,
    {
      cwd: CWD,
      stdio: 'inherit',
    },
  );

  processInfo.on('exit', (code) => {
    if (code === 0) resolve();
  
    else {
      reject(new Error(`Process exit with error ${code}`));
    }
  });
});

const executeCommand = async (command) => {
  try {
    const { stdout } = await asyncExec(command);
  
    return stdout;
  } catch (error) {
    return {
      message: 'Error on executeCommand',
      error,
    };
  }
};

const executeCommandIteractive = async (command, CWD = './') => {
  const commands = command.split(' ');

  const mainCommand = commands[0];
  const options = commands.splice(1);

  try {
    await asyncSpawn(mainCommand, options, CWD);
  } catch (error) {
    return error;
  }
};

module.exports = {
  executeCommand,
  executeCommandIteractive,
};