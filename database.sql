DROP DATABASE eleicao;
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
    ra varchar(9) NOT NULL,
    senha varchar(255) NOT NULL,
    voto int DEFAULT NULL, 
    FOREIGN KEY (voto) references candidatos(id_candidato)
);

INSERT INTO candidatos(nome, idade, foto, descricao) VALUES 
("Breno", 15, 'img/candidato1.png', "Mensagem legal de candidatura"),
("Luisa", 15, 'img/candidato2.png', "Mensagem legal de candidatura"),
("Bianca", 15,'img/candidato3.png', "Mensagem legal de candidatura"),
("Pedro", 15, 'img/candidato4.png', "Mensagem legal de candidatura");

INSERT INTO usuarios(nome, ra, senha, voto) VALUES
("Rui", 2, 123456789, 1),
("Ana", 1, 123456789, 1),
("Carlos", 3, 123456789, 1),
("Camila", 1, 123456789, 1),
("Lucas", 4, 123456789, 1),
("Lucia", 4, 123456789, 1),
("Dimitri", 3, 123456789, 1),
("Daniela", 1, 123456789, 1),
("Julio", 2, 123456789, 1),
("Julia", 2, 123456789, 1),
("Marcos", 3, 123456789, 1),
("Marcia", 2, 123456789, 1);

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
