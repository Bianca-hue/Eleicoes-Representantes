DROP DATABASE IF EXISTS eleicao;
CREATE DATABASE eleicao;
USE eleicao;

CREATE TABLE candidatos(
    id_candidato int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(200) NOT NULL,
    idade int(3) NULL,
    foto varchar(255) NULL,
    descricao varchar(500) NOT NULL
);

CREATE TABLE usuarios(
    id_usuario int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) NOT NULL,
    ra varchar(9) UNIQUE KEY NOT NULL,
    senha varchar(255) NOT NULL,
    voto int DEFAULT NULL, 
    FOREIGN KEY (voto) references candidatos(id_candidato)
);

INSERT INTO candidatos(id_candidato, nome, idade, foto, descricao) VALUES 
(-1, "Nulo", 0, '', "nulo" );

INSERT INTO candidatos(nome, idade, foto, descricao) VALUES 
("Bianca", 15, 'img/bianca.png', "Mensagem legal de candidatura"),
("Isabella", 15, 'img/isabella.png', "Mensagem legal de candidatura"),
("Vitor", 15,'img/vitor.png', "Mensagem legal de candidatura"),
("Marcos", 15, 'img/marcos.png', "Mensagem legal de candidatura");

INSERT INTO usuarios(nome, ra, senha, voto) VALUES
("Rui", 122, 122, 1);


SELECT 
    c.id_candidato,
    c.nome AS nome_candidato,
    COUNT(u.voto) AS total_votos
FROM 
    candidatos c
LEFT JOIN 
    usuarios u
ON 
    c.id_candidato = u.voto
GROUP BY 
    c.id_candidato, c.nome;
