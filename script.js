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
const APP_VERSION = '20260320c';
const LOGIN_URL = window.appSession?.loginUrl || 'https://networknormon.github.io/life_savings/login.html';
const MONTH_NAMES_ES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const LOCAL_STORAGE_KEYS = {
    backup: 'life-savings-app-backup-v1',
    pendingSync: 'life-savings-cloud-pending-v1',
    financeSnapshots: 'life-savings-price-snapshots-v1'
};

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
        { id: 1, name: "Magic: FF Master Set", publisher: "Wizards", type: "cards", items: initialMagicCards, ownedList: Array(45).fill(false), expanded: false, theme: "purple", icon: "🔮", priority: 3 }
 ],
    gaming: {
        items: [],
        aliases: {}
    }
};

const runtimeState = {
    cloudSyncEnabled: false,
    pendingSync: false,
    bootedFromLocal: false,
    sessionExpired: Boolean(window.appSession?.isExpired),
    lastFinanceSummary: null
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
let bookTransitionTimeout = null;

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

function ensureBookTransitionLayer() {
    if (document.getElementById('book-transition-layer')) return;
    const layer = document.createElement('div');
    layer.id = 'book-transition-layer';
    layer.className = 'book-transition-layer hidden';
    layer.innerHTML = `
        <div class="book-transition-stage">
            <div class="book-transition-shell">
                <div class="book-half book-half-left"></div>
                <div class="book-half book-half-right"></div>
                <img class="book-transition-cover" alt="">
            </div>
        </div>
    `;
    document.body.appendChild(layer);
}

function playBookOpenTransition(bookEl, coverSrc, onDone) {
    ensureBookTransitionLayer();
    const layer = document.getElementById('book-transition-layer');
    const cover = layer.querySelector('.book-transition-cover');
    const rect = bookEl.getBoundingClientRect();
    const targetW = Math.min(window.innerWidth * 0.42, 300);
    const targetH = targetW * 1.5;
    const targetX = (window.innerWidth - targetW) / 2;
    const targetY = Math.max((window.innerHeight - targetH) / 2, 36);

    layer.style.setProperty('--from-x', `${rect.left}px`);
    layer.style.setProperty('--from-y', `${rect.top}px`);
    layer.style.setProperty('--from-w', `${rect.width}px`);
    layer.style.setProperty('--from-h', `${rect.height}px`);
    layer.style.setProperty('--to-x', `${targetX}px`);
    layer.style.setProperty('--to-y', `${targetY}px`);
    layer.style.setProperty('--to-w', `${targetW}px`);
    layer.style.setProperty('--to-h', `${targetH}px`);
    cover.src = coverSrc || '';

    layer.classList.remove('hidden', 'is-grow', 'is-open');
    void layer.offsetWidth;
    layer.classList.add('is-grow');

    if (bookTransitionTimeout) clearTimeout(bookTransitionTimeout);
    bookTransitionTimeout = setTimeout(() => {
        layer.classList.add('is-open');
    }, 420);

    setTimeout(() => {
        if (onDone) onDone();
        layer.classList.add('hidden');
        layer.classList.remove('is-grow', 'is-open');
    }, 980);
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
let docClient = null;
let dbUserId = null;

function getDocClient() {
    if (!docClient) {
        docClient = new AWS.DynamoDB.DocumentClient({
            region: REGION,
            credentials: AWS.config.credentials
        });
    }
    return docClient;
}

function getStoredToken() {
    return localStorage.getItem('cognito_id_token') || '';
}

function decodeJwtExpiry(token) {
    if (!token) return 0;
    try {
        const payload = token.split('.')[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        return Number(JSON.parse(atob(payload)).exp || 0);
    } catch {
        return 0;
    }
}

function isTokenExpired(token) {
    const exp = decodeJwtExpiry(token);
    return exp ? Math.floor(Date.now() / 1000) >= exp : !token;
}

function buildCollectionsSaveObject() {
    const collectionsToSave = {};
    appData.collections.forEach((col) => {
        collectionsToSave[col.id] = {
            ownedList: col.ownedList,
            prices: col.type === 'cards' ? col.items.map((item) => item.price) : undefined
        };
    });
    return collectionsToSave;
}

function buildFinanceSaveObject() {
    return {
        globalSavings: appData.globalSavings,
        savingsGoal: appData.savingsGoal,
        currentMonth: appData.currentMonth,
        monthlyData: appData.monthlyData,
        gamingCollection: [],
        gamingAliases: {}
    };
}

function buildPersistedSnapshot() {
    return {
        version: 2,
        collectionsData: buildCollectionsSaveObject(),
        finances: buildFinanceSaveObject(),
        lastUpdated: new Date().toISOString()
    };
}

function persistLocalBackup(snapshot = buildPersistedSnapshot()) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.backup, JSON.stringify(snapshot));
}

function loadLocalBackup() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.backup) || 'null');
    } catch {
        return null;
    }
}

function loadPriceSnapshotState() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.financeSnapshots) || '{"prices":{},"alerts":[]}');
    } catch {
        return { prices: {}, alerts: [] };
    }
}

function persistPriceSnapshotState(state) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.financeSnapshots, JSON.stringify(state));
}

function trackPriceSnapshot(bucket, key, nextPrice, title) {
    if (!nextPrice || nextPrice <= 0) return;
    const state = loadPriceSnapshotState();
    state.prices[bucket] = state.prices[bucket] || {};
    const previous = Number(state.prices[bucket][key] || 0);

    if (previous > 0 && nextPrice < previous) {
        state.alerts = [
            {
                id: `${bucket}-${key}-${Date.now()}`,
                title,
                previous,
                next: nextPrice,
                createdAt: new Date().toISOString()
            },
            ...(state.alerts || [])
        ].slice(0, 12);
    }

    state.prices[bucket][key] = nextPrice;
    persistPriceSnapshotState(state);
}

function queuePendingSync(snapshot = buildPersistedSnapshot()) {
    runtimeState.pendingSync = true;
    localStorage.setItem(LOCAL_STORAGE_KEYS.pendingSync, JSON.stringify(snapshot));
    updateSessionUI();
}

function clearPendingSync() {
    runtimeState.pendingSync = false;
    localStorage.removeItem(LOCAL_STORAGE_KEYS.pendingSync);
    updateSessionUI();
}

function getPendingSync() {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.pendingSync);
        if (!raw) return null;
        runtimeState.pendingSync = true;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function applySavedCollections(savedCollections = {}) {
    appData.collections.forEach((col) => {
        if (!savedCollections[col.id]) return;
        if (Array.isArray(savedCollections[col.id])) {
            col.ownedList = savedCollections[col.id];
            return;
        }

        if (Array.isArray(savedCollections[col.id].ownedList)) {
            col.ownedList = savedCollections[col.id].ownedList;
        }
        if (col.type === 'cards' && Array.isArray(savedCollections[col.id].prices)) {
            col.items.forEach((item, idx) => {
                item.price = Number(savedCollections[col.id].prices[idx] || item.price);
            });
        }
    });
}

function applySavedFinances(finances = {}) {
    if (!finances || typeof finances !== 'object') return;

    if (finances.savingsGoal) appData.savingsGoal = Number(finances.savingsGoal) || appData.savingsGoal;
    if (typeof finances.globalSavings === 'number') appData.globalSavings = finances.globalSavings;
    if (finances.currentMonth) appData.currentMonth = finances.currentMonth;

    if (finances.monthlyData && typeof finances.monthlyData === 'object') {
        appData.monthlyData = finances.monthlyData;
    } else if (finances.salary !== undefined) {
        appData.monthlyData[defaultMonthStr] = {
            salary: finances.salary || 1084.20,
            fixedExpenses: [{ id: Date.now(), name: 'General Fijos', amount: finances.expenses || 0 }],
            variableExpenses: [{ id: Date.now() + 1, name: 'General Variables', amount: finances.variableExpenses || 0 }],
            allocation: finances.allocation || 30
        };
    }

    appData.gaming.items = [];
    appData.gaming.aliases = {};

    if (!appData.monthlyData[appData.currentMonth]) createNewMonthProfile(appData.currentMonth);
    if (!appData.monthlyData[defaultMonthStr]) createNewMonthProfile(defaultMonthStr);
}

function applyPersistedSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') return;
    if (snapshot.collectionsData) applySavedCollections(snapshot.collectionsData);
    if (snapshot.finances) applySavedFinances(snapshot.finances);
}

function hydrateFromLocalBackup() {
    const snapshot = loadLocalBackup();
    if (!snapshot) return;
    applyPersistedSnapshot(snapshot);
    runtimeState.bootedFromLocal = true;
}

function configureAwsCredentials() {
    const token = getStoredToken();
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IDENTITY_POOL_ID,
        Logins: token ? {
            [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: token
        } : {}
    });
    docClient = null;
}

function canSyncCloud() {
    return Boolean(runtimeState.cloudSyncEnabled && dbUserId && navigator.onLine);
}

function updateSessionUI(message = '') {
    const banner = document.getElementById('session-banner');
    const badge = document.getElementById('session-sync-badge');
    const todaySync = document.getElementById('today-sync-state');
    const token = getStoredToken();
    const expired = isTokenExpired(token);
    runtimeState.sessionExpired = expired;

    let modeLabel = 'Modo local';
    let headline = message;

    if (canSyncCloud()) {
        modeLabel = runtimeState.pendingSync ? 'Nube activa · pendiente' : 'Nube activa';
        headline = runtimeState.pendingSync
            ? 'Hay cambios locales en cola y se subirán cuando termine la sincronización.'
            : headline || 'Sesión conectada. Todo se está guardando en Dynamo y en copia local.';
    } else if (!navigator.onLine) {
        headline = headline || 'Sin conexión. Seguimos guardando todo en este navegador y sincronizamos cuando vuelva Internet.';
    } else if (!token) {
        headline = headline || 'No hay sesión iniciada. Puedes seguir usando la app en local y reconectar cuando quieras.';
    } else if (expired) {
        headline = headline || 'La sesión ha caducado. La vista sigue funcionando en local; reconecta para volver a sincronizar.';
    } else {
        headline = headline || 'No he podido validar la nube ahora mismo. Los cambios se están guardando en local.';
    }

    if (badge) badge.textContent = modeLabel;
    if (todaySync) todaySync.textContent = modeLabel;

    if (!banner) return;
    banner.classList.remove('hidden');
    banner.innerHTML = `
        <div class="session-banner-row">
            <div class="session-banner-copy">
                <strong>${modeLabel}</strong>
                <span>${headline}</span>
            </div>
            <div class="header-action-slot">
                <button type="button" class="btn btn-sm" onclick="triggerImportDataJson()">Importar JSON</button>
                <button type="button" class="btn btn-sm" onclick="exportDataJson()">Exportar JSON</button>
                <button type="button" class="btn btn-sm" onclick="reconnectSession()">Reconectar</button>
            </div>
        </div>
    `;
}

function showSaveNotification(message = '☁️ Guardado en la nube') {
    let toast = document.getElementById('save-toast');
    if(!toast) {
        toast = document.createElement('div');
        toast.id = 'save-toast';
        toast.role = 'status';
        toast.ariaLive = 'polite';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    if(window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

function persistSnapshotToCloud(snapshot, onDone = null) {
    if (!dbUserId) {
        if (onDone) onDone(false);
        return;
    }

    const params = {
        TableName: 'ColeccionesData',
        Key: { userId: dbUserId },
        UpdateExpression: 'SET collectionsData = :collectionsData, finances = :finances, lastUpdated = :lastUpdated',
        ExpressionAttributeValues: {
            ':collectionsData': JSON.stringify(snapshot.collectionsData),
            ':finances': snapshot.finances,
            ':lastUpdated': snapshot.lastUpdated || new Date().toISOString()
        }
    };

    getDocClient().update(params, (err) => {
        if (err) {
            console.error('Error subiendo datos:', err);
            runtimeState.cloudSyncEnabled = false;
            queuePendingSync(snapshot);
            updateSessionUI('Fallo el guardado en la nube. Los cambios siguen a salvo en local.');
            showSaveNotification('Guardado local. La nube queda pendiente.');
            if (onDone) onDone(false);
            return;
        }

        clearPendingSync();
        runtimeState.cloudSyncEnabled = true;
        updateSessionUI('Sincronización al día en la nube y en local.');
        showSaveNotification('☁️ Guardado en la nube');
        if (onDone) onDone(true);
    });
}

function flushPendingSync() {
    const pending = getPendingSync();
    if (!pending || !canSyncCloud()) return;
    persistSnapshotToCloud(pending);
}

function saveToDynamo() {
    const snapshot = buildPersistedSnapshot();
    persistLocalBackup(snapshot);

    if (!canSyncCloud()) {
        queuePendingSync(snapshot);
        updateSessionUI();
        showSaveNotification('Guardado local. Se sincronizará después.');
        return;
    }

    persistSnapshotToCloud(snapshot);
}

function loadDataFromDynamo() {
    if (!dbUserId) return;
    const params = { TableName: 'ColeccionesData', Key: { userId: dbUserId } };
    getDocClient().get(params, (err, data) => {
        if (err) {
            console.error('Error descargando datos:', err);
            runtimeState.cloudSyncEnabled = false;
            updateSessionUI('No pude descargar la nube. Seguimos con la copia local.');
            updateAllUI();
            return;
        }

        if (data.Item) {
            applyPersistedSnapshot({
                collectionsData: data.Item.collectionsData ? JSON.parse(data.Item.collectionsData) : {},
                finances: data.Item.finances || {}
            });
            persistLocalBackup(buildPersistedSnapshot());
        }

        runtimeState.cloudSyncEnabled = true;
        updateAllUI();
        updateSessionUI('Datos de la nube cargados. Todo queda también respaldado en local.');
        flushPendingSync();
    });
}

function initializeCloudSession() {
    const token = getStoredToken();
    runtimeState.sessionExpired = isTokenExpired(token);
    configureAwsCredentials();

    if (!token || runtimeState.sessionExpired) {
        runtimeState.cloudSyncEnabled = false;
        updateSessionUI();
        return;
    }

    AWS.config.credentials.get((err) => {
        if (err) {
            runtimeState.cloudSyncEnabled = false;
            updateSessionUI('La sesión de nube no está disponible. La app sigue operativa en local.');
            return;
        }

        dbUserId = AWS.config.credentials.identityId;
        runtimeState.cloudSyncEnabled = true;
        updateSessionUI('Conectando con la nube...');
        loadDataFromDynamo();
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
                    trackPriceSnapshot('magic', card.name, Number(card.price || 0), card.name);
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

    const enterAddBindings = ['sheet-new-name', 'sheet-new-amount', 'sheet-new-type'];

    enterAddBindings.forEach(binding => {
        const el = document.getElementById(binding);
        if (!el) return;
        el.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                addSheetExpense();
            }
        });
    });

    const importInput = document.getElementById('import-json-input');
    if (importInput) {
        importInput.addEventListener('change', importDataJsonFromFile);
    }

    window.addEventListener('online', () => {
        updateSessionUI('La conexión ha vuelto. Intentando sincronizar cambios pendientes.');
        initializeCloudSession();
        flushPendingSync();
    });

    window.addEventListener('offline', () => {
        runtimeState.cloudSyncEnabled = false;
        updateSessionUI('Sin conexión. Todo queda guardado en local hasta que vuelva Internet.');
    });

    hydrateFromLocalBackup();
    updateAllUI();
    initializeCloudSession();
});

function getCollectionById(collectionId) {
    return appData.collections.find((collection) => collection.id === collectionId) || null;
}

function getExpenseTotalsForMonth(monthKey) {
    const month = appData.monthlyData[monthKey];
    if (!month) {
        return { fixed: 0, variable: 0, hobby: 0, savings: 0, totalExpenses: 0, salary: 0 };
    }

    const fixed = (month.fixedExpenses || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const variable = (month.variableExpenses || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const disposable = Number(month.salary || 0) - fixed - variable;
    const hobby = disposable > 0 ? disposable * ((month.allocation || 0) / 100) : 0;
    const savings = disposable > 0 ? disposable - hobby : 0;
    return {
        fixed,
        variable,
        hobby,
        savings,
        salary: Number(month.salary || 0),
        totalExpenses: fixed + variable
    };
}

function getMonthlyHistoryData(limit = 6) {
    const keys = Object.keys(appData.monthlyData).sort().slice(-limit);
    return keys.map((monthKey) => {
        const totals = getExpenseTotalsForMonth(monthKey);
        const { year, month } = parseMonthStr(monthKey);
        return {
            key: monthKey,
            label: `${MONTH_NAMES_ES[month - 1]} ${year}`,
            ...totals
        };
    });
}

function getPriorityCollections() {
    return appData.collections
        .filter((collection) => collection.type !== 'cards')
        .map((collection) => {
            const nextIndex = collection.ownedList.indexOf(false);
            return {
                collection,
                nextIndex,
                remaining: collection.ownedList.filter((owned) => !owned).length
            };
        })
        .filter((entry) => entry.nextIndex !== -1)
        .sort((a, b) => a.collection.priority - b.collection.priority || a.collection.pricePerItem - b.collection.pricePerItem);
}

function getCheapestMissingMagicCard() {
    const magic = getCollectionById(1);
    if (!magic) return null;
    return magic.items
        .map((item, index) => ({ item, index, owned: magic.ownedList[index] }))
        .filter((entry) => !entry.owned)
        .sort((a, b) => a.item.price - b.item.price)[0] || null;
}

window.triggerImportDataJson = () => {
    document.getElementById('import-json-input')?.click();
};

window.exportDataJson = () => {
    const exportPayload = {
        version: 2,
        exportedAt: new Date().toISOString(),
        app: buildPersistedSnapshot()
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life-savings-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showSaveNotification('JSON exportado');
};

function importDataJsonFromFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const parsed = JSON.parse(String(reader.result || '{}'));
            if (!parsed.app) throw new Error('Formato no compatible');

            applyPersistedSnapshot(parsed.app);
            persistLocalBackup(buildPersistedSnapshot());

            updateAllUI();
            saveToDynamo();
            showSaveNotification('JSON importado correctamente');
        } catch (error) {
            console.error('Import JSON error:', error);
            showSaveNotification('No pude importar ese JSON');
        } finally {
            event.target.value = '';
        }
    };
    reader.readAsText(file);
}

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
    const tableBody = document.getElementById('finance-sheet-body');
    const rows = [
        ...(curData.fixedExpenses || []).map((item) => ({ ...item, type: 'fixed' })),
        ...(curData.variableExpenses || []).map((item) => ({ ...item, type: 'variable' }))
    ].sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));

    let totalFixed = 0;
    let totalVar = 0;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    rows.forEach((rowItem) => {
        if (rowItem.type === 'fixed') totalFixed += Number(rowItem.amount || 0);
        if (rowItem.type === 'variable') totalVar += Number(rowItem.amount || 0);

        if (!tableBody) return;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" value="${escapeHtml(rowItem.name)}" onchange="renameSheetExpense('${rowItem.type}', ${rowItem.id}, this.value)"></td>
            <td>
                <select onchange="moveSheetExpense('${rowItem.type}', ${rowItem.id}, this.value)">
                    <option value="fixed"${rowItem.type === 'fixed' ? ' selected' : ''}>Fijo</option>
                    <option value="variable"${rowItem.type === 'variable' ? ' selected' : ''}>Variable</option>
                </select>
            </td>
            <td><input type="number" value="${Number(rowItem.amount || 0).toFixed(2)}" min="0" step="0.01" onchange="updateSheetExpenseAmount('${rowItem.type}', ${rowItem.id}, this.value)"></td>
            <td><button type="button" class="btn btn-sm btn-danger sheet-remove-btn" onclick="removeExpense('${rowItem.type}', ${rowItem.id})">×</button></td>
        `;
        tableBody.appendChild(row);
    });

    const fixedEl = document.getElementById('total-fixed-display');
    const varEl = document.getElementById('total-variable-display');
    if (fixedEl) fixedEl.innerText = formatMoney(totalFixed);
    if (varEl) varEl.innerText = formatMoney(totalVar);

    return { totalFixed, totalVar };
}

window.addSheetExpense = () => {
    const nameInput = document.getElementById('sheet-new-name');
    const typeInput = document.getElementById('sheet-new-type');
    const amountInput = document.getElementById('sheet-new-amount');
    if (!nameInput || !typeInput || !amountInput) return;

    const name = nameInput.value.trim().slice(0, 80);
    const type = typeInput.value === 'variable' ? 'variable' : 'fixed';
    const amount = Number(amountInput.value || 0);
    if (!name || amount <= 0) return;

    appData.monthlyData[appData.currentMonth][`${type}Expenses`].push({
        id: Date.now(),
        name,
        amount
    });

    nameInput.value = '';
    amountInput.value = '';
    updateAllUI();
    saveToDynamo();
};

window.updateSheetExpenseAmount = (type, id, value) => {
    const list = appData.monthlyData[appData.currentMonth][`${type}Expenses`];
    const item = list.find((entry) => entry.id === id);
    if (!item) return;
    item.amount = Number(value || 0);
    updateAllUI();
    saveToDynamo();
};

window.renameSheetExpense = (type, id, value) => {
    const list = appData.monthlyData[appData.currentMonth][`${type}Expenses`];
    const item = list.find((entry) => entry.id === id);
    if (!item) return;
    item.name = String(value || '').trim().slice(0, 80) || item.name;
    updateAllUI();
    saveToDynamo();
};

window.moveSheetExpense = (fromType, id, nextType) => {
    const fromList = appData.monthlyData[appData.currentMonth][`${fromType}Expenses`];
    const index = fromList.findIndex((entry) => entry.id === id);
    if (index === -1) return;
    const [item] = fromList.splice(index, 1);
    const targetType = nextType === 'variable' ? 'variable' : 'fixed';
    appData.monthlyData[appData.currentMonth][`${targetType}Expenses`].push(item);
    updateAllUI();
    saveToDynamo();
};

// --- RENDERIZADO VISUAL SIMPLE ---
const formatMoney = (amount) => { return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount); };

function renderFinanceSummary(summary) {
    const headline = document.getElementById('dashboard-headline');
    const todaySpend = document.getElementById('today-spend');
    const todaySpendNote = document.getElementById('today-spend-note');
    const todayCollection = document.getElementById('today-collection');
    const todayCollectionNote = document.getElementById('today-collection-note');
    const todayNearest = document.getElementById('today-nearest');
    const todayNearestNote = document.getElementById('today-nearest-note');
    const historySummary = document.getElementById('history-summary');
    const financeBalance = document.getElementById('finance-balance-display');
    const monthSavings = document.getElementById('month-savings-display');
    const monthlyTableBody = document.getElementById('monthly-summary-table-body');

    if (headline) {
        headline.textContent = summary.totalItemsNeeded
            ? `Tras gastos te quedan ${formatMoney(summary.disposable)}. La jugada más limpia es separar ${formatMoney(summary.magicPiggyBank)} para Magic y usar el resto con calma.`
            : `No tienes pendientes en colecciones. Este mes te quedan ${formatMoney(summary.disposable)} libres tras gastos.`;
    }

    if (todaySpend) todaySpend.textContent = formatMoney(summary.hobbyBudget);
    if (todaySpendNote) {
        todaySpendNote.textContent = summary.hobbyBudget > 0
            ? `Con el reparto actual, ${formatMoney(summary.spendingMoney)} quedarían disponibles para compras.`
            : 'No queda margen positivo para hobby con los gastos actuales.';
    }

    if (todayCollection) {
        todayCollection.textContent = summary.priorityCollection
            ? summary.priorityCollection.collection.name
            : 'Todo al día';
    }
    if (todayCollectionNote) {
        todayCollectionNote.textContent = summary.priorityCollection
            ? `Siguiente tomo: ${summary.priorityCollection.nextIndex + 1} por ${formatMoney(summary.priorityCollection.collection.pricePerItem)}.`
            : 'No queda ningún tomo pendiente ahora mismo.';
    }

    if (todayNearest) {
        todayNearest.textContent = summary.cheapestMagicCard
            ? `${summary.cheapestMagicCard.item.name} · ${formatMoney(summary.cheapestMagicCard.item.price)}`
            : 'Sin compras urgentes';
    }
    if (todayNearestNote) {
        todayNearestNote.textContent = summary.cheapestMagicCard
            ? 'Es la carta pendiente más barata del set de Magic.'
            : 'Cuando vuelvas a tener pendientes, aquí saldrá la compra más cercana.';
    }

    if (financeBalance) financeBalance.textContent = formatMoney(summary.disposable);
    if (monthSavings) monthSavings.textContent = formatMoney(summary.currentMonthSavings);

    const historyData = getMonthlyHistoryData(4);
    const current = historyData[historyData.length - 1] || null;
    const previous = historyData[historyData.length - 2] || null;
    if (historySummary) {
        if (!current || !previous) {
            historySummary.textContent = 'En cuanto tengas dos meses, te comparo ahorro y hobby aquí.';
        } else {
            const delta = current.savings - previous.savings;
            historySummary.textContent = `${delta >= 0 ? 'Mejor' : 'Peor'} que el mes anterior en ahorro: ${delta >= 0 ? '+' : ''}${formatMoney(delta)}.`;
        }
    }

    if (monthlyTableBody) {
        monthlyTableBody.innerHTML = historyData.map((month) => `
            <tr>
                <td>${escapeHtml(month.label)}</td>
                <td>${escapeHtml(formatMoney(month.savings))}</td>
                <td>${escapeHtml(formatMoney(month.hobby))}</td>
            </tr>
        `).join('');
    }
}

function updateAllUI() {
    if (!appData.monthlyData[appData.currentMonth]) {
        createNewMonthProfile(appData.currentMonth);
    }
    ensureMonthControls();
    const { year, month } = parseMonthStr(appData.currentMonth);
    document.getElementById('month-selector').value = String(month).padStart(2, '0');
    document.getElementById('year-selector').value = String(year);

    const salaryInput = document.getElementById('salary');
    if (salaryInput) salaryInput.value = appData.monthlyData[appData.currentMonth].salary;
    const allocationInput = document.getElementById('allocation');
    if (allocationInput) allocationInput.value = appData.monthlyData[appData.currentMonth].allocation;
    const allocationDisplay = document.getElementById('allocation-display');
    if (allocationDisplay) allocationDisplay.innerText = `${appData.monthlyData[appData.currentMonth].allocation}%`;

    const { totalFixed, totalVar } = renderExpenseLists();
    calculateFinances(totalFixed, totalVar);
    renderCollections();
    renderMtgViewer();
    renderMangaViewer();
    updateSessionUI();
}

function buildSavingsPanel() {
    // La versión ligera ya muestra este resumen directamente en la columna lateral.
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

    const summary = {
        totalFixed,
        totalVar,
        disposable,
        hobbyBudget,
        currentMonthSavings,
        totalItemsNeeded,
        totalCostNeeded,
        magicRemaining,
        magicPiggyBank,
        spendingMoney,
        months,
        completedCollections,
        recommendations,
        priorityCollection: getPriorityCollections()[0] || null,
        cheapestMagicCard: getCheapestMissingMagicCard()
    };

    runtimeState.lastFinanceSummary = summary;
    renderFinanceSummary(summary);
    return summary;
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
                mangaGrid.className = 'manga-grid manga-grid--covers';
                col.ownedList.forEach((isOwned, idx) => {
                    const cover = document.createElement('article');
                    cover.className = `manga-card ${col.theme} ${isOwned ? 'owned' : ''}`;
                    cover.setAttribute('data-collection-id', String(col.id));
                    cover.setAttribute('data-volume-index', String(idx));

                    if (col.folder && col.ext) {
                        const imgPath = `${col.folder}/${idx + 1}.${col.ext}`;
                        cover.innerHTML = `
                            <button type="button" onclick="openMangaViewer(${col.id}, ${idx})" aria-label="Abrir ${escapeHtml(col.name)} tomo ${idx + 1}">
                                <div class="manga-card-cover-wrap">
                                    <img src="${imgPath}" alt="Vol ${idx + 1}" loading="lazy" decoding="async" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid'">
                                    <div class="manga-card-fallback">${idx + 1}</div>
                                    <span class="manga-card-index">#${idx + 1}</span>
                                    <span class="manga-card-status">${isOwned ? 'Comprado' : 'Pendiente'}</span>
                                </div>
                                <div class="manga-card-body">
                                    <div class="manga-card-title">${escapeHtml(col.name)}</div>
                                    <div class="manga-card-meta">${escapeHtml(col.publisher)} · ${formatMoney(col.pricePerItem)}</div>
                                </div>
                            </button>
                        `;
                    } else {
                        cover.innerHTML = `
                            <button type="button" onclick="openMangaViewer(${col.id}, ${idx})" aria-label="Abrir ${escapeHtml(col.name)} tomo ${idx + 1}">
                                <div class="manga-card-cover-wrap">
                                    <div class="manga-card-fallback" style="display:grid">${idx + 1}</div>
                                    <span class="manga-card-index">#${idx + 1}</span>
                                    <span class="manga-card-status">${isOwned ? 'Comprado' : 'Pendiente'}</span>
                                </div>
                                <div class="manga-card-body">
                                    <div class="manga-card-title">${escapeHtml(col.name)}</div>
                                    <div class="manga-card-meta">${escapeHtml(col.publisher)} · ${formatMoney(col.pricePerItem)}</div>
                                </div>
                            </button>
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
    const col = appData.collections.find(c => c.id === colId);
    if (!col || col.type !== 'manga') return;
    const coverSrc = getMangaCoverSrc(col, idx);

    mangaPullTimeout = setTimeout(() => {
        playBookOpenTransition(clickedBook, coverSrc, () => {
            window.openMangaViewer(colId, idx);
        });
    }, 40);
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
