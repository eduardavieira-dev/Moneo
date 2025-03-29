
var filtros = document.querySelectorAll('.btnfiltros');

document.addEventListener('DOMContentLoaded', () => {
    var categoriaInicial = "Todos";
    preencherCampos();
    pegarLivros(categoriaInicial);
    carregarComentario();


    filtros.forEach(item => {
        //Remove a class "active" de todos os botões que tiverem
        item.addEventListener('click', () => {
            filtros.forEach(filtro => filtro.classList.remove('active'));

            //Adiciona a class active apenas aos botão que foi clicado
            item.classList.add('active');

            const valorCategoria = item.getAttribute('value');
            if (valorCategoria) {
                pegarLivros(valorCategoria);
            }
        });
    });
});

function preencherCampos() {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
    if (usuario) {
        console.log("Usuário carregado:", usuario);
        document.getElementById('headerNomeUsuario').innerText = usuario.nome;
        document.getElementById('imagemHeader').src = usuario.foto || 'https://via.placeholder.com/100';
    } else {
        alert("Usuário não encontrado.");
    }
}

function pegarLivros(catego) {
    fetch('/livros')
        .then(response => response.json())
        .then(data => {
            let cardLivro = '';
            for (let i = 0; i < data.length; i++) {
                let livro = data[i];
                if (catego !== "Todos") {
                    if (livro.categoria == catego) {
                        cardLivro += `<div class="cardLivro" id="cardLivro-${livro.id}">
    <div class="capaLivro" id="capaLivro-${livro.id}">
        <img class="capa" src="${livro.capa}">
        <a href="${livro.compra}" target="_blank"><button class="btnComprar">Comprar</button></a>
    </div>
    <div class="infosLivros">
        <h4>${livro.titulo}, ${livro.autor}</h4>
        <p>${livro.sinopse}</p>
        <h6 class="ano"><b>Ano de Publicação:</b> ${livro.ano}</h6>
        <h6 class="nomeEditora"><b>Editora:</b> ${livro.editora}</h6>
        <h6 class="cat"><b>Categoria:</b> <button class="btnCategoria" value = "${livro.categoria}">${livro.categoria}</button></h6>
        <h5 class="msgJaleuolivro">Já leu este livro? Deixe sua opinião!</h5>
        <div>
            <div class="estrelas">
                <span class="star" data-value="1">★</span>
                <span class="star" data-value="2">★</span>
                <span class="star" data-value="3">★</span>
                <span class="star" data-value="4">★</span>
                <span class="star" data-value="5">★</span>
            </div>
            <input type="hidden" class="notaLivro">
        </div>
        <div class="comentar">
            <textarea id="textoComentario-${livro.id}" value="${livro.id}" class="areaComentario" placeholder="Comente sobre"></textarea>
            <button id="btnComentar-${livro.id}" value="${livro.id}" class="btnComentario"  >Comentar</button>
        </div>
    </div>
</div>`
                    }
                } else {
                    cardLivro += `<div class="cardLivro" id="cardLivro-${livro.id}">
    <div class="capaLivro" id="capaLivro-${livro.id}">
        <img class="capa" src="${livro.capa}">
        <a href="${livro.compra}" target="_blank"><button class="btnComprar">Comprar</button></a>
    </div>
    <div class="infosLivros">
        <h4>${livro.titulo}, ${livro.autor}</h4>
        <p>${livro.sinopse}</p>
        <h6 class="ano"><b>Ano de Publicação:</b> ${livro.ano}</h6>
        <h6 class="nomeEditora"><b>Editora:</b> ${livro.editora}</h6>
        <h6 class="cat"><b>Categoria:</b> <button class="btnCategoria" value = "${livro.categoria}">${livro.categoria}</button></h6>
        <h5 class="msgJaleuolivro">Já leu este livro? Deixe sua opinião!</h5>
        <div>
            <div class="estrelas">
                <span class="star" data-value="1">★</span>
                <span class="star" data-value="2">★</span>
                <span class="star" data-value="3">★</span>
                <span class="star" data-value="4">★</span>
                <span class="star" data-value="5">★</span>
            </div>
            <input type="hidden" class="notaLivro">
        </div>
        <div class="comentar">
            <textarea id="textoComentario-${livro.id}" value="${livro.id}" class="areaComentario" placeholder="Comente sobre"></textarea>
            <button id="btnComentar-${livro.id}" value="${livro.id}" class="btnComentario"  >Comentar</button>
        </div>
    </div>
</div>`
                }
            }
            document.getElementById('container-cards').innerHTML = cardLivro;
            // Adicionar eventos para os botões de categoria dentro dos cards
            const categorias = document.querySelectorAll('.btnCategoria');

            categorias.forEach(item => {
                item.addEventListener('click', () => {
                    filtros.forEach(filtro => filtro.classList.remove('active'));

                    const valorCategoria = item.getAttribute('value');
                    if (valorCategoria) {
                        pegarLivros(valorCategoria);
                    }

                    const filtroAtivo = document.querySelector(`.btnfiltros[value="${valorCategoria}"]`);
                    if (filtroAtivo) {
                        filtroAtivo.classList.add('active');
                    }
                })
            })
        })
        .catch(error => console.error("Erro ao buscar os livros:", error));
}

document.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('star')) {
        const estrelas = event.target.parentNode.querySelectorAll('.star');
        const valor = event.target.getAttribute('data-value');

        estrelas.forEach(star => {
            if (parseInt(star.getAttribute('data-value')) <= valor) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }
});

document.getElementById('container-cards').addEventListener('click', (event) => {
    if (event.target && event.target.id.startsWith('btnComentar-')) {
        const livroId = event.target.value;
        adicionarComentario(livroId);
    }
});

function adicionarComentario(livroId) {

    const comentarioTexto = document.getElementById(`textoComentario-${livroId}`).value;

    if (!comentarioTexto) {
        console.log("Comentário vazio, nada a enviar");
        return;
    }

    const estrelas = document.querySelectorAll(`#cardLivro-${livroId} .star`);
    let notaSelecionada = 0;
    estrelas.forEach(star => {
        if (star.classList.contains('selected')) {
            notaSelecionada = star.getAttribute('data-value');
        }
    });

    if (!notaSelecionada) {
        console.log("Nota não selecionada");
        return;
    }

    fetch('/livros')
        .then(response => response.json())
        .then(data => {
            let nomeLivro = '';
            let livroSelecionado = null;
            for (let i = 0; i < data.length; i++) {
                let livro = data[i];
                if (livro.id === parseInt(livroId)) {
                    nomeLivro = livro.titulo;
                    livroSelecionado = livro;

                }
            }

            if (!livroSelecionado) {
                console.error('Livro não encontrado!');
                return;
            }

            const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente'));

            const novoComentario = {
                idusuario: usuario.id,
                livroId: parseInt(livroId),
                nomeusuario: usuario.nome,
                nomeLivro: nomeLivro,
                comentario: comentarioTexto,
                nota: notaSelecionada,
                fotousuario: usuario.foto
            };
            fetch('/comentarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoComentario),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao adicionar comentário');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Comentário adicionado:', data);

                    const containerComentarios = document.getElementById('container-comentarios');
                    if (!containerComentarios) {
                        console.error("Elemento 'container-comentarios' não encontrado!");
                        return;
                    }

                    let cardComentario = `
                        <div class="col-md-4 col-sm-6 mb-4">
                        <div class="card">
                            <div class="card-body card-comentario">
                                <div class="usuariocoment">
                                    <h5 id="nomeUsuario" class="card-title">${usuario.nome}</h5>
                                    <img id="imagemComentario" src="${usuario.foto || 'https://via.placeholder.com/100'}" alt="Usuario" class="imagemUsuario">
                                </div>
                                <h6 id="tituloLivro">${livroSelecionado.titulo}</h6>
                                <div class="text-warning">${'★'.repeat(notaSelecionada)}${'☆'.repeat(5 - notaSelecionada)}</div> <!-- Exibe as estrelas -->
                                <p id="comentarioLivro" class="card-text">${comentarioTexto}</p>
                                <textarea id="editComentario-${novoComentario.id}" class="form-control comentarioTexto" style="display: none;" placeholder="Editar comentário">${novoComentario.comentario}</textarea>
                            </div>
                            <div class="comentario-botoes">
                                <button class="btnEditar" id="btnEditar-${novoComentario.id}" hidden>✎</button>
                                <button class="btnDeletar" id="btnDeletar-${novoComentario.id}" hidden>🗑</button>
                                <button class="btnSalvar" id="btnSalvar-${novoComentario.id}" hidden>Salvar</button>
                            </div>
                        </div>
                    </div>
                `;
                    containerComentarios.innerHTML += cardComentario;

                    document.getElementById(`textoComentario-${livroId}`).value = '';
                    estrelas.forEach(star => star.classList.remove('selected'));
                })
                .catch(error => {
                    console.error('Erro ao adicionar comentário:', error);
                });
        })
        .catch(error => {
            console.error("Erro ao buscar os livros:", error);
        });
    carregarComentario();
}

function carregarComentario() {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente'));

    fetch('/livros')
        .then(response => response.json())
        .then(livros => {
            fetch('/comentarios')
                .then(response => response.json())
                .then(comentarios => {
                    let cardComentario = '';

                    for (let i = 0; i < comentarios.length; i++) {
                        let comentario = comentarios[i];
                        let livroSelecionado = null;

                        for (let j = 0; j < livros.length; j++) {
                            if (livros[j].id === comentario.livroId) {
                                livroSelecionado = livros[j];
                                break;
                            }
                        }

                        if (livroSelecionado) {
                            const notaSelecionada = parseInt(comentario.nota);
                            const estrelas = '★'.repeat(notaSelecionada) + '☆'.repeat(5 - notaSelecionada);

                            cardComentario += `
                                <div class="col-md-4 col-sm-6 mb-4" id="comentario-${comentario.id}">
                                    <div class="card">
                                        <div class="card-body card-comentario">
                                            <div class="usuariocoment">
                                                <h5 class="card-title">${comentario.nomeusuario}</h5>
                                                <img src="${comentario.fotousuario || 'https://via.placeholder.com/100'}" alt="Usuario" class="imagemUsuario">
                                            </div>
                                            <h6 class="nomeLivro"><span>Livro:</span> ${livroSelecionado.titulo}</h6>
                                            <div id="estrelasComentario-${comentario.id}" class="text-warning">${estrelas}</div>
                                            <p id="comentarioLivro-${comentario.id}" class="card-text">${comentario.comentario}</p>

                                            <div id="estrelasEditar-${comentario.id}" class="estrelas" style="display: none;">
                                                <span class="star" data-value="1">★</span>
                                                <span class="star" data-value="2">★</span>
                                                <span class="star" data-value="3">★</span>
                                                <span class="star" data-value="4">★</span>
                                                <span class="star" data-value="5">★</span>
                                            </div>

                                            <textarea id="editComentario-${comentario.id}" class="form-control comentarioTexto" style="display: none;" placeholder="Editar comentário">${comentario.comentario}</textarea>
                                            <div class="comentario-botoes">
                                                <button class="btnEditar" id="btnEditar-${comentario.id}" hidden>✎</button>
                                                <button class="btnDeletar" id="btnDeletar-${comentario.id}" hidden>🗑</button>
                                                <button class="btnSalvar" id="btnSalvar-${comentario.id}" style="display: none;">🖬</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                    }

                    const containerComentarios = document.getElementById('container-comentarios');
                    if (containerComentarios) {
                        containerComentarios.innerHTML = cardComentario;
                    } else {
                        console.error("Elemento 'container-comentario' não encontrado!");
                    }

                    botoesComentarios(comentarios);

                })
                .catch(error => console.error("Erro ao carregar comentários:", error));
        })
        .catch(error => console.error("Erro ao carregar livros:", error));
}

function botoesComentarios(comentarios) {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente'));

    for (let i = 0; i < comentarios.length; i++) {
        let comentario = comentarios[i];
        const comentarioId = comentario.id;

        if (usuario.id === comentario.idusuario) {
            const btnEditar = document.getElementById(`btnEditar-${comentario.id}`);
            const btnDelete = document.getElementById(`btnDeletar-${comentario.id}`);

            console.log('Procurando botões para o comentário ID:', comentarioId);

            if (btnEditar) {

                btnEditar.removeAttribute('hidden');
                btnEditar.addEventListener('click', () => {
                    editarComentario(comentarioId, comentarios);
                });

            }

            if (btnDelete) {
                btnDelete.removeAttribute('hidden');
                btnDelete.addEventListener('click', () => {
                    deletarComentario(comentarioId);
                });
            }
        }
    }
}

function editarComentario(comentarioId, comentarios) {
    for (let i = 0; i < comentarios.length; i++) {
        let comentario = comentarios[i];

        if (comentario.id === comentarioId) {
            const btnSalvar = document.getElementById(`btnSalvar-${comentario.id}`);
            const textareaComentario = document.getElementById(`editComentario-${comentario.id}`);
            const textoComentario = document.getElementById(`comentarioLivro-${comentario.id}`);
            const btnEditar = document.getElementById(`btnEditar-${comentario.id}`);
            const estrelasContainer = document.getElementById(`estrelasEditar-${comentario.id}`);
            const estrelasComentario = document.getElementById(`estrelasComentario-${comentario.id}`);

            btnEditar.style.display = 'none';
            textareaComentario.style.display = 'block';
            textoComentario.style.display = 'none';
            btnSalvar.style.display = 'inline-block';
            estrelasComentario.style.display = 'none'

            textareaComentario.value = comentario.comentario;

            estrelasContainer.style.display = 'inline-block';
            const estrelas = estrelasContainer.querySelectorAll('.star');
            estrelas.forEach(star => {
                star.classList.remove('selected');
                if (parseInt(star.getAttribute('data-value')) <= comentario.nota) {
                    star.classList.add('selected');
                }
            });

            estrelas.forEach(star => {
                star.addEventListener('click', () => {
                    const novaNota = star.getAttribute('data-value');
                    comentario.nota = novaNota;
                    estrelas.forEach(s => {
                        if (parseInt(s.getAttribute('data-value')) <= novaNota) {
                            s.classList.add('selected');
                        } else {
                            s.classList.remove('selected');
                        }
                    });
                });
            });

            btnSalvar.addEventListener('click', () => {
                salvarComentario(comentarioId, comentarios, textareaComentario);
                btnEditar.style.display = 'inline-block';
                estrelasComentario.style.display = 'inline-block'
                estrelasContainer.style.display = 'none';
                textareaComentario.style.display = 'none';
                btnSalvar.style.display = 'none';
                textoComentario.style.display = 'block';

            });

        } else {

            const textareaComentario = document.getElementById(`editComentario-${comentario.id}`);
            const textoComentario = document.getElementById(`comentarioLivro-${comentario.id}`);
            const btnSalvar = document.getElementById(`btnSalvar-${comentario.id}`);
            const btnEditar = document.getElementById(`btnEditar-${comentario.id}`);
            const estrelasContainer = document.getElementById(`estrelasEditar-${comentario.id}`);

            textareaComentario.style.display = 'none';
            textoComentario.style.display = 'block';
            btnSalvar.style.display = 'none';
            btnEditar.style.display = 'inline-block';
            estrelasContainer.style.display = 'none';
        }
    }
}

function salvarComentario(comentarioId, comentarios) {

    for (let i = 0; i < comentarios.length; i++) {
        let comentario = comentarios[i];

        if (comentario.id === comentarioId) {
            const btnSalvar = document.getElementById(`btnSalvar-${comentario.id}`);
            const textareaComentario = document.getElementById(`editComentario-${comentario.id}`);
            const textoComentario = document.getElementById(`comentarioLivro-${comentario.id}`);
            const novoComentarioTexto = textareaComentario.value.trim();
            const estrelasContainer = document.getElementById(`estrelasEditar-${comentario.id}`);

            const comentarioAtualizado = {
                id: comentario.id,
                idusuario: comentario.idusuario,
                livroId: comentario.livroId,
                nomeusuario: comentario.nomeusuario,
                nomeLivro: comentario.nomeLivro,
                comentario: novoComentarioTexto,
                nota: comentario.nota,
                fotousuario: comentario.fotousuario
            };

            fetch(`/comentarios/${comentarioId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(comentarioAtualizado)
            })
                .then(response => response.json())
                .then(updatedComentario => {
                    textoComentario.innerText = novoComentarioTexto;
                    comentario.comentario = novoComentarioTexto;
                    carregarComentario();

                })
                .catch(error => {
                    console.error('Erro ao atualizar comentário:', error);
                });

        }
    }
}

function deletarComentario(comentarioId) {
    fetch(`/comentarios/${comentarioId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                console.log('Comentário apagado com sucesso');

                carregarComentario();
            } else {
                console.error('Erro ao apagar comentário');
            }
        })
        .catch(error => {
            console.error('Erro ao fazer a requisição de delete:', error);
        });
}