const express = require("express");
var cors = require('cors');
const connection = require('./connection');
const usuarioRoute = require('./routes/usuario');
const categoriaRoute = require('./routes/categoria');
const productRouts = require('./routes/produto');
const contaRoute = require('./routes/conta');
const dashboardRoute = require('./routes/dashboard');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/usuario', usuarioRoute);
app.use('/categoria', categoriaRoute);
app.use('/product', productRouts);
app.use('/conta', contaRoute);
app.use('/dashboard', dashboardRoute);

module.exports = app;