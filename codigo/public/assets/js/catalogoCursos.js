document.addEventListener('DOMContentLoaded', generateCourseCards);

async function fetchCursos() {
    try {
        const response = await fetch('/cursos'); // Busca o endpoint correto
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados: ' + response.statusText);
        }
        const data = await response.json(); // Recebe os dados da API
        console.log('Dados recebidos:', data); // Verifica o retorno no console
        // Verifica se o dado retornado é um array ou um objeto contendo "cursos"
        return Array.isArray(data) ? data : data.cursos || [];
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return []; // Retorna um array vazio em caso de erro
    }
}

async function generateCourseCards() {
    const cursos = await fetchCursos(); // Chama a função que busca os cursos
    const courseCardsContainer = document.getElementById("courseCardsContainer");

    if (!Array.isArray(cursos) || cursos.length === 0) {
        const noCoursesMessage = document.createElement("p");
        noCoursesMessage.textContent = "Nenhum curso encontrado.";
        courseCardsContainer.appendChild(noCoursesMessage);
        return;
    }

    cursos.forEach(curso => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        col.innerHTML = `
            <div class="card h-100">
                <img src="${curso.imagem}" class="card-img-top" alt="${curso.nome_curso}">
                <div class="card-body">
                    <h5 class="card-title">${curso.nome_curso}</h5>
                    <p class="card-text">Plataforma: ${curso.plataforma}</p>
                    <p class="card-text"><small class="text-muted">Duração: ${curso.duracao} horas</small></p>
                    <a href="${curso.link}" class="button btn btn-primary" target="_blank">Acessar Curso</a>
                </div>
            </div>
        `;
        courseCardsContainer.appendChild(col);
    });
}

document.addEventListener("DOMContentLoaded", function(){
    preencherCampos();
})
function preencherCampos() {
const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente'));

if (usuario) {
    document.getElementById('headerNomeUsuario').innerText = usuario.nome;
    document.getElementById('imagemHeader').src = usuario.foto || 'https://via.placeholder.com/100';
} else {
    alert("Usuário não encontrado.");
}
}
