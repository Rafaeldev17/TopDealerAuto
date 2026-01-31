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
   
    
});
// Seleciona todos os campos que têm a classe 'input-money'
const moneyInputs = document.querySelectorAll('.input-money');

moneyInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value;

        // 1. Remove tudo o que não é dígito
        value = value.replace(/\D/g, "");

        // 2. Se estiver vazio, limpa o campo
        if (value === "") {
            e.target.value = "";
            return;
        }

        // 3. Formata como moeda (Ex: 120000 vira 120.000)
        // Intl.NumberFormat para garantir a pontuação correta
        const formatter = new Intl.NumberFormat('pt-BR');
        const formattedValue = formatter.format(parseInt(value));

        // 4. Exibe com o prefixo R$
        e.target.value = `R$ ${formattedValue}`;
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os ícones de olho (para login e cadastro)
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Encontra o input de senha que está no mesmo bloco que o ícone
            const passwordInput = this.parentElement.querySelector('input');
            
            if (passwordInput.type === 'password') {
                // Mostra a senha
                passwordInput.type = 'text';
                // Troca o ícone para o olho aberto
                this.classList.remove('bi-eye-slash');
                this.classList.add('bi-eye');
            } else {
                // Esconde a senha
                passwordInput.type = 'password';
                // Volta o ícone para o olho cortado
                this.classList.remove('bi-eye');
                this.classList.add('bi-eye-slash');
            }
        });
    });
});