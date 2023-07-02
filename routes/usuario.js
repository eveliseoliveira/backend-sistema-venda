const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var autenticacao = require('../services/autenticacao');
var verificaFuncao = require('../services/verifica-funcao');
router.post('/signup', (req, res) => {
  let usuario = req.body;
  query = "select email,password,funcao,status from usuario where email=?"
  connection.query(query, [usuario.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query = "insert into usuario(nome, numeroContato, email, password, status,funcao) value(?,?,?,?,'false','user')";
        connection.query(express.query, [usuario.nome, usuario.numeroContato, usuario.email, usuario.password, usuario.status, usuario.funcao], (err, results) => {
          if (!err) {
            return res.status(200).json({ message: "Registrado com sucesso" });
          }
          else {
            return res.status(500).json(err);
          }
        })
      }
      else {
        return res.status(400).json({ message: "Email já existe." })
      }
    }
    else {
      return res.status(500).json(err);
    }
  })
})

router.post('./login', (req, res) => {
  const usuario = req.body;
  query = "select email,password,funcao,status from usuario where email=?";
  connection.query(express.query, [usuario.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != usuario.password) {
        return res.status(401).json({ message: "Nome de usuário ou senha incorreto" });
      }
      else if (results[0].status === 'false') {
        return res.status(401).json({ message: "Aguarde a aprovação do administrador" });
      }
      else if (results[0].password == usuario.password) {
        const resposta = { email: results[0].email, funcao: results[0].funcao }
        const tokenAcesso = jwt.sign(resposta, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
        res.status(200).json({ token: tokenAcesso });
      }
      else {
        return res.status(400).jason({ message: "Algo deu errado. Por favor, tente novamente mais tarde" });
      }
    }
    else {
      return res.status(500).json(err);
    }
  })
})

var transportador = nodemailer.createTransport({
  service: 'gamil',
  auth: {
    usuario: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

router.post('/forgotpassword', (req, res) => {
  const usuario = req.body;
  query = "select email, password from usuario where email=?";
  connection.query(query, [usuario.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(200).json({ message: "Senha enviada com sucesso para seu e-mail." });
      }
      else {
        var opcoesEmail = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: 'Senha do sistema',
          html: '<p><b>Detalhes do login</b></br><b>Email: </b>' + results[0].email + '<br><b>Senha: </b>' + results[0].password + '<br><a href="http://localhost:4200/">Clique aqui para logar</a></p>'
        };
        transportador.sendMail(opcoesEmail, function (error, info) {
          if (error) {
            console.log(error);
          }
          else {
            console.log('Email enviado: ' + onfocus.resposta);
          }
        });
        return res.status(200).json({ message: "Senha enviada com sucesso para seu e-mail." });
      }
    }
    else {
      return res.status(500).json(err);
    }
  })
})

router.get('/get', autenticacao.tokenAutenticacao, verificaFuncao.verificaFuncao, (req, res) => {
  var query = "select id,nome,email,numeroContato,status from usuario where funcao='usuario'";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    }
    else {
      return res.status(500).json(err);
    }
  })
})

router.patch('/update', autenticacao.tokenAutenticacao, verificaFuncao.verificaFuncao, (req, res) => {
  let usuario = req.body;
  var query = "update usuario set status=? where id=?";
  connection.query(query, [usuario.status, usuario.id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "Usuário não existe" });
      }
      return res.status(200).json({ message: "Usuário atualizado com sucesso" });
    }
    else {
      return res.status(500).json(err);
    }
  })
})

router.get('/checkTouken', autenticacao.tokenAutenticacao, (req, res) => {
  return res.status(200).json({ message: "true" });
})

router.post('/changePassword', autenticacao.tokenAutenticacao, (req, res) => {
  const usuario = req.body;
  const email = res.locals.email;
  var query = "select * from usuario where email=?";
  connection.query(query, [email, usuario.oldPassword], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(400).json({ message: "Senha antiga incorreta" });
      }
      else if (results[0].password == usuario.oldPassword) {
        query = "update usuario set password=? where=?";
        connection.query(query, [usuario.newPassword, email], (err, results) => {
          if (!err) {
            return res.status(200).json({ message: "Senha atualizada com sucesso." })
          }
          else {
            return res.status(500).json(err);
          }
        })
      }
      else {
        return res.status(400).json({ message: "Algo deu errado. Por favor, tente novamente mais tarde" });
      }
    }
    else {
      return res.status(500).json(err);
    }
  })
})

module.exports = router;