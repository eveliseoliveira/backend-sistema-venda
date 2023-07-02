const express = require('express');
const connection = require('../connection');
const router = express.Router();
var autenticacao = require('../services/autenticacao');

router.get('detalhes', autenticacao.tokenAutenticacao, (req, res, next) => {
  var categoriaContagem;
  var produtoContagem;
  var contaContagem;
  var query = "select contagem(id) as categoriaContagem from categoria";
  connection.query(query, (err, results) => {
    if (!err) {
      categoriaContagem = results[0].categoriaContagem;
    }
    else {
      return res.status(500).json(err);
    }
  })

  var query = "select contagem(id) as produtoContagem from produto";
  connection.query(query, (err, results) => {
    if (!err) {
      produtoContagem = results[0].produtoContagem;
    }
    else {
      return res.status(500).json(err);
    }
  })

  var query = "select contagem(id) as contaContagem from conta";
  connection.query(query, (err, results) => {
    if (!err) {
      contaContagem = results[0].contaContagem;
      var data = {
        categoria: categoriaContagem,
        produto: produtoContagem,
        conta: contaContagem
      };
      return res.status(200).json(data);
    }
    else {
      return res.status(500).json(err);
    }
  })
})

module.exports = router;