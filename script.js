// --- DATOS INICIALES ---

// Helper para crear array de 'false' con algunos 'true' al principio
function generateOwned(total, ownedCount) {
    return Array(total).fill(false).map((_, i) => i < ownedCount);
}

// Datos de cartas FIJOS - Lista depurada del Master Set
const initialMagicCards = [
    { name: "Absolute Virtue", price: 3.49 },
    { name: "Aerith Gainsborough", price: 1.79 },
    { name: "Aettir and Priwen", price: 5.43 },
    { name: "Ancient Adamantoise", price: 3.90 },
    { name: "Ardyn, the Usurper", price: 1.08 },
    { name: "A Realm Reborn", price: 0.28 },
    { name: "Battle Menu", price: 0.20 },
    { name: "Buster Sword", price: 31.19 },
    { name: "Cecil, Dark Knight // Cecil, Redeemed Paladin", price: 1.25 },
    { name: "Cid, Timeless Artificer", price: 4.18 },
    { name: "Clive, Ifrit's Dominant // Ifrit, Warden of Inferno", price: 2.98 },
    { name: "Cloud, Midgar Mercenary", price: 17.98 },
    { name: "Dark Confidant", price: 3.66 },
    ...Array(33).fill(null).map((_, i) => ({ name: `Carta Master Set #${i + 14}`, price: 2.50 }))
];

let appData = {
    salary: 1084.20,
    expenses: 600.00,
    allocation: 30,
    collections: [
        {
            id: 1,
            name: "Magic: FF Master Set",
            publisher: "Wizards",
            type: "cards",
            items: initialMagicCards,
            ownedList: Array(46).fill(false),
            expanded: false,
            theme: "purple",
            icon: "🔮",
            priority: 0 // Crítico (Ahorro separado)
        },
        {
            id: 2,
            name: "Vagabond",
            publisher: "Ivrea",
            type: "manga",
            totalItems: 37,
            ownedList: generateOwned(37, 2),
            pricePerItem: 7.60,
            expanded: false,
            theme: "col-theme-stone",
            icon: "🗡️",
            folder: "Vagabond",
            ext: "jpg",
            priority: 2 // Media
        },
        {
            id: 3,
            name: "Slam Dunk (Kanzenban)",
            publisher: "Ivrea",
            type: "manga",
            totalItems: 20,
            ownedList: generateOwned(20, 1),
            pricePerItem: 14.25,
            expanded: false,
            theme: "col-theme-orange",
            icon: "🏀",
            folder: "SlamDunk",
            ext: "webp",
            priority: 1 // Alta
        },
        {
            id: 4,
            name: "Vinland Saga",
            publisher: "Planeta",
            type: "manga",
            totalItems: 29,
            ownedList: generateOwned(29, 3),
            pricePerItem: 12.30,
            expanded: false,
            theme: "col-theme-blue",
            icon: "🛡️",
            folder: "VinlandSaga",
            ext: "webp",
            priority: 3 // Baja
        },
        {
            id: 5,
            name: "Dragon Ball Ultimate",
            publisher: "Planeta",
            type: "manga",
            totalItems: 34,
            ownedList: generateOwned(34, 7),
            pricePerItem: 8.60,
            expanded: false,
            theme: "col-theme-yellow",
            icon: "🐉",
            folder: "DragonBall",
            ext: "webp",
            priority: 2 // Media
        }
    ]
};

// --- DOM ELEMENTS ---
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

// --- FORMATTERS ---
const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

// --- CORE LOGIC ---

function calculateFinances() {
    const disposable = appData.salary - appData.expenses;
    const hobbyBudget = disposable * (appData.allocation / 100);
    
    // 1. Calcular Totales y Estado de Magic
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

    // 2. Definir Presupuestos (Si Magic está completo, todo va a compras)
    let savings = isMagicComplete ? 0 : hobbyBudget * 0.60;
    let spending = hobbyBudget - savings;
    const months = hobbyBudget > 0 ? Math.ceil(totalCostNeeded / hobbyBudget) : 999;

    // 3. GENERADOR DE ESTRATEGIA DE COMPRA (Simulación)
    let recommendations = [];
    let tempBudget = spending;
    
    // Filtrar colecciones incompletas (excluyendo Magic que va por 'savings')
    let candidateCollections = appData.collections
        .filter(c => c.id !== 1) // No Magic
        .map(c => {
            // Clonamos para simulación
            return {
                ...c,
                nextIndex: c.ownedList.indexOf(false), // Primer tomo que falta
                simulatedCount: 0
            };
        })
        .filter(c => c.nextIndex !== -1); // Solo las que faltan cosas

    // Ordenar por prioridad (1: Alta, 2: Media, 3: Baja)
    candidateCollections.sort((a, b) => a.priority - b.priority);

    // Bucle "Greedy": Comprar lo más prioritario posible mientras haya dinero
    // Intentamos comprar 1 de cada prioridad alta, luego media, etc., y repetimos
    let safetyLoop = 0;
    while (tempBudget > 0 && candidateCollections.length > 0 && safetyLoop < 100) {
        let boughtSomething = false;
        safetyLoop++;

        for (let col of candidateCollections) {
            // Si nos alcanza para el siguiente tomo
            if (col.pricePerItem <= tempBudget) {
                tempBudget -= col.pricePerItem;
                col.simulatedCount++;
                
                // Añadir a recomendaciones
                let existingRec = recommendations.find(r => r.name === col.name);
                if (existingRec) {
                    existingRec.items.push(col.nextIndex + 1 + existingRec.count); // +count porque ya avanzamos
                    existingRec.count++;
                } else {
                    recommendations.push({
                        name: col.name,
                        icon: col.icon,
                        count: 1,
                        items: [col.nextIndex + 1]
                    });
                }
                
                // Actualizar simulación por si queremos comprar otro del mismo
                // (En este bucle simple, priorizamos variedad por prioridad)
                boughtSomething = true;
                
                // Opción: Romper el for para volver a empezar desde la prioridad más alta
                // Esto asegura que si sobra dinero, volvemos a intentar comprar Slam Dunk antes que Vinland
                break; 
            }
        }
        
        if (!boughtSomething) break; // No alcanza para nada más
    }

    // 4. Renderizado en DOM
    allocationDisplay.innerText = `${appData.allocation}%`;
    hobbyBudgetDisplay.innerText = formatMoney(hobbyBudget);
    savingsDisplay.innerText = formatMoney(savings);
    spendingDisplay.innerText = formatMoney(spending);
    magicCostDisplay.innerText = formatMoney(magicRemaining);
    monthsDisplay.innerText = months < 900 ? months : "∞";
    globalMissingDisplay.innerText = `Faltan ${totalItemsNeeded} items`;

    // 5. Inyectar HTML del Plan Detallado
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
        planHTML = '<div style="color:#34d399; font-weight:bold">¡Felicidades! Has completado todas tus colecciones.</div>';
    } else {
        planHTML += `<h4 style="font-size:0.75rem; text-transform:uppercase; color:#94a3b8; margin-bottom:0.5rem; letter-spacing:1px">Lista de la Compra Sugerida:</h4>`;
        
        if (recommendations.length > 0) {
            planHTML += `<ul style="list-style:none; font-size:0.9rem; padding:0;">`;
            recommendations.forEach(rec => {
                planHTML += `<li style="margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem; background:rgba(255,255,255,0.05); padding:0.5rem; border-radius:0.5rem;">
                    <span style="font-size:1.2rem">${rec.icon}</span>
                    <div>
                        <div style="font-weight:bold; color:#fff">${rec.name}</div>
                        <div style="font-size:0.8rem; color:#94a3b8">Comprar tomos: <strong style="color:#818cf8">${rec.items.join(', ')}</strong></div>
                    </div>
                </li>`;
            });
            planHTML += `</ul>`;
        } else if (spending > 0) {
            planHTML += `<div style="font-style:italic; color:#94a3b8; font-size:0.85rem">No alcanza para ningún tomo completo hoy. ¡Ahorra el excedente!</div>`;
        }

        // Resumen de Hucha
        if (!isMagicComplete) {
            planHTML += `<div style="margin-top:0.75rem; font-size:0.85rem; background:rgba(16, 185, 129, 0.1); padding:0.5rem; border-radius:0.5rem; border:1px solid rgba(16, 185, 129, 0.2)">
                🐷 Hucha Magic: <strong style="color:#34d399">+${formatMoney(savings)}</strong> este mes.
            </div>`;
        }
    }

    detailsDiv.innerHTML = planHTML;
}

// --- RENDER FUNCTIONS ---

function renderCollections() {
    container.innerHTML = '';

    appData.collections.forEach((col, colIndex) => {
        // Calcular estado de la coleccion
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

        // Crear elemento Card
        const card = document.createElement('div');
        card.id = `col-${col.id}`; // ID ÚNICO PARA ACTUALIZACIONES PARCIALES
        card.className = 'collection-card';
        
        // Header HTML
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

        // Body HTML (Items)
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
                        <div class="check-box">${isOwned ? '✔' : ''}</div>
                        <div style="overflow:hidden">
                            <div style="font-weight:600; font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">${item.name}</div>
                            <div style="font-size:0.75rem; color:#94a3b8">${formatMoney(item.price)}</div>
                        </div>
                    `;
                    itemEl.onclick = () => toggleItem(col.id, idx);
                    listGrid.appendChild(itemEl);
                });
                bodyDiv.appendChild(listGrid);
            } else {
                // Manga Grid
                const mangaGrid = document.createElement('div');
                mangaGrid.className = 'manga-grid';
                col.ownedList.forEach((isOwned, idx) => {
                    const cover = document.createElement('div');
                    cover.className = `manga-cover ${col.theme} ${isOwned ? 'owned' : ''}`;
                    
                    // LÓGICA DE IMÁGENES: Usa la carpeta si existe
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
                        // Generador CSS para Vinland
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

// --- ACTIONS ---

window.toggleExpand = (id) => {
    const col = appData.collections.find(c => c.id === id);
    if(col) {
        col.expanded = !col.expanded;
        renderCollections(); 
    }
}

// **FUNCIÓN OPTIMIZADA: Actualiza sin parpadear**
window.toggleItem = (colId, idx) => {
    const col = appData.collections.find(c => c.id === colId);
    if (!col) return;

    // 1. Actualizar Datos
    col.ownedList[idx] = !col.ownedList[idx];
    const isOwned = col.ownedList[idx];

    // 2. Recalcular Finanzas Globales
    calculateFinances();

    // 3. Actualizar DOM del Elemento Específico
    const card = document.getElementById(`col-${colId}`);
    if (!card) return;

    const selector = col.type === 'cards' ? '.item-row' : '.manga-cover';
    const items = card.querySelectorAll(selector);
    const targetItem = items[idx];

    if (targetItem) {
        if (isOwned) {
            targetItem.classList.add('owned');
            if(col.type === 'cards') targetItem.querySelector('.check-box').innerText = '✔';
        } else {
            targetItem.classList.remove('owned');
            if(col.type === 'cards') targetItem.querySelector('.check-box').innerText = '';
        }
    }

    // 4. Actualizar Cabecera
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
}

// --- EVENT LISTENERS ---
salaryInput.addEventListener('input', (e) => { appData.salary = parseFloat(e.target.value); calculateFinances(); });
expensesInput.addEventListener('input', (e) => { appData.expenses = parseFloat(e.target.value); calculateFinances(); });
allocationInput.addEventListener('input', (e) => { appData.allocation = parseInt(e.target.value); calculateFinances(); });


// --- INIT ---
calculateFinances();
renderCollections();