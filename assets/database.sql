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
("Breno", 30, 'img/candidato1.png', "Mensagem legal de candidatura"),
("Luisa", 25, 'img/candidato2.png', "Mensagem legal de candidatura"),
("Bianca", 20,'img/candidato3.png', "Mensagem legal de candidatura"),
("Pedro", 21, 'img/candidato4.png', "Mensagem legal de candidatura");

INSERT INTO usuarios(nome, email, voto, idade) VALUES
("Teste 1", "teste@gmail.com", 1, 15),
("Teste 2", "teste@gmail.com", 2, 15),
("Teste 3", "teste@gmail.com", 2, 15),
("Teste 4", "teste@gmail.com", 3, 15),
("Teste 5", "teste@gmail.com", 1, 15)


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
