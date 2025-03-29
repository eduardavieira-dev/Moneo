document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.querySelector("#table-dados");
    const formCadastro = document.getElementById("formCadastro");

    async function carregarLivros() {
        try {
            const response = await fetch('/livros');
            if (response.ok) {
                const livros = await response.json();
                livros.forEach(livro => atualizarTabela(livro));
            } else {
                console.error("Erro ao carregar livros:", response.statusText);
            }
        } catch (error) {
            console.error("Erro ao carregar livros:", error);
        }
    }

    // Função para alterar dados de um livro
    function alteraDadosLivro(id) {
        const dadosAtualizados = {
            titulo: document.getElementById('titulo').value,
            autor: document.getElementById('autor').value,
            editora: document.getElementById('editora').value,
            ano: document.getElementById('ano').value,
            sinopse: document.getElementById('sinopse').value,
            categoria: document.getElementById('categoria').value,
            capa: document.getElementById('linkcap').value,
            compra: document.getElementById('compra').value
        };

        fetch(`/livros/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados)
        })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao atualizar o livro");
            return response.json();
        })
        .then(data => {
            atualizarTabela({ id, ...dadosAtualizados }, true);
            alert("Livro atualizado com sucesso!");
        })
        .catch(error => {
            console.error("Erro ao atualizar o livro:", error);
            alert("Erro ao atualizar o livro. Verifique os dados e tente novamente.");
        });
    }

    // Função para adicionar ou atualizar linha na tabela
    function atualizarTabela(livro, isUpdate = false) {
        let row = Array.from(tabela.rows).find(row => row.cells[0].innerText === String(livro.id));

        if (isUpdate && row) {
            row.cells[1].innerText = livro.titulo;
            row.cells[2].innerText = livro.autor;
            row.cells[3].innerText = livro.editora;
            row.cells[4].innerText = livro.categoria;
            row.cells[5].innerText = livro.ano;
        } else {
            row = document.createElement("tr");
            row.innerHTML = `
                <td>${livro.id}</td>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${livro.editora}</td>
                <td>${livro.categoria}</td>
                <td>${livro.ano}</td>
            `;
            tabela.appendChild(row);
        }
    }

    document.getElementById('btnAlterar').addEventListener('click', function () {
        const id = document.getElementById('id').value;
        const titulo = document.getElementById("titulo").value;
        const autor = document.getElementById("autor").value;
        const editora = document.getElementById("editora").value;
        const ano = document.getElementById("ano").value;
        const categoria = document.getElementById("categoria").value;
        const sinopse = document.getElementById("sinopse").value;
        const capa = document.getElementById("linkcap").value;
        const compra = document.getElementById("compra").value;

        if (!titulo || !autor || !editora || !ano || !categoria || !sinopse || !capa || !compra) {
            alert("Certifique-se de preencher todos os campos antes de fazer a alteração!");
            return;
        } else {
            alteraDadosLivro(id);
            formCadastro.reset();
        }
    });

    var gridTabela = document.getElementById('grid-tabela');
    gridTabela.addEventListener('click', function (e) {
        if (e.target.tagName === "TD") {
            let linhaColuna = e.target.parentNode;
            var colunas = linhaColuna.querySelectorAll("td");
            var idLivro = colunas[0].innerText;

            fetch(`/livros/${idLivro}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('sinopse').value = data.sinopse;
                    document.getElementById('linkcap').value = data.capa;
                    document.getElementById('compra').value = data.compra;
                })
                .catch(error => console.error('Erro ao buscar dados do livro:', error));

            document.getElementById('id').value = colunas[0].innerText;
            document.getElementById('titulo').value = colunas[1].innerText;
            document.getElementById('autor').value = colunas[2].innerText;
            document.getElementById('editora').value = colunas[3].innerText;
            document.getElementById('categoria').value = colunas[4].innerText;
            document.getElementById('ano').value = colunas[5].innerText;
        }
    });

    async function excluirLivro(id) {
        try {
            const response = await fetch(`/livros/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error("Erro ao excluir livro: " + response.statusText);
            }
            alert("Livro removido com sucesso");
        } catch (error) {
            console.error('Erro ao excluir livro:', error);
        }
    }

    var btnExcluir = document.getElementById('btnExcluir');
    btnExcluir.addEventListener('click', async function () {
        let campoId = document.getElementById('id').value;
        if (campoId === "") {
            alert("Selecione um livro para ser excluído!");
            return;
        } else {
            await excluirLivro(parseInt(campoId));

            const linhaParaRemover = Array.from(gridTabela.rows).find(row => row.cells[0].innerText === campoId);
            if (linhaParaRemover) {
                gridTabela.deleteRow(linhaParaRemover.rowIndex);
            }

            formCadastro.reset();
        }
    });

    async function cadastrarLivro(livro) {
        try {
            const response = await fetch('/livros', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(livro)
            });

            if (response.ok) {
                const novoLivro = await response.json();
                atualizarTabela(novoLivro);
            } else {
                console.error("Erro ao cadastrar o livro:", response.statusText);
            }
        } catch (error) {
            console.error("Erro ao cadastrar o livro:", error);
        }
        alert("Livro cadastrado com sucesso!");
    }

    document.getElementById('btnInserir').addEventListener('click', async (event) => {
        event.preventDefault();
        const titulo = document.getElementById("titulo").value;
        const autor = document.getElementById("autor").value;
        const editora = document.getElementById("editora").value;
        const ano = parseInt(document.getElementById("ano").value);
        const categoria = document.getElementById("categoria").value;
        const sinopse = document.getElementById("sinopse").value;
        const capa = document.getElementById("linkcap").value;
        const compra = document.getElementById("compra").value;

        if (!titulo || !autor || !editora || !ano || !categoria || !sinopse || !capa || !compra) {
            alert("Preencha todos os campos para cadastrar um livro!");
            return;
        } else {
            const novoLivro = { titulo, autor, editora, ano, categoria, sinopse, capa, compra };
            await cadastrarLivro(novoLivro);
            formCadastro.reset();
        }
    });

    preencherCampos();
    carregarLivros();
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
