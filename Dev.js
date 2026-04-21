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
    },
    {
        id: 5,
        marca: "Jeep",
        modelo: "Compass Limited TD350 4x4",
        ano: 2023,
        km: 12000,
        preco: 220000,
        cambio: "Automático",
        img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800",
        galeria: [],
        specs: { cor: "Azul", placa: "0", combustivel: "Diesel", portas: "4" }
    },
    {
        id: 6,
        marca: "Ford",
        modelo: "Bronco Sport Wildtrak",
        ano: 2022,
        km: 25000,
        preco: 210000,
        cambio: "Automático",
        img: "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?auto=format&fit=crop&q=80&w=800",
        galeria: [],
        specs: { cor: "Laranja", placa: "4", combustivel: "Gasolina", portas: "4" }
    },
    {
        id: 7,
        marca: "BMW",
        modelo: "320i M Sport",
        ano: 2021,
        km: 30000,
        preco: 285000,
        cambio: "Automático",
        img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800",
        galeria: [],
        specs: { cor: "Branco", placa: "7", combustivel: "Flex", portas: "4" }
    },
    {
        id: 8,
        marca: "Mercedes-Benz",
        modelo: "C 300 AMG Line",
        ano: 2022,
        km: 18000,
        preco: 340000,
        cambio: "Automático",
        img: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800",
        galeria: [],
        specs: { cor: "Preto", placa: "1", combustivel: "Gasolina", portas: "4" }
    },
    {
        id: 9,
        marca: "Audi",
        modelo: "Q3 Performance Black",
        ano: 2023,
        km: 8000,
        preco: 295000,
        cambio: "Automático",
        img: "https://images.unsplash.com/photo-1541348263662-e0c8643c21ee?auto=format&fit=crop&q=80&w=800",
        galeria: [],
        specs: { cor: "Cinza", placa: "6", combustivel: "Gasolina", portas: "4" }
    },
    {
        id: 10,
        marca: "Hyundai",
        modelo: "HB20 Platinum Plus",
        ano: 2023,
        km: 10000,
        preco: 105000,
        cambio: "Automático",
        img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
        galeria: [],
        specs: { cor: "Prata", placa: "9", combustivel: "Flex", portas: "4" }
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

let paginaAtual = 1;
const itensPorPagina = 8;

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
    const cards = Array.from(document.querySelectorAll(".card-veiculo"));
    
    // 1. Filtragem dos elementos do DOM
    const cardsFiltrados = cards.filter(card => {
        const marca = card.getAttribute("data-marca").toLowerCase();
        const modelo = card.getAttribute("data-modelo").toLowerCase();
        const preco = parseInt(card.getAttribute("data-preco"));
        const ano = parseInt(card.getAttribute("data-ano"));
        const id = parseInt(card.getAttribute("data-id"));

        const matchBusca = modelo.includes(filtros.busca.toLowerCase()) || 
                           marca.includes(filtros.busca.toLowerCase());
        const matchMarca = filtros.marca === "" || marca === filtros.marca.toLowerCase();
        const matchPreco = preco <= filtros.precoMax;
        const matchAno = ano >= filtros.anoMin;
        const matchFavorito = !filtros.apenasFavoritos || favoritos.includes(id);

        return matchBusca && matchMarca && matchPreco && matchAno && matchFavorito;
    });

    const totalVeiculos = cardsFiltrados.length;
    const totalPaginas = Math.ceil(totalVeiculos / itensPorPagina);

    // Garantir que a página atual seja válida
    if (paginaAtual > totalPaginas && totalPaginas > 0) {
        paginaAtual = totalPaginas;
    }
    if (paginaAtual < 1) paginaAtual = 1;

    // 2. Determinar quais cards mostrar (Paginação)
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    
    // Esconder TODOS os cards primeiro
    cards.forEach(card => card.classList.add("d-none"));

    // Mostrar apenas os filtrados que pertencem à página atual
    cardsFiltrados.slice(inicio, fim).forEach(card => {
        card.classList.remove("d-none");
    });

    // 3. Renderizar controles de paginação
    renderizarPaginacao(totalPaginas);

    // Mensagem de "Nenhum resultado"
    const lista = document.getElementById("lista-veiculos");
    const noResultId = "no-results-msg";
    let noResultEl = document.getElementById(noResultId);

    if (totalVeiculos === 0) {
        if (!noResultEl) {
            noResultEl = document.createElement("div");
            noResultEl.id = noResultId;
            noResultEl.className = "col-12 text-center py-5";
            noResultEl.innerHTML = `
                <i class="bi bi-search fs-1 text-muted"></i>
                <p class="mt-3 text-muted">Nenhum veículo encontrado com esses filtros.</p>
                <button class="btn btn-link" onclick="resetarFiltros()">Limpar Filtros</button>
            `;
            lista.appendChild(noResultEl);
        }
    } else if (noResultEl) {
        noResultEl.remove();
    }
}

window.renderizarPaginacao = function(totalPaginas) {
    const paginacaoContainer = document.querySelector(".pagination");
    if (!paginacaoContainer) return;

    if (totalPaginas <= 1) {
        paginacaoContainer.innerHTML = "";
        return;
    }

    let html = `
        <li class="page-item ${paginaAtual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#estoque" onclick="mudarPagina(${paginaAtual - 1})">Anterior</a>
        </li>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
        html += `
            <li class="page-item ${paginaAtual === i ? 'active' : ''}">
                <a class="page-link" href="#estoque" onclick="mudarPagina(${i})">${i}</a>
            </li>
        `;
    }

    html += `
        <li class="page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#estoque" onclick="mudarPagina(${paginaAtual + 1})">Próxima</a>
        </li>
    `;

    paginacaoContainer.innerHTML = html;
}

window.mudarPagina = function(novaPagina) {
    paginaAtual = novaPagina;
    renderizarEstoque();
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
