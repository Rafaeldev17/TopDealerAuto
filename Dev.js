/**
 * TopDealerAuto - Dev.js
 * Lógica modular para gerenciamento de estoque, filtros e favoritos.
 */

const API_BASE_URL = "http://localhost:8080/api"; // Ajuste se necessário

// 1. Dados dos Veículos (Simulação de Banco de Dados)
const VEICULOS = [
    {
        id: 1,
        marca: "Nissan",
        modelo: "Kicks SL 1.6 16V Flexstar 5P Aut.",
        ano: 2017,
        km: 68000,
        preco: 79800,
        cambio: "Automático",
        img: "Kicks2.jpeg",
        galeria: ["Kicks2.jpeg", "Kicks3.jpeg", "Kicks4.jpeg", "Kicks5.jpeg", "Kicks6.jpeg", "Kicks7.jpeg", "Kicks8.jpeg", "Kicks9.jpeg"],
        specs: { cor: "Cinza", placa: "2", combustivel: "Flex", portas: "4" }
    },
    {
        id: 2,
        marca: "Toyota",
        modelo: "Corolla XEI 2.0 Flex",
        ano: 2021,
        km: 35000,
        preco: 125000,
        cambio: "Automático",
        img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800",
        galeria: [],
        specs: { cor: "Preto", placa: "5", combustivel: "Flex", portas: "4" }
    },
    {
        id: 3,
        marca: "Honda",
        modelo: "Civic Touring 1.5 Turbo",
        ano: 2020,
        km: 42000,
        preco: 138000,
        cambio: "Automático",
        img: "https://images.unsplash.com/photo-1594976612710-664f24302672?auto=format&fit=crop&q=80&w=800",
        galeria: [],
        specs: { cor: "Branco", placa: "8", combustivel: "Gasolina", portas: "4" }
    },
    {
        id: 4,
        marca: "Volkswagen",
        modelo: "Nivus Highline 200 TSI",
        ano: 2022,
        km: 15000,
        preco: 115900,
        cambio: "Automático",
        img: "https://images.unsplash.com/photo-1631006509650-619f563d6b05?auto=format&fit=crop&q=80&w=800",
        galeria: [],
        specs: { cor: "Cinza Moon", placa: "3", combustivel: "Flex", portas: "4" }
    }
];

// 2. Estado da Aplicação
let filtros = {
    busca: "",
    marca: "",
    precoMax: 500000,
    anoMin: 0,
    apenasFavoritos: false
};

let favoritos = JSON.parse(localStorage.getItem("topdealer_favs")) || [];
let galeriaAtual = [];
let indiceImagemAtual = 0;

// 3. Inicialização
document.addEventListener("DOMContentLoaded", () => {
    inicializarApp();
});

window.inicializarApp = function() {
    aplicarTemaSalvo();
    renderizarEstoque();
    configurarEventos();
    checarUsuarioLogado();
}

function aplicarTemaSalvo() {
    const temaSalvo = localStorage.getItem("topdealer_theme") || "light";
    document.documentElement.setAttribute("data-theme", temaSalvo);
    atualizarIconeTema(temaSalvo);
}

window.toggleDarkMode = function() {
    const atual = document.documentElement.getAttribute("data-theme") || "light";
    const novo = atual === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", novo);
    localStorage.setItem("topdealer_theme", novo);
    atualizarIconeTema(novo);
}

function atualizarIconeTema(tema) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const icone = btn.querySelector("i");
    if (tema === "dark") {
        icone.classList.replace("bi-moon-stars", "bi-sun");
    } else {
        icone.classList.replace("bi-sun", "bi-moon-stars");
    }
}

// 4. Renderização
window.renderizarEstoque = function() {
    const lista = document.getElementById("lista-veiculos");
    if (!lista) return;

    const veiculosFiltrados = VEICULOS.filter(v => {
        const matchBusca = v.modelo.toLowerCase().includes(filtros.busca.toLowerCase()) || 
                           v.marca.toLowerCase().includes(filtros.busca.toLowerCase());
        const matchMarca = filtros.marca === "" || v.marca === filtros.marca;
        const matchPreco = v.preco <= filtros.precoMax;
        const matchAno = v.ano >= filtros.anoMin;
        const matchFavorito = !filtros.apenasFavoritos || favoritos.includes(v.id);

        return matchBusca && matchMarca && matchPreco && matchAno && matchFavorito;
    });

    document.getElementById("count-veiculos").innerText = veiculosFiltrados.length;

    if (veiculosFiltrados.length === 0) {
        lista.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search fs-1 text-muted"></i>
                <p class="mt-3 text-muted">Nenhum veículo encontrado com esses filtros.</p>
                <button class="btn btn-link" onclick="resetarFiltros()">Limpar Filtros</button>
            </div>
        `;
        return;
    }

    lista.innerHTML = veiculosFiltrados.map(v => `
        <div class="col-md-4 card-veiculo">
            <div class="card h-100 border-0 shadow-sm hover-shadow" onclick="abrirDetalhes(${v.id})" style="cursor: pointer;">
                <div class="img-container">
                    <button class="btn-favorite ${favoritos.includes(v.id) ? 'active' : ''}" onclick="toggleFavorito(${v.id}, event)">
                        <i class="bi bi-heart${favoritos.includes(v.id) ? '-fill' : ''}"></i>
                    </button>
                    <img src="${v.img}" class="card-img-top" alt="${v.modelo}">
                </div>
                <div class="card-body d-flex flex-column p-4">
                    <span class="badge bg-light text-primary mb-2 align-self-start">${v.marca}</span>
                    <h5 class="card-title fw-bold mb-1">${v.modelo}</h5>
                    <p class="card-text text-muted small mb-3">${v.ano} | ${v.km.toLocaleString()} Km | ${v.cambio}</p>
                    <p class="fs-4 fw-bold text-dark mt-auto mb-3">R$ ${v.preco.toLocaleString('pt-BR')}</p>
                    <button class="btn btn-outline-dark w-100 fw-bold rounded-pill">Ver Detalhes</button>
                </div>
            </div>
        </div>
    `).join("");
}

// 5. Lógica de Filtros e Eventos
function configurarEventos() {
    // Busca Global
    const inputBusca = document.getElementById("busca-global");
    if (inputBusca) {
        inputBusca.addEventListener("input", (e) => {
            filtros.busca = e.target.value;
            renderizarEstoque();
        });
    }

    // Filtro Marca
    const selectMarca = document.getElementById("filtro-marca");
    if (selectMarca) {
        selectMarca.addEventListener("change", (e) => {
            filtros.marca = e.target.value;
            renderizarEstoque();
        });
    }

    // Filtro Preço
    const inputPreco = document.getElementById("filtro-preco");
    const labelPreco = document.getElementById("preco-max-label");
    if (inputPreco) {
        inputPreco.addEventListener("input", (e) => {
            filtros.precoMax = parseInt(e.target.value);
            labelPreco.innerText = `Até R$ ${filtros.precoMax.toLocaleString('pt-BR')}`;
            renderizarEstoque();
        });
    }

    // Filtro Ano
    const selectAno = document.getElementById("filtro-ano");
    if (selectAno) {
        selectAno.addEventListener("change", (e) => {
            filtros.anoMin = parseInt(e.target.value) || 0;
            renderizarEstoque();
        });
    }

    // Botão Limpar Filtros
    document.getElementById("limpar-filtros")?.addEventListener("click", resetarFiltros);

    // Botão Ver Favoritos
    document.getElementById("ver-favoritos")?.addEventListener("click", function() {
        filtros.apenasFavoritos = !filtros.apenasFavoritos;
        this.classList.toggle("btn-danger");
        this.classList.toggle("btn-outline-danger");
        this.innerHTML = filtros.apenasFavoritos ? 
            '<i class="bi bi-grid me-2"></i>Ver Todos' : 
            '<i class="bi bi-heart-fill me-2"></i>Ver Favoritos';
        renderizarEstoque();
    });
}

window.resetarFiltros = function() {
    filtros = { busca: "", marca: "", precoMax: 500000, anoMin: 0, apenasFavoritos: false };
    const buscaGlobal = document.getElementById("busca-global");
    if (buscaGlobal) buscaGlobal.value = "";
    const filtroMarca = document.getElementById("filtro-marca");
    if (filtroMarca) filtroMarca.value = "";
    const filtroPreco = document.getElementById("filtro-preco");
    if (filtroPreco) filtroPreco.value = 500000;
    const filtroAno = document.getElementById("filtro-ano");
    if (filtroAno) filtroAno.value = "";
    const precoLabel = document.getElementById("preco-max-label");
    if (precoLabel) precoLabel.innerText = "Até R$ 500.000";
    renderizarEstoque();
}

// 6. Sistema de Favoritos
window.toggleFavorito = function(id, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    const index = favoritos.indexOf(id);
    if (index === -1) {
        favoritos.push(id);
    } else {
        favoritos.splice(index, 1);
    }
    localStorage.setItem("topdealer_favs", JSON.stringify(favoritos));
    renderizarEstoque();
}

// 7. Visualização de Detalhes
window.abrirDetalhes = function(id) {
    const v = VEICULOS.find(x => x.id === id);
    if (!v) return;

    // Configurar Galeria
    galeriaAtual = v.galeria && v.galeria.length > 0 ? v.galeria : [v.img];
    indiceImagemAtual = 0;

    // Preencher Modal
    const mainImg = document.getElementById("viewMainImage");
    if (mainImg) mainImg.src = galeriaAtual[0];
    
    const viewModelo = document.getElementById("viewModelo");
    if (viewModelo) viewModelo.innerText = v.modelo;
    
    const viewAnoKm = document.getElementById("viewAnoKm");
    if (viewAnoKm) viewAnoKm.innerText = `${v.ano} | ${v.km.toLocaleString()} Km | ${v.cambio}`;
    
    const viewPreco = document.getElementById("viewPreco");
    if (viewPreco) viewPreco.innerText = `R$ ${v.preco.toLocaleString('pt-BR')}`;

    // Especificações
    const specCor = document.getElementById("spec-cor");
    if (specCor) specCor.innerText = v.specs.cor;
    const specPlaca = document.getElementById("spec-placa");
    if (specPlaca) specPlaca.innerText = v.specs.placa;
    const specComb = document.getElementById("spec-comb");
    if (specComb) specComb.innerText = v.specs.combustivel;
    const specPortas = document.getElementById("spec-portas");
    if (specPortas) specPortas.innerText = v.specs.portas;

    // Link WhatsApp
    const msg = encodeURIComponent(`Olá! Tenho interesse no ${v.marca} ${v.modelo} anunciado na TopDealerAuto.`);
    const btnWhats = document.getElementById("btn-whatsapp-detalhe");
    if (btnWhats) btnWhats.href = `https://wa.me/5516991475066?text=${msg}`;

    // Renderizar Miniaturas
    const galleryContainer = document.getElementById("thumbGallery");
    if (galleryContainer) {
        galleryContainer.innerHTML = galeriaAtual.map((img, index) => `
            <div class="col-3">
                <img src="${img}" class="img-thumbnail thumb-img ${index === 0 ? 'active' : ''}" 
                     onclick="window.trocarImagemManual(${index}, event)" style="cursor:pointer">
            </div>
        `).join("");
    }

    // Modal
    const modalElement = document.getElementById('detalhesVeiculoModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

window.trocarImagemManual = function(index, event) {
    if (event) event.stopPropagation();
    indiceImagemAtual = index;
    atualizarDisplayImagem();
}

window.mudarImagem = function(direcao) {
    if (!galeriaAtual || galeriaAtual.length <= 1) return;
    
    indiceImagemAtual += direcao;
    
    if (indiceImagemAtual >= galeriaAtual.length) {
        indiceImagemAtual = 0;
    } else if (indiceImagemAtual < 0) {
        indiceImagemAtual = galeriaAtual.length - 1;
    }
    
    atualizarDisplayImagem();
}

window.atualizarDisplayImagem = function() {
    const mainImg = document.getElementById("viewMainImage");
    if (mainImg) mainImg.src = galeriaAtual[indiceImagemAtual];
    
    // Atualizar miniaturas ativas
    document.querySelectorAll(".thumb-img").forEach((t, i) => {
        if (i === indiceImagemAtual) {
            t.classList.add("active");
        } else {
            t.classList.remove("active");
        }
    });
}

// 8. Integração Backend (Login/Auth)
function checarUsuarioLogado() {
    const usuario = JSON.parse(localStorage.getItem("usuario_logado"));
    if (usuario) {
        const perfilBtn = document.getElementById("perfil-logado");
        if (perfilBtn) perfilBtn.style.display = "block";
        document.querySelectorAll(".guest-item").forEach(el => el.style.display = "none");
        const displayNome = document.getElementById("nome-usuario-display");
        if (displayNome) displayNome.innerText = usuario.nome;
        const displayEmail = document.getElementById("info-flutuante-email");
        if (displayEmail) displayEmail.innerText = usuario.email;
        
        // Preencher modal de perfil
        const inputEmail = document.getElementById("perfil-email");
        if (inputEmail) inputEmail.value = usuario.email;
    }
}

// Evento de Login
document.getElementById("form-login")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;

    try {
        const res = await fetch(`${API_BASE_URL}/usuarios/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });
        if (res.ok) {
            const user = await res.json();
            localStorage.setItem("usuario_logado", JSON.stringify(user));
            window.location.reload();
        } else {
            alert("E-mail ou senha incorretos.");
        }
    } catch (err) {
        alert("Erro ao conectar com o servidor.");
    }
});

// Evento de Cadastro
document.getElementById("form-cadastro")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const res = await fetch(`${API_BASE_URL}/usuarios/cadastrar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });
        if (res.ok) {
            alert("Cadastro realizado com sucesso! Faça login para continuar.");
            bootstrap.Modal.getInstance(document.getElementById('cadastroModal')).hide();
            new bootstrap.Modal(document.getElementById('loginModal')).show();
        } else {
            alert("Erro ao cadastrar.");
        }
    } catch (err) {
        alert("Erro ao conectar com o servidor.");
    }
});

// Evento de Atualização de Perfil
document.getElementById("form-perfil")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usuario = JSON.parse(localStorage.getItem("usuario_logado"));
    const dados = {
        telefone: document.getElementById("perfil-tel").value,
        cep: document.getElementById("perfil-cep").value,
        endereco: document.getElementById("perfil-end").value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/usuarios/atualizar/${usuario.email}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        if (res.ok) {
            alert("Perfil atualizado!");
            const updatedUser = await res.json();
            localStorage.setItem("usuario_logado", JSON.stringify(updatedUser));
            window.location.reload();
        }
    } catch (err) {
        alert("Erro ao atualizar perfil.");
    }
});

document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.removeItem("usuario_logado");
    window.location.reload();
});

// Nota: A implementação de Login/Cadastro deve seguir o padrão do seu backend.
// Exemplo simplificado de Login:
/*
async function login(email, senha) {
    const res = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });
    if (res.ok) {
        const user = await res.json();
        localStorage.setItem("usuario_logado", JSON.stringify(user));
        window.location.reload();
    } else {
        alert("Credenciais inválidas");
    }
}
*/
