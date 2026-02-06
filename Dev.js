document.addEventListener('DOMContentLoaded', function() {
    console.log("O site da TopDealerAuto carregou com sucesso!");

    // --- 1. Verificação de Usuário Logado ---
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
        atualizarNavbar(usuarioSalvo);
    }

    // --- 2. Lógica de Cadastro ---
    const cadastroForm = document.getElementById('form-cadastro'); 
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                const resposta = await fetch('http://localhost:8080/api/usuarios/cadastrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha })
                });

                if (resposta.ok) {
                    const usuario = await resposta.json();
                    alert(`Sucesso! Usuário ${usuario.nome} cadastrado.`);
                    cadastroForm.reset(); 
                    // Opcional: fechar o modal de cadastro e abrir o de login
                } else {
                    alert("Erro ao cadastrar. Verifique se o e-mail já existe.");
                }
            } catch (erro) {
                console.error("Falha na conexão:", erro);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }

    // --- 3. Lógica de Login ---
    const loginForm = document.getElementById('form-login'); 
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('login-email');
            const senhaInput = document.getElementById('login-senha');

            if (!emailInput || !senhaInput) {
                alert("Erro técnico: Campos de login não localizados.");
                return;
            }

            try {
                const resposta = await fetch('http://localhost:8080/api/usuarios/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailInput.value, senha: senhaInput.value })
                });

                if (resposta.ok) {
                    const usuario = await resposta.json();
                    
                    // IMPORTANTE: Salva os dados no navegador para usar depois
                    localStorage.setItem('usuarioLogado', usuario.nome);
                    localStorage.setItem('emailLogado', usuario.email);

                    atualizarNavbar(usuario.nome);

                    const modalLogin = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    if (modalLogin) modalLogin.hide();
                    
                    alert(`Seja bem-vindo, ${usuario.nome}!`);
                } else {
                    alert("E-mail ou senha incorretos!");
                }
            } catch (erro) {
                console.error("Erro no login:", erro);
                alert("Servidor fora do ar!");
            }
        });
    }

    // --- 4. Lógica de Atualização de Perfil (CORRIGIDO) ---
    const perfilForm = document.getElementById('form-perfil');
    if (perfilForm) {
        perfilForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Pega o email salvo no login
            const email = localStorage.getItem('emailLogado');
            
            if (!email) {
                alert("Sessão expirada. Por favor, faça login novamente.");
                window.location.reload();
                return;
            }

            const dadosPerfil = {
                telefone: document.getElementById('perfil-tel').value,
                cep: document.getElementById('perfil-cep').value,
                endereco: document.getElementById('perfil-end').value
            };

            try {
                const resposta = await fetch(`http://localhost:8080/api/usuarios/atualizar/${email}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosPerfil)
                });

                if (resposta.ok) {
                    alert("✅ Informações atualizadas com sucesso!");
                    const modalPerfil = bootstrap.Modal.getInstance(document.getElementById('perfilModal'));
                    if (modalPerfil) modalPerfil.hide();
                } else {
                    const erroTxt = await resposta.text();
                    alert("Erro ao atualizar: " + erroTxt);
                }
            } catch (erro) {
                console.error("Erro no fetch:", erro);
                alert("Erro de conexão ao salvar perfil.");
            }
        });
    }

    // --- 5. Busca Automática de CEP ---
    const campoCep = document.getElementById('perfil-cep');
    if (campoCep) {
        campoCep.addEventListener('blur', async function() {
            let cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                try {
                    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await res.json();
                    if (!data.erro) {
                        document.getElementById('perfil-end').value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                    } else {
                        alert("CEP não encontrado.");
                    }
                } catch (e) {
                    console.error("Erro ao buscar CEP");
                }
            }
        });
    }

    // --- 6. Inicializações ---
    configurarMascaras();
});

// --- Funções Auxiliares ---

function atualizarNavbar(nome) {
    const menuArea = document.getElementById('user-menu-area');
    if (menuArea) {
        menuArea.innerHTML = `
            <li class="nav-item">
                <a class="nav-link text-white fw-bold px-3" href="#" data-bs-toggle="modal" data-bs-target="#perfilModal" style="cursor: pointer;">
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
    // Máscara de Telefone: (00) 00000-0000
    const telInput = document.getElementById('perfil-tel');
    if (telInput) {
        telInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formatted = "";
            if (value.length > 0) {
                formatted = '(' + value.substring(0, 2);
                if (value.length > 2) formatted += ') ' + value.substring(2, 7);
                if (value.length > 7) formatted += '-' + value.substring(7, 11);
            }
            e.target.value = formatted;
        });
    }

    // Máscara de Moeda para filtros
    document.querySelectorAll('.input-money').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value === "") return;
            e.target.value = `R$ ${new Intl.NumberFormat('pt-BR').format(parseInt(value))}`;
        });
    });

    // Toggle de Senha
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const container = this.parentElement;
            const input = container.querySelector('input');
            input.type = input.type === 'password' ? 'text' : 'password';
            this.classList.toggle('bi-eye');
            this.classList.toggle('bi-eye-slash');
        });
    });
}