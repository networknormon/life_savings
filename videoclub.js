const VIDEOCLUB_APP_VERSION = '20260320b';
const REGION = 'eu-north-1';
const USER_POOL_ID = 'eu-north-1_HT76kHw12';
const IDENTITY_POOL_ID = 'eu-north-1:d5157883-71f1-475b-8e0e-9774ab7607de';
const VIDEOCLUB_LOGIN_URL = window.appSession?.loginUrl || 'https://networknormon.github.io/life_savings/login.html';
const VIDEOCLUB_LOCAL_KEYS = {
    backup: 'life-savings-videoclub-backup-v1',
    pendingSync: 'life-savings-videoclub-pending-v1'
};
const MOVIE_STATUS_META = {
    watchlist: { label: 'Quiero ver', tone: 'watchlist' },
    pending: { label: 'Pendiente', tone: 'pending' },
    watching: { label: 'Viendo', tone: 'watching' },
    watched: { label: 'Vista', tone: 'watched' },
    rewatch: { label: 'Rewatch', tone: 'rewatch' }
};

AWS.config.region = REGION;

const videoclubState = {
    movies: [],
    searchResults: [],
    searchTerm: '',
    statusFilter: 'all',
    sort: 'updated-desc',
    selectedMovieId: null,
    cloudSyncEnabled: false,
    pendingSync: false,
    bootedFromLocal: false,
    sessionExpired: Boolean(window.appSession?.isExpired)
};

let videoclubDocClient = null;
let videoclubDbUserId = null;
let videoclubToastTimeout = null;

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function createId(prefix = 'movie') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
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

function getVideoclubDocClient() {
    if (!videoclubDocClient) {
        videoclubDocClient = new AWS.DynamoDB.DocumentClient({
            region: REGION,
            credentials: AWS.config.credentials
        });
    }
    return videoclubDocClient;
}

function configureVideoclubAwsCredentials() {
    const token = getStoredToken();
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IDENTITY_POOL_ID,
        Logins: token ? {
            [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: token
        } : {}
    });
    videoclubDocClient = null;
}

function canSyncVideoclubCloud() {
    return Boolean(videoclubState.cloudSyncEnabled && videoclubDbUserId && navigator.onLine);
}

function normalizePosterUrl(url) {
    if (!url) return '';
    return String(url)
        .replace(/\/\d+x\d+bb(?=[.-])/g, '/600x600bb')
        .replace('100x100bb', '600x600bb')
        .replace('200x200bb', '600x600bb');
}

function normalizeMovie(raw = {}) {
    const sourceId = raw.sourceId || raw.trackId || raw.id || createId(raw.source || 'movie');
    const title = String(raw.title || raw.trackName || raw.name || 'Película sin título').trim();
    const year = Number(raw.year || (raw.releaseDate ? String(raw.releaseDate).slice(0, 4) : 0)) || null;
    const releaseDate = raw.releaseDate ? String(raw.releaseDate).slice(0, 10) : '';
    const updatedAt = raw.updatedAt || new Date().toISOString();
    const addedAt = raw.addedAt || updatedAt;
    const status = MOVIE_STATUS_META[raw.status] ? raw.status : 'watchlist';
    const rating = Math.max(0, Math.min(5, Number(raw.rating || 0) || 0));
    const favorite = Boolean(raw.favorite);
    const runtimeMinutes = Number(raw.runtimeMinutes || raw.trackTimeMillis / 60000 || 0) || null;
    const price = raw.price === null || raw.price === undefined || raw.price === '' ? null : Number(raw.price);

    return {
        id: String(raw.id || `${raw.source || 'movie'}:${sourceId}`),
        source: raw.source || 'manual',
        sourceId: String(sourceId),
        title,
        titleKey: title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
        year,
        releaseDate,
        creator: String(raw.creator || raw.artistName || raw.director || '').trim(),
        genre: String(raw.genre || raw.primaryGenreName || '').trim(),
        description: String(raw.description || raw.longDescription || raw.shortDescription || '').trim(),
        poster: normalizePosterUrl(raw.poster || raw.artworkUrl100 || raw.artworkUrl60 || ''),
        price,
        currency: String(raw.currency || 'EUR').trim() || 'EUR',
        runtimeMinutes,
        status,
        rating,
        favorite,
        notes: String(raw.notes || '').trim(),
        dateWatched: raw.dateWatched ? String(raw.dateWatched).slice(0, 10) : '',
        addedAt,
        updatedAt
    };
}

function buildVideoclubSnapshot() {
    return {
        version: 1,
        movies: videoclubState.movies.map((movie) => ({ ...movie })),
        preferences: {
            statusFilter: videoclubState.statusFilter,
            sort: videoclubState.sort
        },
        lastUpdated: new Date().toISOString()
    };
}

function persistVideoclubLocalBackup(snapshot = buildVideoclubSnapshot()) {
    localStorage.setItem(VIDEOCLUB_LOCAL_KEYS.backup, JSON.stringify(snapshot));
}

function loadVideoclubLocalBackup() {
    try {
        return JSON.parse(localStorage.getItem(VIDEOCLUB_LOCAL_KEYS.backup) || 'null');
    } catch {
        return null;
    }
}

function queueVideoclubPendingSync(snapshot = buildVideoclubSnapshot()) {
    videoclubState.pendingSync = true;
    localStorage.setItem(VIDEOCLUB_LOCAL_KEYS.pendingSync, JSON.stringify(snapshot));
    updateVideoclubSessionUI();
}

function clearVideoclubPendingSync() {
    videoclubState.pendingSync = false;
    localStorage.removeItem(VIDEOCLUB_LOCAL_KEYS.pendingSync);
    updateVideoclubSessionUI();
}

function getVideoclubPendingSync() {
    try {
        const raw = localStorage.getItem(VIDEOCLUB_LOCAL_KEYS.pendingSync);
        if (!raw) return null;
        videoclubState.pendingSync = true;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function applyVideoclubSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') return;
    const rawMovies = Array.isArray(snapshot.movies) ? snapshot.movies : [];
    videoclubState.movies = rawMovies.map(normalizeMovie).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    videoclubState.statusFilter = snapshot.preferences?.statusFilter || videoclubState.statusFilter;
    videoclubState.sort = snapshot.preferences?.sort || videoclubState.sort;
}

function hydrateVideoclubFromLocalBackup() {
    const snapshot = loadVideoclubLocalBackup();
    if (!snapshot) return;
    applyVideoclubSnapshot(snapshot);
    videoclubState.bootedFromLocal = true;
}

function formatCurrency(value, currency = 'EUR') {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return 'Sin precio';
    try {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: currency || 'EUR' }).format(Number(value));
    } catch {
        return `${Number(value).toFixed(2)} ${currency || 'EUR'}`;
    }
}

function formatRuntime(minutes) {
    const mins = Number(minutes || 0);
    if (!mins) return '';
    const hours = Math.floor(mins / 60);
    const rest = mins % 60;
    if (!hours) return `${rest} min`;
    return `${hours}h ${String(rest).padStart(2, '0')}m`;
}

function formatMovieRating(rating) {
    const safe = Math.max(0, Math.min(5, Number(rating || 0) || 0));
    return safe ? `${'★'.repeat(safe)}${'☆'.repeat(5 - safe)}` : 'Sin nota';
}

function showVideoclubToast(message) {
    let toast = document.getElementById('videoclub-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'videoclub-toast';
        toast.className = 'videoclub-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('is-visible');
    if (videoclubToastTimeout) clearTimeout(videoclubToastTimeout);
    videoclubToastTimeout = setTimeout(() => {
        toast.classList.remove('is-visible');
    }, 2200);
}

function updateVideoclubSessionUI(message = '') {
    const banner = document.getElementById('videoclub-session-banner');
    const token = getStoredToken();
    const expired = isTokenExpired(token);
    videoclubState.sessionExpired = expired;

    let title = 'Modo local';
    let body = message;

    if (canSyncVideoclubCloud()) {
        title = videoclubState.pendingSync ? 'Nube activa · pendiente' : 'Nube activa';
        body = videoclubState.pendingSync
            ? 'Hay cambios guardados localmente y se subirán en cuanto la sincronización termine.'
            : body || 'La videoteca se está guardando en Dynamo y también en copia local.';
    } else if (!navigator.onLine) {
        body = body || 'Sin Internet. Puedes seguir registrando pelis y las subiremos cuando vuelva la conexión.';
    } else if (!token) {
        body = body || 'No hay sesión activa. Todo sigue funcionando en este navegador.';
    } else if (expired) {
        body = body || 'La sesión ha caducado. La videoteca sigue operativa en local hasta que reconectes.';
    } else {
        body = body || 'No he podido conectar con la nube ahora mismo. Tus cambios siguen a salvo en local.';
    }

    if (!banner) return;
    banner.classList.remove('hidden');
    banner.innerHTML = `
        <div class="videoclub-session-copy">
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(body)}</span>
        </div>
        <div class="videoclub-top-actions">
            <button type="button" class="btn btn-sm" onclick="triggerVideoclubImport()">Importar JSON</button>
            <button type="button" class="btn btn-sm" onclick="exportVideoclubJson()">Exportar JSON</button>
            <button type="button" class="btn btn-sm" onclick="reconnectSession()">Reconectar</button>
        </div>
    `;
}

function persistVideoclubSnapshotToCloud(snapshot, onDone = null) {
    if (!videoclubDbUserId) {
        if (onDone) onDone(false);
        return;
    }

    const params = {
        TableName: 'ColeccionesData',
        Key: { userId: videoclubDbUserId },
        UpdateExpression: 'SET videoclub = :videoclub, videoclubUpdatedAt = :videoclubUpdatedAt',
        ExpressionAttributeValues: {
            ':videoclub': snapshot,
            ':videoclubUpdatedAt': snapshot.lastUpdated || new Date().toISOString()
        }
    };

    getVideoclubDocClient().update(params, (err) => {
        if (err) {
            console.error('Error subiendo videoclub:', err);
            videoclubState.cloudSyncEnabled = false;
            queueVideoclubPendingSync(snapshot);
            updateVideoclubSessionUI('Falló la subida a la nube. La videoteca queda guardada en local.');
            showVideoclubToast('Guardado local. La nube queda pendiente.');
            if (onDone) onDone(false);
            return;
        }

        clearVideoclubPendingSync();
        videoclubState.cloudSyncEnabled = true;
        updateVideoclubSessionUI('Videoteca sincronizada en local y en la nube.');
        showVideoclubToast('Videoteca guardada');
        if (onDone) onDone(true);
    });
}

function flushVideoclubPendingSync() {
    const pending = getVideoclubPendingSync();
    if (!pending || !canSyncVideoclubCloud()) return;
    persistVideoclubSnapshotToCloud(pending);
}

function saveVideoclub() {
    const snapshot = buildVideoclubSnapshot();
    persistVideoclubLocalBackup(snapshot);

    if (!canSyncVideoclubCloud()) {
        queueVideoclubPendingSync(snapshot);
        updateVideoclubSessionUI();
        return;
    }

    persistVideoclubSnapshotToCloud(snapshot);
}

function loadVideoclubFromCloud() {
    if (!videoclubDbUserId) return;
    const params = { TableName: 'ColeccionesData', Key: { userId: videoclubDbUserId } };

    getVideoclubDocClient().get(params, (err, data) => {
        if (err) {
            console.error('Error descargando videoclub:', err);
            videoclubState.cloudSyncEnabled = false;
            updateVideoclubSessionUI('No pude leer la nube. Seguimos con la copia local.');
            renderVideoclub();
            return;
        }

        const cloudPayload = data?.Item?.videoclub;
        if (cloudPayload) {
            const snapshot = typeof cloudPayload === 'string' ? JSON.parse(cloudPayload) : cloudPayload;
            applyVideoclubSnapshot(snapshot);
            persistVideoclubLocalBackup(buildVideoclubSnapshot());
        }

        videoclubState.cloudSyncEnabled = true;
        renderVideoclub();
        updateVideoclubSessionUI('Videoteca cargada desde la nube.');
        flushVideoclubPendingSync();
    });
}

function initializeVideoclubCloudSession() {
    const token = getStoredToken();
    videoclubState.sessionExpired = isTokenExpired(token);
    configureVideoclubAwsCredentials();

    if (!token || videoclubState.sessionExpired) {
        videoclubState.cloudSyncEnabled = false;
        updateVideoclubSessionUI();
        return;
    }

    AWS.config.credentials.get((err) => {
        if (err) {
            console.error('Videoclub credentials error:', err);
            videoclubState.cloudSyncEnabled = false;
            updateVideoclubSessionUI('La sesión de nube no está disponible. Seguimos en local.');
            return;
        }

        videoclubDbUserId = AWS.config.credentials.identityId;
        videoclubState.cloudSyncEnabled = true;
        updateVideoclubSessionUI('Conectando la videoteca con la nube...');
        loadVideoclubFromCloud();
    });
}

function getMovieStatusLabel(status) {
    return MOVIE_STATUS_META[status]?.label || 'Sin estado';
}

function getMovieStatusTone(status) {
    return MOVIE_STATUS_META[status]?.tone || 'watchlist';
}

function findExistingMovie(candidate) {
    return videoclubState.movies.find((movie) => {
        if (candidate.source && candidate.sourceId) {
            if (movie.source === candidate.source && String(movie.sourceId) === String(candidate.sourceId)) return true;
        }
        return movie.titleKey === normalizeMovie(candidate).titleKey && Number(movie.year || 0) === Number(candidate.year || 0);
    }) || null;
}

function upsertMovie(movieCandidate, preferredStatus = null) {
    const normalized = normalizeMovie({
        ...movieCandidate,
        status: preferredStatus || movieCandidate.status || 'watchlist',
        dateWatched: preferredStatus === 'watched' || preferredStatus === 'rewatch'
            ? (movieCandidate.dateWatched || new Date().toISOString().slice(0, 10))
            : movieCandidate.dateWatched,
        updatedAt: new Date().toISOString()
    });
    const existing = findExistingMovie(normalized);

    if (existing) {
        existing.status = preferredStatus || normalized.status || existing.status;
        existing.poster = normalized.poster || existing.poster;
        existing.creator = normalized.creator || existing.creator;
        existing.genre = normalized.genre || existing.genre;
        existing.description = normalized.description || existing.description;
        existing.runtimeMinutes = normalized.runtimeMinutes || existing.runtimeMinutes;
        existing.price = normalized.price ?? existing.price;
        existing.currency = normalized.currency || existing.currency;
        existing.updatedAt = new Date().toISOString();
        if ((existing.status === 'watched' || existing.status === 'rewatch') && !existing.dateWatched) {
            existing.dateWatched = new Date().toISOString().slice(0, 10);
        }
        saveVideoclub();
        renderVideoclub();
        showVideoclubToast('La película ya estaba registrada; he actualizado su estado.');
        openVideoclubModal(existing.id);
        return existing;
    }

    videoclubState.movies.unshift(normalized);
    saveVideoclub();
    renderVideoclub();
    showVideoclubToast('Película añadida al videoclub');
    return normalized;
}

function getFilteredAndSortedMovies() {
    const movies = [...videoclubState.movies];
    const filtered = movies.filter((movie) => {
        if (videoclubState.statusFilter === 'all') return true;
        if (videoclubState.statusFilter === 'favorites') return movie.favorite;
        return movie.status === videoclubState.statusFilter;
    });

    filtered.sort((a, b) => {
        switch (videoclubState.sort) {
        case 'title-asc':
            return a.title.localeCompare(b.title, 'es');
        case 'year-desc':
            return Number(b.year || 0) - Number(a.year || 0) || String(b.updatedAt).localeCompare(String(a.updatedAt));
        case 'rating-desc':
            return Number(b.rating || 0) - Number(a.rating || 0) || String(b.updatedAt).localeCompare(String(a.updatedAt));
        case 'updated-desc':
        default:
            return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
        }
    });

    return filtered;
}

function renderSearchResults() {
    const container = document.getElementById('movie-search-results');
    const status = document.getElementById('movie-search-status');
    if (!container || !status) return;

    if (!videoclubState.searchTerm && !videoclubState.searchResults.length) {
        container.innerHTML = '';
        status.textContent = 'Puedes buscar o añadir una peli manualmente.';
        return;
    }

    if (!videoclubState.searchResults.length) {
        container.innerHTML = '<div class="videoclub-empty">No he encontrado resultados. Puedes probar otro título o añadirla manualmente.</div>';
        return;
    }

    status.textContent = `${videoclubState.searchResults.length} resultado(s) para “${videoclubState.searchTerm}”.`;
    container.innerHTML = videoclubState.searchResults.map((movie) => {
        const poster = movie.poster
            ? `<img class="movie-result-poster" src="${escapeHtml(movie.poster)}" alt="${escapeHtml(movie.title)}" loading="lazy" decoding="async">`
            : `<div class="movie-result-poster movie-result-poster-fallback">${escapeHtml(movie.title.slice(0, 1) || '🎬')}</div>`;
        const metaBits = [movie.year, movie.genre, formatRuntime(movie.runtimeMinutes)].filter(Boolean);
        const priceLine = movie.price !== null ? `<div class="movie-result-meta">iTunes: ${escapeHtml(formatCurrency(movie.price, movie.currency))}</div>` : '';
        return `
            <article class="movie-result-card">
                ${poster}
                <div class="movie-result-body">
                    <div class="movie-result-title">${escapeHtml(movie.title)}</div>
                    <div class="movie-result-meta">${escapeHtml(metaBits.join(' · ') || 'Película')}</div>
                    <div class="movie-result-meta">${escapeHtml(movie.creator || 'Sin director/estudio')}</div>
                    ${priceLine}
                    <div class="movie-result-actions">
                        <button type="button" class="btn btn-sm" onclick="addMovieFromSearch('${escapeHtml(movie.id)}', 'watchlist')">Quiero ver</button>
                        <button type="button" class="btn btn-sm btn-primary" onclick="addMovieFromSearch('${escapeHtml(movie.id)}', 'watched')">Vista</button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function updateVideoclubHero() {
    const total = videoclubState.movies.length;
    const watched = videoclubState.movies.filter((movie) => movie.status === 'watched' || movie.status === 'rewatch').length;
    const watchlist = videoclubState.movies.filter((movie) => movie.status === 'watchlist').length;
    const favorites = videoclubState.movies.filter((movie) => movie.favorite).length;

    document.getElementById('videoclub-total-stat').textContent = String(total);
    document.getElementById('videoclub-watched-stat').textContent = String(watched);
    document.getElementById('videoclub-watchlist-stat').textContent = String(watchlist);
    document.getElementById('videoclub-favorites-stat').textContent = String(favorites);

    const headline = document.getElementById('videoclub-headline');
    if (!headline) return;

    if (!total) {
        headline.textContent = 'Tu videoclub está vacío. Empieza por añadir tu próxima película.';
        return;
    }

    const nextWatch = videoclubState.movies.find((movie) => movie.status === 'watchlist' || movie.status === 'pending' || movie.status === 'watching');
    if (nextWatch) {
        headline.textContent = `Tienes ${watchlist} en watchlist y ${watched} vistas. La siguiente lógica sería ${nextWatch.title}${nextWatch.year ? ` (${nextWatch.year})` : ''}.`;
        return;
    }

    headline.textContent = `Videoteca al día: ${watched} vistas registradas y ${favorites} favoritas marcadas.`;
}

function renderVideoclubGrid() {
    const grid = document.getElementById('videoclub-grid');
    if (!grid) return;

    const movies = getFilteredAndSortedMovies();
    if (!movies.length) {
        grid.innerHTML = '<div class="videoclub-empty">No hay películas en esta vista todavía.</div>';
        return;
    }

    grid.innerHTML = movies.map((movie) => {
        const poster = movie.poster
            ? `<img class="videoclub-card-poster" src="${escapeHtml(movie.poster)}" alt="${escapeHtml(movie.title)}" loading="lazy" decoding="async">`
            : `<div class="videoclub-card-poster videoclub-card-poster-fallback">${escapeHtml(movie.title.slice(0, 1) || '🎬')}</div>`;
        const meta = [movie.year, movie.genre].filter(Boolean).join(' · ');
        const creator = movie.creator || 'Sin director/estudio';
        const note = movie.notes ? `<div class="videoclub-card-meta">${escapeHtml(movie.notes.slice(0, 90))}</div>` : '';
        return `
            <article class="videoclub-card" onclick="openVideoclubModal('${escapeHtml(movie.id)}')">
                ${poster}
                <div class="videoclub-card-body">
                    <div class="videoclub-card-title">${escapeHtml(movie.title)}</div>
                    <div class="videoclub-card-meta">${escapeHtml(meta || 'Película')}</div>
                    <div class="videoclub-card-meta">${escapeHtml(creator)}</div>
                    ${note}
                    <div class="videoclub-card-actions">
                        <span class="videoclub-status-badge is-${escapeHtml(getMovieStatusTone(movie.status))}">${escapeHtml(getMovieStatusLabel(movie.status))}</span>
                        <span class="videoclub-rating">${escapeHtml(movie.favorite ? '★ Favorita' : formatMovieRating(movie.rating))}</span>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function renderVideoclub() {
    const statusFilter = document.getElementById('videoclub-status-filter');
    const sortSelect = document.getElementById('videoclub-sort-select');
    if (statusFilter) statusFilter.value = videoclubState.statusFilter;
    if (sortSelect) sortSelect.value = videoclubState.sort;
    updateVideoclubHero();
    renderSearchResults();
    renderVideoclubGrid();
    updateVideoclubSessionUI();
}

function openMovieModalWithData(movie) {
    const modal = document.getElementById('videoclub-modal');
    if (!modal || !movie) return;

    videoclubState.selectedMovieId = movie.id;
    document.getElementById('videoclub-modal-title').textContent = movie.title;
    document.getElementById('videoclub-modal-meta').textContent = [movie.year, movie.genre, formatRuntime(movie.runtimeMinutes)].filter(Boolean).join(' · ') || 'Película';
    document.getElementById('videoclub-modal-subtitle').textContent = movie.creator || 'Sin director/estudio';
    const poster = document.getElementById('videoclub-modal-image');
    if (movie.poster) {
        poster.src = movie.poster;
        poster.alt = movie.title;
    } else {
        poster.removeAttribute('src');
        poster.alt = movie.title;
    }

    document.getElementById('videoclub-edit-status').value = movie.status;
    document.getElementById('videoclub-edit-rating').value = String(movie.rating || 0);
    document.getElementById('videoclub-edit-date').value = movie.dateWatched || '';
    document.getElementById('videoclub-edit-favorite').checked = Boolean(movie.favorite);
    document.getElementById('videoclub-edit-notes').value = movie.notes || '';
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

window.openVideoclubModal = (movieId) => {
    const movie = videoclubState.movies.find((entry) => entry.id === movieId);
    if (!movie) return;
    openMovieModalWithData(movie);
};

window.closeVideoclubModal = () => {
    const modal = document.getElementById('videoclub-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    videoclubState.selectedMovieId = null;
    document.body.style.overflow = '';
};

window.saveVideoclubMovieEdits = () => {
    const movie = videoclubState.movies.find((entry) => entry.id === videoclubState.selectedMovieId);
    if (!movie) return;

    movie.status = document.getElementById('videoclub-edit-status').value;
    movie.rating = Number(document.getElementById('videoclub-edit-rating').value || 0);
    movie.dateWatched = document.getElementById('videoclub-edit-date').value || '';
    movie.favorite = document.getElementById('videoclub-edit-favorite').checked;
    movie.notes = document.getElementById('videoclub-edit-notes').value.trim();
    movie.updatedAt = new Date().toISOString();

    if ((movie.status === 'watched' || movie.status === 'rewatch') && !movie.dateWatched) {
        movie.dateWatched = new Date().toISOString().slice(0, 10);
    }

    saveVideoclub();
    renderVideoclub();
    openMovieModalWithData(movie);
    showVideoclubToast('Ficha actualizada');
};

window.deleteVideoclubMovie = () => {
    const movie = videoclubState.movies.find((entry) => entry.id === videoclubState.selectedMovieId);
    if (!movie) return;
    if (!window.confirm(`¿Quitar “${movie.title}” del videoclub?`)) return;

    videoclubState.movies = videoclubState.movies.filter((entry) => entry.id !== movie.id);
    saveVideoclub();
    renderVideoclub();
    closeVideoclubModal();
    showVideoclubToast('Película eliminada');
};

window.setVideoclubStatusFilter = (value) => {
    videoclubState.statusFilter = value || 'all';
    persistVideoclubLocalBackup(buildVideoclubSnapshot());
    renderVideoclubGrid();
};

window.setVideoclubSort = (value) => {
    videoclubState.sort = value || 'updated-desc';
    persistVideoclubLocalBackup(buildVideoclubSnapshot());
    renderVideoclubGrid();
};

window.toggleManualMoviePanel = () => {
    const panel = document.getElementById('manual-movie-panel');
    if (!panel) return;
    const willOpen = panel.classList.contains('hidden');
    panel.classList.toggle('hidden');
    if (willOpen) {
        const searchInput = document.getElementById('movie-search-input');
        const manualTitle = document.getElementById('manual-movie-title');
        if (manualTitle && !manualTitle.value.trim() && searchInput?.value.trim()) {
            manualTitle.value = searchInput.value.trim();
        }
    }
};

window.addManualMovie = () => {
    const title = document.getElementById('manual-movie-title')?.value.trim();
    if (!title) {
        showVideoclubToast('Necesito al menos un título');
        return;
    }

    const movie = {
        id: createId('manual'),
        source: 'manual',
        sourceId: createId('manual-source'),
        title,
        year: Number(document.getElementById('manual-movie-year')?.value || 0) || null,
        creator: document.getElementById('manual-movie-creator')?.value.trim() || '',
        genre: document.getElementById('manual-movie-genre')?.value.trim() || '',
        poster: document.getElementById('manual-movie-poster')?.value.trim() || '',
        status: document.getElementById('manual-movie-status')?.value || 'watchlist',
        rating: 0,
        favorite: false,
        notes: '',
        dateWatched: '',
        description: ''
    };

    if (movie.status === 'watched' || movie.status === 'rewatch') {
        movie.dateWatched = new Date().toISOString().slice(0, 10);
    }

    const saved = upsertMovie(movie, movie.status);
    if (!saved) return;

    ['manual-movie-title', 'manual-movie-year', 'manual-movie-creator', 'manual-movie-genre', 'manual-movie-poster'].forEach((id) => {
        const field = document.getElementById(id);
        if (field) field.value = '';
    });
    document.getElementById('manual-movie-status').value = 'watchlist';
    document.getElementById('manual-movie-panel')?.classList.add('hidden');
};

function mapItunesResult(result) {
    return normalizeMovie({
        id: `itunes:${result.trackId}`,
        source: 'itunes',
        sourceId: result.trackId,
        title: result.trackName,
        year: result.releaseDate ? String(result.releaseDate).slice(0, 4) : '',
        releaseDate: result.releaseDate,
        creator: result.artistName || result.artistViewUrl || '',
        genre: result.primaryGenreName || '',
        description: result.longDescription || result.shortDescription || '',
        poster: normalizePosterUrl(result.artworkUrl100 || result.artworkUrl60 || ''),
        price: result.trackPrice ?? result.collectionPrice ?? null,
        currency: result.currency || 'EUR',
        runtimeMinutes: result.trackTimeMillis ? Math.round(result.trackTimeMillis / 60000) : null,
        status: 'watchlist',
        rating: 0,
        favorite: false,
        notes: ''
    });
}

window.searchMovies = async () => {
    const input = document.getElementById('movie-search-input');
    const status = document.getElementById('movie-search-status');
    const term = input?.value.trim();
    if (!term) {
        if (status) status.textContent = 'Escribe un título para buscar.';
        return;
    }

    videoclubState.searchTerm = term;
    videoclubState.searchResults = [];
    renderSearchResults();
    if (status) status.textContent = `Buscando “${term}”...`;

    try {
        const url = new URL('https://itunes.apple.com/search');
        url.searchParams.set('term', term);
        url.searchParams.set('media', 'movie');
        url.searchParams.set('entity', 'movie');
        url.searchParams.set('country', 'es');
        url.searchParams.set('limit', '24');
        url.searchParams.set('lang', 'es_es');

        const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        videoclubState.searchResults = Array.isArray(payload.results)
            ? payload.results.map(mapItunesResult).filter((movie) => movie.title)
            : [];

        if (!videoclubState.searchResults.length && status) {
            status.textContent = 'No he encontrado resultados. Puedes probar otro término o añadirla manualmente.';
        }
    } catch (error) {
        console.error('Movie search error:', error);
        videoclubState.searchResults = [];
        if (status) {
            status.textContent = 'No he podido consultar el buscador ahora mismo. Puedes añadir la película manualmente.';
        }
    }

    renderSearchResults();
};

window.addMovieFromSearch = (movieId, status = 'watchlist') => {
    const movie = videoclubState.searchResults.find((entry) => entry.id === movieId);
    if (!movie) return;
    const saved = upsertMovie(movie, status);
    if (saved) openVideoclubModal(saved.id);
};

window.exportVideoclubJson = () => {
    const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        videoclub: buildVideoclubSnapshot()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `videoclub-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showVideoclubToast('JSON exportado');
};

window.triggerVideoclubImport = () => {
    document.getElementById('videoclub-import-input')?.click();
};

function importVideoclubFromFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const parsed = JSON.parse(String(reader.result || '{}'));
            const snapshot = parsed.videoclub || parsed;
            if (!snapshot || !Array.isArray(snapshot.movies)) throw new Error('Formato no compatible');
            applyVideoclubSnapshot(snapshot);
            persistVideoclubLocalBackup(buildVideoclubSnapshot());
            saveVideoclub();
            renderVideoclub();
            showVideoclubToast('Videoclub importado');
        } catch (error) {
            console.error('Videoclub import error:', error);
            showVideoclubToast('No pude importar ese JSON');
        } finally {
            event.target.value = '';
        }
    };
    reader.readAsText(file);
}

function bindVideoclubEvents() {
    const searchInput = document.getElementById('movie-search-input');
    const importInput = document.getElementById('videoclub-import-input');
    const modal = document.getElementById('videoclub-modal');
    const modalCard = modal?.querySelector('.videoclub-modal-card');

    searchInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchMovies();
        }
    });

    importInput?.addEventListener('change', importVideoclubFromFile);
    modal?.addEventListener('pointerdown', (event) => {
        if (event.target === modal) closeVideoclubModal();
    });
    modalCard?.addEventListener('pointerdown', (event) => event.stopPropagation());

    document.addEventListener('keydown', (event) => {
        const modalOpen = modal && !modal.classList.contains('hidden');
        if (event.key === 'Escape' && modalOpen) {
            closeVideoclubModal();
        }
    });

    window.addEventListener('online', () => {
        updateVideoclubSessionUI('Ha vuelto Internet. Intentando sincronizar la videoteca.');
        initializeVideoclubCloudSession();
        flushVideoclubPendingSync();
    });

    window.addEventListener('offline', () => {
        videoclubState.cloudSyncEnabled = false;
        updateVideoclubSessionUI('Sin conexión. Seguimos guardando todo localmente.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    bindVideoclubEvents();
    hydrateVideoclubFromLocalBackup();
    renderVideoclub();
    initializeVideoclubCloudSession();
});
