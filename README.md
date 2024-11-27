# Sistema de Eleições de Representantes

Este projeto é um sistema de votação para eleições de representantes, permitindo que os usuários se registrem, façam login, votem e vejam os resultados.

## Requisitos

Antes de começar, você precisará ter os seguintes programas instalados em sua máquina:

- **Node.js** (https://nodejs.org)
- **MySQL** (https://www.mysql.com)

## Configuração do Banco de Dados

1. Certifique-se de que o servidor MySQL está rodando. 
2. Crie um banco de dados database.sql no MySQL.  
3. Verifique se as configurações de conexão do banco de dados no arquivo `index.js` estão corretas:
   ```javascript
   const db = mysql.createConnection({
       host: 'localhost',
       user: 'seu_usuario',
       password: 'sua_senha',
       database: 'eleicoes'
   });
   ```

## Inicializando o Servidor

1. Instale as dependências do projeto:
   ```bash
   npm install
   ```
2. Inicie o servidor Node.js:
   ```bash
   node index.js
   ```

Se tudo estiver configurado corretamente, o servidor será iniciado e estará escutando na porta 3000 por padrão.

## Acessando o Sistema

- Abra o navegador e acesse: [http://localhost:3000](http://localhost:3000).

## Recursos

- Cadastro de usuários
- Login de usuários
- Votação
- Exibição de resultados
