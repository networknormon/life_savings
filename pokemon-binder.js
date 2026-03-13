const POKE_API_SPECIES_URL = 'https://pokeapi.co/api/v2/pokemon-species?limit=2000';
const POKE_API_TYPE_URL = 'https://pokeapi.co/api/v2/type';
const TCGDEX_CARD_LIST_URL = 'https://api.tcgdex.net/v2/en/cards';
const TCGDEX_CARD_URL = 'https://api.tcgdex.net/v2/en/cards';
const REGION = 'eu-north-1';
const USER_POOL_ID = 'eu-north-1_HT76kHw12';
const IDENTITY_POOL_ID = 'eu-north-1:d5157883-71f1-475b-8e0e-9774ab7607de';
const NATIONAL_DEX_TOTAL = 1025;
const BINDER_VERSION = '20260313d';
const BINDER_GENERATIONS = [
    { id: 'gen1', label: 'Generacion I', start: 1, end: 151 },
    { id: 'gen2', label: 'Generacion II', start: 152, end: 251 },
    { id: 'gen3', label: 'Generacion III', start: 252, end: 386 },
    { id: 'gen4', label: 'Generacion IV', start: 387, end: 493 },
    { id: 'gen5', label: 'Generacion V', start: 494, end: 649 },
    { id: 'gen6', label: 'Generacion VI', start: 650, end: 721 },
    { id: 'gen7', label: 'Generacion VII', start: 722, end: 809 },
    { id: 'gen8', label: 'Generacion VIII', start: 810, end: 905 },
    { id: 'gen9', label: 'Generacion IX', start: 906, end: NATIONAL_DEX_TOTAL }
];

const binderState = {
    species: [],
    entries: {},
    currentPage: 1,
    pageSize: 24,
    selectedSpeciesId: null,
    searchCache: {},
    dbUserId: null,
    highlightedSpeciesId: null,
    cloudSyncEnabled: true,
    viewMode: 'national',
    generation: 'all',
    type: 'all',
    set: 'all',
    typeSpeciesCache: {},
    pendingSpeciesId: null,
    pendingSync: false
};

const binderStorageKeys = {
    species: 'pokemon-binder-species-v1',
    entries: 'pokemon-binder-entries-v1',
    cardCache: 'pokemon-binder-card-cache-v2',
    pendingSync: 'pokemon-binder-pending-sync-v1'
};

AWS.config.region = REGION;
const docClient = new AWS.DynamoDB.DocumentClient();

document.addEventListener('DOMContentLoaded', () => {
    const jumpInput = document.getElementById('binder-jump-input');
    const modal = document.getElementById('pokemon-modal');
    const removeBtn = document.getElementById('pokemon-remove-btn');
    const generationSelect = document.getElementById('binder-generation-select');

    if (jumpInput) {
        jumpInput.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                jumpToPokemon();
            }
        });
    }

    if (modal) {
        modal.addEventListener('click', (ev) => {
            if (ev.target === modal) closePokemonModal();
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            if (binderState.selectedSpeciesId) removePokemonCard(binderState.selectedSpeciesId);
        });
    }

    if (generationSelect && !generationSelect.querySelector('[value="gen1"]')) {
        generationSelect.innerHTML += BINDER_GENERATIONS
            .map((generation) => `<option value="${generation.id}">${generation.label}</option>`)
            .join('');
    }

    const routeSpecies = Number(new URL(window.location.href).searchParams.get('species') || 0);
    binderState.pendingSpeciesId = routeSpecies || null;

    window.addEventListener('online', () => {
        setBinderStatus('Conexion recuperada. Intentando reactivar la nube del binder...');
        initializeBinderSession();
    });

    window.addEventListener('offline', () => {
        binderState.cloudSyncEnabled = false;
        updateBinderSessionUI('Sin conexion. El binder sigue guardando cambios en este navegador.');
    });

    initializeBinderSession();
});

function getBinderToken() {
    return localStorage.getItem('cognito_id_token') || '';
}

function decodeTokenExpiry(token) {
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

function isBinderTokenExpired(token) {
    const exp = decodeTokenExpiry(token);
    return exp ? Math.floor(Date.now() / 1000) >= exp : !token;
}

function configureBinderCredentials() {
    const token = getBinderToken();
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IDENTITY_POOL_ID,
        Logins: token ? {
            [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: token
        } : {}
    });
}

function updateBinderSessionUI(message = '') {
    const banner = document.getElementById('binder-session-banner');
    const token = getBinderToken();
    const expired = isBinderTokenExpired(token);
    let headline = message;
    let title = 'Modo local';

    if (binderState.cloudSyncEnabled && binderState.dbUserId && navigator.onLine) {
        title = binderState.pendingSync ? 'Nube activa · pendiente' : 'Nube activa';
        headline = headline || 'El binder está guardando en local y en Dynamo.';
    } else if (!navigator.onLine) {
        headline = headline || 'No hay conexion. Los cambios se quedan guardados localmente.';
    } else if (!token) {
        headline = headline || 'No hay sesión activa. Puedes seguir editando el binder y reconectar más tarde.';
    } else if (expired) {
        headline = headline || 'La sesión de Cognito ha caducado. El binder sigue funcionando en local.';
    } else {
        headline = headline || 'No pude validar la nube ahora mismo. El binder se mantiene en modo local.';
    }

    if (!banner) return;
    banner.classList.remove('hidden');
    banner.innerHTML = `
        <div class="binder-session-copy">
            <strong>${title}</strong>
            <span>${headline}</span>
        </div>
        <button type="button" class="binder-btn binder-btn-ghost" onclick="reconnectBinderSession()">Reconectar</button>
    `;
}

function initializeBinderSession() {
    configureBinderCredentials();
    const token = getBinderToken();
    const expired = isBinderTokenExpired(token);

    if (!token || expired) {
        binderState.cloudSyncEnabled = false;
        binderState.dbUserId = null;
        loadBinderApp();
        updateBinderSessionUI();
        return;
    }

    AWS.config.credentials.get(async (err) => {
        if (err) {
            binderState.cloudSyncEnabled = false;
            binderState.dbUserId = null;
            await loadBinderApp();
            updateBinderSessionUI('No he podido recuperar la nube del binder. Seguimos en local.');
            return;
        }

        binderState.dbUserId = AWS.config.credentials.identityId;
        binderState.cloudSyncEnabled = true;
        await loadBinderApp();
        updateBinderSessionUI('Sesión válida. El binder vuelve a sincronizar con la nube.');
        flushBinderPendingSync();
    });
}

function setBinderStatus(text) {
    const statusEl = document.getElementById('binder-status');
    if (statusEl) statusEl.textContent = text;
}

function showBinderToast(message) {
    let toast = document.getElementById('binder-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'binder-toast';
        toast.style.position = 'fixed';
        toast.style.right = '18px';
        toast.style.bottom = '18px';
        toast.style.padding = '0.75rem 0.95rem';
        toast.style.borderRadius = '0.8rem';
        toast.style.background = 'rgba(10, 15, 30, 0.92)';
        toast.style.border = '1px solid rgba(255, 255, 255, 0.08)';
        toast.style.color = 'var(--binder-text)';
        toast.style.boxShadow = '0 14px 32px rgba(0, 0, 0, 0.35)';
        toast.style.zIndex = '120';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.2s ease';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(window.binderToastTimeout);
    window.binderToastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

function formatMoney(amount) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(amount || 0));
}

function normalizePokemonName(value) {
    return String(value || '')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function formatSpeciesName(name) {
    const normalized = String(name || '').replace(/-/g, ' ');
    return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

function parseSpeciesId(url) {
    const match = String(url || '').match(/\/(\d+)\/?$/);
    return match ? Number(match[1]) : null;
}

function sanitizeSpeciesList(items) {
    return (items || [])
        .map((item) => ({
            id: Number(item.id),
            name: item.name
        }))
        .filter((item) => item.id && item.id <= NATIONAL_DEX_TOTAL && item.name)
        .filter((item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index)
        .sort((a, b) => a.id - b.id);
}

function getVisibleSpecies() {
    let visible = [...binderState.species];

    if (binderState.viewMode === 'generation' && binderState.generation !== 'all') {
        const generation = BINDER_GENERATIONS.find((item) => item.id === binderState.generation);
        if (generation) {
            visible = visible.filter((species) => species.id >= generation.start && species.id <= generation.end);
        }
    }

    if (binderState.viewMode === 'type' && binderState.type !== 'all') {
        const allowedIds = new Set(binderState.typeSpeciesCache[binderState.type] || []);
        visible = visible.filter((species) => allowedIds.has(species.id));
    }

    if (binderState.viewMode === 'set' && binderState.set !== 'all') {
        visible = visible.filter((species) => binderState.entries[String(species.id)]?.setName === binderState.set);
    }

    return visible;
}

function getTotalPages() {
    return Math.max(1, Math.ceil(getVisibleSpecies().length / binderState.pageSize));
}

function getSpeciesById(speciesId) {
    return binderState.species.find((item) => item.id === speciesId) || null;
}

function getCurrentViewLabel() {
    if (binderState.viewMode === 'generation') {
        return BINDER_GENERATIONS.find((item) => item.id === binderState.generation)?.label || 'Generacion';
    }
    if (binderState.viewMode === 'type') {
        return binderState.type === 'all' ? 'Todos los tipos' : `Tipo ${formatSpeciesName(binderState.type)}`;
    }
    if (binderState.viewMode === 'set') {
        return binderState.set === 'all' ? 'Todos los sets' : binderState.set;
    }
    return 'Pokedex';
}

function getPriceFromCard(card) {
    const prices = card.pricing?.cardmarket || card.cardmarket?.prices || {};
    return Number(
        prices.trend ||
        prices['trend-holo'] ||
        prices.avg ||
        prices['avg-holo'] ||
        prices.low ||
        prices['low-holo'] ||
        prices.trendPrice ||
        prices.averageSellPrice ||
        prices.lowPriceExPlus ||
        prices.lowPrice ||
        0
    );
}

function buildTcgdexImageUrl(baseImageUrl, quality = 'low', extension = 'webp') {
    const raw = String(baseImageUrl || '').trim();
    if (!raw) return '';
    if (/\.(png|webp|jpg|jpeg)$/i.test(raw)) return raw;
    const normalizedBase = raw.endsWith('/') ? raw.slice(0, -1) : raw;
    return `${normalizedBase}/${quality}.${extension}`;
}

function getCardImage(card, quality = 'low') {
    const directImage = card.image || card.imageUrl || card.images?.small || '';
    return buildTcgdexImageUrl(directImage, quality, 'webp');
}

function getCardImageFallback(card, quality = 'low') {
    const directImage = card.image || card.imageUrl || card.images?.small || '';
    return buildTcgdexImageUrl(directImage, quality, 'png');
}

function normalizeStoredEntryImage(imageUrl, quality = 'low') {
    return buildTcgdexImageUrl(imageUrl, quality, 'webp');
}

function persistEntriesBackup() {
    localStorage.setItem(binderStorageKeys.entries, JSON.stringify(binderState.entries));
}

function queueBinderPendingSync() {
    binderState.pendingSync = true;
    localStorage.setItem(binderStorageKeys.pendingSync, JSON.stringify({
        entries: binderState.entries,
        updatedAt: new Date().toISOString()
    }));
    updateBinderSessionUI();
}

function clearBinderPendingSync() {
    binderState.pendingSync = false;
    localStorage.removeItem(binderStorageKeys.pendingSync);
    updateBinderSessionUI();
}

function getBinderPendingSync() {
    try {
        const raw = localStorage.getItem(binderStorageKeys.pendingSync);
        if (!raw) return null;
        binderState.pendingSync = true;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function loadCardCache() {
    try {
        return JSON.parse(localStorage.getItem(binderStorageKeys.cardCache) || '{}');
    } catch {
        return {};
    }
}

function persistCardCache() {
    localStorage.setItem(binderStorageKeys.cardCache, JSON.stringify(binderState.searchCache));
}

async function loadBinderApp() {
    setBinderStatus('Cargando huecos del binder...');
    binderState.searchCache = loadCardCache();

    try {
        const [species, entries] = await Promise.all([
            loadSpeciesList(),
            loadBinderEntries()
        ]);

        binderState.species = species;
        binderState.entries = entries;
        binderState.pendingSync = Boolean(getBinderPendingSync());
        renderBinder();
        setBinderStatus(
            binderState.cloudSyncEnabled
                ? 'Binder listo. Elige un Pokemon para asignarle una carta.'
                : 'Binder listo en modo local. Elige un Pokemon para asignarle una carta.'
        );
        updateBinderSessionUI();
        applyPendingSpeciesFocus();
    } catch (error) {
        console.error('Binder boot error:', error);
        binderState.species = [];
        binderState.entries = loadEntriesFromBackup();
        renderBinder();
        setBinderStatus('No se pudo cargar el binder completo.');
        updateBinderSessionUI('No he podido cargar todas las fuentes del binder.');
    }
}

async function loadSpeciesList() {
    const cached = localStorage.getItem(binderStorageKeys.species);
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            const sanitized = sanitizeSpeciesList(parsed.data);
            if (sanitized.length) {
                return sanitized;
            }
        } catch {
            // Ignore broken cache and refetch.
        }
    }

    const res = await fetch(POKE_API_SPECIES_URL);
    if (!res.ok) throw new Error(`PokeAPI HTTP ${res.status}`);
    const data = await res.json();
    const species = sanitizeSpeciesList((data.results || [])
        .map((item) => ({
            id: parseSpeciesId(item.url),
            name: item.name
        }))
    );

    localStorage.setItem(binderStorageKeys.species, JSON.stringify({ data: species }));
    return species;
}

function loadEntriesFromBackup() {
    try {
        return JSON.parse(localStorage.getItem(binderStorageKeys.entries) || '{}');
    } catch {
        return {};
    }
}

function loadBinderEntries() {
    return new Promise((resolve) => {
        if (!binderState.dbUserId) {
            resolve(loadEntriesFromBackup());
            return;
        }

        docClient.get(
            { TableName: 'ColeccionesData', Key: { userId: binderState.dbUserId } },
            (err, data) => {
                if (err) {
                    console.error('Pokemon binder load error:', err);
                    resolve(loadEntriesFromBackup());
                    return;
                }

                const entries = data.Item?.pokemonBinder && typeof data.Item.pokemonBinder === 'object'
                    ? data.Item.pokemonBinder
                    : loadEntriesFromBackup();
                resolve(entries);
            }
        );
    });
}

function saveBinderEntries() {
    persistEntriesBackup();

    return new Promise((resolve) => {
        if (!binderState.dbUserId || !binderState.cloudSyncEnabled || !navigator.onLine) {
            queueBinderPendingSync();
            showBinderToast('Binder guardado localmente');
            setBinderStatus('Cambios guardados en este navegador. La nube esta desactivada o sin conexion.');
            resolve();
            return;
        }

        docClient.update(
            {
                TableName: 'ColeccionesData',
                Key: { userId: binderState.dbUserId },
                UpdateExpression: 'SET pokemonBinder = :pokemonBinder, lastUpdated = :lastUpdated',
                ExpressionAttributeValues: {
                    ':pokemonBinder': binderState.entries,
                    ':lastUpdated': new Date().toISOString()
                }
            },
            (err) => {
                if (err) {
                    console.error('Pokemon binder save error:', err);
                    queueBinderPendingSync();
                    setBinderStatus('Guardado local hecho, pero fallo el guardado en la nube.');
                } else {
                    clearBinderPendingSync();
                    showBinderToast('Binder guardado');
                    setBinderStatus('Cambios guardados.');
                }
                resolve();
            }
        );
    });
}

function flushBinderPendingSync() {
    const pending = getBinderPendingSync();
    if (!pending || !binderState.dbUserId || !binderState.cloudSyncEnabled || !navigator.onLine) return;

    docClient.update(
        {
            TableName: 'ColeccionesData',
            Key: { userId: binderState.dbUserId },
            UpdateExpression: 'SET pokemonBinder = :pokemonBinder, lastUpdated = :lastUpdated',
            ExpressionAttributeValues: {
                ':pokemonBinder': pending.entries || binderState.entries,
                ':lastUpdated': new Date().toISOString()
            }
        },
        (err) => {
            if (err) {
                console.error('Pokemon binder flush error:', err);
                updateBinderSessionUI('La nube del binder sigue fallando. Mantengo la cola local.');
                return;
            }

            clearBinderPendingSync();
            showBinderToast('Binder sincronizado con la nube');
            updateBinderSessionUI('La cola local del binder ya se ha sincronizado.');
        }
    );
}

function renderBinder() {
    binderState.currentPage = Math.min(getTotalPages(), Math.max(1, binderState.currentPage));
    renderBinderControlState();
    renderSetOptions();
    renderBinderSummary();
    renderBinderGrid();
}

function renderBinderSummary() {
    const visibleSpecies = getVisibleSpecies();
    const totalSlots = Math.min(visibleSpecies.length, NATIONAL_DEX_TOTAL);
    const filledSlots = Object.keys(binderState.entries).length;
    const totalPages = getTotalPages();
    const pageStart = totalSlots ? ((binderState.currentPage - 1) * binderState.pageSize) + 1 : 0;
    const pageEnd = Math.min(totalSlots, binderState.currentPage * binderState.pageSize);

    document.getElementById('binder-total-count').textContent = String(totalSlots);
    document.getElementById('binder-filled-count').textContent = String(filledSlots);
    document.getElementById('binder-page-label').textContent = `${binderState.currentPage} / ${totalPages}`;
    document.getElementById('binder-page-range').textContent = totalSlots ? `#${pageStart} - #${pageEnd}` : 'Sin datos';
    document.getElementById('binder-view-label').textContent = getCurrentViewLabel();
}

function renderBinderGrid() {
    const grid = document.getElementById('binder-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const visibleSpecies = getVisibleSpecies();

    if (!visibleSpecies.length) {
        grid.innerHTML = '<div class="binder-muted">No hay especies cargadas todavia.</div>';
        return;
    }

    const start = (binderState.currentPage - 1) * binderState.pageSize;
    const pageSpecies = visibleSpecies.slice(start, start + binderState.pageSize);

    pageSpecies.forEach((species) => {
        const entry = binderState.entries[String(species.id)];
        const slotImage = entry?.imageSmall ? normalizeStoredEntryImage(entry.imageSmall, 'low') : '';
        const slot = document.createElement('article');
        slot.className = `binder-slot${binderState.highlightedSpeciesId === species.id ? ' highlighted' : ''}`;
        slot.innerHTML = `
            <div class="binder-pocket">
                ${slotImage ? `<img class="binder-card-image" src="${slotImage}" alt="${entry.cardName}" onerror="this.onerror=null; this.src='${normalizeStoredEntryImage(entry.imageSmall, 'low').replace('.webp', '.png')}'">` : ''}
            </div>
            <div class="binder-slot-footer">
                <div class="binder-slot-title">
                    <span>#${String(species.id).padStart(4, '0')}</span>
                    <span class="binder-slot-name">${formatSpeciesName(species.name)}</span>
                </div>
                <div class="binder-slot-meta">${entry ? `${entry.setName} · ${formatMoney(entry.price)}` : 'Hueco vacio'}</div>
            </div>
        `;
        slot.addEventListener('click', () => openPokemonModal(species.id));
        grid.appendChild(slot);
    });
}

function changeBinderPage(delta) {
    const totalPages = getTotalPages();
    binderState.currentPage = Math.min(totalPages, Math.max(1, binderState.currentPage + delta));
    binderState.highlightedSpeciesId = null;
    renderBinder();
}

function jumpToPokemon() {
    const input = document.getElementById('binder-jump-input');
    if (!input) return;
    const query = input.value.trim();
    if (!query) return;

    let target = null;
    if (/^\d+$/.test(query)) {
        target = getSpeciesById(Number(query));
    } else {
        const normalized = normalizePokemonName(query);
        target = binderState.species.find((species) => normalizePokemonName(species.name) === normalized)
            || binderState.species.find((species) => normalizePokemonName(species.name).includes(normalized));
    }

    if (!target) {
        setBinderStatus('No encontre ese Pokemon en la Pokedex.');
        return;
    }

    binderState.currentPage = Math.floor((target.id - 1) / binderState.pageSize) + 1;
    binderState.highlightedSpeciesId = target.id;
    binderState.viewMode = 'national';
    renderBinder();
    setBinderStatus(`Saltando a ${formatSpeciesName(target.name)}.`);
}

function applyPendingSpeciesFocus() {
    if (!binderState.pendingSpeciesId) return;
    const target = getSpeciesById(binderState.pendingSpeciesId);
    if (!target) return;
    binderState.viewMode = 'national';
    binderState.currentPage = Math.floor((target.id - 1) / binderState.pageSize) + 1;
    binderState.highlightedSpeciesId = target.id;
    renderBinder();
    binderState.pendingSpeciesId = null;
}

function renderSetOptions() {
    const select = document.getElementById('binder-set-select');
    if (!select) return;

    const sets = [...new Set(
        Object.values(binderState.entries)
            .map((entry) => entry.setName)
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));

    const current = binderState.set;
    select.innerHTML = '<option value="all">Todos los sets</option>' +
        sets.map((setName) => `<option value="${setName}">${setName}</option>`).join('');
    select.value = sets.includes(current) ? current : 'all';
    if (!sets.includes(current)) binderState.set = select.value;
}

function renderBinderControlState() {
    const viewMode = document.getElementById('binder-view-mode');
    const generation = document.getElementById('binder-generation-select');
    const type = document.getElementById('binder-type-select');
    const set = document.getElementById('binder-set-select');
    const pageSize = document.getElementById('binder-page-size-select');

    if (viewMode) viewMode.value = binderState.viewMode;
    if (generation) {
        generation.value = binderState.generation;
        generation.disabled = binderState.viewMode !== 'generation';
    }
    if (type) {
        type.value = binderState.type;
        type.disabled = binderState.viewMode !== 'type';
    }
    if (set) {
        set.value = binderState.set;
        set.disabled = binderState.viewMode !== 'set';
    }
    if (pageSize) pageSize.value = String(binderState.pageSize);
}

async function ensureTypeSpeciesCache(typeName) {
    if (!typeName || typeName === 'all' || binderState.typeSpeciesCache[typeName]) return;

    const res = await fetch(`${POKE_API_TYPE_URL}/${encodeURIComponent(typeName)}`);
    if (!res.ok) throw new Error(`PokeAPI type HTTP ${res.status}`);
    const data = await res.json();
    const speciesByName = new Map(binderState.species.map((species) => [normalizePokemonName(species.name), species.id]));

    binderState.typeSpeciesCache[typeName] = (data.pokemon || [])
        .map((entry) => speciesByName.get(normalizePokemonName(entry.pokemon?.name)))
        .filter(Boolean);
}

window.setBinderViewMode = async (mode) => {
    binderState.viewMode = mode || 'national';
    binderState.currentPage = 1;
    binderState.highlightedSpeciesId = null;

    if (binderState.viewMode === 'type' && binderState.type !== 'all') {
        try {
            await ensureTypeSpeciesCache(binderState.type);
        } catch (error) {
            console.warn('Binder type filter error:', error);
            setBinderStatus('No pude cargar ese tipo Pokemon.');
        }
    }

    renderBinder();
};

window.setBinderGeneration = (value) => {
    binderState.generation = value || 'all';
    binderState.currentPage = 1;
    renderBinder();
};

window.setBinderType = async (value) => {
    binderState.type = value || 'all';
    binderState.currentPage = 1;

    if (binderState.type !== 'all') {
        try {
            await ensureTypeSpeciesCache(binderState.type);
        } catch (error) {
            console.warn('Binder type filter error:', error);
            setBinderStatus('No pude cargar el listado de este tipo.');
        }
    }

    renderBinder();
};

window.setBinderSet = (value) => {
    binderState.set = value || 'all';
    binderState.currentPage = 1;
    renderBinder();
};

window.setBinderPageSize = (value) => {
    const nextSize = Number(value || 24);
    binderState.pageSize = [12, 24, 48].includes(nextSize) ? nextSize : 24;
    binderState.currentPage = 1;
    renderBinder();
};

function openPokemonModal(speciesId) {
    binderState.selectedSpeciesId = speciesId;
    const modal = document.getElementById('pokemon-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderPokemonModal();
    loadCardsForSpecies(speciesId);
}

function closePokemonModal() {
    const modal = document.getElementById('pokemon-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    binderState.selectedSpeciesId = null;
}

function renderPokemonModal() {
    const species = getSpeciesById(binderState.selectedSpeciesId);
    if (!species) return;

    const entry = binderState.entries[String(species.id)] || null;
    document.getElementById('pokemon-modal-dex').textContent = `#${String(species.id).padStart(4, '0')}`;
    document.getElementById('pokemon-modal-title').textContent = formatSpeciesName(species.name);
    document.getElementById('pokemon-modal-subtitle').textContent = entry
        ? `${entry.cardName} · ${entry.setName} · ${formatMoney(entry.price)}`
        : 'Sin carta asignada';

    const preview = document.getElementById('pokemon-selected-preview');
    const removeBtn = document.getElementById('pokemon-remove-btn');
    if (preview) {
        const previewImage = entry?.imageLarge
            ? normalizeStoredEntryImage(entry.imageLarge, 'high')
            : entry?.imageSmall
                ? normalizeStoredEntryImage(entry.imageSmall, 'low')
                : '';

        if (previewImage) {
            preview.classList.remove('empty');
            preview.innerHTML = `<img src="${previewImage}" alt="${entry.cardName}" onerror="this.onerror=null; this.src='${previewImage.replace('.webp', '.png')}'">`;
        } else {
            preview.classList.add('empty');
            preview.innerHTML = '<span>Sin carta elegida</span>';
        }
    }

    if (removeBtn) {
        removeBtn.disabled = !entry;
    }

    if (Array.isArray(binderState.searchCache[species.id])) {
        renderPokemonCardResults(binderState.searchCache[species.id]);
    } else {
        document.getElementById('pokemon-results-status').textContent = 'Consultando cartas y precios...';
        document.getElementById('pokemon-card-results').innerHTML = '';
    }
}

function chunkArray(items, size) {
    const chunks = [];
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
}

async function fetchTcgdexCard(cardId) {
    const res = await fetch(`${TCGDEX_CARD_URL}/${encodeURIComponent(cardId)}`);
    if (!res.ok) throw new Error(`TCGdex card HTTP ${res.status}`);
    return await res.json();
}

async function loadCardsForSpecies(speciesId) {
    if (Array.isArray(binderState.searchCache[speciesId])) {
        renderPokemonCardResults(binderState.searchCache[speciesId]);
        return;
    }

    const resultsStatus = document.getElementById('pokemon-results-status');
    if (resultsStatus) resultsStatus.textContent = 'Consultando TCGdex...';

    try {
        const query = new URLSearchParams({
            dexId: `eq:${speciesId}`,
            category: 'eq:Pokemon',
            'pagination:itemsPerPage': '250'
        });

        const res = await fetch(`${TCGDEX_CARD_LIST_URL}?${query.toString()}`);
        if (!res.ok) throw new Error(`TCGdex list HTTP ${res.status}`);

        const list = await res.json();
        const listItems = Array.isArray(list)
            ? list
            : Array.isArray(list.cards)
                ? list.cards
                : Array.isArray(list.data)
                    ? list.data
                    : [];
        const detailedCards = [];
        const cardIds = listItems.map((card) => card.id).filter(Boolean);

        for (const batch of chunkArray(cardIds, 10)) {
            const responses = await Promise.all(
                batch.map(async (cardId) => {
                    try {
                        return await fetchTcgdexCard(cardId);
                    } catch {
                        return null;
                    }
                })
            );
            detailedCards.push(...responses.filter(Boolean));
        }

        const cards = detailedCards
            .filter((card) => {
                const dexIds = Array.isArray(card.dexId) ? card.dexId : [card.dexId].filter(Boolean);
                return dexIds.includes(speciesId);
            })
            .filter((card) => String(card.category || '').toLowerCase().includes('pokemon'))
            .sort((a, b) => getPriceFromCard(b) - getPriceFromCard(a));

        binderState.searchCache[speciesId] = cards;
        persistCardCache();
        renderPokemonCardResults(cards);
    } catch (error) {
        console.warn('Pokemon card search error:', error);
        binderState.searchCache[speciesId] = [];
        persistCardCache();
        renderPokemonCardResults([]);
        if (resultsStatus) resultsStatus.textContent = 'No se pudieron cargar cartas para este Pokemon.';
    }
}

function renderPokemonCardResults(cards) {
    const results = document.getElementById('pokemon-card-results');
    const resultsStatus = document.getElementById('pokemon-results-status');
    if (!results || !resultsStatus) return;

    results.innerHTML = '';
    if (!cards.length) {
        resultsStatus.textContent = 'No hay cartas disponibles para este Pokemon en la API.';
        return;
    }

    resultsStatus.textContent = `${cards.length} carta(s) encontradas`;
    cards.forEach((card) => {
        const price = getPriceFromCard(card);
        const article = document.createElement('article');
        article.className = 'pokemon-card-result';
        article.innerHTML = `
            <img src="${getCardImage(card, 'low')}" alt="${card.name}" onerror="this.onerror=null; this.src='${getCardImageFallback(card, 'low')}'">
            <div class="pokemon-card-copy">
                <div class="pokemon-card-name">${card.name}</div>
                <div class="pokemon-card-meta">${card.set?.name || 'Set N/D'} · #${card.localId || '--'}</div>
                <div class="pokemon-card-meta">${card.rarity || 'Rareza N/D'}</div>
                <div class="pokemon-card-price">Cardmarket: ${formatMoney(price)}</div>
                <button type="button" class="binder-btn binder-btn-primary">Asignar al hueco</button>
            </div>
        `;

        article.querySelector('button').addEventListener('click', () => assignCardToSpecies(binderState.selectedSpeciesId, card));
        results.appendChild(article);
    });
}

async function assignCardToSpecies(speciesId, card) {
    const species = getSpeciesById(speciesId);
    if (!species) return;

    binderState.entries[String(speciesId)] = {
        speciesId,
        speciesName: formatSpeciesName(species.name),
        cardId: card.id,
        cardName: card.name,
        imageSmall: getCardImage(card, 'low'),
        imageLarge: getCardImage(card, 'high'),
        setName: card.set?.name || 'Set N/D',
        number: card.localId || '',
        rarity: card.rarity || 'Rareza N/D',
        price: getPriceFromCard(card),
        cardmarketUrl: '',
        updatedAt: card.pricing?.cardmarket?.updated || null
    };

    await saveBinderEntries();
    renderBinder();
    renderPokemonModal();
}

async function removePokemonCard(speciesId) {
    delete binderState.entries[String(speciesId)];
    await saveBinderEntries();
    renderBinder();
    renderPokemonModal();
}

window.changeBinderPage = changeBinderPage;
window.jumpToPokemon = jumpToPokemon;
window.closePokemonModal = closePokemonModal;
