document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('course-form');
    const courseNameInput = document.getElementById('course-name');
    const platformInput = document.getElementById('platform');
    const durationInput = document.getElementById('duration');
    const priceInput = document.getElementById('price');
    const linkInput = document.getElementById('link');
    const imageInput = document.getElementById('image');

    // Quando o formulário for enviado
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        // Obter os valores do formulário
        const courseName = courseNameInput.value.trim();
        const platform = platformInput.value.trim();
        const duration = parseInt(durationInput.value.trim());
        const price = parseFloat(priceInput.value.trim());
        const link = linkInput.value.trim();
        const image = imageInput.value.trim();

        // Validar os campos antes de enviar os dados
        if (!courseName || !platform || isNaN(duration) || isNaN(price) || !link || !image) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        // Criar o novo curso
        const newCourse = {
            nome_curso: courseName,
            plataforma: platform,
            duracao: duration,
            preco: price,
            link: link,
            imagem: image
        };

        // Enviar os dados para o JSON Server
        fetch('http://localhost:3000/cursos', {
            method: 'POST',
            body: JSON.stringify(newCourse),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            alert('Curso cadastrado com sucesso!');
            form.reset(); // Limpa o formulário após o envio
        })
        .catch(error => {
            console.error('Erro ao cadastrar o curso:', error);
            alert('Ocorreu um erro ao cadastrar o curso. Tente novamente.');
        });
    });
});

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