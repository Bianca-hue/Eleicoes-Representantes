const apiUrl = "http://localhost:3000";

async function inserirUsuario() {
    const nome = document.getElementById("nome").value;
    const ra = document.getElementById("ra").value;
    const senha = document.getElementById("senha").value;
    const voto = -1;

    if (!nome || !ra || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/usuario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, ra, senha, voto })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            window.location.href = '/index.html';
        } else {
            alert(result.error || result.message);
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
        const response = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ra, senha })
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('id_usuario', result.usuario.id);
            localStorage.setItem('ra', ra);
            localStorage.setItem('nome', result.usuario.nome);

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
    const idUsuario = localStorage.getItem('id_usuario');

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
            console.log(data.message);
            window.location.href = '/resultados.html';
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao registrar voto. Tente novamente.');
        });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${apiUrl}/resultados`);
        const data = await response.json();

        if (data.resultados) {
            const candidatosContainer = document.querySelector('.candidates');
            const totalVotesChart = document.querySelector('.chart span');
            const totalUsuarios = data.totalUsuarios;
            const votosFeitos = data.votosFeitos;
            const votosFeitosPercentage = totalUsuarios ? ((votosFeitos / totalUsuarios) * 100).toFixed(2) : 0;
            const totalVotosValidos = data.resultados.reduce((sum, candidato) => sum + candidato.total_votos, 0);

            candidatosContainer.innerHTML = '';
            data.resultados.forEach((candidato, index) => {
                const percentage = totalVotosValidos ? ((candidato.total_votos / totalVotosValidos) * 100).toFixed(2) : 0;
                const colors = ['#007bff', '#6f42c0', '#28a745', '#dc3545', '#ffc107'];

                const candidateElement = document.createElement('li');
                candidateElement.className = 'candidate';
                candidateElement.style.backgroundColor = colors[index % colors.length];
                candidateElement.textContent = `${candidato.nome_candidato}: ${percentage}%`;

                candidatosContainer.appendChild(candidateElement);
            });

            totalVotesChart.textContent = `${votosFeitosPercentage}%`;
        } else {
            throw new Error('Não foi possível carregar os resultados.');
        }
    } catch (error) {
        console.error('Erro ao carregar resultados:', error);
    }
});

async function carregarCandidatos() {
    try {
        const response = await fetch(`${apiUrl}/candidatos`);
        if (!response.ok) {
            throw new Error('Erro ao buscar candidatos');
        }
        const candidatos = await response.json();

        const container = document.querySelector('.candidates-container');
        container.innerHTML = '';

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

document.addEventListener('DOMContentLoaded', carregarCandidatos);

function carregarPerfil() {
    const userNameElement = document.getElementById('user-name');
    const userRaElement = document.getElementById('user-ra');
    const userName = localStorage.getItem('nome');
    const userRa = localStorage.getItem('ra');

    if (userName && userRa) {
        userNameElement.innerHTML = userName;
        userRaElement.innerHTML = userRa;
    }
}

function desconectar() {
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('nome');
    localStorage.removeItem('ra');

    alert('Você foi desconectado.');
    window.location.href = '/index.html';
}
