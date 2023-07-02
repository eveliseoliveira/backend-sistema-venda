const express = require('express');
const connection = require('../connection');
const router = express.Router();
var autenticacao = require('../services/autenticacao');
var verificaFuncao = require('../services/verifica-funcao');

router.post('/add',autenticacao.tokenAutenticacao,verificaFuncao.verificaFuncao,(req,res,next)=>{
  let categoria = req.body;
  query = "insert into categoria (nome) values(?)";
  connection.query(query[categoria.nome],(err,results)=>{
    if(!err){
      return res.status(200).json({message:"Categoria adicionada com sucesso"});
    }
    else{
      return res.status(500).json(err);
    }
  })
})

router.get('/get',autenticacao.tokenAutenticacao,(req,res,next)=>{
  var query = "select * from categoria order by name";
  connection.query(query,(err,results)=>{
    if(!err){
      return res.status(200).json(results);
    }
    else{
      return res.status(500).json(err);
    }
  })
})

router.patch('/update',autenticacao.tokenAutenticacao,verificaFuncao.verificaFuncao,(req,res,next)=>{
  let produto = req.body;
  var query = "update categoria set nome=? where id=?";
  connection.query(query,[produto.nome,produto.id],(err,results)=>{
    if(!err){
      if(results.affectedRows == 0){
        return res.status(404).json({message:"Categoria id não encontrada."});
      }
      return res.status(200).json({message:"Categoria atualizada com sucesso."});
    }
  })
})

module.exports = router;