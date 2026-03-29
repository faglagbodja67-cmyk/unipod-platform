let currentPage = 1;
const limit = 20;
let currentSearch = "";
let currentTheme = "";
let currentLevel = "";
let currentSort = "title_asc";
let totalPages = 1;
let currentItems = [];
let metaLoaded = false;

const booksList = document.getElementById("books-list");
const booksMeta = document.getElementById("books-meta");
const pageInfo = document.getElementById("page-info");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const themeFilter = document.getElementById("theme-filter");
const levelFilter = document.getElementById("level-filter");
const sortSelect = document.getElementById("sort-select");
const exportBtn = document.getElementById("export-btn");

function escapeXml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function buildBookCover(book) {
    const title = escapeXml(book.title || "Livre");
    const author = escapeXml(book.author || "UNIPOD");
    const theme = escapeXml(book.theme || "Entrepreneuriat");

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="460" viewBox="0 0 320 460">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a2540"/>
      <stop offset="100%" stop-color="#1f6feb"/>
    </linearGradient>
  </defs>
  <rect width="320" height="460" rx="20" fill="url(#g)"/>
  <rect x="18" y="18" width="284" height="424" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)"/>
  <text x="34" y="74" font-size="14" fill="#cfe0ff" font-family="Arial, sans-serif">Bibliotheque UNIPOD</text>
  <foreignObject x="34" y="94" width="252" height="215">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;font-size:28px;line-height:1.18;color:white;font-weight:700;word-break:break-word;">
      ${title}
    </div>
  </foreignObject>
  <text x="34" y="352" font-size="16" fill="#e6efff" font-family="Arial, sans-serif">${author}</text>
  <text x="34" y="382" font-size="13" fill="#b7cbef" font-family="Arial, sans-serif">${theme}</text>
</svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderBooks(items) {
    booksList.innerHTML = "";

    if (!items.length) {
        booksList.innerHTML = '<p>Aucun livre trouvé pour cette recherche.</p>';
        return;
    }

    items.forEach((book) => {
        const card = document.createElement("article");
        card.className = "book-card";
        const cover = book.coverUrl || buildBookCover(book);
        card.innerHTML = `
            <a class="book-link" href="/livre/${encodeURIComponent(book.id)}" aria-label="Lire ${book.title}">
                <img class="book-cover" src="${cover}" alt="Couverture du livre ${book.title}" loading="lazy">
                <h4>${book.title}</h4>
            </a>
        `;
        booksList.appendChild(card);
    });
}

async function loadMeta() {
    if (metaLoaded) return;

    const response = await fetch("/api/library/meta");
    if (!response.ok) {
        throw new Error("Impossible de charger les filtres");
    }

    const meta = await response.json();

    meta.themes.forEach((theme) => {
        const opt = document.createElement("option");
        opt.value = theme;
        opt.textContent = theme;
        themeFilter.appendChild(opt);
    });

    meta.levels.forEach((level) => {
        const opt = document.createElement("option");
        opt.value = level;
        opt.textContent = level;
        levelFilter.appendChild(opt);
    });

    metaLoaded = true;
}

async function loadBooks() {
    const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(limit),
        search: currentSearch,
        theme: currentTheme,
        level: currentLevel,
        sort: currentSort
    });

    const response = await fetch(`/api/library/books?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Impossible de charger les livres");
    }

    const data = await response.json();
    totalPages = data.pagination.totalPages;
    currentPage = data.pagination.page;
    currentItems = data.items;

    booksMeta.textContent = `${data.pagination.total} livre(s) trouvés dans le catalogue français`;
    pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;

    renderBooks(data.items);
}

function renderVideos(videos) {
    const container = document.getElementById("video-list");
    container.innerHTML = "";

    videos.forEach((video) => {
        const card = document.createElement("article");
        card.className = "video-card";
        card.innerHTML = `
            <h4>${video.title}</h4>
            <iframe src="${video.embedUrl}" title="${video.title}" loading="lazy" allowfullscreen></iframe>
        `;
        container.appendChild(card);
    });
}

async function loadVideos() {
    const response = await fetch("/api/library/videos");
    if (!response.ok) {
        throw new Error("Impossible de charger les videos");
    }

    const videos = await response.json();
    renderVideos(videos);
}

function exportCurrentPageCsv() {
    if (!currentItems.length) return;

    const headers = ["id", "title", "author", "theme", "level", "year", "language", "sourceUrl"];
    const lines = [headers.join(",")];

    currentItems.forEach((book) => {
        const row = headers.map((h) => {
            const value = String(book[h] ?? "").replace(/"/g, '""');
            return `"${value}"`;
        });
        lines.push(row.join(","));
    });

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bibliotheque_page_${currentPage}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

async function refresh() {
    try {
        await loadMeta();
        await Promise.all([loadBooks(), loadVideos()]);
    } catch (error) {
        booksList.innerHTML = `<p>${error.message}</p>`;
    }
}

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        loadBooks();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage += 1;
        loadBooks();
    }
});

function applyFilters() {
    currentSearch = searchInput.value.trim();
    currentTheme = themeFilter.value.trim();
    currentLevel = levelFilter.value.trim();
    currentSort = sortSelect.value;
    currentPage = 1;
    loadBooks();
}

searchBtn.addEventListener("click", applyFilters);
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        applyFilters();
    }
});

themeFilter.addEventListener("change", applyFilters);
levelFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);
exportBtn.addEventListener("click", exportCurrentPageCsv);

refresh();
