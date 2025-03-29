document.addEventListener('DOMContentLoaded', () => {
    preencherCampos();
    carregarDadosDaPlanilha();
    configurarNotificacoes();
});

// Função para carregar os dados da planilha
function carregarDadosDaPlanilha() {
    fetch('/dados-planilha') // Altere para o URL correto se necessário
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            const { usuarios } = data;

            // Preencher tabela com usuários
            const tabela = document.getElementById('tabela').getElementsByTagName('tbody')[0];
            usuarios.forEach(usuario => {
                const novaLinha = tabela.insertRow();
                novaLinha.insertCell(0).textContent = usuario.nome;
                novaLinha.insertCell(1).textContent = usuario.email;
                novaLinha.insertCell(2).textContent = usuario.telefone || 'N/A';
                novaLinha.insertCell(3).textContent = usuario.endereco || 'N/A';
                novaLinha.insertCell(4).textContent = "clique para editar"; // Célula para edição
                novaLinha.cells[4].onclick = function() {
                    editarCelula(novaLinha.cells[4]);
                };
            });

            // Exemplo: usar o salário do primeiro usuário
            if (usuarios.length > 0) {
                document.getElementById('salario').value = `R$ ${usuarios[0].salario || 0}`;
                document.getElementById('dataInicio').value = new Date().toISOString().split('T')[0]; // Data atual
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Preencher os campos do perfil
function preencherCampos() {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
    if (usuario) {
        document.getElementById('headerNomeUsuario').innerText = usuario.nome; // Atualiza nome no header
        document.getElementById('imagemHeader').src = usuario.foto || 'https://via.placeholder.com/100'; // Atualiza imagem de perfil
    } else {
        alert("Usuário não encontrado.");
    }
}

// Adiciona evento de submit
document.getElementById('submitDados').addEventListener('click', function() {
    const dataPagamento = document.getElementById('dataPagamento').value;
    const salario = parseFloat(document.getElementById('salario').value.replace('R$ ', '').replace(',', '.')) || 0;
    const dataInicio = document.getElementById('dataInicio').value;

    // Verifica se os campos estão vazios
    if (!dataInicio || !dataPagamento || isNaN(salario) || salario <= 0) {
        alert("Por favor, preencha todos os campos obrigatórios corretamente.");
        return; // Cancela a operação
    }

    // Atualiza a data de início na exibição
    document.getElementById('dataInicioDisplay').textContent = `Data de Início: ${dataInicio}`;

    // Atualiza os valores na tabela de resumo
    document.getElementById('dataPrevistaPagamento').textContent = dataPagamento;
    document.getElementById('salarioValor').textContent = `R$ ${salario.toFixed(2)}`;

    // Mostra a tabela e oculta o texto explicativo
    document.getElementById('tabela').style.display = 'table'; // Torna a tabela visível
    document.getElementById('resumoTabela').style.display = 'table'; // Torna o resumo visível
    document.getElementById('textoExplicativo').style.display = 'none'; // Esconde o texto explicativo
    document.getElementById('criar-linha').style.display = 'inline-block'; // Torna o botão visível
    document.getElementById('subtitulomain').style.display = 'block'; // Torna o título do resumo visível

    // Adiciona uma nova linha na tabela
    const tabela = document.getElementById('tabela').getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();

    for (let i = 0; i < 5; i++) {
        const novaCelula = novaLinha.insertCell(i);
        novaCelula.textContent = "clique para editar";

        novaCelula.onclick = function() {
            editarCelula(novaCelula);
        };
    }

    // Atualiza o resumo
    atualizarResumo();

    // Enviar dados para o endpoint
    const dadosParaEnviar = {
        dataPagamento,
        salario,
        dataInicio
    };

    fetch('/dados-planilha', { // Altere para o URL correto se necessário
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnviar),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao enviar dados');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados enviados com sucesso:', data);
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

// Função para atualizar o resumo
function atualizarResumo() {
    const tabela = document.getElementById('tabela').getElementsByTagName('tbody')[0];
    let total = 0;

    // Soma os valores da coluna "Valor"
    for (let i = 0; i < tabela.rows.length; i++) {
        total += parseFloat(tabela.rows[i].cells[3].textContent) || 0;
    }

    // Atualiza os valores do resumo
    document.getElementById('totalValor').textContent = `R$ ${total.toFixed(2)}`;

    // Atualiza o saldo
    const salario = parseFloat(document.getElementById('salario').value.replace('R$ ', '').replace(',', '.')) || 0;
    const saldo = salario - total;
    document.getElementById('saldoValor').textContent = `R$ ${saldo.toFixed(2)}`;

    // Verifica se o total está chegando perto do limite
    verificarNotificacaoLimite(total);
}

// Função para editar células
function editarCelula(celula) {
    const valorAtual = celula.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = valorAtual;
    celula.textContent = '';
    celula.appendChild(input);

    input.addEventListener('blur', function() {
        celula.textContent = input.value || "clique para editar";
        atualizarResumo();
    });

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            celula.textContent = input.value || "clique para editar";
            atualizarResumo();
        }
    });

    input.focus();
}

// Limpar os campos do formulário
document.getElementById('limparDados').addEventListener('click', function() {
    // Limpa os campos do formulário
    document.getElementById('dataInicio').value = '';
    document.getElementById('valorLimite').value = '';
    document.getElementById('dataPagamento').value = '';
    document.getElementById('salario').value = '';

    // Limpa a exibição da data de início
    document.getElementById('dataInicioDisplay').textContent = '';

    // Limpa a tabela
    const tabela = document.getElementById('tabela').getElementsByTagName('tbody')[0];
    while (tabela.rows.length > 0) {
        tabela.deleteRow(0);
    }

    // Limpa o resumo
    document.getElementById('dataPrevistaPagamento').textContent = 'clique para editar';
    document.getElementById('salarioValor').textContent = 'clique para editar';
    document.getElementById('totalValor').textContent = 'R$ 0,00';
    document.getElementById('saldoValor').textContent = 'R$ 0,00';
});

// Cria uma nova linha na tabela
document.getElementById('criar-linha').addEventListener('click', () => {
    const tabela = document.getElementById('tabela').getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();

    for (let i = 0; i < 5; i++) {
        const novaCelula = novaLinha.insertCell(i);
        novaCelula.textContent = "clique para editar";
        novaCelula.onclick = function() {
            editarCelula(novaCelula);
        };
    }

    // Atualiza o resumo
    atualizarResumo();
});

// Função para configurar as notificações
function configurarNotificacoes() {
    const sininho = document.querySelector('.material-symbols-outlined');
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes')) || [];

    // Exibe a quantidade de notificações não lidas
    if (notificacoes.length > 0) {
        sininho.classList.add('notificacao-pendente');
    }

    sininho.addEventListener('click', function() {
        // Exibe notificações no pop-up (pode ser customizado)
        const notificacaoPopUp = document.createElement('div');
        notificacaoPopUp.classList.add('notificacao-pop-up');
        notificacaoPopUp.innerHTML = notificacoes.map(n => `<p class="p-2">${n}</p>`).join('');
        document.body.appendChild(notificacaoPopUp);

        setTimeout(() => {
            document.body.removeChild(notificacaoPopUp);
        }, 5000);
    });
}

// Função para verificar o limite de valor
function verificarNotificacaoLimite(saldo) {
    const limite = parseFloat(document.getElementById('valorLimite').value.replace('R$ ', '').replace(',', '.')) || 0;

    if(limite > 0){
        // Verifica se a diferença é de 10 ou 5 reais
        if (saldo > limite) {
            criarNotificacao(`Você ultrapassou o limite de R$ ${(limite).toFixed(2)}! Seu gasto atual é de R$ ${(saldo).toFixed(2)}.`);
        } else if (limite - saldo <= 10) {
            criarNotificacao(`Seus gastos estão a R$ ${(limite - saldo).toFixed(2)} de atingir o limite!`);
        }
    }

}

function criarNotificacao(mensagem) {
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes')) || [];

    // Adiciona a nova notificação
    notificacoes.push(mensagem);

    // Armazena as notificações no localStorage
    localStorage.setItem('notificacoes', JSON.stringify(notificacoes));

    // Atualiza o badge de notificação
    document.getElementById('notification-badge').textContent = notificacoes.length;
    document.getElementById('notification-badge').classList.remove('d-none');

    // Exibe notificações no pop-up (pode ser customizado)
    const notificacaoPopUp = document.createElement('div');
    notificacaoPopUp.classList.add('notificacao-pop-up');
    notificacaoPopUp.innerHTML = `<p class="p-2">${mensagem}</p>`;
    document.body.appendChild(notificacaoPopUp);

    setTimeout(() => {
        document.body.removeChild(notificacaoPopUp);
    }, 5000);
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