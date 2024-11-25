// URL base do backend
const API_BASE = "http://localhost:3000";
const apiUrl = "http://localhost:3000";

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

        if (response.ok) {
            alert(result.message);
            // Redireciona para outra página após login (exemplo: /votar.html)
            window.location.href = '/votar.html';
        } else {
            alert(result.error || result.message);
        }
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        alert("Erro ao conectar ao servidor.");
    }
}

// Função para carregar dados do perfil
async function carregarPerfil(userId) {
    try {
        const response = await fetch(`${API_BASE}/perfil/${userId}`);
        const perfil = await response.json();

        if (response.ok) {
            document.querySelector('.profile-photo').src = perfil.foto || "img/default.png";
            document.querySelector('.profile-image').alt = `Foto de perfil de ${perfil.nome}`;
            document.querySelector('h1').textContent = perfil.nome;
            document.querySelector('h2').textContent = perfil.email;
        } else {
            alert(perfil.message || "Erro ao carregar perfil");
        }
    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
    }
}

// Função para desconectar usuário
async function desconectar() {
    try {
        const response = await fetch(`${API_BASE}/desconectar`, { method: "POST" });
        const resultado = await response.json();

        if (response.ok) {
            alert(resultado.message);
            // Redirecionar para a página inicial ou de login
            window.location.href = "index.html";
        } else {
            alert("Erro ao desconectar");
        }
    } catch (error) {
        console.error("Erro ao desconectar:", error);
    }
}

function inserirUsuario() {
  const data = {
      ra: document.getElementById('ra').value,
      nome: document.getElementById('nome').value,
      senha: document.getElementById('senha').value,
      voto: null
  };

  fetch(`${apiUrl}/cliente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => alert(data.message))
  .catch(error => console.error('Erro:', error));
}

function salvarUsuarioLogado(usuario) {
    localStorage.setItem('userId', usuario.id); // Armazena no navegador
    localStorage.setItem('userName', usuario.nome); // Opcional
}

// Chamar funções ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const userId = 1; // Substitua pelo ID do usuário logado (exemplo estático)
    carregarPerfil(userId);

    // Evento para desconectar
    document.querySelector('.btn-error').addEventListener('click', desconectar);
});

document.addEventListener('DOMContentLoaded', async () => {
    const apiBaseUrl = 'http://localhost:3000';
  
    try {
      // Faz a requisição ao endpoint de resultados
      const response = await fetch(`${apiBaseUrl}/resultados`);
      const data = await response.json();
  
      if (data.resultados) {
        const candidatosContainer = document.querySelector('.candidates');
        const totalVotesChart = document.querySelector('.chart span');
  
        // Calcula o total de votos
        const totalVotes = data.resultados.reduce((sum, candidato) => sum + candidato.total_votos, 0);
  
        // Adiciona cada candidato dinamicamente
        candidatosContainer.innerHTML = '';
        data.resultados.forEach((candidato, index) => {
          const percentage = totalVotes ? ((candidato.total_votos / totalVotes) * 100).toFixed(2) : 0;
          const colors = ['#007bff', '#6f42c0', '#28a745', '#dc3545', '#ffc107']; // Definimos cores diferentes
  
          const candidateElement = document.createElement('li');
          candidateElement.className = 'candidate';
          candidateElement.style.backgroundColor = colors[index % colors.length];
          candidateElement.textContent = `${candidato.nome_candidato}: ${percentage}%`;
  
          candidatosContainer.appendChild(candidateElement);
        });
  
        // Atualiza a porcentagem total de votos feitos (exemplo de estatística geral)
        const participationRate = totalVotes ? ((totalVotes / 100) * 100).toFixed(2) : 0; // Exemplo fictício de cálculo
        totalVotesChart.textContent = `${participationRate}%`;
      } else {
        throw new Error('Não foi possível carregar os resultados.');
      }
    } catch (error) {
      console.error('Erro ao carregar resultados:', error);
      alert('Erro ao carregar resultados. Tente novamente mais tarde.');
    }
  });
  