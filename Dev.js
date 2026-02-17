document.addEventListener('DOMContentLoaded', function() {
    console.log("O site da TopDealerAuto carregou com sucesso!");

    // --- 1. Verificação de Usuário Logado ---
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
        atualizarNavbar(usuarioSalvo);
    }

    // --- 2. Lógica do Filtro de Veículos (CORRIGIDA PARA MÁSCARAS) ---
    const filtroForm = document.getElementById('filtro-veiculos');
    if (filtroForm) {
        filtroForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Função para converter "R$ 10.000" ou "15.000 km" em número puro (10000)
            const extrairNumero = (valor) => {
                if (!valor) return null;
                const num = parseInt(valor.replace(/\D/g, ""));
                return isNaN(num) ? null : num;
            };

            // Pegando os valores dos filtros
            const marca = filtroForm.querySelector('select').value;
            const modelo = filtroForm.querySelectorAll('input[type="text"]')[0].value.toLowerCase();
            const anoMin = parseInt(filtroForm.querySelectorAll('input[type="number"]')[0].value);
            const anoMax = parseInt(filtroForm.querySelectorAll('input[type="number"]')[1].value);
            
            // Usando a limpeza para KM e Preço
            const kmMin = extrairNumero(filtroForm.querySelectorAll('.input-km')[0].value);
            const kmMax = extrairNumero(filtroForm.querySelectorAll('.input-km')[1].value);
            const precoMin = extrairNumero(filtroForm.querySelectorAll('.input-money')[0].value);
            const precoMax = extrairNumero(filtroForm.querySelectorAll('.input-money')[1].value);

            const cards = document.querySelectorAll('.card-veiculo');

            cards.forEach(card => {
                const cMarca = card.getAttribute('data-marca');
                const cModelo = card.getAttribute('data-modelo').toLowerCase();
                const cAno = parseInt(card.getAttribute('data-ano'));
                const cKm = parseInt(card.getAttribute('data-km'));
                const cPreco = parseInt(card.getAttribute('data-preco'));

                let visivel = true;

                if (marca !== 'Todas' && cMarca !== marca) visivel = false;
                if (modelo && !cModelo.includes(modelo)) visivel = false;
                if (anoMin && cAno < anoMin) visivel = false;
                if (anoMax && cAno > anoMax) visivel = false;
                if (kmMin !== null && cKm < kmMin) visivel = false;
                if (kmMax !== null && cKm > kmMax) visivel = false;
                if (precoMin !== null && cPreco < precoMin) visivel = false;
                if (precoMax !== null && cPreco > precoMax) visivel = false;

                card.style.display = visivel ? 'block' : 'none';
            });
        });
    }

    // --- 3. Lógica de Cadastro ---
    const cadastroForm = document.getElementById('form-cadastro'); 
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                // ALTERAÇÃO: Apontando para o seu Java Local que está ligado
                const resposta = await fetch('http://localhost:8080/usuarios', {
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
                alert("Erro ao conectar com o servidor local.");
            }
        });
    }

    // --- 4. Lógica de Login ---
    const loginForm = document.getElementById('form-login'); 
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('login-email');
            const senhaInput = document.getElementById('login-senha');

            try {
                // ALTERAÇÃO: Apontando para o seu Java Local (localhost:8080)
                const resposta = await fetch('http://localhost:8080/usuarios/login', {
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
                console.error(erro);
                alert("Servidor local offline ou erro de CORS!");
            }
        });
    }

    // --- 5. Preenchimento do Perfil e Outros ---
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

    configurarMascaras();
});

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
        input.addEventListener('blur', function() {
            if (this.value && !this.value.includes('km')) this.value += " km";
        });
        input.addEventListener('focus', function() {
            this.value = this.value.replace(" km", "").replace(/\./g, "");
        });
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