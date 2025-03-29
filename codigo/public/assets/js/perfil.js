document.addEventListener('DOMContentLoaded', () => {
    preencherCampos();

    // Adiciona eventos aos botões
    document.getElementById('btnEditarInfo').addEventListener('click', habilitarEdicao);
    document.getElementById('btnSalvarInfo').addEventListener('click', salvarEdicoes);
    document.getElementById('btnCancelarInfo').addEventListener('click', cancelarEdicoes);
    document.getElementById('btnEditarSenha').addEventListener('click', habilitarEdicaoSenha);
    document.getElementById('btnSalvarSenha').addEventListener('click', salvarSenha);
    document.getElementById('btnCancelarSenha').addEventListener('click', cancelarEdicoesSenha);
    document.getElementById('btnImagemPerfil').addEventListener('click', habilitarEdicaoImagem);
    document.getElementById('btnSalvarImagem').addEventListener('click', salvarImagemPerfil);
});

function preencherCampos() {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
    if (usuario) {
        console.log("Usuário carregado:", usuario); // Log dos dados carregados
        document.getElementById('cfgNome').value = usuario.nome;
        document.getElementById('cfgEmail').value = usuario.email;
        document.getElementById('cfgTelefone').value = usuario.telefone || ''; 
        document.getElementById('cfgEndereço').value = usuario.endereco || ''; 
        document.getElementById('usuarioPerfil').innerText = usuario.nome; // Atualiza nome do usuário no perfil
        document.getElementById('headerNomeUsuario').innerText = usuario.nome; // Atualiza nome no header
        document.getElementById('imagemPerfil').src = usuario.foto || 'https://via.placeholder.com/100'; // Atualiza imagem de perfil
        document.getElementById('imagemHeader').src = usuario.foto || 'https://via.placeholder.com/100'; // Atualiza imagem de perfil
        document.getElementById('senhaAtual').value = null;
        document.getElementById('novaSenha').value = null;
        document.getElementById('confirmaSenha').value = null;
    } else {
        alert("Usuário não encontrado.");
    }

    desabilitarCampos();
}

function habilitarEdicao() {
    document.getElementById('cfgNome').disabled = false;
    document.getElementById('cfgEmail').disabled = false;
    document.getElementById('cfgTelefone').disabled = false;
    document.getElementById('cfgEndereço').disabled = false;

    // Esconde o botão Editar e mostra os botões Salvar e Cancelar
    document.getElementById('btnEditarInfo').style.display = 'none';
    document.getElementById('btnSalvarInfo').style.display = 'inline-block';
    document.getElementById('btnCancelarInfo').style.display = 'inline-block';
}

function salvarEdicoes() {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
    if (usuario) {
        // Atualiza os dados do usuário
        usuario.nome = document.getElementById('cfgNome').value;
        usuario.email = document.getElementById('cfgEmail').value;
        usuario.telefone = document.getElementById('cfgTelefone').value; 
        usuario.endereco = document.getElementById('cfgEndereço').value; 

        console.log("Dados do usuário antes de salvar:", usuario); // Verifique os dados antes de salvar

        sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuario)); // Salva as edições

        atualizarUsuarioNoBanco(usuario);
        desabilitarCampos();

        // Recarregue os dados após salvar
        preencherCampos(); // Chame novamente para garantir que os dados estão atualizados na página
    } else {
        alert("Usuário não encontrado.");
    }
}

function atualizarUsuarioNoBanco(usuario) {
    const API_URL = '/usuarios/' + usuario.id;
    fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario), 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar o usuário no banco de dados');
        }
        console.log('Usuário atualizado com sucesso');
    })
    .catch(error => {
        console.error('Erro:', error);
        alert("Erro ao atualizar o usuário.");
    });
}

function cancelarEdicoes() {
    preencherCampos();
    desabilitarCampos();
}

function desabilitarCampos() {
    document.getElementById('cfgNome').disabled = true;
    document.getElementById('cfgEmail').disabled = true;
    document.getElementById('cfgTelefone').disabled = true;
    document.getElementById('cfgEndereço').disabled = true;

    document.getElementById('btnSalvarInfo').style.display = 'none';
    document.getElementById('btnCancelarInfo').style.display = 'none';
    document.getElementById('btnEditarInfo').style.display = 'inline-block'; // Garante que o botão Editar apareça novamente
}

// Funções para editar senha
function habilitarEdicaoSenha() {
    document.getElementById('senhaAtual').disabled = false;
    document.getElementById('novaSenha').disabled = false;
    document.getElementById('confirmaSenha').disabled = false;

    document.getElementById('btnEditarSenha').style.display = 'none';
    document.getElementById('btnSalvarSenha').style.display = 'inline-block';
    document.getElementById('btnCancelarSenha').style.display = 'inline-block';
}

function salvarSenha() {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmaSenha = document.getElementById('confirmaSenha').value;

    if (!senhaAtual || !novaSenha || !confirmaSenha) {
        alert("Todos os campos de senha devem ser preenchidos.");
        return;
    }

    if (usuario.senha !== senhaAtual) {
        alert("Senha atual está incorreta.");
        return;
    }
    if (novaSenha !== confirmaSenha) {
        alert("As novas senhas não coincidem.");
        return;
    }

    usuario.senha = novaSenha;
    sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuario)); // Salva a nova senha
    atualizarUsuarioNoBanco(usuario); // Atualiza no banco

    desabilitarCamposSenha();
    preencherCampos(); // Atualiza os campos

    alert("Sua senha foi alterada com sucesso.");
}

function cancelarEdicoesSenha() {
    desabilitarCamposSenha();
    preencherCampos();
}

function desabilitarCamposSenha() {
    document.getElementById('senhaAtual').disabled = true;
    document.getElementById('novaSenha').disabled = true;
    document.getElementById('confirmaSenha').disabled = true;

    document.getElementById('btnSalvarSenha').style.display = 'none';
    document.getElementById('btnCancelarSenha').style.display = 'none';
    document.getElementById('btnEditarSenha').style.display = 'inline-block';
}

// Funções para editar a imagem de perfil
function habilitarEdicaoImagem() {
    const inputUrl = document.getElementById('imageUrl');
    const btnSalvar = document.getElementById('btnSalvarImagem');

    // Alterna a visibilidade do campo e do botão de salvar
    if (inputUrl.style.display === 'none' || inputUrl.style.display === '') {
        inputUrl.style.display = 'inline-block';
        btnSalvar.style.display = 'inline-block';
        // Desabilita a edição dos outros campos
        desabilitarCampos();
    } else {
        inputUrl.style.display = 'none';
        btnSalvar.style.display = 'none';
    }
}

function salvarImagemPerfil() {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
    const novaImagem = document.getElementById('imageUrl').value;

    if (novaImagem) {
        usuario.foto = novaImagem; // Atualiza a URL da imagem
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuario)); // Salva a nova imagem no sessionStorage
        atualizarUsuarioNoBanco(usuario); // Atualiza no banco

        // Atualiza a imagem na tela e no cabeçalho
        document.getElementById('imagemPerfil').src = novaImagem; // Atualiza a imagem de perfil
        document.getElementById('imagemHeader').src = novaImagem; // Atualiza a imagem no cabeçalho
        document.getElementById('usuarioPerfil').innerText = usuario.nome; // Atualiza nome
        document.getElementById('headerNomeUsuario').innerText = usuario.nome; // Atualiza nome no header

        // Esconde o campo de URL e o botão de salvar
        document.getElementById('imageUrl').style.display = 'none';
        document.getElementById('btnSalvarImagem').style.display = 'none';
    } else {
        alert("Por favor, insira um link válido para a imagem.");
    }
}
