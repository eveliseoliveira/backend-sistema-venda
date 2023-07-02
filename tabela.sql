create table usuario(
  id int primary key AUTO_INCREMENT,
  nome varchar(200),
  numeroContato varchar(20),
  email varchar(50),
  password varchar(200),
  status varchar(20),
  funcao varchar(20),
  UNIQUE (email)
);

insert into usuario(nome, numeroContato, email, password, status, funcao) values('Admin','123456789','teste@gmail.com','987','true','admin')

create table categoria(
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(200) NOT NULL,
  primary key(id)
);

create table produto(
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(200) NOT NULL,
  categoriaId integer NOT NULL,
  descricao varchar(200),
  prece integer,
  status varchar(20),
  primary key(id)
);

create table conta(
  id int NOT NULL AUTO_INCREMENT,
  uuid varchar(200) NOT NULL,
  nome varchar(200) NOT NULL,
  email varchar(200) NOT NULL,
  numeroContato varchar(20) NOT NULL,
  formaPagamento varchar(50) NOT NULL,
  total int NOT NULL,
  detalheProduto JSON DEFAULT NULL,
  fabricante varchar(200) NOT NULL,
  primary key(id)
);