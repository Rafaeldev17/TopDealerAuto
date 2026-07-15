/**
 * TopDealerAuto - Dev.js
 * Lógica modular para gerenciamento de estoque, filtros e favoritos.
 */

// const API_BASE_URL = "https://topdealer-api-acendkbfbwdpcuh6.brazilsouth-01.azurewebsites.net/api";
const API_BASE_URL = "http://localhost:8080/api"
// 1. Dados dos Veículos (Banco de Dados)
const VEICULOS = [
    {
        id: 1,
        marca: "Fiat",
        modelo: "Fiat Cronos Drive 1.3",
        ano: 2024,
        km: 29000,
        preco: 91900,
        cambio: "Automático",
        img: "Fiat Cronos principal.jpeg",
        galeria: ["cronos-principal.jpeg", "cronos-detalhes-1.jpeg", "cronos-detalhes-2.jpeg","cronos-detalhes-3.jpeg","cronos-detalhes-4.jpeg","cronos-detalhes-5.jpeg","cronos-detalhes-6.jpeg","cronos-detalhes-7.jpeg"],
        specs: { cor: "Branco", combustivel: "Flex", portas: "4" }
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
        specs: { cor: "Preto", combustivel: "Flex", portas: "4" }
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
        specs: { cor: "Branco", combustivel: "Gasolina", portas: "4" }
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
        specs: { cor: "Cinza Moon", combustivel: "Flex", portas: "4" }
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
        specs: { cor: "Azul", combustivel: "Diesel", portas: "4" }
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
        specs: { cor: "Laranja", combustivel: "Gasolina", portas: "4" }
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
        specs: { cor: "Branco", combustivel: "Flex", portas: "4" }
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
        specs: { cor: "Preto", combustivel: "Gasolina", portas: "4" }
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
        specs: { cor: "Cinza", combustivel: "Gasolina", portas: "4" }
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
        specs: { cor: "Prata", combustivel: "Flex", portas: "4" }
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

const TRANSLATIONS = {
    "pt-br": {
        heroTitle: "Encontre seu próximo carro aqui",
        heroSubtitle: "A melhor curadoria de veículos com a confiança TopDealerAuto.",
        inventoryTitle: "Nosso Estoque",
        emptyInventoryTitle: "Aguarde atualizações do estoque!",
        emptyInventoryDesc: "Estamos preparando novidades incríveis para você. Volte em breve!",
        contactTitle: "Fale Conosco",
        contactDesc: "Dúvidas ou quer vender seu carro? Entre em contato.",
        contactEmail: "E-mail",
        contactWhatsapp: "WhatsApp",
        copyright: "© 2026 TopDealerAuto. Todos os direitos reservados.",
        btnDetails: "Ver Detalhes",
        destaque: "Destaque",
        especificacoes: "Especificações Técnicas",
        cor: "Cor",
        combustivel: "Combustível",
        portas: "Portas",
        btnWhats: "Tenho Interesse"
    },
    "en-us": {
        heroTitle: "Find your next car here",
        heroSubtitle: "The best vehicle curation with TopDealerAuto's trust.",
        inventoryTitle: "Our Inventory",
        emptyInventoryTitle: "Wait for stock updates!",
        emptyInventoryDesc: "We are preparing incredible news for you. Come back soon!",
        contactTitle: "Contact Us",
        contactDesc: "Questions or want to sell your car? Get in touch.",
        contactEmail: "Email",
        contactWhatsapp: "WhatsApp",
        copyright: "© 2026 TopDealerAuto. All rights reserved.",
        btnDetails: "View Details",
        destaque: "Featured",
        especificacoes: "Technical Specifications",
        cor: "Color",
        combustivel: "Fuel",
        portas: "Doors",
        btnWhats: "I am interested"
    },
    "es-es": {
        heroTitle: "Encuentra tu próximo coche aquí",
        heroSubtitle: "La mejor selección de veículos con la confianza de TopDealerAuto.",
        inventoryTitle: "Nuestro Stock",
        emptyInventoryTitle: "¡Espere actualizaciones de stock!",
        emptyInventoryDesc: "Estamos preparando novedades increíbles para usted. ¡Vuelva pronto!",
        contactTitle: "Contáctenos",
        contactDesc: "¿Dudas o quieres vender tu coche? Ponte en contacto.",
        contactEmail: "Correo electrónico",
        contactWhatsapp: "WhatsApp",
        copyright: "© 2026 TopDealerAuto. Todos los derechos reservados.",
        btnDetails: "Ver Detalles",
        destaque: "Destacado",
        especificacoes: "Especificaciones Técnicas",
        cor: "Color",
        combustivel: "Combustible",
        portas: "Puertas",
        btnWhats: "Tengo interés"
    }
};

const CAMBIO_TRADUCAO = {
    "pt-br": { "Automático": "Automático", "Manual": "Manual" },
    "en-us": { "Automático": "Automatic", "Manual": "Manual" },
    "es-es": { "Automático": "Automático", "Manual": "Manual" }
};

const CORES_TRADUCAO = {
    "pt-br": { "Branco": "Branco", "Preto": "Preto", "Prata": "Prata", "Cinza": "Cinza" },
    "en-us": { "Branco": "White", "Preto": "Black", "Prata": "Silver", "Cinza": "Gray" },
    "es-es": { "Branco": "Blanco", "Preto": "Negro", "Prata": "Plata", "Cinza": "Gris" }
};

window.inicializarApp = function() {
    aplicarTemaSalvo();
    aplicarIdiomaSalvo();
    renderizarEstoque();
    configurarEventos();
}

function aplicarIdiomaSalvo() {
    const lang = localStorage.getItem("topdealer_lang") || "pt-br";
    const flag = localStorage.getItem("topdealer_lang_flag") || "https://flagcdn.com/w40/br.png";
    
    const flagEl = document.getElementById("current-lang-flag");
    if (flagEl) flagEl.src = flag;
    
    document.documentElement.lang = lang;
    translatePage(lang);
}

window.changeLanguage = function(lang, flag, name) {
    localStorage.setItem("topdealer_lang", lang);
    localStorage.setItem("topdealer_lang_flag", flag);
    
    const flagEl = document.getElementById("current-lang-flag");
    if (flagEl) flagEl.src = flag;
    
    document.documentElement.lang = lang;
    translatePage(lang);
    console.log(`Idioma alterado para: ${name}`);
}

function translatePage(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;

    // --- Tradução de Elementos do Modal ---
    const badge = document.getElementById("modal-destaque-label");
    if (badge) badge.innerText = t.destaque;

    const specsTitle = document.getElementById("modal-specs-title");
    if (specsTitle) specsTitle.innerText = t.especificacoes;

    const labelCor = document.getElementById("label-cor");
    if (labelCor) labelCor.innerText = t.cor + ":";

    const labelCambio = document.getElementById("label-cambio");
    if (labelCambio) labelCambio.innerText = t.cambio + ":";

    const labelComb = document.getElementById("label-comb");
    if (labelComb) labelComb.innerText = t.combustivel + ":";

    const labelPortas = document.getElementById("label-portas");
    if (labelPortas) labelPortas.innerText = t.portas + ":";
    
    const btnWhatsText = document.getElementById("btn-whatsapp-text");
    if (btnWhatsText) btnWhatsText.innerText = t.btnWhats;

    // --- Tradução de Estrutura da Página ---
    const h1 = document.querySelector(".hero-section h1");
    if (h1) h1.innerText = t.heroTitle;
    const p = document.querySelector(".hero-section p");
    if (p) p.innerText = t.heroSubtitle;

    const estoqueH2 = document.querySelector("#estoque h2");
    if (estoqueH2) estoqueH2.innerText = t.inventoryTitle;

    const emptyTitle = document.querySelector("#lista-veiculos .empty-inventory-title");
    if (emptyTitle) emptyTitle.innerText = t.emptyInventoryTitle;
    const emptyDesc = document.querySelector("#lista-veiculos .empty-inventory-desc");
    if (emptyDesc) emptyDesc.innerText = t.emptyInventoryDesc;

    const contatoH2 = document.querySelector("#contato h2");
    if (contatoH2) contatoH2.innerText = t.contactTitle;
    const contatoP = document.querySelector("#contato p");
    if (contatoP) contatoP.innerText = t.contactDesc;
    
    const emailBtn = document.querySelector("#contato a.btn-primary");
    if (emailBtn) emailBtn.innerHTML = `<i class="bi bi-envelope me-2"></i>${t.contactEmail}`;
    
    const whatsBtn = document.querySelector("#contato a.btn-success");
    if (whatsBtn) whatsBtn.innerHTML = `<i class="bi bi-whatsapp me-2"></i>${t.contactWhatsapp}`;

    const copyright = document.querySelector(".bg-dark.text-white small");
    if (copyright) copyright.innerText = t.copyright;

    // --- Tradução de Itens Dinâmicos ---
    document.querySelectorAll(".btn-outline-dark").forEach(btn => {
        btn.innerText = t.btnDetails;
    });

    // Tradução usando atributo data-original
   // Agora o script ignora o texto visível e busca a tradução a partir da fonte fixa
    document.querySelectorAll(".trans-cambio").forEach(el => {
        const valorOriginal = el.getAttribute("data-original");
        if (valorOriginal && CAMBIO_TRADUCAO[lang] && CAMBIO_TRADUCAO[lang][valorOriginal]) {
            el.textContent = CAMBIO_TRADUCAO[lang][valorOriginal];
        }
    });

    // Atualização do Modal
    const modeloAtualEl = document.getElementById("viewModelo");
    if (modeloAtualEl) {
        const modeloAtual = modeloAtualEl.innerText;
        const veiculo = VEICULOS.find(v => v.modelo === modeloAtual);
        if (veiculo) {
            document.getElementById("spec-cor").innerText = CORES_TRADUCAO[lang][veiculo.specs.cor] || veiculo.specs.cor;
            const specCambio = document.getElementById("spec-cambio");
            if (specCambio) specCambio.innerText = CAMBIO_TRADUCAO[lang][veiculo.cambio] || veiculo.cambio;
        }
    }
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
    }
// 7. Visualização de Detalhes
window.abrirDetalhes = function(id) {
    const v = VEICULOS.find(x => x.id === id);
    if (!v) return;
    
    const lang = localStorage.getItem("topdealer_lang") || "pt-br";
    
    // Tradução da cor e câmbio (Com verificação de segurança para não quebrar)
    const corTraduzida = (CORES_TRADUCAO[lang] && CORES_TRADUCAO[lang][v.specs.cor]) ? CORES_TRADUCAO[lang][v.specs.cor] : v.specs.cor;
    const cambioTraduzido = (CAMBIO_TRADUCAO[lang] && CAMBIO_TRADUCAO[lang][v.cambio]) ? CAMBIO_TRADUCAO[lang][v.cambio] : v.cambio;
    
    // Configurar Galeria
    galeriaAtual = v.galeria && v.galeria.length > 0 ? v.galeria : [v.img];
    indiceImagemAtual = 0;

    // Preencher Modal
    const mainImg = document.getElementById("viewMainImage");
    if (mainImg) mainImg.src = galeriaAtual[0];
    
    const viewModelo = document.getElementById("viewModelo");
    if (viewModelo) viewModelo.innerText = v.modelo;
    
    // Aplicando a tradução no viewAnoKm
    const viewAnoKm = document.getElementById("viewAnoKm");
    if (viewAnoKm) viewAnoKm.innerText = `${v.ano} | ${v.km.toLocaleString()} Km | ${cambioTraduzido}`;
    
    const viewPreco = document.getElementById("viewPreco");
    if (viewPreco) viewPreco.innerText = `R$ ${v.preco.toLocaleString('pt-BR')}`;

    // Especificações
    const specCor = document.getElementById("spec-cor");
    if (specCor) specCor.innerText = corTraduzida;
    
    const specComb = document.getElementById("spec-comb");
    if (specComb) specComb.innerText = v.specs.combustivel;
    
    const specPortas = document.getElementById("spec-portas");
    if (specPortas) specPortas.innerText = v.specs.portas;

    // Link WhatsApp Traduzido
    const textosWhats = {
        "pt-br": `Olá! Tenho interesse no ${v.marca} ${v.modelo} anunciado na TopDealer.`,
        "en-us": `Hello! I'm interested in the ${v.marca} ${v.modelo} advertised on TopDealer.`,
        "es-es": `¡Hola! Tengo interés en el ${v.marca} ${v.modelo} anunciado en TopDealer.`
    };
    
    const msg = encodeURIComponent(textosWhats[lang] || textosWhats["pt-br"]);
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
