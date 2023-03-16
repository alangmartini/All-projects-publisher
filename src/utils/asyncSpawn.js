const { spawn } = require('child_process');

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
    if (code === 0) {
      resolve();
    } else {
      reject(new Error(`Process exit with error ${code}`));
    }
  });
});

module.exports = {
  asyncSpawn,
};
