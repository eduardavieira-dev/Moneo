     /**
 * Função para buscar dados de investimentos do backend.
 * 
 * @returns {Promise<Array>} Retorna uma lista de investimentos.
 */
    async function fetchInvestmentData() {
        try {
            const response = await fetch("/investimentos");
            if (!response.ok) {
                throw new Error("Erro ao buscar dados dos investimentos");
            }
            const investments = await response.json();
            return investments;
        } catch (error) {
            console.error("Erro ao obter dados:", error);
            return [];
        }
    }

    /**
     * Função para renderizar o gráfico na página.
     */
    async function renderChart() {
        const investments = await fetchInvestmentData();
        if (investments.length > 0) {
            createInvestmentsChart(investments);
        } else {
            console.warn("Nenhum dado encontrado para exibir no gráfico.");
        }
    }
    
    
    /**
     * Função para criar o gráfico de barras das taxas de investimentos.
     * 
     * @param {Array} data - Lista de investimentos com nome e taxa de juros.
     */
    function createInvestmentsChart(data) {
        const ctx = document.getElementById('investmentsChart').getContext('2d');
        const labels = data.map(item => item.nome); 
        const values = data.map(item => item.taxa); 
        const colors = '#aaeb9b';
    
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Taxa de Juros (%)',
                    data: values,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Taxas de Juros dos Investimentos',
                        font: {
                            size: 22 // Aumenta o tamanho do título
                        },
                        padding: {
                            top: 20,
                            bottom: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Taxa (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Investimentos'
                        }
                    }
                }
            }
        });
    }
    
    // Executa a renderização do gráfico ao carregar a página
    document.addEventListener('DOMContentLoaded', renderChart);
    

