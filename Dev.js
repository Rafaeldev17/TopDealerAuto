const API_BASE_URL = 'https://topdealer-api-acendkbfbwdpcuh6.brazilsouth-01.azurewebsites.net';

document.addEventListener('DOMContentLoaded', function() {
    console.log("O site da TopDealerAuto carregou com sucesso!");

    // --- Verificação de Login ---
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
        atualizarNavbar(usuarioSalvo);
    }

    // --- Lógica de Cadastro ---
    const cadastroForm = document.getElementById('form-cadastro'); 
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                const resposta = await fetch(`${API_BASE_URL}/api/usuarios/cadastrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha })
                });

                if (resposta.ok) {
                    const usuario = await resposta.json();
                    alert(`Sucesso! Usuário ${usuario.nome} cadastrado.`);
                    cadastroForm.reset(); 
                } else {
                    alert("Erro ao cadastrar.");
                }
            } catch (erro) {
                alert("Erro ao conectar com o servidor.");
            }
        });
    }

    // --- Lógica de Login ---
    const loginForm = document.getElementById('form-login'); 
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('login-email');
            const senhaInput = document.getElementById('login-senha');

            try {
                const resposta = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailInput.value, senha: senhaInput.value })
                });

                if (resposta.ok) {
                    const usuario = await resposta.json();
                    localStorage.setItem('usuarioLogado', usuario.nome);
                    localStorage.setItem('emailLogado', usuario.email);
                    localStorage.setItem('dadosCompletos', JSON.stringify(usuario));
                    atualizarNavbar(usuario.nome);
                    const modalLogin = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    if (modalLogin) modalLogin.hide();
                } else {
                    alert("Dados incorretos!");
                }
            } catch (erro) {
                alert("Servidor offline!");
            }
        });
    }

    // --- Perfil e Modal ---
    const modalPerfilElement = document.getElementById('perfilModal');
    if (modalPerfilElement) {
        modalPerfilElement.addEventListener('show.bs.modal', function () {
            const dados = JSON.parse(localStorage.getItem('dadosCompletos'));
            if (dados) {
                if(document.getElementById('perfil-email')) document.getElementById('perfil-email').value = dados.email || "";
                if(document.getElementById('perfil-senha')) document.getElementById('perfil-senha').value = dados.senha || "";
                if(document.getElementById('perfil-tel')) document.getElementById('perfil-tel').value = dados.telefone || "";
                if(document.getElementById('perfil-cep')) document.getElementById('perfil-cep').value = dados.cep || "";
                if(document.getElementById('perfil-end')) document.getElementById('perfil-end').value = dados.endereco || "";
            }
        });
    }

    // Inicialização de Máscaras e Paginação
    configurarMascaras();
    configurarPaginacao(); 
});

// --- FUNÇÕES GLOBAIS ---

function atualizarNavbar(nome) {
    const menuArea = document.getElementById('user-menu-area');
    if (menuArea) {
        menuArea.innerHTML = `
            <li class="nav-item">
                <a class="nav-link text-white fw-bold px-3" href="#" data-bs-toggle="modal" data-bs-target="#perfilModal">
                    <i class="bi bi-person-circle me-1"></i> Olá, ${nome.split(' ')[0]}!
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-danger px-3" href="#" onclick="logout()">Sair</a>
            </li>
        `;
    }
}

function logout() {
    localStorage.clear();
    window.location.reload();
}

function configurarMascaras() {
    const telInput = document.getElementById('perfil-tel');
    if (telInput) {
        telInput.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            let f = v.length > 0 ? '(' + v.substring(0, 2) + (v.length > 2 ? ') ' + v.substring(2, 7) + (v.length > 7 ? '-' + v.substring(7, 11) : '') : '') : '';
            e.target.value = f;
        });
    }
    document.querySelectorAll('.input-money').forEach(input => {
        input.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, "");
            e.target.value = v ? `R$ ${new Intl.NumberFormat('pt-BR').format(parseInt(v))}` : "";
        });
    });
    document.querySelectorAll('.input-km').forEach(input => {
        input.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, "");
            e.target.value = v ? new Intl.NumberFormat('pt-BR').format(parseInt(v)) : "";
        });
        input.addEventListener('blur', function() { if (this.value && !this.value.includes('km')) this.value += " km"; });
        input.addEventListener('focus', function() { this.value = this.value.replace(" km", "").replace(/\./g, ""); });
    });
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            input.type = input.type === 'password' ? 'text' : 'password';
            this.classList.toggle('bi-eye');
            this.classList.toggle('bi-eye-slash');
        });
    });
}

// --- CONFIGURAÇÃO DA PAGINAÇÃO ---
const itensPorPagina = 8; // Define que queremos 2 fileiras de 4
let paginaAtual = 1;

function configurarPaginacao() {
    // 1. Pega todos os cards que existem na tela
    const todosVeiculos = document.querySelectorAll('.card-veiculo');
    
    if (todosVeiculos.length === 0) return;

    // 2. Calcula o total de páginas necessário
    const totalPaginas = Math.ceil(todosVeiculos.length / itensPorPagina);
    const containerPaginacao = document.querySelector('.pagination');

    if (!containerPaginacao) return;

    // 3. FUNÇÃO PARA MOSTRAR OS CARROS CERTOS
    function atualizarCards() {
        const inicio = (paginaAtual - 1) * itensPorPagina;
        const fim = paginaAtual * itensPorPagina;

        todosVeiculos.forEach((veiculo, index) => {
            // Se o carro estiver dentro do intervalo da página, mostra. Se não, esconde.
            if (index >= inicio && index < fim) {
                veiculo.style.display = 'block';
            } else {
                veiculo.style.display = 'none';
            }
        });
        
        atualizarBotoes(totalPaginas);
    }

    // 4. FUNÇÃO PARA DESENHAR OS BOTÕES (1, 2, 3...)
    function atualizarBotoes(total) {
        let html = `
            <li class="page-item ${paginaAtual === 1 ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0)" onclick="mudarPagina(${paginaAtual - 1})">Anterior</a>
            </li>`;

        for (let i = 1; i <= total; i++) {
            html += `
                <li class="page-item ${i === paginaAtual ? 'active' : ''}">
                    <a class="page-link" href="javascript:void(0)" onclick="mudarPagina(${i})">${i}</a>
                </li>`;
        }

        html += `
            <li class="page-item ${paginaAtual === total ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0)" onclick="mudarPagina(${paginaAtual + 1})">Próxima</a>
            </li>`;

        containerPaginacao.innerHTML = html;
    }

    // Executa a lógica pela primeira vez
    atualizarCards();
}

// 5. FUNÇÃO GLOBAL PARA O CLIQUE
window.mudarPagina = function(num) {
    const todosVeiculos = document.querySelectorAll('.card-veiculo');
    const totalPaginas = Math.ceil(todosVeiculos.length / itensPorPagina);
    
    if (num < 1 || num > totalPaginas) return;
    
    paginaAtual = num;
    configurarPaginacao(); // Re-executa a lógica para esconder/mostrar
};
{
}

