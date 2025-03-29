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
