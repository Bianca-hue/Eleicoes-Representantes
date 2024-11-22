const mysql = require('mysql2');

// Configurar a conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',    // Substitua pelo endereço do servidor MySQL
    user: 'root',  // Seu usuário do MySQL
    password: '',// Sua senha do MySQL
    database: 'eleicao' // O nome do banco de dados
});

// Testar a conexão
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.message);
    } else {
        console.log('Conexão bem-sucedida com o banco de dados MySQL!');
    }
});

module.exports = connection;