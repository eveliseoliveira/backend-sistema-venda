const express = require('express');
const connection = require('../connection');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var autenticacao = require('../services/autenticacao');

router.post('/generateReport', autenticacao.tokenAutenticacao, (req, res) => {
  const gerarUuid = uuid.v1();
  const detalhesPedido = req.body;
  var detalhesProdutoReport = JSON.parse(detalhesPedido.detalheProduto);

  query = "insert into conta (nome,uuid,email,numeroContato,formaPagamento,total,detalheProduto,fabricante) values(?,?,?,?,?,?,?,?)";
  connection.query(query, [detalhesPedido.nome, gerarUuid, detalhesPedido.email, detalhesPedido.numeroContato, detalhesPedido.formaPagamento, detalhesPedido.valorTotal, detalhesPedido.detalheProduto, res.locals.email], (err, results) => {
    if (!err) {
      ejs.renderFile(path.json(__dirname, '', "relatorio.ejs"), {
        detalheProduto: detalhesProdutoReport, nome: detalhesPedido.nome,
        email: detalhesPedido.email, numeroContato: detalhesPedido.numeroContato, formaPagamento: detalhesPedido.formaPagamento,
        valorTotal: detalhesPedido.valorTotal
      }, (err, results) => {
        if (err) {
          return res.status(500).json(err);
        }
        else {
          pdf.create(results).toFile('./gera-pdf/' + detalhesPedido.uuid + ".pdf", function (err, data) {
            if (err) {
              console.log(err);
              return res.status(500).json(err);
            }
            else {
              res.contentType("aplicacao/pdf");
              fs.createReadStream(pdfCaminho).pipe(res);
            }
          })
        }
      })
    }
    else {
      return res.status(500).json(err);
    }
  })
})

router.post('/getPdf', autenticacao.tokenAutenticacao, function (req, res) {
  const detalhesPedido = req.body;
  const pdfCaminho = './gera-pdf/' + detalhesPedido.uuid + '.pdf';
  if (fs.existsSync(pdfCaminho)) {
    res.contentType("aplicacao/pdf");
    fs.createReadStream(pdfCaminho).pipe(res);
  }
  else {
    var detalhesProdutoReport = JSON.parse(detalhesPedido.detalheProduto);
  }
})

router.get('/getContas', autenticacao.tokenAutenticacao, (req, res, next) => {
  var query = "select * from conta order by id DESC";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    }
    else {
      return res.status(500).json(err);
    }
  })
})

router.delete('/delete/:id', autenticacao.tokenAutenticacao, (req, res, next) => {
  const id = req.params.id;
  var query = "delete from conta where id=?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "Id da conta não encontrado." });
      }
      return res.status(200).json({ message: "Conta deletada com sucesso." });
    }
    else {
      return res.status(500).json(err);
    }
  })
})

module.exports = router;