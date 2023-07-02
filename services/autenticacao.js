require('dotenv').config()
const jwt = require('jsonwebtoken');
const { response } = require('..');

function tokenAutenticacao(req, res, next) {
  const headerAutenticacao = req.headers['autorizacao']
  const token = headerAutenticacao && headerAutenticacao.split(' ')[1]
  if (token == null)
    return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
    if (err)
      return res.sendStatus(403);
    res.locals = response;
    next()
  })
}