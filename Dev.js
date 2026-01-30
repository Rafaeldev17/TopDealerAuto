document.addEventListener('DOMContentLoaded', function() {
    console.log("O site da TopDealerAuto carregou com sucesso!");

    // 1. Atualização visual do Filtro de Quilometragem
    const kmInput = document.getElementById('kmRange');
    const kmLabel = document.getElementById('kmValue');

    if (kmInput && kmLabel) {
        kmInput.addEventListener('input', function(e) {
            const value = parseInt(e.target.value).toLocaleString('pt-BR');
            kmLabel.innerText = value;
        });
    }

    // 2. Lógica do Formulário de Filtro
    const filtroForm = document.getElementById('filtro-veiculos');
    if (filtroForm) {
        filtroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert("Filtros aplicados com sucesso!");
        });
    }

    // 3. Alerta de boas-vindas ao clicar no botão do topo
    const btnHero = document.querySelector('.btn-primary');
    if (btnHero) {
        btnHero.addEventListener('click', function() {
            alert('Obrigado pelo interesse! Em breve nosso estoque estará atualizado.');
        });
    }
});