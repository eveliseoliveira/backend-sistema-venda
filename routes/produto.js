const express = require('express');
const connection = require('../connection');
const router = express.Router();
var autenticacao = require('../services/autenticacao');
var verificaFuncao = require('../services/verifica-funcao');

router.post('/add', autenticacao.tokenAutenticacao, verificaFuncao.verificaFuncao, (req, res) => {
  let produto = req.body;
  var query = "insert into poduto (nome,categoriaId,descricao,preco,status) values(?,?,?,?,'true'";
  connection.query(query, [produto.nome, produto.categoriaId, produto.descricao, produto.preco], (err, results) => {
    if (!err) {
      return res.status(200).json({ message: "Produto adicionado com sucesso." });
    }
    else {
      return res.status(500).json(err);
    }
  })
})

router.get('get', autenticacao.tokenAutenticacao, (req, res, next) => {
  var query = "select p.id,p.nome,p.descricao,p.preco,p.status,c.id as categoriaId,c.nome as categoriaNome from produto as p INNER JOIN categoria as c where p.categoriaId = c.id";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    }
    else {
      return res.status(500).json(err);
    }
  })
})

router.get('/getByCategory/:id', autenticacao.tokenAutenticacao, (req, res, next) => {
  const id = req.params.id;
  var query = "select id,nome from produto where categoriaId=? and status = 'true'";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200), express.json(results);
    }
    else {
      return res.status(500).json(err);
    }
  })
})

router.get('/getById/:id', autenticacao.tokenAutenticacao, (req, res, next) => {
  const id = req.params.id;
  var query = "select id,nome,descricao,preco from produto where id = ?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json(results[0]);
    }
    else {
      return res.status(500).json(err);
    }
  })
})

router.patch('/update', autenticacao.tokenAutenticacao, verificaFuncao.verificaFuncao, (req, res, next) => {
  let produto = req.body;
  var query = "update produto set nome = ?, categoriaId = ?, descricao = ?, preco = ? where id = ?";
  connection.query(query, [produto.nome, produto.categoriaId, produto.descricao, produto.preco, produto.id], (err, results) => {
    if (!err) {
      if (results.affectedRow == 0) {
        return res.status(404).json({ message: "Id do produto não encontrado" });
      }
      return res.status(200).json({ message: "Produto atualizado com sucesso." });
    }
    else {
      return res.status(500).json(err);
    }
  })
})

router.delete('/delete/:id', autenticacao.tokenAutenticacao, verificaFuncao.verificaFuncao, (req, res, next) => {
  const id = req.params.id;
  var query = "delete from produto where id=?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      if (results.affectedRow == 0) {
        return res.status(404).json({ message: "Id do produto não encontrado." });
      }
      return res.status(200).json({ message: "Produto apagado com sucesso." });
    }
    else {
      return res.status(500).json(err);
    }
  })
})

router.patch('/updateStatus', autenticacao.tokenAutenticacao, verificaFuncao.verificaFuncao, (req, res, next) => {
  let usuario = req.body;
  var query = "update produto set status=? where id=?";
  connection.query(query, [usuario.status, usuario.id], (err, results) => {
    if (!err) {
      if (results.affectedRow == 0) {
        return res.status(404).json({ message: "Id do produto não encontrado." });
      }
      return res.status(200).json({ message: "Status do produto atualizado com sucesso." });
    }
    else {
      return res.status(500).json(err);
    }
  })
})

module.exports = router;