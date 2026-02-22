// --- CARGA DINÁMICA DE CHART.JS ---
const chartScript = document.createElement('script');
chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
chartScript.onload = () => { if(window.ChartLoadedCallback) window.ChartLoadedCallback(); };
document.head.appendChild(chartScript);

// --- DATOS INICIALES Y HELPER ---
function generateOwned(total, ownedCount) {
    return Array(total).fill(false).map((_, i) => i < ownedCount);
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
        { id: 3, name: "Vinland Saga", publisher: "Planeta", type: "manga", totalItems: 29, ownedList: generateOwned(29, 3), pricePerItem: 12.30, expanded: false, theme: "col-theme-blue", icon: "🛡️", folder: "VinlandSaga", ext: "webp", priority: 1 }
    ]
};

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
                    appData.globalSavings = 2100;
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
        toast.innerHTML = '☁️ Guardado en la nube';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.background = '#10b981';
        toast.style.color = 'white';
        toast.style.padding = '0.5rem 1rem';
        toast.style.borderRadius = '999px';
        toast.style.fontSize = '0.85rem';
        toast.style.fontWeight = 'bold';
        toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
        toast.style.zIndex = '999999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
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

    setTimeout(() => {
        btn.innerHTML = '🔄 Precios Magic';
        btn.disabled = false;
        btn.style.opacity = '1';
    }, 3000);
};

// Insertar Botones en el Menú Superior Dinámicamente
document.addEventListener('DOMContentLoaded', () => {
    const badgesContainer = document.querySelector('.badges');
    
    // Botón API Scryfall
    const scryfallBtn = document.createElement('button');
    scryfallBtn.id = 'scryfall-sync-btn';
    scryfallBtn.className = 'btn';
    scryfallBtn.style.padding = '0.15rem 0.5rem';
    scryfallBtn.style.fontSize = '0.75rem';
    scryfallBtn.style.borderColor = '#8b5cf6'; // Morado Magic
    scryfallBtn.style.color = '#8b5cf6';
    scryfallBtn.style.marginRight = '0.5rem';
    scryfallBtn.innerHTML = '🔄 Precios Magic';
    scryfallBtn.onclick = window.syncScryfallPrices;

    // Botón Resumen
    const summaryBtn = document.createElement('button');
    summaryBtn.className = 'btn';
    summaryBtn.style.padding = '0.15rem 0.5rem';
    summaryBtn.style.fontSize = '0.75rem';
    summaryBtn.style.borderColor = 'var(--primary)';
    summaryBtn.style.color = 'var(--primary)';
    summaryBtn.innerHTML = '📊 Resumen Anual';
    summaryBtn.onclick = window.showAnnualSummary;
    
    // Insertamos los dos justo antes del botón de salir
    const logoutBtn = badgesContainer.lastElementChild;
    badgesContainer.insertBefore(scryfallBtn, logoutBtn);
    badgesContainer.insertBefore(summaryBtn, logoutBtn);
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

window.changeMonth = (newMonth) => {
    if (!newMonth) return;
    appData.currentMonth = newMonth;
    if (!appData.monthlyData[newMonth]) {
        createNewMonthProfile(newMonth);
        saveToDynamo();
    }
    updateAllUI();
};

window.togglePanel = (panelId) => {
    const el = document.getElementById(panelId);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
};

window.addExpense = (type) => {
    const nameInput = document.getElementById(`new-${type}-name`);
    const amountInput = document.getElementById(`new-${type}-amount`);
    const name = nameInput.value.trim();
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

// FUNCIÓN PARA AÑADIR/RESTAR AL AHORRO TOTAL
window.modifySavings = (multiplier) => {
    const input = document.getElementById('savings-modifier');
    const val = parseFloat(input.value);
    if (!isNaN(val) && val > 0) {
        appData.globalSavings += (val * multiplier);
        input.value = ''; 
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
            container.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:0.4rem 0.5rem; border-radius:4px; font-size:0.85rem;">
                   <span style="color:#f8fafc; font-weight:500;">${item.name}</span>
                   <div style="display:flex; align-items:center;">
                       <span style="color:#94a3b8; margin-right:10px;">${formatMoney(item.amount)}</span>
                       <button onclick="removeExpense('${type}', ${item.id})" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-weight:bold; font-size:1rem; padding:0 0.2rem;">×</button>
                   </div>
                </div>
            `;
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
            backgroundColor: ['#f43f5e', '#f59e0b', '#10b981', '#6366f1'],
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
    document.getElementById('month-selector').value = appData.currentMonth;
    document.getElementById('salary').value = appData.monthlyData[appData.currentMonth].salary;
    document.getElementById('allocation').value = appData.monthlyData[appData.currentMonth].allocation;
    document.getElementById('allocation-display').innerText = `${appData.monthlyData[appData.currentMonth].allocation}%`;

    const { totalFixed, totalVar } = renderExpenseLists();
    calculateFinances(totalFixed, totalVar);
    renderCollections();
}

function buildSavingsPanel(monthlyAdd, totalRealSavings, accumulatedSavings) {
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
                    <span style="color:#94a3b8;" title="Añade o resta dinero extra (ej. ventas, regalos o imprevistos)">Ajuste Manual:</span>
                    <div style="display:flex; align-items:center; gap: 0.25rem;">
                        <input type="number" id="savings-modifier" placeholder="€" style="background:#0f172a; border:1px solid #334155; border-radius:4px; padding:0.25rem 0.5rem; color:white; font-weight:bold; width:70px; outline:none;">
                        <button class="btn" style="padding:0.25rem 0.5rem; background:rgba(16, 185, 129, 0.2); color:#34d399; border:1px solid #10b981; border-radius:4px; font-weight:bold; cursor:pointer;" onclick="modifySavings(1)">+ Añadir</button>
                        <button class="btn" style="padding:0.25rem 0.5rem; background:rgba(244, 63, 94, 0.2); color:#fb7185; border:1px solid #f43f5e; border-radius:4px; font-weight:bold; cursor:pointer;" onclick="modifySavings(-1)">- Restar</button>
                    </div>
                </div>
                <div style="color:#94a3b8; text-align:right;">
                    Ajustes Extra: <strong style="color:${appData.globalSavings >= 0 ? '#34d399' : '#fb7185'};">${appData.globalSavings > 0 ? '+' : ''}${formatMoney(appData.globalSavings)}</strong><br/>
                    Ahorro App (Histórico): <strong style="color:white;">+${formatMoney(accumulatedSavings)}</strong>
                </div>
            </div>
            <div style="color:#34d399; text-align:right; border-top:1px solid #334155; padding-top:0.5rem;">Este mes sumas: <strong>+${formatMoney(monthlyAdd)}</strong></div>
        </div>
    `;
}

function calculateFinances(totalFixed = 0, totalVar = 0) {
    const curData = appData.monthlyData[appData.currentMonth];
    
    let accumulatedSavings = 0;
    Object.values(appData.monthlyData).forEach(monthData => {
        let mFixed = monthData.fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        let mVar = monthData.variableExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        let mDisp = (monthData.salary || 0) - mFixed - mVar;
        if (mDisp > 0) {
            let mHobby = mDisp * ((monthData.allocation || 30) / 100);
            let mSavings = mDisp - mHobby;
            accumulatedSavings += mSavings;
        }
    });

    const totalRealSavings = appData.globalSavings + accumulatedSavings;

    const disposable = curData.salary - totalFixed - totalVar;
    const hobbyBudget = disposable > 0 ? disposable * (curData.allocation / 100) : 0;
    const currentMonthSavings = disposable > 0 ? disposable - hobbyBudget : 0; 
    
    let totalCostNeeded = 0; let totalItemsNeeded = 0; let magicRemaining = 0; let isMagicComplete = false;

    appData.collections.forEach(col => {
        if (col.type === 'cards') {
            const missingCards = col.items.filter((_, i) => !col.ownedList[i]);
            const cost = missingCards.reduce((acc, item) => acc + item.price, 0);
            if (col.id === 1) { magicRemaining += cost; isMagicComplete = missingCards.length === 0; }
            totalCostNeeded += cost; totalItemsNeeded += missingCards.length;
        } else {
            const owned = col.ownedList.filter(Boolean).length;
            const remaining = col.totalItems - owned;
            if (remaining > 0) { totalCostNeeded += (remaining * col.pricePerItem); totalItemsNeeded += remaining; }
        }
    });

    let magicPiggyBank = isMagicComplete ? 0 : hobbyBudget * 0.60;
    let spendingMoney = hobbyBudget - magicPiggyBank;
    const months = hobbyBudget > 0 ? Math.ceil(totalCostNeeded / hobbyBudget) : 999;

    buildSavingsPanel(currentMonthSavings, totalRealSavings, accumulatedSavings);

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
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width:400px; text-align:center;">
            <h2 style="color:var(--primary); margin-bottom:1rem;">📊 Resumen del Año ${year}</h2>
            <div style="background:#0f172a; padding:1.5rem; border-radius:8px; text-align:left; line-height:2;">
                <div>Ingresos Totales: <strong style="color:white; float:right;">${formatMoney(tSalary)}</strong></div>
                <div>Gastos Fijos Totales: <strong style="color:var(--danger); float:right;">${formatMoney(tFixed)}</strong></div>
                <div>Gastos Variables Totales: <strong style="color:var(--danger); float:right;">${formatMoney(tVar)}</strong></div>
                <hr style="border-color:#334155; margin:1rem 0;">
                <div>Presupuesto Vicios Generado: <strong style="color:#818cf8; float:right;">${formatMoney(tHobbies)}</strong></div>
                <div style="font-size:1.1rem; margin-top:0.5rem;">Ahorro App Generado: <strong style="color:var(--success); float:right;">${formatMoney(tSavings)}</strong></div>
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
                        <div style="display:flex; align-items:center; gap:1rem; width:100%; cursor:zoom-in;"
                             data-img="${item.image.replace(/"/g, '&quot;')}"
                             onmouseenter="showCardPreview(event, this.getAttribute('data-img'))" 
                             onmouseleave="hideCardPreview()"
                             onmousemove="moveCardPreview(event)">
                            <div style="position:relative; width:45px; height:63px; border-radius:4px; overflow:hidden; border:1px solid #334155; flex-shrink:0; pointer-events:none;">
                                <img src="MagicFFSet/${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                                <div style="display:none; width:100%; height:100%; background:#334155; align-items:center; justify-content:center; font-size:0.8rem; color:#94a3b8;">?</div>
                            </div>
                            <div style="flex:1; overflow:hidden; pointer-events:none;">
                                <div style="font-weight:600; font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis" title="${item.name}">${item.name}</div>
                                <div style="font-size:0.75rem; color:#94a3b8">${formatMoney(item.price)}</div>
                            </div>
                            <div class="check-box" style="pointer-events:none;">${isOwned ? '✔' : ''}</div>
                        </div>
                    `;
                    itemEl.onclick = () => toggleItem(col.id, idx);
                    listGrid.appendChild(itemEl);
                });
                bodyDiv.appendChild(listGrid);
            } else {
                const mangaGrid = document.createElement('div');
                mangaGrid.className = 'manga-grid';
                col.ownedList.forEach((isOwned, idx) => {
                    const cover = document.createElement('div');
                    cover.className = `manga-cover ${col.theme} ${isOwned ? 'owned' : ''}`;
                    
                    if (col.folder && col.ext) {
                        const imgPath = `${col.folder}/${idx + 1}.${col.ext}`;
                        cover.innerHTML = `
                            <img src="${imgPath}" alt="Vol ${idx + 1}" style="width:100%; height:100%; object-fit:cover; display:block;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div style="display:none; width:100%; height:100%; flex-direction:column; background:#1e293b; align-items:center; justify-content:center; color:#94a3b8;">
                                <span style="font-size:2rem; font-weight:bold">${idx + 1}</span>
                            </div>
                            <div class="owned-overlay">✔</div>
                        `;
                    } else {
                        cover.innerHTML = `
                            <div class="cover-art">
                                <div class="spine-top">${col.publisher}</div>
                                <div class="spine-main">
                                    <span class="cover-title-vertical">${col.name}</span>
                                    <span class="cover-number">${idx + 1}</span>
                                </div>
                                <div class="spine-bottom">★</div>
                            </div>
                            <div class="owned-overlay">✔</div>
                        `;
                    }
                    cover.onclick = () => toggleItem(col.id, idx);
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
    saveToDynamo();
}

// --- SISTEMA DE ZOOM GLOBAL DE CARTAS ---
const previewImg = document.createElement('img');
previewImg.id = 'global-card-preview';
document.body.appendChild(previewImg);

window.showCardPreview = (e, imageSrc) => {
    previewImg.src = `MagicFFSet/${imageSrc}`;
    previewImg.style.display = 'block';
    window.moveCardPreview(e);
};

window.hideCardPreview = () => {
    previewImg.style.display = 'none';
    previewImg.src = '';
};

window.moveCardPreview = (e) => {
    if (previewImg.style.display === 'block') {
        let x = e.clientX + 20; 
        let y = e.clientY - 125; 
        if (x + 250 > window.innerWidth) x = e.clientX - 270;
        if (y + 350 > window.innerHeight) y = window.innerHeight - 360;
        if (y < 10) y = 10;
        previewImg.style.left = `${x}px`;
        previewImg.style.top = `${y}px`;
    }
};

// INIT ARRANQUE BÁSICO
updateAllUI();