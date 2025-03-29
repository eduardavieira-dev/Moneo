let result = document.querySelector('#resultado');
let btnCalculate = document.querySelector('#calculate');
let btnClean = document.querySelector('#clean');
let selectInvestimento = document.querySelector('#investimento');
const urlHistorico = "http://localhost:3000/historico";

async function preencherInvestimentos() {
    try {
        const response = await fetch('http://localhost:3000/investimentos');
        
        if (!response.ok) {
            throw new Error('Erro ao carregar os dados de investimentos');
        }

        const investimentos = await response.json();

        selectInvestimento.innerHTML = '<option value="">Selecione um investimento</option>';

        investimentos.forEach((investimento) => {
            const option = document.createElement('option');
            option.value = investimento.id;
            option.textContent = `${investimento.nome}`;
            selectInvestimento.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao buscar investimentos:', error);
    }
}

function atualizarTaxa() {
    const selectedId = selectInvestimento.value;
    const taxaInput = document.querySelector('#rate');

    fetch('http://localhost:3000/investimentos')
        .then(response => response.json())
        .then(investimentos => {
            const investimentoSelecionado = investimentos.find(inv => inv.id == selectedId);

            if (investimentoSelecionado) {
                taxaInput.value = investimentoSelecionado.taxa;
            } else {
                taxaInput.value = '';
            }
        })
        .catch(error => console.error('Erro ao buscar taxa de investimento:', error));
}

btnCalculate.addEventListener('click', async (e) => {
    e.preventDefault();

    let P = parseFloat(document.querySelector('#initial').value);
    let PMT = parseFloat(document.querySelector('#month').value);
    let r = parseFloat(document.querySelector('#rate').value) / 100;
    let t = parseInt(document.querySelector('#period').value);
    let nomeInvestimento = selectInvestimento.options[selectInvestimento.selectedIndex].text;

    if (isNaN(P) || isNaN(PMT) || isNaN(r) || isNaN(t) || !nomeInvestimento) {
        result.innerHTML = '<p style="color: red;">Por favor, preencha todos os campos corretamente.</p>';
        return;
    }

    let n = 12;

    let total = P * Math.pow(1 + r / n, n * t) + PMT * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
    let investedValue = P + PMT * t * n;

    let interest = total - investedValue;

    total = total.toFixed(2).replace('.', ',');
    investedValue = investedValue.toFixed(2).replace('.', ',');
    interest = interest.toFixed(2).replace('.', ',');

    result.innerHTML = `
    <div class="card-resultado">
       <div class="titulo-restltado">Valor total:</div>
       <p> R$${total}</p>
    </div>
    <div class="card-resultado">
       <div class="titulo-restltado">Valor investido<br> (sem juros):</div>
       <p> R$${investedValue}</p>
    </div>
    <div class="card-resultado">
       <div class="titulo-restltado">Valor dos juros:</div>
       <p> R$${interest}</p>
    </div>
    `;

    await salvarRegistro("Novo Registro", nomeInvestimento, investedValue.replace(',', '.'), total.replace(',', '.'));
    await carregarHistorico();
});

btnClean.addEventListener('click', (e) => {
    e.preventDefault();

    document.querySelector('#initial').value = '';
    document.querySelector('#month').value = '';
    document.querySelector('#rate').value = '';
    document.querySelector('#period').value = '';
    result.innerHTML = '';
});

document.addEventListener('DOMContentLoaded', () => {
    preencherInvestimentos();
    preencherCampos();
    carregarHistorico();
});

function preencherCampos() {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente'));

    if (usuario) {
        document.getElementById('headerNomeUsuario').innerText = usuario.nome;
        document.getElementById('imagemHeader').src = usuario.foto || 'https://via.placeholder.com/100';
    } else {
        alert("Usuário não encontrado.");
    }
}

async function salvarRegistro(nomeRegistro, nomeInvestimento, valorInvestido, valorTotal) {
    try {
        const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
        if (!usuario || !usuario.id) {
            throw new Error("Usuário não autenticado.");
        }

        const response = await fetch(urlHistorico, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeRegistro,
                nomeInvestimento,
                valorInvestido,
                valorTotal,
                userId: usuario.id,
            }),
        });

        if (!response.ok) {
            throw new Error("Erro ao salvar o registro.");
        }

        const novoRegistro = await response.json();

        const id = novoRegistro.id;
        const registroAtualizado = `Registro ${id}`;

        await fetch(`${urlHistorico}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeRegistro: registroAtualizado,
            }),
        });

        await carregarHistorico();
    } catch (error) {
        console.error("Erro ao salvar o registro:", error);
    }
}