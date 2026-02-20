// --- DATOS INICIALES ---

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

let appData = {
    salary: 1084.20,
    expenses: 329.92,
    allocation: 30,
    currentSavings: 2100, 
    savingsGoal: 10000,   
    collections: [
        { id: 1, name: "Magic: FF Master Set", publisher: "Wizards", type: "cards", items: initialMagicCards, ownedList: Array(45).fill(false), expanded: false, theme: "purple", icon: "🔮", priority: 3 },
        { id: 2, name: "Vagabond", publisher: "Ivrea", type: "manga", totalItems: 37, ownedList: generateOwned(37, 2), pricePerItem: 7.60, expanded: false, theme: "col-theme-stone", icon: "🗡️", folder: "Vagabond", ext: "jpg", priority: 1 },
        { id: 3, name: "Slam Dunk (Kanzenban)", publisher: "Ivrea", type: "manga", totalItems: 20, ownedList: generateOwned(20, 1), pricePerItem: 14.25, expanded: false, theme: "col-theme-orange", icon: "🏀", folder: "SlamDunk", ext: "webp", priority: 2 },
        { id: 4, name: "Vinland Saga", publisher: "Planeta", type: "manga", totalItems: 29, ownedList: generateOwned(29, 3), pricePerItem: 12.30, expanded: false, theme: "col-theme-blue", icon: "🛡️", folder: "VinlandSaga", ext: "webp", priority: 1 },
        { id: 5, name: "Dragon Ball Ultimate", publisher: "Planeta", type: "manga", totalItems: 34, ownedList: generateOwned(34, 7), pricePerItem: 8.60, expanded: false, theme: "col-theme-yellow", icon: "🐉", folder: "DragonBall", ext: "webp", priority: 2 }
    ]
};

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

// Autenticamos y cargamos datos al entrar
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
    const params = {
        TableName: 'ColeccionesData',
        Key: { userId: dbUserId }
    };
    docClient.get(params, (err, data) => {
        if (err) {
            console.error("Error descargando datos:", err);
        } else if (data.Item && data.Item.collectionsData) {
            console.log("Datos cargados desde la nube ☁️");
            const savedCollections = JSON.parse(data.Item.collectionsData);
            
            // Volcamos lo guardado en nuestra app
            appData.collections.forEach(col => {
                if(savedCollections[col.id]) col.ownedList = savedCollections[col.id];
            });
            
            if (data.Item.finances) {
                 appData.salary = data.Item.finances.salary || appData.salary;
                 appData.expenses = data.Item.finances.expenses || appData.expenses;
                 appData.allocation = data.Item.finances.allocation || appData.allocation;
                 salaryInput.value = appData.salary;
                 expensesInput.value = appData.expenses;
                 allocationInput.value = appData.allocation;
            }
            // Recalculamos con los nuevos datos
            calculateFinances();
            renderCollections();
        }
    });
}

function saveToDynamo() {
    if (!dbUserId) return; // Si no hay conexión, no guardamos
    
    const collectionsToSave = {};
    appData.collections.forEach(col => {
        collectionsToSave[col.id] = col.ownedList;
    });

    const params = {
        TableName: 'ColeccionesData',
        Item: {
            userId: dbUserId,
            collectionsData: JSON.stringify(collectionsToSave),
            finances: {
                salary: appData.salary,
                expenses: appData.expenses,
                allocation: appData.allocation
            },
            lastUpdated: new Date().toISOString()
        }
    };

    docClient.put(params, (err, data) => {
        if (err) console.error("Error subiendo datos:", err);
        else console.log("Datos guardados en la nube ☁️");
    });
}


const salaryInput = document.getElementById('salary');
const expensesInput = document.getElementById('expenses');
const allocationInput = document.getElementById('allocation');
const allocationDisplay = document.getElementById('allocation-display');
const hobbyBudgetDisplay = document.getElementById('hobby-budget');
const savingsDisplay = document.getElementById('savings-suggestion');
const spendingDisplay = document.getElementById('spending-money');
const magicCostDisplay = document.getElementById('magic-cost');
const monthsDisplay = document.getElementById('months-to-finish');
const container = document.getElementById('collections-container');
const globalMissingDisplay = document.getElementById('global-missing-count');

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

const financePanel = document.querySelector('.finance-panel');
if (!document.getElementById('savings-goal-panel')) {
    const goalDiv = document.createElement('div');
    goalDiv.id = 'savings-goal-panel';
    goalDiv.className = 'card';
    goalDiv.style.gridColumn = "1 / -1"; 
    goalDiv.style.background = "linear-gradient(to right, #1e293b, #0f172a)";
    goalDiv.style.border = "1px solid #eab308"; 
    
    goalDiv.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <div style="font-weight:bold; color:#fcd34d; display:flex; align-items:center; gap:0.5rem;">
                🏆 META 10K <span style="font-size:0.8rem; color:#94a3b8; font-weight:normal">(Ahorro Total)</span>
            </div>
            <div style="text-align:right">
                <span id="current-savings-text" style="font-size:1.2rem; font-weight:bold; color:white">€2,100</span>
                <span style="color:#64748b"> / €10,000</span>
            </div>
        </div>
        <div style="height:1.5rem; background:#334155; border-radius:999px; overflow:hidden; position:relative;">
            <div id="savings-bar" style="height:100%; width:21%; background:linear-gradient(90deg, #eab308, #f59e0b); transition:width 1s;"></div>
            <div id="savings-percent" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:bold; color:white; text-shadow:0 1px 2px black;">21%</div>
        </div>
        <div style="margin-top:0.5rem; display:flex; justify-content:space-between; font-size:0.85rem;">
            <div style="color:#94a3b8">Llevas ahorrado: <strong style="color:white">€${appData.currentSavings}</strong></div>
            <div style="color:#34d399">Este mes sumas: <strong id="monthly-add">+€0.00</strong></div>
        </div>
    `;
    financePanel.insertBefore(goalDiv, document.querySelector('.strategy-box'));
}

const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

function calculateFinances() {
    const disposable = appData.salary - appData.expenses;
    const hobbyBudget = disposable * (appData.allocation / 100);
    const generalSavings = disposable - hobbyBudget; 
    
    let totalCostNeeded = 0;
    let totalItemsNeeded = 0;
    let magicRemaining = 0;
    let isMagicComplete = false;

    appData.collections.forEach(col => {
        if (col.type === 'cards') {
            const missingCards = col.items.filter((_, i) => !col.ownedList[i]);
            const cost = missingCards.reduce((acc, item) => acc + item.price, 0);
            if (col.id === 1) {
                magicRemaining += cost;
                isMagicComplete = missingCards.length === 0;
            }
            totalCostNeeded += cost;
            totalItemsNeeded += missingCards.length;
        } else {
            const owned = col.ownedList.filter(Boolean).length;
            const remaining = col.totalItems - owned;
            if (remaining > 0) {
                totalCostNeeded += (remaining * col.pricePerItem);
                totalItemsNeeded += remaining;
            }
        }
    });

    let magicPiggyBank = isMagicComplete ? 0 : hobbyBudget * 0.60;
    let spendingMoney = hobbyBudget - magicPiggyBank;
    const months = hobbyBudget > 0 ? Math.ceil(totalCostNeeded / hobbyBudget) : 999;

    const monthlyAdd = generalSavings;
    const projectedTotal = appData.currentSavings + monthlyAdd;
    const progressPercent = (appData.currentSavings / appData.savingsGoal) * 100;

    document.getElementById('savings-bar').style.width = `${progressPercent}%`;
    document.getElementById('savings-percent').innerText = `${progressPercent.toFixed(1)}%`;
    document.getElementById('current-savings-text').innerText = formatMoney(appData.currentSavings);
    document.getElementById('monthly-add').innerText = `+${formatMoney(monthlyAdd)}`;

    let recommendations = [];
    let tempBudget = spendingMoney;
    
    let candidateCollections = appData.collections
        .filter(c => c.id !== 1) 
        .map(c => {
            return { ...c, nextIndex: c.ownedList.indexOf(false), simulatedCount: 0 };
        })
        .filter(c => c.nextIndex !== -1);

    candidateCollections.sort((a, b) => a.priority - b.priority || a.pricePerItem - b.pricePerItem);

    let safetyLoop = 0;
    while (tempBudget > 0 && candidateCollections.length > 0 && safetyLoop < 50) {
        let boughtSomething = false;
        safetyLoop++;

        for (let col of candidateCollections) {
            if (col.pricePerItem <= tempBudget && (col.nextIndex + col.simulatedCount < col.totalItems)) {
                tempBudget -= col.pricePerItem;
                col.simulatedCount++;
                
                let existingRec = recommendations.find(r => r.name === col.name);
                if (existingRec) {
                    existingRec.items.push(col.nextIndex + existingRec.count); 
                    existingRec.count++;
                } else {
                    recommendations.push({
                        name: col.name, icon: col.icon, count: 1, items: [col.nextIndex + 1]
                    });
                }
                boughtSomething = true;
                break; 
            }
        }
        if (!boughtSomething) break;
    }

    allocationDisplay.innerText = `${appData.allocation}%`;
    hobbyBudgetDisplay.innerText = formatMoney(hobbyBudget);
    savingsDisplay.innerText = formatMoney(magicPiggyBank);
    spendingDisplay.innerText = formatMoney(spendingMoney);
    magicCostDisplay.innerText = formatMoney(magicRemaining);
    monthsDisplay.innerText = months < 900 ? months : "∞";
    globalMissingDisplay.innerText = `Faltan ${totalItemsNeeded} items`;

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
            if (tempBudget > 1) {
                 planHTML += `<div style="font-size:0.8rem; color:#94a3b8; margin-top:0.5rem;">Sobra: <strong>${formatMoney(tempBudget)}</strong> (A la hucha Magic)</div>`;
            }
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

function renderCollections() {
    container.innerHTML = '';

    appData.collections.forEach((col, colIndex) => {
        let ownedCount = 0;
        let totalCount = 0;
        let remainingCost = 0;

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
                             data-img="${item.image}"
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
    const isOwned = col.ownedList[idx];

    calculateFinances();

    const card = document.getElementById(`col-${colId}`);
    if (!card) return;

    const selector = col.type === 'cards' ? '.item-row' : '.manga-cover';
    const items = card.querySelectorAll(selector);
    const targetItem = items[idx];

    if (targetItem) {
        if (isOwned) {
            targetItem.classList.add('owned');
            if(col.type === 'cards') {
                const checkBox = targetItem.querySelector('.check-box');
                if (checkBox) checkBox.innerText = '✔';
            }
        } else {
            targetItem.classList.remove('owned');
            if(col.type === 'cards') {
                const checkBox = targetItem.querySelector('.check-box');
                if (checkBox) checkBox.innerText = '';
            }
        }
    }

    let ownedCount = col.ownedList.filter(Boolean).length;
    let totalCount = col.type === 'cards' ? col.items.length : col.totalItems;
    let remainingCost = 0;

    if (col.type === 'cards') {
        remainingCost = col.items.reduce((acc, item, i) => !col.ownedList[i] ? acc + item.price : acc, 0);
    } else {
        remainingCost = (totalCount - ownedCount) * col.pricePerItem;
    }

    const progress = (ownedCount / totalCount) * 100;
    const isCompleted = ownedCount >= totalCount;

    const moneyEl = card.querySelector('.money-value');
    if (moneyEl) moneyEl.innerText = isCompleted ? '¡Listo!' : formatMoney(remainingCost);

    const countEl = card.querySelector('.col-meta-count');
    if (countEl) countEl.innerText = `${ownedCount} / ${totalCount} items`;

    const barEl = card.querySelector('.progress-bar');
    if (barEl) {
        barEl.style.width = `${progress}%`;
        barEl.style.backgroundColor = isCompleted ? '#10b981' : '#6366f1';
    }
    
    // GUARDADO EN LA NUBE AUTOMÁTICO AL HACER CLIC
    saveToDynamo();
}

salaryInput.addEventListener('input', (e) => { appData.salary = parseFloat(e.target.value); calculateFinances(); saveToDynamo(); });
expensesInput.addEventListener('input', (e) => { appData.expenses = parseFloat(e.target.value); calculateFinances(); saveToDynamo(); });
allocationInput.addEventListener('input', (e) => { appData.allocation = parseInt(e.target.value); calculateFinances(); saveToDynamo(); });

salaryInput.value = appData.salary;
expensesInput.value = appData.expenses;
allocationInput.value = appData.allocation;

calculateFinances();
renderCollections();
