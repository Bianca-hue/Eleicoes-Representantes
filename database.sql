DROP DATABASE eleicao;
CREATE DATABASE eleicao;
USE eleicao;

CREATE TABLE candidatos(
id_candidato int AUTO_INCREMENT PRIMARY KEY,
nome varchar(200) NOT NULL,
idade int(3) NOT NULL,
foto varchar(255) NOT NULL,
descricao varchar(500) NOT NULL
);

CREATE TABLE usuarios(
id_usuario int AUTO_INCREMENT PRIMARY KEY,
nome varchar(100) NOT NULL,
email varchar(200) NOT NULL, 
voto int DEFAULT NULL, 
idade int(3) NOT NULL,
FOREIGN KEY (voto) references candidatos(id_candidato)
);

INSERT INTO candidatos(nome, idade, foto, descricao) VALUES 
("Luiz", 30, 'img/candidato1.png', "to cansada quero dormir to com sono xoxa capenga e anemica"),
("Luiza", 25, 'img/candidato2.png', "Oi bom dia"),
("Bianca", 20,'img/candidato3.png', "To com fome"),
("Breno", 21, 'img/candidato4.png', "Oi");
