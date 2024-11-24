const express = require('express');
const db = require('./db')
const app = express();
const bcrypt = require('bcrypt'); // Importa bcrypt para hash de senha

// Configurar middleware para JSON
app.use(express.json());

// Rota para testar o server
app.get('/', (req, res) => {
    res.send('Servidor funcionando!');
});

//---> ROTAS PARA CANDIDATOS <---

//Cadastrar candidato
app.post('/candidato', (req, res) => {
    const { nome, idade=null, foto=null, descricao } = req.body;
    const query = 'INSERT INTO candidatos (nome, idade, foto, descricao) VALUES (?, ?, ?, ?)';

    db.query(query, [nome, idade, foto, descricao], (err, result) => {
        if (err) {
            res.status(500).send({ error: 'Erro ao cadastrar candidato' });
        } else {
            res.status(201).send({ message: 'Candidato cadastrado com sucesso', id: result.insertId });
        }
    });
});

//Listar candidatos
app.get('/candidatos', (req, res) => {
    const query = 'SELECT * FROM candidatos';

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Erro ao listar candidatos' });
        } else {
            res.send({ candidatos: results });
        }
    });
});

// Rota para obter detalhes de um candidato
app.get('/candidato/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM candidatos WHERE id_candidato = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Erro ao buscar candidato' });
        } else if (results.length === 0) {
            res.status(404).send({ message: 'Candidato não encontrado' });
        } else {
            res.send(results[0]); // Retorna o candidato encontrado
        }
    });
});

//---> ROTAS PARA USUÁRIOS <---

//Cadastrar Usuário
app.post('/usuario', (req, res) => {
    const {nome, email, idade, senha, ra} = req.body;
    if (!nome) {
        return res.status(400).send({error: 'Nome é um campo obrigatório'})
    } else if (!email) {
        return res.status(400).send({error: 'E-mail é um campo obrigatório'})
    } else if (!senha) {
        return res.status(400).send({error: 'Senha é um campo obrigatório'})
    } else if (!ra) {
        return res.status(400).send({error: 'RA é um campo obrigatório'})
    }
    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) {
            return res.status(500).send({error : 'Erro ao criptografar senha'});
        }
        
        const query = 'INSERT INTO usuarios (ra, nome, email, idade, senha) VALUES (?, ?, ?, ?, ?)';

        // Define idade como NULL se não for enviada
        const idadeFinal = idade || null;
                
        db.query(query, [ra, nome, email, idadeFinal, hash], (err, result) => {
            if (err) {
                res.status(500).send({ error: 'Erro ao cadastrar usuário' });
            } else {
                res.status(201).send({ message: 'Usuário cadastrado com sucesso', id: result.insertId });
            }
        });
    });
});

// Rota para autenticação de login
app.post('/login', (req, res) => {
    const { ra, senha } = req.body; // Recebe RA e senha do cliente
    const query = 'SELECT id_usuario, nome, email, senha FROM usuarios WHERE ra = ?';

    db.query(query, [ra], (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Erro ao realizar login' });
        } else if (results.length === 0) {
            res.status(401).send({ message: 'RA ou Senha incorretos' });
        } else {
            // Verifica se a senha é válida
            bcrypt.compare(senha, results[0].senha, (err, isMatch) => {
                if (err) {
                    res.status(500).send({ error: 'Erro ao comparar senha'})
                } else if (!isMatch) {
                    res.status(401).send({ error: 'RA ou Senha incorretos' });
                } else {
                    // Enviamos os dados do usuário autenticado
                    res.send({
                        message: 'Login realizado com sucesso',
                        usuario: {
                            id: results[0].id_usuario,
                            nome: results[0].nome,
                            email: results[0].email,
                        }
                    });
                }
            });
        }
    });
});

// Adicionar rota para buscar perfil de usuário
app.get('/perfil/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT id_usuario, nome, email, idade, voto
        FROM usuarios
        WHERE id_usuario = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Erro ao buscar dados do perfil' });
        } else if (results.length === 0) {
            res.status(404).send({ message: 'Usuário não encontrado' });
        } else {
            res.send(results[0]); // Retorna os dados do usuário encontrado
        }
    });
});

// Rota para desconectar usuário
app.post('/logout', (req, res) => {
    res.clearCookie('connect.sid'); // Apenas remove cookies, se necessário
    res.send({ message: 'Logout realizado com sucesso!' });
});


// Rota para registrar um voto
app.post('/votar', (req, res) => {
    const { id_usuario, id_candidato } = req.body;

    // Verificar se o usuário já votou
    const verificarQuery = 'SELECT voto FROM usuarios WHERE id_usuario = ?';
    db.query(verificarQuery, [id_usuario], (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Erro ao verificar voto do usuário' });
        } else if (results.length === 0) {
            res.status(404).send({ message: 'Usuário não encontrado' });
        } else if (results[0].voto !== null) {
            res.status(409).send({ message: 'Usuário já votou' });
        } else {
            // Registrar o voto
            const votarQuery = 'UPDATE usuarios SET voto = ? WHERE id_usuario = ?';
            db.query(votarQuery, [id_candidato, id_usuario], (err) => {
                if (err) {
                    res.status(500).send({ error: 'Erro ao registrar voto' });
                } else {
                    res.send({ message: 'Voto registrado com sucesso!' });
                }
            });
        }
    });
});

// Rota para exibir o total de votos por candidato
app.get('/resultados', (req, res) => {
    const query = `
        SELECT 
            c.id_candidato,
            c.nome AS nome_candidato,
            COUNT(u.voto) AS total_votos
        FROM 
            candidatos c
        LEFT JOIN 
            usuarios u ON c.id_candidato = u.voto
        GROUP BY 
            c.id_candidato, c.nome;
    `;

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Erro ao buscar resultados' });
        } else {
            res.send({ resultados: results });
        }
    });
});

// Porta do servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

//Listar usuários (Contagem de votos)
// app.get('/usuarios', (req, res) => {
//     const query = 'SELECT * FROM usuarios';

//     db.query(query, (err, results) => {
//         if (err) {
//             res.status(500).send({ error: 'Erro ao listar usuários' });
//         } else {
//             res.send({ data: results });
//         }
//     });
// });

// // Atualizar voto
// app.put('/voto/:id', (req, res) => {
//     const { id } = req.params;
//     const { voto } = req.body;
//     const query = 'UPDATE usuarios SET voto = ? WHERE id_usuario = ?';

//     db.query(query, [voto, id], (err, result) => {
//         if (err) {
//             res.status(500).send({ error: 'Erro ao registrar voto' });
//         } else {
//             res.send({ message: `Voto do usuário ${id} registrado com sucesso` });
//         }
//     });
// });

// Deletar item
//app.delete('/item/:id', (req, res) => {
//    const { id } = req.params;
//    const query = 'DELETE FROM tabela_itens WHERE id = ?';
//
//    db.query(query, [id], (err, result) => {
//        if (err) {
//            res.status(500).send({ error: 'Erro ao deletar item' });
//        } else {
//            res.send({ message: `Item ${id} deletado com sucesso` });
//        }
//    });
//});