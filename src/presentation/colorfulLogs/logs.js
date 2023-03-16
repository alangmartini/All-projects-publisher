function logYellowBigBold(message) {
  console.log(`\x1b[33m\x1b[1m${message}\x1b[0m`);
}

function logGreenBigBold(message) {
  console.log(`\x1b[32m\x1b[1m${message}\x1b[0m`);
}

function logRedBigBold(message) {
  console.log(`\x1b[31m\x1b[1m${message}\x1b[0m`);
}

module.exports = {
  logYellowBigBold,
  logGreenBigBold,
  logRedBigBold,
};