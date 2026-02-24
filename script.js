// ===============================
// script.js (COMPLETO)
// ===============================

// --- CARGA DINÁMICA DE CHART.JS ---
const chartScript = document.createElement('script');
chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
chartScript.onload = () => { if (window.ChartLoadedCallback) window.ChartLoadedCallback(); };
document.head.appendChild(chartScript);

// --- HELPERS ---
function generateOwned(total, ownedCount) {
  return Array(total).fill(false).map((_, i) => i < ownedCount);
}

const formatMoney = (amount) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

// --- DATOS INICIALES (Magic) ---
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

// --- FECHA / MES ---
const today = new Date();
const defaultMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

// ======================================================
// ✅ MODELO: base + ajustes + monthlyData
// ======================================================
let appData = {
  initialSavings: 1124.90,     // <-- tu base
  manualAdjustments: 0,        // <-- ajustes con + / -
  savingsGoal: 10000,
  currentMonth: defaultMonthStr,

  monthlyData: {
    [defaultMonthStr]: {
      salary: 1084.20,
      fixedExpenses: [{ id: Date.now(), name: "General Fijos", amount: 329.92 }],
      variableExpenses: [{ id: Date.now() + 1, name: "General Variables", amount: 150.00 }],
      allocation: 30
    }
  },

  collections: [
    { id: 1, name: "Magic: FF Master Set", publisher: "Wizards", type: "cards", items: initialMagicCards, ownedList: Array(45).fill(false), expanded: false, theme: "purple", icon: "🔮", priority: 3 },
    { id: 2, name: "Vagabond", publisher: "Ivrea", type: "manga", totalItems: 37, ownedList: generateOwned(37, 2), pricePerItem: 7.60, expanded: false, theme: "col-theme-stone", icon: "🗡️", folder: "Vagabond", ext: "jpg", priority: 1 },
    { id: 3, name: "Vinland Saga", publisher: "Planeta", type: "manga", totalItems: 29, ownedList: generateOwned(29, 3), pricePerItem: 12.30, expanded: false, theme: "col-theme-blue", icon: "🛡️", folder: "VinlandSaga", ext: "webp", priority: 1 }
  ]
};

// ======================================================
// AWS / DYNAMO
// ======================================================
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
      return;
    }

    if (!data.Item) {
      updateAllUI();
      return;
    }

    console.log("Datos cargados desde la nube ☁️");

    // Colecciones
    if (data.Item.collectionsData) {
      const savedCollections = JSON.parse(data.Item.collectionsData);
      appData.collections.forEach(col => {
        if (savedCollections[col.id]) {
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

    // Finanzas
    if (data.Item.finances) {
      const dbFin = data.Item.finances;

      if (dbFin.monthlyData) {
        appData.monthlyData = dbFin.monthlyData;

        if (dbFin.initialSavings !== undefined) appData.initialSavings = dbFin.initialSavings;

        if (dbFin.manualAdjustments !== undefined) {
          appData.manualAdjustments = dbFin.manualAdjustments;
        } else if (dbFin.globalSavings !== undefined) {
          appData.manualAdjustments = dbFin.globalSavings; // compat antiguo
        }

        if (!appData.monthlyData[defaultMonthStr]) createNewMonthProfile(defaultMonthStr);
      } else if (dbFin.salary !== undefined) {
        // formato viejo
        appData.monthlyData[defaultMonthStr] = {
          salary: dbFin.salary || 1084.20,
          fixedExpenses: [{ id: Date.now(), name: "General Fijos", amount: dbFin.expenses || 0 }],
          variableExpenses: [{ id: Date.now() + 1, name: "General Variables", amount: dbFin.variableExpenses || 0 }],
          allocation: dbFin.allocation ?? 30
        };
        if (dbFin.globalSavings !== undefined) appData.manualAdjustments = dbFin.globalSavings;
      }
    }

    updateAllUI();
  });
}

function showSaveNotification() {
  let toast = document.getElementById('save-toast');
  if (!toast) {
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
  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

function saveToDynamo() {
  if (!dbUserId) return;

  const collectionsToSave = {};
  appData.collections.forEach(col => {
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
      finances: {
        initialSavings: appData.initialSavings || 0,
        manualAdjustments: appData.manualAdjustments || 0,
        monthlyData: appData.monthlyData
      },
      lastUpdated: new Date().toISOString()
    }
  };

  docClient.put(params, (err) => {
    if (err) console.error("Error subiendo datos:", err);
    else {
      console.log("Datos guardados en la nube ☁️");
      showSaveNotification();
    }
  });
}

// ======================================================
// SCRYFALL
// ======================================================
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
    let searchName = card.name.split(' // ')[0].trim();

    try {
      const res = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(searchName)}`);
      if (res.ok) {
        const data = await res.json();
        const newPrice = data.prices?.eur || data.prices?.usd;
        if (newPrice) card.price = parseFloat(newPrice);
      }
    } catch (e) {
      console.error("Error buscando en Scryfall:", card.name);
    }

    updatedCount++;
    btn.innerHTML = `⏳ Leyendo... ${updatedCount}/${magicCol.items.length}`;
    await new Promise(r => setTimeout(r, 120));
  }

  btn.innerHTML = '✅ ¡Mercado Actualizado!';
  saveToDynamo();
  updateAllUI();

  setTimeout(() => {
    btn.innerHTML = '🔄 Precios Magic';
    btn.disabled = false;
    btn.style.opacity = '1';
  }, 3000);
};

// Botones top
document.addEventListener('DOMContentLoaded', () => {
  const badgesContainer = document.querySelector('.badges');
  if (!badgesContainer) return;

  const scryfallBtn = document.createElement('button');
  scryfallBtn.id = 'scryfall-sync-btn';
  scryfallBtn.className = 'btn';
  scryfallBtn.style.padding = '0.15rem 0.5rem';
  scryfallBtn.style.fontSize = '0.75rem';
  scryfallBtn.style.borderColor = '#8b5cf6';
  scryfallBtn.style.color = '#8b5cf6';
  scryfallBtn.style.marginRight = '0.5rem';
  scryfallBtn.innerHTML = '🔄 Precios Magic';
  scryfallBtn.onclick = window.syncScryfallPrices;

  const summaryBtn = document.createElement('button');
  summaryBtn.className = 'btn';
  summaryBtn.style.padding = '0.15rem 0.5rem';
  summaryBtn.style.fontSize = '0.75rem';
  summaryBtn.style.borderColor = 'var(--primary)';
  summaryBtn.style.color = 'var(--primary)';
  summaryBtn.innerHTML = '📊 Resumen Anual';
  summaryBtn.onclick = window.showAnnualSummary;

  const logoutBtn = badgesContainer.lastElementChild;
  badgesContainer.insertBefore(scryfallBtn, logoutBtn);
  badgesContainer.insertBefore(summaryBtn, logoutBtn);
});

// ======================================================
// MESES Y GASTOS
// ======================================================
function createNewMonthProfile(monthStr) {
  const months = Object.keys(appData.monthlyData).sort();
  const lastMonth = months[months.length - 1];
  if (lastMonth) {
    const lastData = appData.monthlyData[lastMonth];
    appData.monthlyData[monthStr] = {
      salary: lastData.salary,
      fixedExpenses: JSON.parse(JSON.stringify(lastData.fixedExpenses)),
      variableExpenses: [],
      allocation: lastData.allocation ?? 30
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
  if (!el) return;
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
};

window.addExpense = (type) => {
  const nameInput = document.getElementById(`new-${type}-name`);
  const amountInput = document.getElementById(`new-${type}-amount`);
  if (!nameInput || !amountInput) return;

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (name && amount > 0) {
    appData.monthlyData[appData.currentMonth][`${type}Expenses`].push({ id: Date.now(), name, amount });
    nameInput.value = '';
    amountInput.value = '';
    updateAllUI();
    saveToDynamo();
  }
};

window.removeExpense = (type, id) => {
  const list = appData.monthlyData[appData.currentMonth][`${type}Expenses`];
  appData.monthlyData[appData.currentMonth][`${type}Expenses`] = list.filter(item => item.id !== id);
  updateAllUI();
  saveToDynamo();
};

window.updateSalary = (val) => {
  appData.monthlyData[appData.currentMonth].salary = parseFloat(val) || 0;
  updateAllUI();
  saveToDynamo();
};

window.updateAllocation = (val) => {
  appData.monthlyData[appData.currentMonth].allocation = parseInt(val) || 0;
  updateAllUI();
  saveToDynamo();
};

// ✅ ajustes manuales (no toca base)
window.modifySavings = (multiplier) => {
  const input = document.getElementById('savings-modifier');
  if (!input) return;
  const val = parseFloat(input.value);
  if (!isNaN(val) && val > 0) {
    appData.manualAdjustments += (val * multiplier);
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
    if (!container) return 0;

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

    const totalEl = document.getElementById(`total-${type}-display`);
    if (totalEl) totalEl.innerText = total.toFixed(2);
    return total;
  };

  return {
    totalFixed: renderList('fixed', curData.fixedExpenses),
    totalVar: renderList('variable', curData.variableExpenses)
  };
}

// ======================================================
// CHART
// ======================================================
let mainChart = null;

function drawDonutChart(fixed, variable, savings, hobbies) {
  const canvas = document.getElementById('financeChart');
  if (!canvas || typeof Chart === 'undefined') return;

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
    mainChart = new Chart(canvas, {
      type: 'doughnut',
      data: dataObj,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#f8fafc', font: { size: 11 }, padding: 10 } }
        }
      }
    });
  }
}

// ======================================================
// UI PRINCIPAL
// ======================================================
function updateAllUI() {
  const monthSel = document.getElementById('month-selector');
  const salaryEl = document.getElementById('salary');
  const allocEl = document.getElementById('allocation');
  const allocDisp = document.getElementById('allocation-display');

  if (monthSel) monthSel.value = appData.currentMonth;
  if (salaryEl) salaryEl.value = appData.monthlyData[appData.currentMonth].salary;
  if (allocEl) allocEl.value = appData.monthlyData[appData.currentMonth].allocation;
  if (allocDisp) allocDisp.innerText = `${appData.monthlyData[appData.currentMonth].allocation}%`;

  const { totalFixed, totalVar } = renderExpenseLists();
  calculateFinances(totalFixed, totalVar);
  renderCollections();
}

function calculateFinances(totalFixed = 0, totalVar = 0) {
  const curData = appData.monthlyData[appData.currentMonth];

  // Histórico app (suma ahorros de todos los meses)
  let accumulatedSavings = 0;
  Object.values(appData.monthlyData).forEach(monthData => {
    const mFixed = monthData.fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const mVar = monthData.variableExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const mDisp = (monthData.salary || 0) - mFixed - mVar;

    if (mDisp > 0) {
      // ✅ IMPORTANTE: respeta 0% (usa ??)
      const allocPct = (monthData.allocation ?? 30) / 100;
      const mHobby = mDisp * allocPct;
      const mSavings = mDisp - mHobby;
      accumulatedSavings += mSavings;
    }
  });

  // Total real
  const base = appData.initialSavings || 0;
  const manual = appData.manualAdjustments || 0;
  const totalRealSavings = base + manual + accumulatedSavings;

  // Mes actual
  const disposable = (curData.salary || 0) - totalFixed - totalVar;
  const hobbyBudget = disposable > 0 ? disposable * ((curData.allocation ?? 30) / 100) : 0;
  const currentMonthSavings = disposable > 0 ? (disposable - hobbyBudget) : 0;

  // Costes pendientes colecciones
  let totalCostNeeded = 0;
  let totalItemsNeeded = 0;
  let magicRemaining = 0;
  let isMagicComplete = false;

  appData.collections.forEach(col => {
    if (col.type === 'cards') {
      const missingCards = col.items.filter((_, i) => !col.ownedList[i]);
      const cost = missingCards.reduce((acc, item) => acc + item.price, 0);
      if (col.id === 1) {
        magicRemaining = cost;
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

  // Estrategia
  const magicPiggyBank = isMagicComplete ? 0 : hobbyBudget * 0.60;
  const spendingMoney = hobbyBudget - magicPiggyBank;
  const months = hobbyBudget > 0 ? Math.ceil(totalCostNeeded / hobbyBudget) : 999;

  // ===== KPIs =====
  const kTotal = document.getElementById('kpi-total');
  const kBase = document.getElementById('kpi-base');
  const kApp = document.getElementById('kpi-app');
  const kManual = document.getElementById('kpi-manual');
  const kMonth = document.getElementById('kpi-month');
  const kMonthMini = document.getElementById('kpi-month-mini');
  const kHobby = document.getElementById('kpi-hobby');
  const kMagicPiggy = document.getElementById('kpi-magic-piggy');
  const kSpending = document.getElementById('kpi-spending');
  const kProgBar = document.getElementById('kpi-progress-bar');
  const kProgTxt = document.getElementById('kpi-progress-text');

  if (kTotal) kTotal.innerText = formatMoney(totalRealSavings);
  if (kBase) kBase.innerText = formatMoney(base);
  if (kApp) kApp.innerText = formatMoney(accumulatedSavings);
  if (kManual) kManual.innerText = `${manual > 0 ? '+' : ''}${formatMoney(manual)}`;
  if (kMonth) kMonth.innerText = formatMoney(currentMonthSavings);
  if (kMonthMini) kMonthMini.innerText = `+${formatMoney(currentMonthSavings)}`;
  if (kHobby) kHobby.innerText = formatMoney(hobbyBudget);
  if (kMagicPiggy) kMagicPiggy.innerText = formatMoney(magicPiggyBank);
  if (kSpending) kSpending.innerText = formatMoney(spendingMoney);

  const progressPercent = Math.max(0, Math.min((totalRealSavings / appData.savingsGoal) * 100, 100));
  if (kProgBar) kProgBar.style.width = `${progressPercent}%`;
  if (kProgTxt) kProgTxt.innerText = `${progressPercent.toFixed(1)}%`;

  // ===== Donut =====
  if (typeof Chart !== 'undefined') {
    drawDonutChart(totalFixed, totalVar, currentMonthSavings, hobbyBudget);
  } else {
    window.ChartLoadedCallback = () => drawDonutChart(totalFixed, totalVar, currentMonthSavings, hobbyBudget);
  }

  // ===== Plan text =====
  const hobbyEl = document.getElementById('hobby-budget');
  const saveSug = document.getElementById('savings-suggestion');
  const spendEl = document.getElementById('spending-money');
  const magicEl = document.getElementById('magic-cost');
  const monthsEl = document.getElementById('months-to-finish');
  const missEl = document.getElementById('global-missing-count');

  if (hobbyEl) hobbyEl.innerText = formatMoney(hobbyBudget);
  if (saveSug) saveSug.innerText = formatMoney(magicPiggyBank);
  if (spendEl) spendEl.innerText = formatMoney(spendingMoney);
  if (magicEl) magicEl.innerText = formatMoney(magicRemaining);
  if (monthsEl) monthsEl.innerText = months < 900 ? months : "∞";
  if (missEl) missEl.innerText = `Faltan ${totalItemsNeeded} items`;

  // ===== Recomendaciones mangas =====
  let recommendations = [];
  let tempBudget = spendingMoney;

  let candidateCollections = appData.collections
    .filter(c => c.id !== 1)
    .map(c => ({ ...c, nextIndex: c.ownedList.indexOf(false), simulatedCount: 0 }))
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
          existingRec.items.push(col.nextIndex + existingRec.count + 1);
          existingRec.count++;
        } else {
          recommendations.push({ name: col.name, icon: col.icon, count: 1, items: [col.nextIndex + 1] });
        }

        boughtSomething = true;
        break;
      }
    }
    if (!boughtSomething) break;
  }

  const detailsDiv = document.getElementById('plan-details');
  if (!detailsDiv) return;

  let planHTML = '';
  if (isMagicComplete && recommendations.length === 0 && totalItemsNeeded === 0) {
    planHTML = '<div style="color:#34d399; font-weight:bold">¡Todo Completado! Eres el rey del coleccionismo.</div>';
  } else {
    planHTML += `<h4 style="font-size:0.75rem; text-transform:uppercase; color:#94a3b8; margin-bottom:0.5rem; letter-spacing:1px">Lista de Compra Prioritaria:</h4>`;

    if (recommendations.length > 0) {
      planHTML += `<ul style="list-style:none; font-size:0.9rem; padding:0; margin:0;">`;
      recommendations.forEach(rec => {
        planHTML += `
          <li style="margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem; background:rgba(255,255,255,0.05); padding:0.5rem; border-radius:0.75rem;">
            <span style="font-size:1.2rem">${rec.icon}</span>
            <div>
              <div style="font-weight:bold; color:#fff">${rec.name}</div>
              <div style="font-size:0.8rem; color:#94a3b8">Tomos: <strong style="color:#818cf8">${rec.items.join(', ')}</strong></div>
            </div>
          </li>
        `;
      });
      planHTML += `</ul>`;

      if (tempBudget > 1) {
        planHTML += `<div style="font-size:0.8rem; color:#94a3b8; margin-top:0.5rem;">Sobra: <strong>${formatMoney(tempBudget)}</strong> (A la hucha Magic)</div>`;
      }
    } else if (spendingMoney > 0) {
      planHTML += `<div style="font-style:italic; color:#94a3b8; font-size:0.85rem">No alcanza para ningún tomo. ¡Todo a la hucha!</div>`;
    }

    if (!isMagicComplete) {
      planHTML += `
        <div style="margin-top:0.75rem; font-size:0.85rem; background:rgba(16, 185, 129, 0.1); padding:0.6rem; border-radius:0.75rem; border:1px solid rgba(16, 185, 129, 0.2)">
          🔮 Para Magic: Guarda <strong style="color:#34d399">${formatMoney(magicPiggyBank)}</strong>
        </div>
      `;
    }
  }

  detailsDiv.innerHTML = planHTML;
}

// ======================================================
// RESUMEN ANUAL
// ======================================================
window.showAnnualSummary = () => {
  const year = appData.currentMonth.split('-')[0];
  let tSalary = 0, tFixed = 0, tVar = 0, tHobbies = 0, tSavings = 0;

  Object.keys(appData.monthlyData).forEach(month => {
    if (month.startsWith(year)) {
      const md = appData.monthlyData[month];
      tSalary += md.salary || 0;

      let mFixed = 0, mVar = 0;
      md.fixedExpenses.forEach(e => mFixed += e.amount);
      md.variableExpenses.forEach(e => mVar += e.amount);
      tFixed += mFixed;
      tVar += mVar;

      const mDisp = (md.salary || 0) - mFixed - mVar;
      if (mDisp > 0) {
        // ✅ respeta 0% con ??
        const alloc = (md.allocation ?? 30) / 100;
        tHobbies += (mDisp * alloc);
        tSavings += (mDisp - (mDisp * alloc));
      }
    }
  });

  let modal = document.getElementById('annual-modal');
  if (!modal) {
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

// ======================================================
// COLECCIONES
// ======================================================
function renderCollections() {
  const container = document.getElementById('collections-container');
  if (!container) return;
  container.innerHTML = '';

  appData.collections.forEach((col) => {
    let ownedCount = 0, totalCount = 0, remainingCost = 0;

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
          <div class="progress-bar" style="width:${progress}%; background-color:${isCompleted ? '#10b981' : '#6366f1'}"></div>
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
  if (col) {
    col.expanded = !col.expanded;
    renderCollections();
  }
};

window.toggleItem = (colId, idx) => {
  const col = appData.collections.find(c => c.id === colId);
  if (!col) return;
  col.ownedList[idx] = !col.ownedList[idx];
  updateAllUI();
  saveToDynamo();
};

// ======================================================
// ZOOM CARTAS
// ======================================================
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

// INIT
updateAllUI();
