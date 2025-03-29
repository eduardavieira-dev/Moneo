const historicoEndpoint = "http://localhost:3000/historico";
const historicoBody = document.getElementById("historico-body");

async function carregarHistorico() {
    try {
        const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente')); // Obtem o usuário do sessionStorage
        if (!usuario || !usuario.id) {
            throw new Error("Usuário não autenticado.");
        }

        const response = await fetch(historicoEndpoint);
        if (!response.ok) throw new Error("Erro ao carregar o histórico.");

        const historico = await response.json();

        if (!Array.isArray(historico)) {
            throw new Error("O formato do histórico não é válido.");
        }

        historicoBody.innerHTML = "";

        const registrosUsuario = historico.filter((registro) => registro.userId === usuario.id);

        registrosUsuario.forEach((registro) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${registro.nomeRegistro}</td>
                <td>${registro.nomeInvestimento}</td>
                <td>R$${parseFloat(registro.valorInvestido).toFixed(2)}</td>
                <td>R$${parseFloat(registro.valorTotal).toFixed(2)}</td>
                <td>
                    <img
                        src="../assets/images/trash.svg"
                        alt="Excluir"
                        class="deleteRegistro"
                        data-id="${registro.id}"
                        style="cursor: pointer;"
                    />
                </td>
            `;

            historicoBody.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao carregar o histórico:", error);
    }
}

async function excluirRegistro(id) {
    try {
        await fetch(`${historicoEndpoint}/${id}`, {
            method: "DELETE",
        });
        await carregarHistorico();
    } catch (error) {
        console.error("Erro ao excluir o registro:", error);
    }
}

document.getElementById("historico").addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("deleteRegistro")) {
        const id = event.target.dataset.id;
        excluirRegistro(id);
    }
});

document.addEventListener("DOMContentLoaded", carregarHistorico);