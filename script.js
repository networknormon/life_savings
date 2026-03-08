// --- CARGA DINÁMICA DE CHART.JS ---
const chartScript = document.createElement('script');
chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
chartScript.onload = () => { if(window.ChartLoadedCallback) window.ChartLoadedCallback(); };
document.head.appendChild(chartScript);

// --- DATOS INICIALES Y HELPER ---
function generateOwned(total, ownedCount) {
    return Array(total).fill(false).map((_, i) => i < ownedCount);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

const initialMagicCards = [
    { name: "A Realm Reborn", price: 0.28, image: "A Realm Reborn.jpg" },
    { name: "Absolute Virtue", price: 3.49, image: "Absolute Virtue .jpg" },
    { name: "Aerith Gainsborough", price: 1.79, image: "Aerith.jpg" },
    { name: "Aettir and Priwen", price: 5.43, image: "Aettir and Priwen.jpg" },
    { name: "Ancient Adamantoise", price: 3.90, image: "Ancient Adamantoise.jpg" },
    { name: "Ardyn, the Usurper", price: 1.08, image: "Ardyn, the Usurper.jpg" },
    { name: "Battle Menu", price: 0.20, image: "BattleMenu.jpg" },
    { name: "Buster Sword", price: 31.19, image: "Buster Sword.jpg" },
    { name: "Cecil, Dark Knight // Cecil, Redeemed Paladin", price: 1.25, image: "Cecil, Dark Knight : Cecil, Redeemed Paladin.jpg" },
    { name: "Cid, Timeless Artificer", price: 4.18, image: "Cid, Timeless Artificer.jpg" },
    { name: "Clive, Ifrit's Dominant // Ifrit, Warden of Inferno", price: 2.98, image: "Clive, Ifrit's Dominant : Ifrit, Warden of Inferno.jpg" },
    { name: "Cloud, Midgar Mercenary", price: 17.98, image: "Cloud, Midgar Mercenary.jpg" },
    { name: "Dark Confidant", price: 3.66, image: "Dark Confidant.jpg" },
    { name: "Emet-Selch, Unsundered // Hades, Sorcerer of Eld", price: 2.50, image: "Emet-Selch, Unsundered : Hades, Sorcerer of Eld.jpg" },
    { name: "Esper Origins // Summon: Esper Maduin", price: 2.50, image: "Esper Origins : Summon- Esper Maduin.jpg" },
    { name: "Genji Glove", price: 2.50, image: "Genji Glove .jpg" },
    { name: "Gogo, Master of Mimicry", price: 2.50, image: "Gogo, Master of Mimicry.jpg" },
    { name: "Golbez, Crystal Collector", price: 2.50, image: "Golbez, Crystal Collector.jpg" },
    { name: "Jecht, Reluctant Guardian // Braska's Final Aeon", price: 2.50, image: "Jecht, Reluctant Guardian : Braska's Final Aeon.jpg" },
    { name: "Jumbo Cactuar", price: 2.50, image: "Jumbo Cactuar.jpg" },
    { name: "Kefka, Court Mage // Kefka, Ruler of Ruin", price: 2.50, image: "Kefka, Court Mage : Kefka, Ruler of Ruin.jpg" },
    { name: "Lightning, Army of One", price: 2.50, image: "Lightning, Andanada.jpg" },
    { name: "Lindblum, Industrial Regency // Mage Siege", price: 2.50, image: "Lindblum, Industrial Regency : Mage Siege.jpg" },
    { name: "Machinist's Arsenal", price: 2.50, image: "Machinist's Arsenal .jpg" },
    { name: "Memories Returning", price: 2.50, image: "Memories Returning.jpg" },
    { name: "Minwu, White Mage", price: 2.50, image: "Minwu, White Mage.jpg" },
    { name: "Nibelheim Aflame", price: 2.50, image: "Nibelheim Aflame.jpg" },
    { name: "Quina, Qu Gourmet", price: 2.50, image: "Quina, Qu Gourmet.jpg" },
    { name: "Restoration Magic", price: 2.50, image: "Restoration Magic.jpg" },
    { name: "Sephiroth, Fabled SOLDIER // Sephiroth, One-Winged Angel", price: 2.50, image: "Sephiroth, Fabled SOLDIER : Sephiroth, One-Winged Angel.jpg" },
    { name: "Starting Town", price: 2.50, image: "Starting Town.jpg" },
    { name: "Summon: Bahamut", price: 2.50, image: "Bahamut.jpg" },
    { name: "Summon: G.F. Cerberus", price: 2.50, image: "Summon- G.F. Cerberus.jpg" },
    { name: "Summon: Knights of Round", price: 2.50, image: "Summon- Knights of Round.jpg" },
    { name: "Summon: Primal Odin", price: 2.50, image: "Summon- Primal Odin.jpg" },
    { name: "Summon: Titan", price: 2.50, image: "Summon- Titan .jpg" },
    { name: "Terra, Magical Adept // Esper Terra", price: 2.50, image: "Terra, Magical Adept : Esper Terra.jpg" },
    { name: "The Earth Crystal", price: 2.50, image: "The Earth Crystal.jpg" },
    { name: "The Fire Crystal", price: 2.50, image: "The Fire Crystal .jpg" },
    { name: "Tifa Lockhart", price: 2.50, image: "Tifa Lockhart.jpg" },
    { name: "Traveling Chocobo", price: 2.50, image: "Traveling Chocobo.jpg" },
    { name: "Vaan, Street Thief", price: 2.50, image: "Vaan, Street Thief .jpg" },
    { name: "Vivi Ornitier", price: 2.50, image: "Vivi Ornitier.jpg" },
    { name: "Y'shtola Rhul", price: 2.50, image: "Y'shtola Rhul.jpg" },
    { name: "Yuna, Hope of Spira", price: 2.50, image: "Yuna, la Esperanza de Spira.jpg" }
];

const today = new Date();
const defaultMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
const MONTH_NAMES_ES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

let appData = {
    globalSavings: 2100, 
    savingsGoal: 10000,
    currentMonth: defaultMonthStr, 
    monthlyData: {
        [defaultMonthStr]: {
            salary: 1084.20,
            fixedExpenses: [{ id: Date.now(), name: "General Fijos", amount: 329.92 }],
            variableExpenses: [{ id: Date.now()+1, name: "General Variables", amount: 150.00 }],
            allocation: 30
        }
    },
    collections: [
        { id: 1, name: "Magic: FF Master Set", publisher: "Wizards", type: "cards", items: initialMagicCards, ownedList: Array(45).fill(false), expanded: false, theme: "purple", icon: "🔮", priority: 3 },
        { id: 2, name: "Vagabond", publisher: "Ivrea", type: "manga", totalItems: 37, ownedList: generateOwned(37, 2), pricePerItem: 7.60, expanded: false, theme: "col-theme-stone", icon: "🗡️", folder: "Vagabond", ext: "jpg", priority: 1 },
        { id: 4, name: "Dragon Ball Ultimate", publisher: "Planeta", type: "manga", totalItems: 34, ownedList: generateOwned(34, 7), pricePerItem: 8.60, expanded: false, theme: "col-theme-yellow", icon: "🐉", folder: "DragonBall", ext: "webp", priority: 2 },
        { id: 5, name: "Slam Dunk", publisher: "Ivrea", type: "manga", totalItems: 20, ownedList: generateOwned(20,1), pricePerItem: 14.25, expanded: false, theme: "col-theme-orange", icon: "🏀⛹🏻‍♂️", folder: "SlamDunk", ext: "webp", priority: 3 }
    ]
};

const mtgViewerState = {
    collectionId: null,
    index: 0,
    scale: 1,
    translateX: 0,
    translateY: 0,
    dragging: false,
    lastDragPoint: null,
    pointers: new Map(),
    pinchStartDistance: 0,
    pinchStartScale: 1,
    touchSwipeStart: null
};

const MTG_MIN_SCALE = 1;
const MTG_MAX_SCALE = 3.5;
const mangaViewerState = {
    collectionId: null,
    index: 0
};
let mangaPullTimeout = null;
let activePulledBookEl = null;

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function getPointerDistance(points) {
    if (points.length < 2) return 0;
    const dx = points[0].x - points[1].x;
    const dy = points[0].y - points[1].y;
    return Math.hypot(dx, dy);
}

function syncBodyScrollLock() {
    const mtgModal = document.getElementById('mtg-viewer-modal');
    const mangaModal = document.getElementById('manga-viewer-modal');
    const mtgOpen = mtgModal && !mtgModal.classList.contains('hidden');
    const mangaOpen = mangaModal && !mangaModal.classList.contains('hidden');
    document.body.style.overflow = (mtgOpen || mangaOpen) ? 'hidden' : '';
}

function applyMtgTransform() {
    const imageEl = document.getElementById('mtg-viewer-image');
    if (!imageEl) return;
    imageEl.style.transform = `translate(${mtgViewerState.translateX}px, ${mtgViewerState.translateY}px) scale(${mtgViewerState.scale})`;
    imageEl.style.cursor = mtgViewerState.scale > 1 ? (mtgViewerState.dragging ? 'grabbing' : 'grab') : 'zoom-in';
}

function resetMtgZoom() {
    mtgViewerState.scale = 1;
    mtgViewerState.translateX = 0;
    mtgViewerState.translateY = 0;
    mtgViewerState.dragging = false;
    mtgViewerState.lastDragPoint = null;
    mtgViewerState.pointers.clear();
    mtgViewerState.pinchStartDistance = 0;
    mtgViewerState.pinchStartScale = 1;
    mtgViewerState.touchSwipeStart = null;
    applyMtgTransform();
}

// --- CONFIGURACIÓN DE AWS DYNAMODB ---
const REGION = 'eu-north-1';
const USER_POOL_ID = 'eu-north-1_HT76kHw12';
const IDENTITY_POOL_ID = 'eu-north-1:d5157883-71f1-475b-8e0e-9774ab7607de';

AWS.config.region = REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
    Logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: localStorage.getItem('cognito_id_token')
    }
});

const docClient = new AWS.DynamoDB.DocumentClient();
let dbUserId = null;

AWS.config.credentials.get((err) => {
    if (err) {
        console.error("Error validando token con AWS:", err);
        return;
    }
    dbUserId = AWS.config.credentials.identityId;
    console.log("Conectado a AWS con ID:", dbUserId);
    loadDataFromDynamo();
});

function loadDataFromDynamo() {
    const params = { TableName: 'ColeccionesData', Key: { userId: dbUserId } };
    docClient.get(params, (err, data) => {
        if (err) {
            console.error("Error descargando datos:", err);
        } else if (data.Item) {
            console.log("Datos cargados desde la nube ☁️");
            if (data.Item.collectionsData) {
                const savedCollections = JSON.parse(data.Item.collectionsData);
                appData.collections.forEach(col => { 
                    if(savedCollections[col.id]) {
                        // MIGRACIÓN: Comprobamos si el guardado es el antiguo (solo un array) o el nuevo (con precios)
                        if (Array.isArray(savedCollections[col.id])) {
                            col.ownedList = savedCollections[col.id];
                        } else {
                            col.ownedList = savedCollections[col.id].ownedList;
                            if (col.type === 'cards' && savedCollections[col.id].prices) {
                                col.items.forEach((item, idx) => {
                                    item.price = savedCollections[col.id].prices[idx] || item.price;
                                });
                            }
                        }
                    } 
                });
            }
            if (data.Item.finances) {
                const dbFin = data.Item.finances;
                if (dbFin.monthlyData) {
                    appData.globalSavings = dbFin.globalSavings || 0;
                    appData.monthlyData = dbFin.monthlyData;
                    if (!appData.monthlyData[defaultMonthStr]) createNewMonthProfile(defaultMonthStr);
                } else if (dbFin.salary !== undefined) {
                    appData.globalSavings = dbFin.globalSavings || 0; // CORREGIDA LA INCONGRUENCIA DEL 2100
                    appData.monthlyData[defaultMonthStr] = {
                        salary: dbFin.salary || 1084.20,
                        fixedExpenses: [{ id: Date.now(), name: "General Fijos", amount: dbFin.expenses || 0 }],
                        variableExpenses: [{ id: Date.now()+1, name: "General Variables", amount: dbFin.variableExpenses || 0 }],
                        allocation: dbFin.allocation || 30
                    };
                }
            }
            updateAllUI();
        }
    });
}

function showSaveNotification() {
    let toast = document.getElementById('save-toast');
    if(!toast) {
        toast = document.createElement('div');
        toast.id = 'save-toast';
        toast.role = 'status';
        toast.ariaLive = 'polite';
        toast.textContent = '☁️ Guardado en la nube';
        document.body.appendChild(toast);
    }
    toast.style.opacity = '1';
    if(window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

function saveToDynamo() {
    if (!dbUserId) return; 
    const collectionsToSave = {};
    appData.collections.forEach(col => { 
        // NUEVO: Guardamos tanto la propiedad como los precios
        collectionsToSave[col.id] = {
            ownedList: col.ownedList,
            prices: col.type === 'cards' ? col.items.map(i => i.price) : undefined
        }; 
    });

    const params = {
        TableName: 'ColeccionesData',
        Item: {
            userId: dbUserId,
            collectionsData: JSON.stringify(collectionsToSave),
            finances: { globalSavings: appData.globalSavings, monthlyData: appData.monthlyData },
            lastUpdated: new Date().toISOString()
        }
    };
    docClient.put(params, (err, data) => {
        if (err) console.error("Error subiendo datos:", err);
        else {
            console.log("Datos guardados en la nube ☁️");
            showSaveNotification();
        }
    });
}


// --- 🔮 API SCRYFALL: ACTUALIZACIÓN DE PRECIOS EN TIEMPO REAL ---
window.syncScryfallPrices = async () => {
    const btn = document.getElementById('scryfall-sync-btn');
    if (!btn) return;
    
    btn.disabled = true;
    btn.innerHTML = '⏳ Preparando...';
    btn.style.opacity = '0.7';

    const magicCol = appData.collections.find(c => c.id === 1);
    if (!magicCol) return;

    let updatedCount = 0;

    for (let i = 0; i < magicCol.items.length; i++) {
        const card = magicCol.items[i];
        
        // Limpiamos el nombre: Si es una carta doble (ej. Cecil // Paladin), Scryfall la encuentra solo buscando la primera cara.
        let searchName = card.name.split(' // ')[0].trim();
        
        try {
            // Usamos Fuzzy search para evitar fallos por comas o apóstrofes raros
            const res = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(searchName)}`);
            if (res.ok) {
                const data = await res.json();
                // Priorizamos Euros, si no Dolares
                const newPrice = data.prices?.eur || data.prices?.usd;
                if (newPrice) {
                    card.price = parseFloat(newPrice);
                }
            }
        } catch (e) {
            console.error("Error buscando en Scryfall:", card.name);
        }

        updatedCount++;
        btn.innerHTML = `⏳ Leyendo... ${updatedCount}/${magicCol.items.length}`;

        // ESPERA VITAL: Scryfall banea IPs si hacemos más de 10 peticiones por segundo.
        await new Promise(r => setTimeout(r, 120)); 
    }

    btn.innerHTML = '✅ ¡Mercado Actualizado!';
    saveToDynamo();  // Guardamos los nuevos precios
    updateAllUI();   // Refrescamos toda la web

    // CORRECCIÓN BUG TIMEOUT: Ahora espera al final del loop
    setTimeout(() => {
        btn.innerHTML = '🔄 Precios Magic';
        btn.disabled = false;
        btn.style.opacity = '1';
    }, 2000);
};

// Insertar Botones en el Menú Superior Dinámicamente
document.addEventListener('DOMContentLoaded', () => {
    const actionSlot = document.getElementById('header-action-slot');
    
    // Botón API Scryfall
    const scryfallBtn = document.createElement('button');
    scryfallBtn.id = 'scryfall-sync-btn';
    scryfallBtn.type = 'button';
    scryfallBtn.className = 'btn btn-sm';
    scryfallBtn.style.borderColor = '#6ba9ff';
    scryfallBtn.style.color = '#8fc2ff';
    scryfallBtn.innerHTML = '🔄 Precios Magic';
    scryfallBtn.onclick = window.syncScryfallPrices;

    // Botón Resumen
    const summaryBtn = document.createElement('button');
    summaryBtn.type = 'button';
    summaryBtn.className = 'btn btn-sm';
    summaryBtn.innerHTML = '📊 Resumen Anual';
    summaryBtn.onclick = window.showAnnualSummary;
    
    // Insertamos los dos justo antes del botón de salir
    if (actionSlot) {
        actionSlot.appendChild(scryfallBtn);
        actionSlot.appendChild(summaryBtn);
    }

    const enterAddBindings = [
        { id: 'new-fixed-name', type: 'fixed' },
        { id: 'new-fixed-amount', type: 'fixed' },
        { id: 'new-variable-name', type: 'variable' },
        { id: 'new-variable-amount', type: 'variable' }
    ];

    enterAddBindings.forEach(binding => {
        const el = document.getElementById(binding.id);
        if (!el) return;
        el.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                addExpense(binding.type);
            }
        });
    });
});


// --- LÓGICA DE MESES Y GASTOS ---

function createNewMonthProfile(monthStr) {
    const months = Object.keys(appData.monthlyData).sort();
    const lastMonth = months[months.length - 1];
    if (lastMonth) {
        const lastData = appData.monthlyData[lastMonth];
        appData.monthlyData[monthStr] = {
            salary: lastData.salary,
            fixedExpenses: JSON.parse(JSON.stringify(lastData.fixedExpenses)), 
            variableExpenses: [], 
            allocation: lastData.allocation
        };
    } else {
        appData.monthlyData[monthStr] = { salary: 0, fixedExpenses: [], variableExpenses: [], allocation: 30 };
    }
}

function parseMonthStr(monthStr) {
    const [year, month] = monthStr.split('-').map(Number);
    return { year, month };
}

function formatMonthStr(year, month) {
    return `${year}-${String(month).padStart(2, '0')}`;
}

function getSelectorYears() {
    const fromData = Object.keys(appData.monthlyData).map(m => Number(m.split('-')[0])).filter(Boolean);
    fromData.push(today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1);
    const unique = [...new Set(fromData)].sort((a, b) => a - b);
    return unique;
}

function ensureMonthControls() {
    const monthSelect = document.getElementById('month-selector');
    const yearSelect = document.getElementById('year-selector');
    if (!monthSelect || !yearSelect) return;

    if (!monthSelect.options.length) {
        monthSelect.innerHTML = MONTH_NAMES_ES
            .map((name, idx) => `<option value="${String(idx + 1).padStart(2, '0')}">${name}</option>`)
            .join('');
    }

    const years = getSelectorYears();
    const currentYearOptions = Array.from(yearSelect.options).map(o => Number(o.value));
    const sameLength = currentYearOptions.length === years.length;
    const sameValues = sameLength && currentYearOptions.every((y, idx) => y === years[idx]);
    if (!sameValues) {
        yearSelect.innerHTML = years.map(year => `<option value="${year}">${year}</option>`).join('');
    }
}

window.onYearMonthSelectorChange = () => {
    const monthSelect = document.getElementById('month-selector');
    const yearSelect = document.getElementById('year-selector');
    if (!monthSelect || !yearSelect || !monthSelect.value || !yearSelect.value) return;
    changeMonth(`${yearSelect.value}-${monthSelect.value}`);
};

window.navigateMonth = (step) => {
    const { year, month } = parseMonthStr(appData.currentMonth);
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + step);
    changeMonth(formatMonthStr(date.getFullYear(), date.getMonth() + 1));
};

window.changeMonth = (newMonth) => {
    if (!newMonth) return;
    appData.currentMonth = newMonth;
    if (!appData.monthlyData[newMonth]) {
        createNewMonthProfile(newMonth);
        saveToDynamo();
    }
    updateAllUI();
};

window.togglePanel = (panelId, btn = null) => {
    const el = document.getElementById(panelId);
    if (!el) return;
    const isOpen = getComputedStyle(el).display !== 'none';
    el.style.display = isOpen ? 'none' : 'block';
    if (btn) {
        btn.setAttribute('aria-expanded', String(!isOpen));
        btn.textContent = isOpen ? 'Editar' : 'Cerrar';
    }
};

window.addExpense = (type) => {
    const nameInput = document.getElementById(`new-${type}-name`);
    const amountInput = document.getElementById(`new-${type}-amount`);
    const name = nameInput.value.trim().slice(0, 60);
    const amount = parseFloat(amountInput.value);
    
    if (name && amount > 0) {
        appData.monthlyData[appData.currentMonth][`${type}Expenses`].push({ id: Date.now(), name: name, amount: amount });
        nameInput.value = ''; amountInput.value = '';
        updateAllUI(); saveToDynamo();
    }
};

window.removeExpense = (type, id) => {
    const list = appData.monthlyData[appData.currentMonth][`${type}Expenses`];
    appData.monthlyData[appData.currentMonth][`${type}Expenses`] = list.filter(item => item.id !== id);
    updateAllUI(); saveToDynamo();
};

window.updateSalary = (val) => { appData.monthlyData[appData.currentMonth].salary = parseFloat(val) || 0; updateAllUI(); saveToDynamo(); };
window.updateAllocation = (val) => { appData.monthlyData[appData.currentMonth].allocation = parseInt(val) || 0; updateAllUI(); saveToDynamo(); };

// NUEVO: FUNCIÓN PARA ESTABLECER EL AHORRO EXACTO MANUALMENTE
window.setExactSavings = (val) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
        appData.globalSavings = num;
        updateAllUI();
        saveToDynamo();
    }
};

function renderExpenseLists() {
    const curData = appData.monthlyData[appData.currentMonth];
    const renderList = (type, array) => {
        const container = document.getElementById(`${type}-list`);
        let total = 0;
        container.innerHTML = '';
        array.forEach(item => {
            total += item.amount;
            const row = document.createElement('div');
            row.className = 'expense-item';

            const name = document.createElement('span');
            name.className = 'expense-item-name';
            name.textContent = item.name;

            const meta = document.createElement('div');
            meta.className = 'expense-item-meta';

            const price = document.createElement('span');
            price.className = 'expense-item-price';
            price.textContent = formatMoney(item.amount);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn-icon-danger';
            removeBtn.textContent = '×';
            removeBtn.ariaLabel = `Eliminar gasto ${item.name}`;
            removeBtn.onclick = () => removeExpense(type, item.id);

            meta.appendChild(price);
            meta.appendChild(removeBtn);
            row.appendChild(name);
            row.appendChild(meta);
            container.appendChild(row);
        });
        document.getElementById(`total-${type}-display`).innerText = total.toFixed(2);
        return total;
    };
    return { totalFixed: renderList('fixed', curData.fixedExpenses), totalVar: renderList('variable', curData.variableExpenses) };
}

// --- RENDERIZADO VISUAL Y GRÁFICOS ---
const formatMoney = (amount) => { return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount); };

let mainChart = null;
function drawDonutChart(fixed, variable, savings, hobbies) {
    const stratBox = document.querySelector('.strategy-box');
    stratBox.style.flexWrap = 'wrap'; 
    stratBox.style.justifyContent = 'space-between';
    
    let chartContainer = document.getElementById('chart-container');
    if (!chartContainer) {
        chartContainer = document.createElement('div');
        chartContainer.id = 'chart-container';
        chartContainer.style.width = '220px';
        chartContainer.style.height = '220px';
        chartContainer.style.margin = '0 auto';
        chartContainer.innerHTML = '<canvas id="financeChart"></canvas>';
        stratBox.appendChild(chartContainer);
    }

    const ctx = document.getElementById('financeChart');
    if (!ctx) return;

    const dataObj = {
        labels: ['Fijos', 'Variables', 'Ahorro', 'Vicios'],
        datasets: [{
            data: [fixed, variable, savings, hobbies],
            backgroundColor: ['#ff5f6d', '#ffb454', '#20c997', '#2b7fff'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    if (mainChart) {
        mainChart.data = dataObj;
        mainChart.update();
    } else {
        mainChart = new Chart(ctx, {
            type: 'doughnut',
            data: dataObj,
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#f8fafc', font: {size: 11}, padding: 10 } }
                }
            }
        });
    }
}

function updateAllUI() {
    ensureMonthControls();
    const { year, month } = parseMonthStr(appData.currentMonth);
    document.getElementById('month-selector').value = String(month).padStart(2, '0');
    document.getElementById('year-selector').value = String(year);
    document.getElementById('salary').value = appData.monthlyData[appData.currentMonth].salary;
    document.getElementById('allocation').value = appData.monthlyData[appData.currentMonth].allocation;
    document.getElementById('allocation-display').innerText = `${appData.monthlyData[appData.currentMonth].allocation}%`;

    const { totalFixed, totalVar } = renderExpenseLists();
    calculateFinances(totalFixed, totalVar);
    renderCollections();
    renderMtgViewer();
    renderMangaViewer();
}

function buildSavingsPanel(monthlyAdd, totalRealSavings) {
    const financePanel = document.querySelector('.finance-panel');
    let goalDiv = document.getElementById('savings-goal-panel');
    if (!goalDiv) {
        goalDiv = document.createElement('div');
        goalDiv.id = 'savings-goal-panel';
        goalDiv.className = 'card';
        goalDiv.style.gridColumn = "1 / -1"; 
        goalDiv.style.background = "linear-gradient(to right, #1e293b, #0f172a)";
        goalDiv.style.border = "1px solid #eab308"; 
        financePanel.insertBefore(goalDiv, document.querySelector('.strategy-box'));
    }

    const progressPercent = Math.max(0, Math.min((totalRealSavings / appData.savingsGoal) * 100, 100));
    
    goalDiv.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; flex-wrap:wrap; gap:1rem;">
            <div style="font-weight:bold; color:#fcd34d; display:flex; align-items:center; gap:0.5rem;">
                🏆 META 10K <span style="font-size:0.8rem; color:#94a3b8; font-weight:normal">(Ahorro Total)</span>
            </div>
            <div style="text-align:right">
                <span style="font-size:1.2rem; font-weight:bold; color:white">${formatMoney(totalRealSavings)}</span>
                <span style="color:#64748b"> / €10,000</span>
            </div>
        </div>
        <div style="height:1.5rem; background:#334155; border-radius:999px; overflow:hidden; position:relative;">
            <div style="height:100%; width:${progressPercent}%; background:linear-gradient(90deg, #eab308, #f59e0b); transition:width 1s;"></div>
            <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:bold; color:white; text-shadow:0 1px 2px black;">${progressPercent.toFixed(1)}%</div>
        </div>
        <div style="margin-top:0.75rem; display:flex; flex-direction:column; gap:0.5rem; font-size:0.85rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span style="color:#94a3b8;" title="Introduce tu ahorro total real">Ahorro Real (Manual):</span>
                    <div style="display:flex; align-items:center; gap: 0.25rem;">
                        <input type="number" id="savings-modifier" value="${totalRealSavings.toFixed(2)}" onchange="setExactSavings(this.value)" style="background:#0f172a; border:1px solid #334155; border-radius:4px; padding:0.25rem 0.5rem; color:white; font-weight:bold; width:90px; outline:none;">
                        <span style="color:#94a3b8">€</span>
                    </div>
                </div>
                <div style="color:#34d399; text-align:right;">
                    Este mes sobran: <strong>+${formatMoney(monthlyAdd)}</strong><br>
                    <span style="font-size:0.75rem; color:#94a3b8;">(Súmalo a la izquierda si no lo gastas)</span>
                </div>
            </div>
        </div>
    `;
}

function calculateFinances(totalFixed = 0, totalVar = 0) {
    const curData = appData.monthlyData[appData.currentMonth];
    
    // El ahorro real ahora es ÚNICAMENTE el global (100% manual)
    const totalRealSavings = appData.globalSavings;

    const disposable = curData.salary - totalFixed - totalVar;
    const hobbyBudget = disposable > 0 ? disposable * (curData.allocation / 100) : 0;
    // Esto es lo que "debería" sobrar este mes, te lo mostraremos solo como sugerencia
    const currentMonthSavings = disposable > 0 ? disposable - hobbyBudget : 0; 
    
    let totalCostNeeded = 0;
    let totalItemsNeeded = 0;
    let magicRemaining = 0;
    let isMagicComplete = false;
    let completedCollections = 0;

    appData.collections.forEach(col => {
        if (col.type === 'cards') {
            const missingCards = col.items.filter((_, i) => !col.ownedList[i]);
            const cost = missingCards.reduce((acc, item) => acc + item.price, 0);
            if (col.id === 1) { magicRemaining += cost; isMagicComplete = missingCards.length === 0; }
            totalCostNeeded += cost; totalItemsNeeded += missingCards.length;
            if (missingCards.length === 0) completedCollections++;
        } else {
            const owned = col.ownedList.filter(Boolean).length;
            const remaining = col.totalItems - owned;
            if (remaining > 0) { totalCostNeeded += (remaining * col.pricePerItem); totalItemsNeeded += remaining; }
            if (remaining === 0) completedCollections++;
        }
    });

    let magicPiggyBank = isMagicComplete ? 0 : hobbyBudget * 0.60;
    let spendingMoney = hobbyBudget - magicPiggyBank;
    const months = hobbyBudget > 0 ? Math.ceil(totalCostNeeded / hobbyBudget) : 999;

    buildSavingsPanel(currentMonthSavings, totalRealSavings);

    if (typeof Chart !== 'undefined') {
        drawDonutChart(totalFixed, totalVar, currentMonthSavings, hobbyBudget);
    } else {
        window.ChartLoadedCallback = () => drawDonutChart(totalFixed, totalVar, currentMonthSavings, hobbyBudget);
    }

    let recommendations = [];
    let tempBudget = spendingMoney;
    
    let candidateCollections = appData.collections.filter(c => c.id !== 1).map(c => {
        return { ...c, nextIndex: c.ownedList.indexOf(false), simulatedCount: 0 };
    }).filter(c => c.nextIndex !== -1);

    candidateCollections.sort((a, b) => a.priority - b.priority || a.pricePerItem - b.pricePerItem);

    let safetyLoop = 0;
    while (tempBudget > 0 && candidateCollections.length > 0 && safetyLoop < 50) {
        let boughtSomething = false;
        safetyLoop++;
        for (let col of candidateCollections) {
            if (col.pricePerItem <= tempBudget && (col.nextIndex + col.simulatedCount < col.totalItems)) {
                tempBudget -= col.pricePerItem; col.simulatedCount++;
                let existingRec = recommendations.find(r => r.name === col.name);
                if (existingRec) { 
                    existingRec.items.push(col.nextIndex + existingRec.count + 1); 
                    existingRec.count++; 
                } 
                else { 
                    recommendations.push({ name: col.name, icon: col.icon, count: 1, items: [col.nextIndex + 1] }); 
                }
                boughtSomething = true; break; 
            }
        }
        if (!boughtSomething) break;
    }

    document.getElementById('hobby-budget').innerText = formatMoney(hobbyBudget);
    document.getElementById('quick-income').innerText = formatMoney(curData.salary || 0);
    document.getElementById('quick-expenses').innerText = formatMoney(totalFixed + totalVar);
    document.getElementById('quick-savings').innerText = formatMoney(currentMonthSavings);
    document.getElementById('quick-hobby').innerText = formatMoney(hobbyBudget);
    document.getElementById('header-goal-progress').innerText = `Objetivo: ${completedCollections}/${appData.collections.length}`;
    document.getElementById('header-magic-remaining').innerText = `Magic: ${formatMoney(magicRemaining)}`;
    document.getElementById('header-month-budget').innerText = `Hobby mes: ${formatMoney(hobbyBudget)}`;
    document.getElementById('savings-suggestion').innerText = formatMoney(magicPiggyBank);
    document.getElementById('spending-money').innerText = formatMoney(spendingMoney);
    document.getElementById('magic-cost').innerText = formatMoney(magicRemaining);
    document.getElementById('months-to-finish').innerText = months < 900 ? months : "∞";
    document.getElementById('global-missing-count').innerText = `Faltan ${totalItemsNeeded} items`;

    const stratText = document.querySelector('.strategy-text');
    let detailsDiv = document.getElementById('plan-details');
    if (!detailsDiv) {
        detailsDiv = document.createElement('div');
        detailsDiv.id = 'plan-details';
        detailsDiv.style.marginTop = "1rem";
        detailsDiv.style.paddingTop = "1rem";
        detailsDiv.style.borderTop = "1px solid rgba(255,255,255,0.1)";
        stratText.appendChild(detailsDiv);
    }

    let planHTML = '';
    if (isMagicComplete && recommendations.length === 0 && totalItemsNeeded === 0) {
        planHTML = '<div style="color:#34d399; font-weight:bold">¡Todo Completado! Eres el rey del coleccionismo.</div>';
    } else {
        planHTML += `<h4 style="font-size:0.75rem; text-transform:uppercase; color:#94a3b8; margin-bottom:0.5rem; letter-spacing:1px">Lista de Compra Prioritaria:</h4>`;
        if (recommendations.length > 0) {
            planHTML += `<ul style="list-style:none; font-size:0.9rem; padding:0;">`;
            recommendations.forEach(rec => {
                planHTML += `<li style="margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem; background:rgba(255,255,255,0.05); padding:0.5rem; border-radius:0.5rem;">
                    <span style="font-size:1.2rem">${rec.icon}</span>
                    <div>
                        <div style="font-weight:bold; color:#fff">${rec.name}</div>
                        <div style="font-size:0.8rem; color:#94a3b8">Tomos: <strong style="color:#818cf8">${rec.items.join(', ')}</strong></div>
                    </div>
                </li>`;
            });
            planHTML += `</ul>`;
            if (tempBudget > 1) planHTML += `<div style="font-size:0.8rem; color:#94a3b8; margin-top:0.5rem;">Sobra: <strong>${formatMoney(tempBudget)}</strong> (A la hucha Magic)</div>`;
        } else if (spendingMoney > 0) {
            planHTML += `<div style="font-style:italic; color:#94a3b8; font-size:0.85rem">No alcanza para ningún tomo. ¡Todo a la hucha!</div>`;
        }
        if (!isMagicComplete) {
            planHTML += `<div style="margin-top:0.75rem; font-size:0.85rem; background:rgba(16, 185, 129, 0.1); padding:0.5rem; border-radius:0.5rem; border:1px solid rgba(16, 185, 129, 0.2)">
                🔮 Para Magic: Guarda <strong style="color:#34d399">${formatMoney(magicPiggyBank)}</strong>
            </div>`;
        }
    }
    detailsDiv.innerHTML = planHTML;
}

window.showAnnualSummary = () => {
    const year = appData.currentMonth.split('-')[0];
    let tSalary = 0, tFixed = 0, tVar = 0, tHobbies = 0, tSavings = 0;
    
    Object.keys(appData.monthlyData).forEach(month => {
        if(month.startsWith(year)) {
            const md = appData.monthlyData[month];
            tSalary += md.salary || 0;
            
            let mFixed = 0, mVar = 0;
            md.fixedExpenses.forEach(e => mFixed += e.amount);
            md.variableExpenses.forEach(e => mVar += e.amount);
            tFixed += mFixed;
            tVar += mVar;
            
            const mDisp = (md.salary || 0) - mFixed - mVar;
            if (mDisp > 0) {
                const alloc = (md.allocation || 30) / 100;
                tHobbies += (mDisp * alloc);
                tSavings += (mDisp - (mDisp * alloc));
            }
        }
    });
    
    let modal = document.getElementById('annual-modal');
    if(!modal) {
        modal = document.createElement('div');
        modal.id = 'annual-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    // CORRECCIÓN Wording Ahorro App por Ahorro Teórico
    modal.innerHTML = `
        <div class="modal-content" style="max-width:400px; text-align:center;">
            <h2 style="color:var(--primary); margin-bottom:1rem;">📊 Resumen del Año ${year}</h2>
            <div style="background:#0f172a; padding:1.5rem; border-radius:8px; text-align:left; line-height:2;">
                <div>Ingresos Totales: <strong style="color:white; float:right;">${formatMoney(tSalary)}</strong></div>
                <div>Gastos Fijos Totales: <strong style="color:var(--danger); float:right;">${formatMoney(tFixed)}</strong></div>
                <div>Gastos Variables Totales: <strong style="color:var(--danger); float:right;">${formatMoney(tVar)}</strong></div>
                <hr style="border-color:#334155; margin:1rem 0;">
                <div>Presupuesto Vicios Generado: <strong style="color:#818cf8; float:right;">${formatMoney(tHobbies)}</strong></div>
                <div style="font-size:1.1rem; margin-top:0.5rem;" title="Esto es lo que debería haber sobrado en base a tus ingresos y gastos registrados.">Ahorro Teórico Generado: <strong style="color:var(--success); float:right;">${formatMoney(tSavings)}</strong></div>
            </div>
            <button class="btn btn-primary" style="margin-top:1.5rem; width:100%; padding:0.75rem; font-weight:bold;" onclick="document.getElementById('annual-modal').style.display='none'">Cerrar Resumen</button>
        </div>
    `;
    modal.style.display = 'flex';
};

function renderCollections() {
    const container = document.getElementById('collections-container');
    container.innerHTML = '';

    appData.collections.forEach((col, colIndex) => {
        let ownedCount = 0; let totalCount = 0; let remainingCost = 0;

        if (col.type === 'cards') {
            totalCount = col.items.length;
            ownedCount = col.ownedList.filter(Boolean).length;
            remainingCost = col.items.reduce((acc, item, i) => !col.ownedList[i] ? acc + item.price : acc, 0);
        } else {
            totalCount = col.totalItems;
            ownedCount = col.ownedList.filter(Boolean).length;
            remainingCost = (totalCount - ownedCount) * col.pricePerItem;
        }

        const progress = (ownedCount / totalCount) * 100;
        const isCompleted = ownedCount >= totalCount;

        const card = document.createElement('div');
        card.id = `col-${col.id}`;
        card.className = 'collection-card';
        
        const headerHTML = `
            <div class="collection-header">
                <div class="header-top">
                    <div class="info-flex">
                        <div class="col-icon">${col.icon}</div>
                        <div class="col-data">
                            <h3>${col.name}</h3>
                            <div class="col-meta">${col.publisher} • ${col.type === 'cards' ? 'Variable' : formatMoney(col.pricePerItem)}</div>
                        </div>
                    </div>
                    <div class="money-data">
                        <span class="money-label">Falta Invertir</span>
                        <div class="money-value">${isCompleted ? '¡Listo!' : formatMoney(remainingCost)}</div>
                    </div>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progress}%; background-color: ${isCompleted ? '#10b981' : '#6366f1'}"></div>
                </div>
                <div class="controls">
                    <span class="col-meta-count">${ownedCount} / ${totalCount} items</span>
                    <div>
                        <button class="btn btn-toggle" onclick="toggleExpand(${col.id})">
                            ${col.expanded ? 'Ocultar' : 'Ver Items'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        const bodyDiv = document.createElement('div');
        bodyDiv.className = `collection-body ${col.expanded ? 'open' : ''}`;
        
        if (col.expanded) {
            if (col.type === 'cards') {
                const listGrid = document.createElement('div');
                listGrid.className = 'items-list-grid';
                col.items.forEach((item, idx) => {
                    const isOwned = col.ownedList[idx];
                    const itemEl = document.createElement('div');
                    itemEl.className = `item-row ${isOwned ? 'owned' : ''}`;
                    itemEl.innerHTML = `
                        <div class="item-main">
                            <button
                                type="button"
                                class="mtg-thumb-btn"
                                onclick="openMtgViewer(${col.id}, ${idx}, event)"
                                aria-label="Abrir visor de ${escapeHtml(item.name)}"
                            >
                                <img src="MagicFFSet/${item.image}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid'">
                                <span class="mtg-thumb-fallback">?</span>
                            </button>
                            <div class="item-copy">
                                <div class="item-title" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
                                <div class="item-price">${formatMoney(item.price)}</div>
                            </div>
                        </div>
                        <div class="item-actions">
                            <button type="button" class="btn btn-sm" onclick="openMtgViewer(${col.id}, ${idx}, event)">Ver</button>
                            <div class="check-box">${isOwned ? '✔' : ''}</div>
                        </div>
                    `;
                    itemEl.onclick = () => toggleItem(col.id, idx);
                    listGrid.appendChild(itemEl);
                });
                bodyDiv.appendChild(listGrid);
            } else {
                const mangaGrid = document.createElement('div');
                mangaGrid.className = 'manga-grid bookshelf-grid';
                col.ownedList.forEach((isOwned, idx) => {
                    const cover = document.createElement('div');
                    cover.className = `manga-cover shelf-book ${col.theme} ${isOwned ? 'owned' : ''}`;
                    const spineWidth = 24 + ((idx + col.id) % 4) * 3;
                    const spineHeight = 132 + ((idx + col.id) % 6) * 10;
                    const hue = ((idx * 27) + (col.id * 34)) % 360;
                    cover.style.setProperty('--book-w', `${spineWidth}px`);
                    cover.style.setProperty('--book-h', `${spineHeight}px`);
                    cover.style.setProperty('--spine-hue', `${hue}`);
                    cover.onclick = (ev) => previewMangaBook(col.id, idx, ev);
                    
                    if (col.folder && col.ext) {
                        const imgPath = `${col.folder}/${idx + 1}.${col.ext}`;
                        cover.innerHTML = `
                            <div class="book-spine">
                                <span class="book-spine-title">${escapeHtml(col.name)}</span>
                                <span class="book-spine-number">${idx + 1}</span>
                            </div>
                            <div class="book-face">
                                <img src="${imgPath}" alt="Vol ${idx + 1}" loading="lazy" decoding="async" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                                <div class="book-fallback">
                                    <span>${idx + 1}</span>
                                </div>
                            </div>
                        `;
                    } else {
                        cover.innerHTML = `
                            <div class="book-spine">
                                <span class="book-spine-title">${escapeHtml(col.name)}</span>
                                <span class="book-spine-number">${idx + 1}</span>
                            </div>
                            <div class="book-face">
                                <div class="cover-art">
                                    <div class="spine-top">${col.publisher}</div>
                                    <div class="spine-main">
                                        <span class="cover-title-vertical">${col.name}</span>
                                        <span class="cover-number">${idx + 1}</span>
                                    </div>
                                    <div class="spine-bottom">★</div>
                                </div>
                            </div>
                        `;
                    }
                    mangaGrid.appendChild(cover);
                });
                bodyDiv.appendChild(mangaGrid);
            }
        }
        card.innerHTML = headerHTML;
        card.appendChild(bodyDiv);
        container.appendChild(card);
    });
}

window.toggleExpand = (id) => {
    const col = appData.collections.find(c => c.id === id);
    if(col) {
        col.expanded = !col.expanded;
        renderCollections(); 
    }
}

window.toggleItem = (colId, idx) => {
    const col = appData.collections.find(c => c.id === colId);
    if (!col) return;
    col.ownedList[idx] = !col.ownedList[idx];
    updateAllUI();
    renderMtgViewer();
    renderMangaViewer();
    saveToDynamo();
}

window.previewMangaBook = (colId, idx, ev) => {
    const clickedBook = ev?.currentTarget;
    if (!clickedBook) return;

    if (mangaPullTimeout) clearTimeout(mangaPullTimeout);
    if (activePulledBookEl && activePulledBookEl !== clickedBook) {
        activePulledBookEl.classList.remove('is-pulled');
    }
    activePulledBookEl = clickedBook;
    clickedBook.classList.remove('is-pulled');
    void clickedBook.offsetWidth;
    clickedBook.classList.add('is-pulled');

    mangaPullTimeout = setTimeout(() => {
        window.openMangaViewer(colId, idx);
    }, 430);
};

function ensureMangaViewer() {
    if (document.getElementById('manga-viewer-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'manga-viewer-modal';
    modal.className = 'manga-modal hidden';
    modal.innerHTML = `
        <div class="manga-modal-content" role="dialog" aria-modal="true" aria-labelledby="manga-viewer-title">
            <button type="button" class="mtg-close-btn" id="manga-close-btn" aria-label="Cerrar visor">✕</button>
            <div class="manga-modal-layout">
                <div class="manga-cover-wrap">
                    <img id="manga-viewer-image" class="manga-viewer-image" alt="">
                </div>
                <div class="manga-side">
                    <h3 id="manga-viewer-title">Tomo</h3>
                    <p id="manga-viewer-subtitle" class="mtg-viewer-price"></p>
                    <p id="manga-viewer-index" class="mtg-viewer-index">1 / 1</p>
                    <div class="mtg-viewer-controls">
                        <button type="button" class="btn" id="manga-prev-btn">← Anterior</button>
                        <button type="button" class="btn" id="manga-next-btn">Siguiente →</button>
                    </div>
                    <button type="button" class="btn btn-primary" id="manga-owned-toggle-btn">Marcar como comprado</button>
                </div>
            </div>
        </div>
    `;
    const content = modal.querySelector('.manga-modal-content');
    modal.addEventListener('pointerdown', (ev) => {
        if (ev.target === modal) closeMangaViewer();
    });
    content.addEventListener('pointerdown', (ev) => ev.stopPropagation());
    document.body.appendChild(modal);

    document.getElementById('manga-close-btn').onclick = closeMangaViewer;
    document.getElementById('manga-prev-btn').onclick = () => moveMangaViewer(-1);
    document.getElementById('manga-next-btn').onclick = () => moveMangaViewer(1);
    document.getElementById('manga-owned-toggle-btn').onclick = () => {
        const col = appData.collections.find(c => c.id === mangaViewerState.collectionId);
        if (!col || col.type !== 'manga') return;
        toggleItem(mangaViewerState.collectionId, mangaViewerState.index);
    };
}

function getMangaCoverSrc(collection, index) {
    if (!collection.folder || !collection.ext) return null;
    return `${collection.folder}/${index + 1}.${collection.ext}`;
}

function renderMangaViewer() {
    const modal = document.getElementById('manga-viewer-modal');
    if (!modal || modal.classList.contains('hidden')) return;

    const collection = appData.collections.find(c => c.id === mangaViewerState.collectionId);
    if (!collection || collection.type !== 'manga') return;

    const index = mangaViewerState.index;
    const owned = Boolean(collection.ownedList[index]);
    const imageEl = document.getElementById('manga-viewer-image');
    const titleEl = document.getElementById('manga-viewer-title');
    const subtitleEl = document.getElementById('manga-viewer-subtitle');
    const indexEl = document.getElementById('manga-viewer-index');
    const toggleBtn = document.getElementById('manga-owned-toggle-btn');

    const src = getMangaCoverSrc(collection, index);
    if (src) {
        imageEl.src = src;
        imageEl.alt = `${collection.name} #${index + 1}`;
    } else {
        imageEl.removeAttribute('src');
        imageEl.alt = `${collection.name} #${index + 1}`;
    }

    titleEl.textContent = `${collection.name} · Tomo ${index + 1}`;
    subtitleEl.textContent = `${collection.publisher} • ${formatMoney(collection.pricePerItem)}`;
    indexEl.textContent = `${index + 1} / ${collection.totalItems}`;
    toggleBtn.textContent = owned ? 'Marcar como pendiente' : 'Marcar como comprado';
    toggleBtn.classList.toggle('btn-danger', owned);
    toggleBtn.classList.toggle('btn-primary', !owned);
}

window.openMangaViewer = (collectionId, index) => {
    ensureMangaViewer();
    mangaViewerState.collectionId = collectionId;
    mangaViewerState.index = index;
    const modal = document.getElementById('manga-viewer-modal');
    modal.classList.remove('hidden');
    syncBodyScrollLock();
    renderMangaViewer();
};

window.closeMangaViewer = () => {
    const modal = document.getElementById('manga-viewer-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    if (activePulledBookEl) {
        activePulledBookEl.classList.remove('is-pulled');
        activePulledBookEl = null;
    }
    syncBodyScrollLock();
};

window.moveMangaViewer = (step) => {
    const collection = appData.collections.find(c => c.id === mangaViewerState.collectionId);
    if (!collection || collection.type !== 'manga') return;
    mangaViewerState.index = (mangaViewerState.index + step + collection.totalItems) % collection.totalItems;
    renderMangaViewer();
};

function ensureMtgViewer() {
    if (document.getElementById('mtg-viewer-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'mtg-viewer-modal';
    modal.className = 'mtg-modal hidden';
    modal.innerHTML = `
        <div class="mtg-modal-content" role="dialog" aria-modal="true" aria-labelledby="mtg-viewer-title">
            <button type="button" class="mtg-close-btn" id="mtg-close-btn" aria-label="Cerrar visor">✕</button>
            <div class="mtg-modal-layout">
                <div class="mtg-image-wrap">
                    <img id="mtg-viewer-image" class="mtg-viewer-image" alt="">
                </div>
                <div class="mtg-side">
                    <h3 id="mtg-viewer-title">Carta</h3>
                    <p id="mtg-viewer-price" class="mtg-viewer-price">€0.00</p>
                    <p id="mtg-viewer-index" class="mtg-viewer-index">1 / 1</p>
                    <div class="mtg-viewer-controls">
                        <button type="button" class="btn" id="mtg-prev-btn">← Anterior</button>
                        <button type="button" class="btn" id="mtg-next-btn">Siguiente →</button>
                    </div>
                    <button type="button" class="btn btn-primary" id="mtg-owned-toggle-btn">Marcar como comprada</button>
                </div>
            </div>
        </div>
    `;
    const modalContent = modal.querySelector('.mtg-modal-content');
    modal.addEventListener('pointerdown', (ev) => {
        if (ev.target === modal) closeMtgViewer();
    });
    modalContent.addEventListener('pointerdown', (ev) => ev.stopPropagation());
    document.body.appendChild(modal);

    document.getElementById('mtg-close-btn').onclick = closeMtgViewer;
    document.getElementById('mtg-prev-btn').onclick = () => moveMtgViewer(-1);
    document.getElementById('mtg-next-btn').onclick = () => moveMtgViewer(1);
    document.getElementById('mtg-owned-toggle-btn').onclick = () => {
        const col = appData.collections.find(c => c.id === mtgViewerState.collectionId);
        if (!col) return;
        toggleItem(mtgViewerState.collectionId, mtgViewerState.index);
    };

    const imageWrap = modal.querySelector('.mtg-image-wrap');
    const imageEl = document.getElementById('mtg-viewer-image');

    imageWrap.addEventListener('wheel', (ev) => {
        ev.preventDefault();
        const factor = ev.deltaY < 0 ? 1.12 : 0.9;
        mtgViewerState.scale = clamp(mtgViewerState.scale * factor, MTG_MIN_SCALE, MTG_MAX_SCALE);
        if (mtgViewerState.scale === 1) {
            mtgViewerState.translateX = 0;
            mtgViewerState.translateY = 0;
        }
        applyMtgTransform();
    }, { passive: false });

    imageWrap.addEventListener('dblclick', (ev) => {
        ev.preventDefault();
        if (mtgViewerState.scale > 1) {
            resetMtgZoom();
        } else {
            mtgViewerState.scale = 2;
            applyMtgTransform();
        }
    });

    imageEl.addEventListener('pointerdown', (ev) => {
        imageEl.setPointerCapture(ev.pointerId);
        mtgViewerState.pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY, pointerType: ev.pointerType });

        if (ev.pointerType === 'touch' && mtgViewerState.scale === 1 && mtgViewerState.pointers.size === 1) {
            mtgViewerState.touchSwipeStart = { x: ev.clientX, y: ev.clientY, t: Date.now() };
        }

        if (mtgViewerState.scale > 1 && mtgViewerState.pointers.size === 1) {
            mtgViewerState.dragging = true;
            mtgViewerState.lastDragPoint = { x: ev.clientX, y: ev.clientY };
            applyMtgTransform();
        }
    });

    imageEl.addEventListener('pointermove', (ev) => {
        if (!mtgViewerState.pointers.has(ev.pointerId)) return;
        mtgViewerState.pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY, pointerType: ev.pointerType });

        const points = [...mtgViewerState.pointers.values()];
        if (points.length >= 2) {
            const dist = getPointerDistance(points);
            if (!mtgViewerState.pinchStartDistance) {
                mtgViewerState.pinchStartDistance = dist;
                mtgViewerState.pinchStartScale = mtgViewerState.scale;
            } else if (dist > 0) {
                mtgViewerState.scale = clamp((dist / mtgViewerState.pinchStartDistance) * mtgViewerState.pinchStartScale, MTG_MIN_SCALE, MTG_MAX_SCALE);
                if (mtgViewerState.scale === 1) {
                    mtgViewerState.translateX = 0;
                    mtgViewerState.translateY = 0;
                }
                applyMtgTransform();
            }
            return;
        }

        if (mtgViewerState.dragging && mtgViewerState.scale > 1 && mtgViewerState.lastDragPoint) {
            const dx = ev.clientX - mtgViewerState.lastDragPoint.x;
            const dy = ev.clientY - mtgViewerState.lastDragPoint.y;
            mtgViewerState.translateX += dx;
            mtgViewerState.translateY += dy;
            mtgViewerState.lastDragPoint = { x: ev.clientX, y: ev.clientY };
            applyMtgTransform();
        }
    });

    const pointerEnd = (ev) => {
        mtgViewerState.pointers.delete(ev.pointerId);
        if (mtgViewerState.pointers.size < 2) {
            mtgViewerState.pinchStartDistance = 0;
            mtgViewerState.pinchStartScale = mtgViewerState.scale;
        }
        if (mtgViewerState.pointers.size === 0) {
            mtgViewerState.dragging = false;
            mtgViewerState.lastDragPoint = null;
            applyMtgTransform();

            if (ev.pointerType === 'touch' && mtgViewerState.touchSwipeStart && mtgViewerState.scale === 1) {
                const dx = ev.clientX - mtgViewerState.touchSwipeStart.x;
                const dy = ev.clientY - mtgViewerState.touchSwipeStart.y;
                const dt = Date.now() - mtgViewerState.touchSwipeStart.t;
                if (dt < 450 && Math.abs(dx) > 50 && Math.abs(dy) < 40) {
                    moveMtgViewer(dx < 0 ? 1 : -1);
                }
            }
            mtgViewerState.touchSwipeStart = null;
        }
    };

    imageEl.addEventListener('pointerup', pointerEnd);
    imageEl.addEventListener('pointercancel', pointerEnd);
}

function preloadNearbyCards(collection, index) {
    const nextIdx = (index + 1) % collection.items.length;
    const prevIdx = (index - 1 + collection.items.length) % collection.items.length;
    [nextIdx, prevIdx].forEach((cardIdx) => {
        const image = new Image();
        image.src = `MagicFFSet/${collection.items[cardIdx].image}`;
    });
}

function renderMtgViewer() {
    const modal = document.getElementById('mtg-viewer-modal');
    if (!modal || modal.classList.contains('hidden')) return;

    const collection = appData.collections.find(c => c.id === mtgViewerState.collectionId);
    if (!collection || collection.type !== 'cards') return;

    const item = collection.items[mtgViewerState.index];
    if (!item) return;

    const owned = Boolean(collection.ownedList[mtgViewerState.index]);
    const imageEl = document.getElementById('mtg-viewer-image');
    const titleEl = document.getElementById('mtg-viewer-title');
    const priceEl = document.getElementById('mtg-viewer-price');
    const indexEl = document.getElementById('mtg-viewer-index');
    const ownedBtn = document.getElementById('mtg-owned-toggle-btn');

    imageEl.src = `MagicFFSet/${item.image}`;
    imageEl.alt = item.name;
    titleEl.textContent = item.name;
    priceEl.textContent = formatMoney(item.price);
    indexEl.textContent = `${mtgViewerState.index + 1} / ${collection.items.length}`;
    ownedBtn.textContent = owned ? 'Marcar como pendiente' : 'Marcar como comprada';
    ownedBtn.classList.toggle('btn-danger', owned);
    ownedBtn.classList.toggle('btn-primary', !owned);

    preloadNearbyCards(collection, mtgViewerState.index);
}

window.openMtgViewer = (collectionId, index, ev) => {
    if (ev) ev.stopPropagation();
    ensureMtgViewer();
    mtgViewerState.collectionId = collectionId;
    mtgViewerState.index = index;
    const modal = document.getElementById('mtg-viewer-modal');
    modal.classList.remove('hidden');
    syncBodyScrollLock();
    resetMtgZoom();
    renderMtgViewer();
};

window.closeMtgViewer = () => {
    const modal = document.getElementById('mtg-viewer-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    syncBodyScrollLock();
    resetMtgZoom();
};

window.moveMtgViewer = (step) => {
    const collection = appData.collections.find(c => c.id === mtgViewerState.collectionId);
    if (!collection || collection.type !== 'cards') return;
    mtgViewerState.index = (mtgViewerState.index + step + collection.items.length) % collection.items.length;
    resetMtgZoom();
    renderMtgViewer();
}

document.addEventListener('keydown', (ev) => {
    const mtgModal = document.getElementById('mtg-viewer-modal');
    const mangaModal = document.getElementById('manga-viewer-modal');
    const mtgOpen = mtgModal && !mtgModal.classList.contains('hidden');
    const mangaOpen = mangaModal && !mangaModal.classList.contains('hidden');
    if (!mtgOpen && !mangaOpen) return;

    if (ev.key === 'Escape') {
        if (mangaOpen) closeMangaViewer();
        if (mtgOpen) closeMtgViewer();
    }
    if (ev.key === 'ArrowRight') {
        if (mangaOpen) moveMangaViewer(1);
        else if (mtgOpen) moveMtgViewer(1);
    }
    if (ev.key === 'ArrowLeft') {
        if (mangaOpen) moveMangaViewer(-1);
        else if (mtgOpen) moveMtgViewer(-1);
    }
});

// INIT ARRANQUE BÁSICO
updateAllUI();
