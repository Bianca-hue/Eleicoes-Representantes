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
    email varchar(255) NOT NULL, 
    ra varchar(9) NOT NULL,
    idade int(3) NOT NULL,
    senha varchar(255) NOT NULL;    
    voto int DEFAULT NULL--, 
    -- FOREIGN KEY (voto) references candidatos(id_candidato)
);

INSERT INTO candidatos(nome, idade, foto, descricao) VALUES 
("Breno", 15, 'img/candidato1.png', "Mensagem legal de candidatura"),
("Luisa", 15, 'img/candidato2.png', "Mensagem legal de candidatura"),
("Bianca", 15,'img/candidato3.png', "Mensagem legal de candidatura"),
("Pedro", 15, 'img/candidato4.png', "Mensagem legal de candidatura");

INSERT INTO usuarios(nome, email, voto, idade, ra, senha) VALUES
("Rui", "rui@gmail.com", 2, 15, 123456789, 123456),
("Ana", "ana@gmail.com", 1, 15, 123456789, 123456),
("Carlos", "carlosgmail.com", 3, 15, 123456789, 123456),
("Camila", "camila@gmail.com", 1, 15, 123456789, 123456),
("Lucas", "lucas@gmail.com", 4, 15, 123456789, 123456),
("Lucia", "lucia@gmail.com", 4, 15, 123456789, 123456),
("Dimitri", "dimitri@gmail.com", 3, 15, 123456789, 123456),
("Daniela", "daniela@gmail.com", 1, 15, 123456789, 123456),
("Julio", "julio@gmail.com", 2, 15, 123456789, 123456),
("Julia", "julia@gmail.com", 2, 15, 123456789, 123456),
("Marcos", "marcos@gmail.com", 3, 15, 123456789, 123456),
("Marcia", "marcia@gmail.com", 2, 15, 123456789, 123456);


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
