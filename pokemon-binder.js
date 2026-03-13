const POKE_API_SPECIES_URL = 'https://pokeapi.co/api/v2/pokemon-species?limit=2000';
const TCGDEX_CARD_LIST_URL = 'https://api.tcgdex.net/v2/en/cards';
const TCGDEX_CARD_URL = 'https://api.tcgdex.net/v2/en/cards';
const REGION = 'eu-north-1';
const USER_POOL_ID = 'eu-north-1_HT76kHw12';
const IDENTITY_POOL_ID = 'eu-north-1:d5157883-71f1-475b-8e0e-9774ab7607de';
const NATIONAL_DEX_TOTAL = 1025;

const binderState = {
    species: [],
    entries: {},
    currentPage: 1,
    pageSize: 12,
    selectedSpeciesId: null,
    searchCache: {},
    dbUserId: null,
    highlightedSpeciesId: null,
    cloudSyncEnabled: true
};

const binderStorageKeys = {
    species: 'pokemon-binder-species-v1',
    entries: 'pokemon-binder-entries-v1',
    cardCache: 'pokemon-binder-card-cache-v2'
};

AWS.config.region = REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
    Logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: localStorage.getItem('cognito_id_token')
    }
});

const docClient = new AWS.DynamoDB.DocumentClient();

document.addEventListener('DOMContentLoaded', () => {
    const jumpInput = document.getElementById('binder-jump-input');
    const modal = document.getElementById('pokemon-modal');
    const removeBtn = document.getElementById('pokemon-remove-btn');

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
});

AWS.config.credentials.get(async (err) => {
    if (err) {
        binderState.cloudSyncEnabled = false;
        await loadBinderApp();
        setBinderStatus('Binder listo en modo local. Vuelve a iniciar sesion para sincronizar en la nube.');
        return;
    }

    binderState.dbUserId = AWS.config.credentials.identityId;
    await loadBinderApp();
});

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

function getTotalPages() {
    return Math.max(1, Math.ceil(binderState.species.length / binderState.pageSize));
}

function getSpeciesById(speciesId) {
    return binderState.species.find((item) => item.id === speciesId) || null;
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

function normalizeStoredEntryImage(imageUrl, quality = 'low') {
    return buildTcgdexImageUrl(imageUrl, quality, 'webp');
}

function persistEntriesBackup() {
    localStorage.setItem(binderStorageKeys.entries, JSON.stringify(binderState.entries));
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
        renderBinder();
        setBinderStatus(
            binderState.cloudSyncEnabled
                ? 'Binder listo. Elige un Pokemon para asignarle una carta.'
                : 'Binder listo en modo local. Elige un Pokemon para asignarle una carta.'
        );
    } catch (error) {
        console.error('Binder boot error:', error);
        binderState.species = [];
        binderState.entries = loadEntriesFromBackup();
        renderBinder();
        setBinderStatus('No se pudo cargar el binder completo.');
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
        if (!binderState.dbUserId) {
            showBinderToast('Binder guardado localmente');
            setBinderStatus('Cambios guardados en este navegador. La nube esta desactivada hasta que inicies sesion de nuevo.');
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
                    setBinderStatus('Guardado local hecho, pero fallo el guardado en la nube.');
                } else {
                    showBinderToast('Binder guardado');
                    setBinderStatus('Cambios guardados.');
                }
                resolve();
            }
        );
    });
}

function renderBinder() {
    renderBinderSummary();
    renderBinderGrid();
}

function renderBinderSummary() {
    const totalSlots = Math.min(binderState.species.length, NATIONAL_DEX_TOTAL);
    const filledSlots = Object.keys(binderState.entries).length;
    const totalPages = getTotalPages();
    const pageStart = totalSlots ? ((binderState.currentPage - 1) * binderState.pageSize) + 1 : 0;
    const pageEnd = Math.min(totalSlots, binderState.currentPage * binderState.pageSize);

    document.getElementById('binder-total-count').textContent = String(totalSlots);
    document.getElementById('binder-filled-count').textContent = String(filledSlots);
    document.getElementById('binder-page-label').textContent = `${binderState.currentPage} / ${totalPages}`;
    document.getElementById('binder-page-range').textContent = totalSlots ? `#${pageStart} - #${pageEnd}` : 'Sin datos';
}

function renderBinderGrid() {
    const grid = document.getElementById('binder-grid');
    if (!grid) return;

    grid.innerHTML = '';
    if (!binderState.species.length) {
        grid.innerHTML = '<div class="binder-muted">No hay especies cargadas todavia.</div>';
        return;
    }

    const start = (binderState.currentPage - 1) * binderState.pageSize;
    const pageSpecies = binderState.species.slice(start, start + binderState.pageSize);

    pageSpecies.forEach((species) => {
        const entry = binderState.entries[String(species.id)];
        const slotImage = entry?.imageSmall ? normalizeStoredEntryImage(entry.imageSmall, 'low') : '';
        const slot = document.createElement('article');
        slot.className = `binder-slot${binderState.highlightedSpeciesId === species.id ? ' highlighted' : ''}`;
        slot.innerHTML = `
            <div class="binder-pocket">
                ${slotImage ? `<img class="binder-card-image" src="${slotImage}" alt="${entry.cardName}">` : ''}
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
    renderBinder();
    setBinderStatus(`Saltando a ${formatSpeciesName(target.name)}.`);
}

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
            preview.innerHTML = `<img src="${previewImage}" alt="${entry.cardName}">`;
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
            <img src="${getCardImage(card, 'low')}" alt="${card.name}">
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
