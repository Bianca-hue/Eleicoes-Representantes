// URL base do backend
const apiUrl = "http://localhost:3000";

async function inserirUsuario() {
    const nome = document.getElementById("nome").value;
    const ra = document.getElementById("ra").value;
    const senha = document.getElementById("senha").value;
    const voto = -1;

    // Verifica se os campos estão preenchidos
    if (!nome || !ra || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    try {
        // Faz a requisição para o backend
        const response = await fetch('http://localhost:3000/usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, ra, senha, voto })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Mostra a mensagem de sucesso
            // Redireciona ou limpa os campos do formulário, se necessário
            window.location.href = '/index.html';
        } else {
            alert(result.error || result.message); // Mostra a mensagem de erro
        }
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        alert("Erro ao conectar ao servidor.");
    }
}

async function login() {
    const ra = document.getElementById("ra").value;
    const senha = document.getElementById("senha").value;

    if (!ra || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ra, senha })
        });

        const result = await response.json();

        console.log(result);  // Log da resposta para diagnóstico

        if (response.ok) {
            // Armazenando o id_usuario e ra no localStorage
            localStorage.setItem('id_usuario', result.usuario.id);  // Corrigido aqui
            localStorage.setItem('ra', ra);  // O RA é o valor enviado pelo usuário

            alert(result.message);
            window.location.href = '/Candidatos.html';
        } else {
            alert(result.error || result.message);
        }
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        alert("Erro ao conectar ao servidor.");
    }
}

function votar(idCandidato) {
    // Aqui você deve pegar o ID do usuário, talvez do localStorage ou de um cookie
    const idUsuario = localStorage.getItem('id_usuario');  // Exemplo, certifique-se de ter o ID do usuário armazenado

    if (!idUsuario) {
        alert("Usuário não encontrado ou não autenticado!");
        return;
    }

    const data = {
        id_candidato: idCandidato,
        id_usuario: idUsuario
    };

    fetch(`${apiUrl}/votar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);  // Exibe a mensagem retornada do servidor
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao registrar voto. Tente novamente.');
        });
}

// Resultados
document.addEventListener('DOMContentLoaded', async () => {

    try {
        const response = await fetch(`${apiUrl}/resultados`);
        const data = await response.json();

        if (data.resultados) {
            const candidatosContainer = document.querySelector('.candidates');
            const totalVotesChart = document.querySelector('.chart span');

            // Total de usuários e votos feitos
            const totalUsuarios = data.totalUsuarios;
            const votosFeitos = data.votosFeitos;

            // Calcula a porcentagem de votos feitos
            const votosFeitosPercentage = totalUsuarios ? ((votosFeitos / totalUsuarios) * 100).toFixed(2) : 0;

            // Total de votos válidos
            const totalVotosValidos = data.resultados.reduce((sum, candidato) => sum + candidato.total_votos, 0);

            // Adiciona cada candidato dinamicamente
            candidatosContainer.innerHTML = '';
            data.resultados.forEach((candidato, index) => {
                const percentage = totalVotosValidos ? ((candidato.total_votos / totalVotosValidos) * 100).toFixed(2) : 0;
                const colors = ['#007bff', '#6f42c0', '#28a745', '#dc3545', '#ffc107']; // Definimos cores diferentes

                const candidateElement = document.createElement('li');
                candidateElement.className = 'candidate';
                candidateElement.style.backgroundColor = colors[index % colors.length];
                candidateElement.textContent = `${candidato.nome_candidato}: ${percentage}%`;

                candidatosContainer.appendChild(candidateElement);
            });

            // Atualiza a porcentagem total de votos feitos
            totalVotesChart.textContent = `${votosFeitosPercentage}%`;
        } else {
            throw new Error('Não foi possível carregar os resultados.');
        }
    } catch (error) {
        console.error('Erro ao carregar resultados:', error);
    }
});

// Candidatos
async function carregarCandidatos() {
    try {
        const response = await fetch(`${apiUrl}/candidatos`);
        if (!response.ok) {
            throw new Error('Erro ao buscar candidatos');
        }
        const candidatos = await response.json();

        const container = document.querySelector('.candidates-container');
        container.innerHTML = ''; // Limpa qualquer conteúdo existente

        candidatos.forEach(candidato => {
            const card = document.createElement('div');
            card.className = 'candidate-card';

            card.innerHTML = `
                <img src="${candidato.foto}" alt="Foto de ${candidato.nome}" />
                <h2>${candidato.nome}</h2>
                <p>${candidato.idade} anos</p>
                <p>${candidato.descricao}</p>
                <button class="btn" onclick="votar(${candidato.id_candidato})">Votar</button>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar candidatos:', error);
    }
}

// Carrega os candidatos ao abrir a página
document.addEventListener('DOMContentLoaded', carregarCandidatos);
