const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa o CORS
const path = require('path');


const app = express();
app.use(cors()); // Habilita o CORS
app.use(bodyParser.json());


// Configuração para servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Configuração para aceitar requisições JSON
app.use(express.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'eleicao'
});

// Conexão ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados com sucesso');
});

app.post('/candidato', (req, res) => {
    const { nome, idade = null, foto = null, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ message: 'Nome e descrição são obrigatórios' });
    }

    const query = 'INSERT INTO candidatos (nome, idade, foto, descricao) VALUES (?, ?, ?, ?)';
    db.query(query, [nome, idade, foto, descricao], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar candidato:', err);
            return res.status(500).json({ error: 'Erro ao cadastrar candidato' });
        }
        res.status(201).json({ message: 'Candidato cadastrado com sucesso', id: result.insertId });
    });
});

app.get('/candidatos', (req, res) => {
    const query = 'SELECT id_candidato, nome, idade, foto, descricao FROM candidatos WHERE id_candidato != -1';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar candidatos:', err);
            return res.status(500).json({ error: 'Erro ao buscar candidatos' });
        }
        res.status(200).json(results);
    });
});


// Detalhes de um candidato
app.get('/candidato/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM candidatos WHERE id_candidato = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar candidato:', err);
            return res.status(500).json({ error: 'Erro ao buscar candidato' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Candidato não encontrado' });
        }
        res.status(200).json(results[0]);
    });
});

// ---> ROTAS PARA USUÁRIOS <---

// Cadastrar usuário
app.post('/usuario', (req, res) => {
    const { nome, ra, senha, voto } = req.body;

    if (!nome || !ra || !senha || !voto) {
        return res.status(400).json({ message: 'Nome, senha e RA são obrigatórios' });
    }

    const query = 'INSERT INTO usuarios (nome, ra, senha, voto) VALUES (?, ?, ?, ?)';
    db.query(query, [nome, ra, senha, voto], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
        }
        res.status(201).json({ message: 'Usuário cadastrado com sucesso', id: result.insertId });
        
    });
});

// Login do usuário
app.post('/login', (req, res) => {
    const { ra, senha } = req.body;

    if (!ra || !senha) {
        return res.status(400).json({ message: 'RA e senha são obrigatórios' });
    }

    const query = 'SELECT id_usuario, nome, senha FROM usuarios WHERE ra = ?';
    db.query(query, [ra], (err, results) => {
        if (err) {
            console.error('Erro ao realizar login:', err);
            return res.status(500).json({ error: 'Erro ao realizar login' });
        }
        if (results.length === 0 || results[0].senha !== senha) {
            return res.status(401).json({ message: 'RA ou senha incorretos' });
        }
        res.status(200).json({
            message: 'Login realizado com sucesso',
            usuario: {
                id: results[0].id_usuario,
                nome: results[0].nome
            }
        });
    });
});

// Perfil do usuário
app.get('/perfil/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT id_usuario, nome, ra, voto FROM usuarios WHERE id_usuario = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar perfil:', err);
            return res.status(500).json({ error: 'Erro ao buscar perfil' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(results[0]);
    });
});

// Votar em um candidato
app.post('/votar', (req, res) => {
    const { id_candidato, id_usuario  } = req.body;  // Recebe o ID do usuário e o candidato

    // Verifica se ambos os dados foram passados
    if (!id_usuario || !id_candidato) {
        return res.status(400).json({ message: 'Id de usuário ou candidato não encontrados' });
    }

    // Atualiza o voto do usuário
    const query = 'UPDATE usuarios SET voto = ? WHERE id_usuario = ?';
    db.query(query, [id_candidato, id_usuario], (err, results) => {
        if (err) {
            console.error('Erro ao registrar voto:', err);
            return res.status(500).json({ error: 'Erro ao registrar voto' });
        }

        // Se o usuário não foi encontrado, retorna erro
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({
            message: 'Voto registrado com sucesso!'
        });
    });
});

// Resultados de votação
app.get('/resultados', (req, res) => {
    const queryCandidatos = `
        SELECT c.id_candidato, c.nome AS nome_candidato, COUNT(u.voto) AS total_votos
        FROM candidatos c
        LEFT JOIN usuarios u ON c.id_candidato = u.voto
        WHERE c.id_candidato != -1
        GROUP BY c.id_candidato, c.nome
    `;

    const queryTotalUsuarios = `
        SELECT COUNT(*) AS total_usuarios FROM usuarios
    `;

    const queryVotosFeitos = `
        SELECT COUNT(*) AS votos_feitos FROM usuarios WHERE voto IS NOT NULL AND voto != -1
    `;

    db.query(queryCandidatos, (err, candidatos) => {
        if (err) {
            console.error('Erro ao carregar resultados dos candidatos:', err);
            return res.status(500).json({ error: 'Erro ao carregar resultados' });
        }

        db.query(queryTotalUsuarios, (err, totalUsuariosResult) => {
            if (err) {
                console.error('Erro ao carregar total de usuários:', err);
                return res.status(500).json({ error: 'Erro ao carregar total de usuários' });
            }

            db.query(queryVotosFeitos, (err, votosFeitosResult) => {
                if (err) {
                    console.error('Erro ao carregar votos feitos:', err);
                    return res.status(500).json({ error: 'Erro ao carregar votos feitos' });
                }

                const totalUsuarios = totalUsuariosResult[0].total_usuarios;
                const votosFeitos = votosFeitosResult[0].votos_feitos;

                res.json({
                    resultados: candidatos,
                    totalUsuarios,
                    votosFeitos
                });
            });
        });
    });
});




// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});