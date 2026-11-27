/**
 * Furlan Motors - Dev.js
 * Lógica modular para gerenciamento de estoque, filtros, tema e idiomas.
 */

// const API_BASE_URL = "https://topdealer-api-acendkbfbwdpcuh6.brazilsouth-01.azurewebsites.net/api";
const API_BASE_URL = "http://localhost:8080/api";

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
        galeria: ["cronos-principal.jpeg", "cronos-detalhes-1.jpeg", "cronos-detalhes-2.jpeg", "cronos-detalhes-3.jpeg", "cronos-detalhes-4.jpeg", "cronos-detalhes-5.jpeg", "cronos-detalhes-6.jpeg", "cronos-detalhes-7.jpeg"],
        specs: { cor: "Branco", combustivel: "Flex", portas: "4" }
    },
    {
        id: 2,
        marca: "BMW",
        modelo: "BMW X1 XDRIVE 25i 2.0 TURBO",
        ano: 2016,
        km: 118000,
        preco: 105900,
        cambio: "Automático",
        img: "X1 img1.jpeg",
        galeria: ["X1 img1.jpeg", "X1 img2.jpeg", "X1 img4.jpeg", "X1 img y.jpeg", "X1 img3.jpeg", "X1 img5.jpeg", "X1 img6.jpeg", "X1 img x.jpeg"],
        specs: { cor: "Branco", combustivel: "Gasolina", portas: "4" }
    },
    {
        id: 3,
        marca: "Suzuki",
        modelo: "SUZUKI VITARA 4STYLE ALLGRIP 1.4 TURBO FLEX",
        ano: 2020,
        km: 98000,
        preco: 92900,
        cambio: "Automático",
        img: "suzuki_1.jpeg",
        galeria: ["suzuki_1.jpeg", "suzuki_2.jpeg", "suzuki_3.jpeg", "suzuki_4.jpeg", "suzuki_5.jpeg", "suzuki_6.jpeg", "suzuki_7.jpeg", "suzuki_8.jpeg"],
        specs: { cor: "Cinza", combustivel: "Flex", portas: "4" }
    },
    {
        id: 4,
        marca: "Chevrolet",
        modelo: "CHEVROLET CRUZE LTZ 1.4 TURBO FLEX AUT",
        ano: 2018,
        km: 115000,
        preco: 79900,
        cambio: "Automático",
        img: "cruze.png",
        galeria: ["cruze.png", "cruze2.png", "cruze3.png", "cruze4.1.png", "cruze4.png", "cruze5.png", "cruze7.png", "cruze8.png"],
        specs: { cor: "Preto", combustivel: "Flex", portas: "4" }
    },
    {
        id: 5,
        marca: "Caoa",
        modelo: "Chery Tiggo 8 txs max drive 1.6 turbo aut",
        ano: 2024,
        km: 28000,
        preco: 139900,
        cambio: "Automático",
        img: "tiggo.png",
        galeria: ["tiggo.png", "tiggo_2.png", "tiggo_3.png", "tiggo_4.png", "tiggo_5.png", "tiggo_6.png", "tiggo_7.png", "tiggo_8.png"],
        specs: { cor: "Azul", combustivel: "Diesel", portas: "4" }
    },
    {
        id: 6,
        marca: "Nisaan",
        modelo: "Nissan Frontier 2.3 biturbo diesel 4x4 aut",
        ano: 2017,
        km: 160000,
        preco: 116900,
        cambio: "Automático",
        img: "frontier_1.png",
        galeria: ["frontier_1.png", "frontier_2.png", "frontier_3.png", "frontier_4.png", "frontier_5.png", "frontier_6.png", "frontier_7.png", "frontier_8.png", ],
        specs: { cor: "Prata", combustivel: "Diesel", portas: "4" }
    },
    {
        id: 7,
        marca: "Jeep",
        modelo: "Jeep Compass limited 2.0 turbo diesel 4x4 aut",
        ano: 2023,
        km: 58000,
        preco: 139900,
        cambio: "Automático",
        img: "compass_1.png",
        galeria: ["compass_1.png", "compass_2.png", "compass_3.png", "compass_4.png", "compass_5.png", "compass_6.png", "compass_7.png", "compass_8.png" ],
        specs: { cor: "Branco", combustivel: "Flex", portas: "4" }
    },
    {
        id: 8,
        marca: "Honda",
        modelo: "Honda city LX 1.4 flex aut",
        ano: 2014,
        km: 124000,
        preco: 56900,
        cambio: "Automático",
        img: "city_1.png",
        galeria: ["city_1.png", "city_2.png", "city_3.png", "city_4.png", "city_5.png", "city_6.png", "city_7.png", "city_8.png"],
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

let favoritos = JSON.parse(localStorage.getItem("furlan_favs")) || [];
let galeriaAtual = [];
let indiceImagemAtual = 0;

// 3. Inicialização
document.addEventListener("DOMContentLoaded", () => {
    inicializarApp();
});

const TRANSLATIONS = {
    "pt-br": {
        heroSubtitle: "Curadoria automotiva de excelência e procedência garantida.",
        inventoryTitle: "Nosso Estoque",
        filterSearchLabel: "Pesquisar veículo",
        filterSearchPlaceholder: "Marca, modelo ou versão...",
        filterBrandLabel: "Marca",
        filterBrandAll: "Todas as marcas",
        filterPriceLabel: "Preço máximo",
        filterPriceAny: "Qualquer valor",
        filterYearLabel: "Ano mínimo",
        filterYearAny: "Todos os anos",
        filterClear: "Limpar",
        noResultsTitle: "Nenhum veículo encontrado",
        noResultsDesc: "Tente ajustar os filtros ou limpar a pesquisa para ver todo o estoque.",
        noResultsBtn: "Limpar Filtros",
        emptyInventoryTitle: "Aguarde atualizações do estoque!",
        emptyInventoryDesc: "Estamos preparando novidades incríveis para você. Volte em breve!",
        contactTitle: "Fale Conosco",
        contactDesc: "Dúvidas ou quer vender seu carro? Entre em contato.",
        contactEmail: "E-mail",
        contactWhatsapp: "WhatsApp",
        copyright: "© 2026 Furlan Motors. Todos os direitos reservados.",
        btnDetails: "Ver Detalhes",
        destaque: "Destaque",
        especificacoes: "Especificações Técnicas",
        cor: "Cor",
        cambio: "Câmbio",
        combustivel: "Combustível",
        portas: "Portas",
        btnWhats: "Tenho Interesse",
        btnEmail: "Enviar E-mail",
        prevPage: "Anterior",
        nextPage: "Próxima"
    },
    "en-us": {
        heroSubtitle: "Automotive curation of excellence and guaranteed provenance.",
        inventoryTitle: "Our Inventory",
        filterSearchLabel: "Search vehicle",
        filterSearchPlaceholder: "Brand, model or trim...",
        filterBrandLabel: "Brand",
        filterBrandAll: "All brands",
        filterPriceLabel: "Max price",
        filterPriceAny: "Any price",
        filterYearLabel: "Min year",
        filterYearAny: "All years",
        filterClear: "Clear",
        noResultsTitle: "No vehicles found",
        noResultsDesc: "Try adjusting the filters or clearing your search to view all inventory.",
        noResultsBtn: "Clear Filters",
        emptyInventoryTitle: "Wait for stock updates!",
        emptyInventoryDesc: "We are preparing incredible news for you. Come back soon!",
        contactTitle: "Contact Us",
        contactDesc: "Questions or want to sell your car? Get in touch.",
        contactEmail: "Email",
        contactWhatsapp: "WhatsApp",
        copyright: "© 2026 Furlan Motors. All rights reserved.",
        btnDetails: "View Details",
        destaque: "Featured",
        especificacoes: "Technical Specifications",
        cor: "Color",
        cambio: "Transmission",
        combustivel: "Fuel",
        portas: "Doors",
        btnWhats: "I am interested",
        btnEmail: "Send Email",
        prevPage: "Previous",
        nextPage: "Next"
    },
    "es-es": {
        heroSubtitle: "Curaduría automotriz de excelencia y procedencia garantizada.",
        inventoryTitle: "Nuestro Stock",
        filterSearchLabel: "Buscar vehículo",
        filterSearchPlaceholder: "Marca, modelo o versión...",
        filterBrandLabel: "Marca",
        filterBrandAll: "Todas las marcas",
        filterPriceLabel: "Precio máximo",
        filterPriceAny: "Cualquier valor",
        filterYearLabel: "Año mínimo",
        filterYearAny: "Todos los años",
        filterClear: "Limpiar",
        noResultsTitle: "Ningún vehículo encontrado",
        noResultsDesc: "Intente ajustar los filtros o limpiar la búsqueda para ver todo el stock.",
        noResultsBtn: "Limpiar Filtros",
        emptyInventoryTitle: "¡Espere actualizaciones de stock!",
        emptyInventoryDesc: "Estamos preparando novedades increíbles para usted. ¡Vuelva pronto!",
        contactTitle: "Contáctenos",
        contactDesc: "¿Dudas o quieres vender tu coche? Ponte en contacto.",
        contactEmail: "Correo electrónico",
        contactWhatsapp: "WhatsApp",
        copyright: "© 2026 Furlan Motors. Todos los derechos reservados.",
        btnDetails: "Ver Detalles",
        destaque: "Destacado",
        especificacoes: "Especificaciones Técnicas",
        cor: "Color",
        cambio: "Transmisión",
        combustivel: "Combustible",
        portas: "Puertas",
        btnWhats: "Tengo interés",
        btnEmail: "Enviar correo",
        prevPage: "Anterior",
        nextPage: "Siguiente"
    }
};

const CAMBIO_TRADUCAO = {
    "pt-br": { "Automático": "Automático", "Manual": "Manual" },
    "en-us": { "Automático": "Automatic", "Manual": "Manual" },
    "es-es": { "Automático": "Automático", "Manual": "Manual" }
};

const CORES_TRADUCAO = {
    "pt-br": { "Branco": "Branco", "Preto": "Preto", "Prata": "Prata", "Cinza": "Cinza", "Azul": "Azul" },
    "en-us": { "Branco": "White", "Preto": "Black", "Prata": "Silver", "Cinza": "Gray", "Azul": "Blue" },
    "es-es": { "Branco": "Blanco", "Preto": "Negro", "Prata": "Plata", "Cinza": "Gris" , "Azul": "Azul" }
};

window.inicializarApp = function() {
    popularFiltroMarcas();
    aplicarTemaSalvo();
    aplicarIdiomaSalvo();
    renderizarEstoque();
    configurarEventos();
};

function popularFiltroMarcas() {
    const selectMarca = document.getElementById("filtro-marca");
    if (!selectMarca) return;

    const cards = Array.from(document.querySelectorAll(".card-veiculo"));
    const marcasUnicas = [...new Set(cards.map(c => c.getAttribute("data-marca")).filter(Boolean))].sort();

    const lang = localStorage.getItem("furlan_lang") || "pt-br";
    const textoTodas = (TRANSLATIONS[lang] && TRANSLATIONS[lang].filterBrandAll) || "Todas as marcas";

    selectMarca.innerHTML = `<option value="">${textoTodas}</option>` +
        marcasUnicas.map(m => `<option value="${m}">${m}</option>`).join("");
}

function aplicarIdiomaSalvo() {
    const lang = localStorage.getItem("furlan_lang") || "pt-br";
    const flag = localStorage.getItem("furlan_lang_flag") || "https://flagcdn.com/w40/br.png";

    const flagEl = document.getElementById("current-lang-flag");
    if (flagEl) flagEl.src = flag;

    document.documentElement.lang = lang;
    translatePage(lang);
}

window.changeLanguage = function(lang, flag, name) {
    localStorage.setItem("furlan_lang", lang);
    localStorage.setItem("furlan_lang_flag", flag);

    const flagEl = document.getElementById("current-lang-flag");
    if (flagEl) flagEl.src = flag;

    document.documentElement.lang = lang;
    translatePage(lang);
    renderizarEstoque();
    console.log(`Idioma alterado para: ${name}`);
};

function translatePage(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;

    // --- Hero e Seções ---
    const heroSub = document.getElementById("hero-subtitle");
    if (heroSub) heroSub.innerText = t.heroSubtitle;

    const estoqueH2 = document.querySelector("#estoque h2");
    if (estoqueH2) estoqueH2.innerText = t.inventoryTitle;

    // --- Filtros ---
    const lblBusca = document.getElementById("label-filtro-busca");
    if (lblBusca) lblBusca.innerText = t.filterSearchLabel;

    const inpBusca = document.getElementById("busca-global");
    if (inpBusca) inpBusca.placeholder = t.filterSearchPlaceholder;

    const lblMarca = document.getElementById("label-filtro-marca");
    if (lblMarca) lblMarca.innerText = t.filterBrandLabel;

    const optMarcaTodas = document.querySelector("#filtro-marca option[value='']");
    if (optMarcaTodas) optMarcaTodas.innerText = t.filterBrandAll;

    const lblPreco = document.getElementById("label-filtro-preco");
    if (lblPreco) lblPreco.innerText = t.filterPriceLabel;

    const optPrecoAny = document.querySelector("#filtro-preco option[value='500000']");
    if (optPrecoAny) optPrecoAny.innerText = t.filterPriceAny;

    const lblAno = document.getElementById("label-filtro-ano");
    if (lblAno) lblAno.innerText = t.filterYearLabel;

    const optAnoAny = document.querySelector("#filtro-ano option[value='0']");
    if (optAnoAny) optAnoAny.innerText = t.filterYearAny;

    const txtLimpar = document.getElementById("txt-limpar-filtros");
    if (txtLimpar) txtLimpar.innerText = t.filterClear;

    const noResTitle = document.getElementById("no-results-title");
    if (noResTitle) noResTitle.innerText = t.noResultsTitle;

    const noResDesc = document.getElementById("no-results-desc");
    if (noResDesc) noResDesc.innerText = t.noResultsDesc;

    const noResBtn = document.getElementById("no-results-btn");
    if (noResBtn) noResBtn.innerText = t.noResultsBtn;

    // --- Modal ---
    const badge = document.getElementById("modal-destaque-label");
    if (badge) badge.innerText = t.destaque;

    const specsTitle = document.getElementById("modal-specs-title");
    if (specsTitle) specsTitle.innerText = t.especificacoes;

    const labelCor = document.getElementById("label-cor");
    if (labelCor) labelCor.innerText = t.cor + ":";

    const labelComb = document.getElementById("label-comb");
    if (labelComb) labelComb.innerText = t.combustivel + ":";

    const labelPortas = document.getElementById("label-portas");
    if (labelPortas) labelPortas.innerText = t.portas + ":";

    const btnWhatsText = document.getElementById("btn-whatsapp-text");
    if (btnWhatsText) btnWhatsText.innerText = t.btnWhats;

    const btnEmailText = document.getElementById("btn-email-text");
    if (btnEmailText) btnEmailText.innerText = t.btnEmail;

    // --- Estoque Vazio & Contato ---
    const emptyTitle = document.querySelector("#lista-veiculos .empty-inventory-title");
    if (emptyTitle) emptyTitle.innerText = t.emptyInventoryTitle;
    const emptyDesc = document.querySelector("#lista-veiculos .empty-inventory-desc");
    if (emptyDesc) emptyDesc.innerText = t.emptyInventoryDesc;

    const contatoH2 = document.querySelector("#contato h2");
    if (contatoH2) contatoH2.innerText = t.contactTitle;
    const contatoP = document.querySelector("#contato p");
    if (contatoP) contatoP.innerText = t.contactDesc;

    const emailBtn = document.querySelector("#contato a.btn-furlan");
    if (emailBtn) emailBtn.innerHTML = `<i class="bi bi-envelope me-2"></i>${t.contactEmail}`;

    const whatsBtn = document.querySelector("#contato a.btn-success");
    if (whatsBtn) whatsBtn.innerHTML = `<i class="bi bi-whatsapp me-2"></i>${t.contactWhatsapp}`;

    const copyright = document.querySelector(".footer-bottom small");
    if (copyright) copyright.innerText = t.copyright;

    // --- Itens Dinâmicos ---
    document.querySelectorAll(".card-veiculo .btn-outline-furlan").forEach(btn => {
        btn.innerText = t.btnDetails;
    });

    document.querySelectorAll(".trans-cambio").forEach(el => {
        const valorOriginal = el.getAttribute("data-original");
        if (valorOriginal && CAMBIO_TRADUCAO[lang] && CAMBIO_TRADUCAO[lang][valorOriginal]) {
            el.textContent = CAMBIO_TRADUCAO[lang][valorOriginal];
        }
    });

    // Atualização do Modal se estiver preenchido
    const modeloAtualEl = document.getElementById("viewModelo");
    if (modeloAtualEl) {
        const modeloAtual = modeloAtualEl.innerText;
        const veiculo = VEICULOS.find(v => v.modelo === modeloAtual);
        if (veiculo) {
            document.getElementById("spec-cor").innerText = CORES_TRADUCAO[lang][veiculo.specs.cor] || veiculo.specs.cor;
        }
    }
}

function aplicarTemaSalvo() {
    const temaSalvo = localStorage.getItem("furlan_theme") || "light";
    document.documentElement.setAttribute("data-theme", temaSalvo);
    atualizarIconeTema(temaSalvo);
}

window.toggleDarkMode = function() {
    const atual = document.documentElement.getAttribute("data-theme") || "light";
    const novo = atual === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", novo);
    localStorage.setItem("furlan_theme", novo);
    atualizarIconeTema(novo);
};

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

// 4. Renderização e Filtragem
window.renderizarEstoque = function() {
    const cards = Array.from(document.querySelectorAll(".card-veiculo"));

    const cardsFiltrados = cards.filter(card => {
        const marca = (card.getAttribute("data-marca") || "").toLowerCase();
        const modelo = (card.getAttribute("data-modelo") || "").toLowerCase();
        const tituloCard = (card.querySelector(".card-title")?.innerText || "").toLowerCase();
        const preco = parseInt(card.getAttribute("data-preco")) || 0;
        const ano = parseInt(card.getAttribute("data-ano")) || 0;
        const id = parseInt(card.getAttribute("data-id")) || 0;

        const termo = filtros.busca.trim().toLowerCase();
        const matchBusca = termo === "" ||
                           modelo.includes(termo) ||
                           marca.includes(termo) ||
                           tituloCard.includes(termo);
        const matchMarca = filtros.marca === "" || marca === filtros.marca.toLowerCase();
        const matchPreco = preco <= filtros.precoMax;
        const matchAno = ano >= filtros.anoMin;
        const matchFavorito = !filtros.apenasFavoritos || favoritos.includes(id);

        return matchBusca && matchMarca && matchPreco && matchAno && matchFavorito;
    });

    const semResultadosEl = document.getElementById("sem-resultados");
    if (semResultadosEl) {
        if (cardsFiltrados.length === 0 && cards.length > 0) {
            semResultadosEl.classList.remove("d-none");
        } else {
            semResultadosEl.classList.add("d-none");
        }
    }

    const totalVeiculos = cardsFiltrados.length;
    const totalPaginas = Math.ceil(totalVeiculos / itensPorPagina);

    if (paginaAtual > totalPaginas && totalPaginas > 0) {
        paginaAtual = totalPaginas;
    }
    if (paginaAtual < 1) paginaAtual = 1;

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    cards.forEach(card => card.classList.add("d-none"));

    cardsFiltrados.slice(inicio, fim).forEach(card => {
        card.classList.remove("d-none");
    });

    renderizarPaginacao(totalPaginas);
};

window.renderizarPaginacao = function(totalPaginas) {
    const paginacaoContainer = document.querySelector(".pagination");
    if (!paginacaoContainer) return;

    if (totalPaginas <= 1) {
        paginacaoContainer.innerHTML = "";
        return;
    }

    const lang = localStorage.getItem("furlan_lang") || "pt-br";
    const t = TRANSLATIONS[lang] || TRANSLATIONS["pt-br"];

    let html = `
        <li class="page-item ${paginaAtual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#estoque" onclick="mudarPagina(${paginaAtual - 1})">${t.prevPage}</a>
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
            <a class="page-link" href="#estoque" onclick="mudarPagina(${paginaAtual + 1})">${t.nextPage}</a>
        </li>
    `;

    paginacaoContainer.innerHTML = html;
};

window.mudarPagina = function(novaPagina) {
    paginaAtual = novaPagina;
    renderizarEstoque();
};

window.limparFiltros = function() {
    filtros = {
        busca: "",
        marca: "",
        precoMax: 500000,
        anoMin: 0,
        apenasFavoritos: false
    };

    const inputBusca = document.getElementById("busca-global");
    if (inputBusca) inputBusca.value = "";

    const selectMarca = document.getElementById("filtro-marca");
    if (selectMarca) selectMarca.value = "";

    const selectPreco = document.getElementById("filtro-preco");
    if (selectPreco) selectPreco.value = "500000";

    const selectAno = document.getElementById("filtro-ano");
    if (selectAno) selectAno.value = "0";

    paginaAtual = 1;
    renderizarEstoque();
};

// 5. Lógica de Filtros e Eventos
function configurarEventos() {
    const inputBusca = document.getElementById("busca-global");
    if (inputBusca) {
        inputBusca.addEventListener("input", (e) => {
            filtros.busca = e.target.value;
            paginaAtual = 1;
            renderizarEstoque();
        });
    }

    const selectMarca = document.getElementById("filtro-marca");
    if (selectMarca) {
        selectMarca.addEventListener("change", (e) => {
            filtros.marca = e.target.value;
            paginaAtual = 1;
            renderizarEstoque();
        });
    }

    const selectPreco = document.getElementById("filtro-preco");
    if (selectPreco) {
        selectPreco.addEventListener("change", (e) => {
            filtros.precoMax = parseInt(e.target.value) || 500000;
            paginaAtual = 1;
            renderizarEstoque();
        });
    }

    const selectAno = document.getElementById("filtro-ano");
    if (selectAno) {
        selectAno.addEventListener("change", (e) => {
            filtros.anoMin = parseInt(e.target.value) || 0;
            paginaAtual = 1;
            renderizarEstoque();
        });
    }
}

// 7. Visualização de Detalhes
window.abrirDetalhes = function(id) {
    const v = VEICULOS.find(x => x.id === id);
    if (!v) return;

    const lang = localStorage.getItem("furlan_lang") || "pt-br";

    const corTraduzida = (CORES_TRADUCAO[lang] && CORES_TRADUCAO[lang][v.specs.cor]) ? CORES_TRADUCAO[lang][v.specs.cor] : v.specs.cor;
    const cambioTraduzido = (CAMBIO_TRADUCAO[lang] && CAMBIO_TRADUCAO[lang][v.cambio]) ? CAMBIO_TRADUCAO[lang][v.cambio] : v.cambio;

    galeriaAtual = v.galeria && v.galeria.length > 0 ? v.galeria : [v.img];
    indiceImagemAtual = 0;

    const mainImg = document.getElementById("viewMainImage");
    if (mainImg) mainImg.src = galeriaAtual[0];

    const viewModelo = document.getElementById("viewModelo");
    if (viewModelo) viewModelo.innerText = v.modelo;

    const viewAnoKm = document.getElementById("viewAnoKm");
    if (viewAnoKm) viewAnoKm.innerText = `${v.ano} | ${v.km.toLocaleString()} Km | ${cambioTraduzido}`;

    const viewPreco = document.getElementById("viewPreco");
    if (viewPreco) viewPreco.innerText = `R$ ${v.preco.toLocaleString('pt-BR')}`;

    const specCor = document.getElementById("spec-cor");
    if (specCor) specCor.innerText = corTraduzida;

    const specComb = document.getElementById("spec-comb");
    if (specComb) specComb.innerText = v.specs.combustivel;

    const specPortas = document.getElementById("spec-portas");
    if (specPortas) specPortas.innerText = v.specs.portas;

    const textosWhats = {
        "pt-br": `Olá! Tenho interesse no ${v.marca} ${v.modelo} anunciado na Furlan Motors.`,
        "en-us": `Hello! I'm interested in the ${v.marca} ${v.modelo} advertised at Furlan Motors.`,
        "es-es": `¡Hola! Tengo interés en el ${v.marca} ${v.modelo} anunciado en Furlan Motors.`
    };

    const msg = encodeURIComponent(textosWhats[lang] || textosWhats["pt-br"]);
    const btnWhats = document.getElementById("btn-whatsapp-detalhe");
    if (btnWhats) btnWhats.href = `https://wa.me/5516991475066?text=${msg}`;

    const galleryContainer = document.getElementById("thumbGallery");
    if (galleryContainer) {
        galleryContainer.innerHTML = galeriaAtual.map((img, index) => `
            <div class="col-3">
                <img src="${img}" class="img-thumbnail thumb-img ${index === 0 ? 'active' : ''}" 
                     onclick="window.trocarImagemManual(${index}, event)" style="cursor:pointer">
            </div>
        `).join("");
    }

    const modalElement = document.getElementById('detalhesVeiculoModal');
    if (modalElement) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    }
};

window.trocarImagemManual = function(index, event) {
    if (event) event.stopPropagation();
    indiceImagemAtual = index;
    atualizarDisplayImagem();
};

window.mudarImagem = function(direcao) {
    if (!galeriaAtual || galeriaAtual.length <= 1) return;

    indiceImagemAtual += direcao;

    if (indiceImagemAtual >= galeriaAtual.length) {
        indiceImagemAtual = 0;
    } else if (indiceImagemAtual < 0) {
        indiceImagemAtual = galeriaAtual.length - 1;
    }

    atualizarDisplayImagem();
};

window.atualizarDisplayImagem = function() {
    const mainImg = document.getElementById("viewMainImage");
    if (mainImg) mainImg.src = galeriaAtual[indiceImagemAtual];

    document.querySelectorAll(".thumb-img").forEach((t, i) => {
        if (i === indiceImagemAtual) {
            t.classList.add("active");
        } else {
            t.classList.remove("active");
        }
    });
};