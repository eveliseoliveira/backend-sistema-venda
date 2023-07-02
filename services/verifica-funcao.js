require('dotenv').config();

function verificaFuncao(req, res, next) {
  if (res.locals.funcao == process.env.USUARIO)
    res.sendStatus(401)
  else
    next()
}

module.exports = { verificaFuncao: verificaFuncao }