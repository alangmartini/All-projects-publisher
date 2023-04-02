const { logYellowBigBold, logRedBigBold } = require('../../userInteraction/colorfulLogs/logs');
const business = require('../../business-rules');

async function deleteRepository(repository) {
  logYellowBigBold('Deletando repositório clonado');

  const error = await business.removeFolder(repository);
    
  if (error) {
    logRedBigBold('Algo deu errado ao deletar o repositorio!');
  }
}

module.exports = {
  deleteRepository,
};