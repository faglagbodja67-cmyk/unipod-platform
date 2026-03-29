const domains = ["formations", "events", "network", "videos", "mobile", "commande", "reservation", "cafe", "autre"];
const pageSize = 10;

const state = {
    grouped: {},
    kpis: {},
    kpisDirty: false,
    activeDomain: "formations",
    pageByDomain: Object.fromEntries(domains.map((domain) => [domain, 1]))
};

function safeNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function renderKpiAdmin(kpis) {
    const grid = document.getElementById("kpi-admin-grid");
    if (!grid) return;

    grid.innerHTML = "";

    Object.values(kpis).forEach((kpi) => {
        const card = document.createElement("article");
        card.className = "kpi-admin-card";
        card.dataset.kpi = kpi.key;
        const titleNode = document.createElement("h3");
        titleNode.textContent = safeText(kpi.title);

        function createField(labelText, field, value, type = "text") {
            const label = document.createElement("label");
            label.textContent = labelText;

            const input = document.createElement("input");
            input.type = type;
            input.dataset.field = field;
            input.value = String(value ?? "");
            input.addEventListener("input", () => {
                state.kpisDirty = true;
            });

            label.appendChild(input);
            return label;
        }

        const rowOne = document.createElement("div");
        rowOne.className = "kpi-admin-row";
        rowOne.appendChild(createField("Valeur", "value", safeNumber(kpi.value), "number"));
        rowOne.appendChild(createField("Objectif", "target", safeNumber(kpi.target, 100), "number"));

        const rowTwo = document.createElement("div");
        rowTwo.className = "kpi-admin-row";
        rowTwo.appendChild(createField("Préfixe", "prefix", safeText(kpi.prefix)));
        rowTwo.appendChild(createField("Suffixe", "suffix", safeText(kpi.suffix)));

        card.appendChild(titleNode);
        card.appendChild(createField("Titre", "title", safeText(kpi.title)));
        card.appendChild(rowOne);
        card.appendChild(rowTwo);
        card.appendChild(createField("Suffixe objectif", "targetSuffix", safeText(kpi.targetSuffix)));
        grid.appendChild(card);
    });
}

function collectKpiPayload() {
    const cards = Array.from(document.querySelectorAll(".kpi-admin-card[data-kpi]"));
    return cards.reduce((acc, card) => {
        const key = card.dataset.kpi;
        if (!key) return acc;

        const getValue = (field) => card.querySelector(`[data-field="${field}"]`)?.value ?? "";
        acc[key] = {
            title: String(getValue("title")).trim(),
            value: safeNumber(getValue("value")),
            target: safeNumber(getValue("target"), 100),
            prefix: String(getValue("prefix")).trim(),
            suffix: String(getValue("suffix")).trim(),
            targetSuffix: String(getValue("targetSuffix")).trim()
        };
        return acc;
    }, {});
}

async function loadKpis() {
    if (state.kpisDirty) {
        return;
    }

    const response = await fetch("/api/kpis", { credentials: "same-origin" });
    if (response.status === 401) {
        window.location.href = "/admin-login";
        return;
    }
    if (!response.ok) {
        throw new Error("Impossible de charger les KPI.");
    }

    state.kpis = await response.json();
    renderKpiAdmin(state.kpis);
}

async function saveKpis() {
    const status = document.getElementById("kpi-admin-status");
    const saveBtn = document.getElementById("save-kpis-btn");
    try {
        if (saveBtn) saveBtn.disabled = true;
        if (status) status.textContent = "Enregistrement en cours...";

        const response = await fetch("/api/kpis", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify(collectKpiPayload())
        });

        if (response.status === 401) {
            window.location.href = "/admin-login";
            return;
        }

        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(body.error || "Impossible d'enregistrer les KPI.");
        }

        state.kpis = body;
        state.kpisDirty = false;
        renderKpiAdmin(state.kpis);
        if (status) status.textContent = "KPI mis à jour avec succès.";
    } catch (error) {
        if (status) status.textContent = error.message;
    } finally {
        if (saveBtn) saveBtn.disabled = false;
    }
}

function formatDomain(value) {
    const labels = {
        formations: "Formations",
        events: "Événements",
        network: "Réseautage",
        videos: "Pub Video",
        mobile: "Application Mobile",
        commande: "Commandes",
        reservation: "Reservations",
        cafe: "Espace Café",
        autre: "Autre"
    };

    return labels[value] || value;
}

function formatDate(value) {
    try {
        return new Date(value).toLocaleString("fr-FR");
    } catch (_error) {
        return value;
    }
}

function safeText(value) {
    return value ? String(value) : "-";
}

function formatAmount(value) {
    const amount = Number(value) || 0;
    if (amount <= 0) return "-";
    return `${amount.toLocaleString("fr-FR")} FCFA`;
}

function formatPaymentMethod(value) {
    const labels = {
        mixx: "Mixx by Yas",
        flooz: "Flooz",
        ussd: "USSD",
        sur_place: "Sur place",
        non_precise: "-"
    };

    return labels[value] || safeText(value);
}

function formatPaymentStatus(value) {
    const labels = {
        en_attente: "En attente",
        paye: "Paye"
    };

    return labels[value] || "En attente";
}

function getDomainRows(domain) {
    const rows = state.grouped[domain] || [];
    return rows.slice().reverse();
}

function renderSummary(grouped) {
    const summary = document.getElementById("summary");
    if (!summary) return;

    const total = domains.reduce((count, domain) => count + (grouped[domain] || []).length, 0);
    summary.innerHTML = "";

    const totalPill = document.createElement("div");
    totalPill.className = "pill";
    totalPill.innerHTML = `<strong>${total}</strong><span>Total inscriptions</span>`;
    summary.appendChild(totalPill);

    domains.forEach((domain) => {
        const count = (grouped[domain] || []).length;
        const pill = document.createElement("div");
        pill.className = "pill";
        pill.innerHTML = `<strong>${count}</strong><span>${formatDomain(domain)}</span>`;
        summary.appendChild(pill);
    });
}

function renderTabs() {
    const tabsContainer = document.getElementById("domain-tabs");
    if (!tabsContainer) return;

    tabsContainer.innerHTML = "";

    domains.forEach((domain) => {
        const count = (state.grouped[domain] || []).length;
        const button = document.createElement("button");
        button.type = "button";
        button.className = `domain-tab${state.activeDomain === domain ? " active" : ""}`;
        button.textContent = `${formatDomain(domain)} (${count})`;
        button.addEventListener("click", () => {
            state.activeDomain = domain;
            renderTabs();
            renderActiveDomain();
        });

        tabsContainer.appendChild(button);
    });
}

function buildRow(item) {
    const tr = document.createElement("tr");
    const values = [
        safeText(item.fullName),
        safeText(item.email),
        safeText(item.organization),
        safeText(item.activityTitle),
        formatPaymentMethod(item.paymentMethod),
        formatPaymentStatus(item.paymentStatus),
        formatAmount(item.paymentAmount),
        safeText(item.paymentNumber),
        safeText(item.paymentUssdCode),
        safeText(item.paymentReference),
        safeText(item.sourcePage),
        formatDate(item.createdAt)
    ];

    values.forEach((value) => {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
    });

    return tr;
}

function buildTable(rows) {
    const tableWrap = document.createElement("div");
    tableWrap.className = "table-wrap";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    ["Nom", "Email", "Organisation", "Activité", "Paiement", "Statut", "Montant", "Numéro paiement", "Code USSD", "Référence", "Source", "Date"].forEach((label) => {
        const th = document.createElement("th");
        th.textContent = label;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    rows.forEach((row) => tbody.appendChild(buildRow(row)));
    table.appendChild(tbody);

    tableWrap.appendChild(table);
    return tableWrap;
}

function renderActiveDomain() {
    const view = document.getElementById("admin-view");
    if (!view) return;

    const domain = state.activeDomain;
    const rows = getDomainRows(domain);
    const totalRows = rows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
    const currentPage = Math.min(state.pageByDomain[domain] || 1, totalPages);
    state.pageByDomain[domain] = currentPage;

    const start = (currentPage - 1) * pageSize;
    const pageRows = rows.slice(start, start + pageSize);

    view.innerHTML = "";

    const card = document.createElement("article");
    card.className = "domain-card";

    const title = document.createElement("h2");
    title.textContent = `${formatDomain(domain)} (${totalRows})`;
    card.appendChild(title);

    if (totalRows === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "Aucune inscription dans ce domaine.";
        card.appendChild(empty);
        view.appendChild(card);
        return;
    }

    card.appendChild(buildTable(pageRows));

    const footer = document.createElement("div");
    footer.className = "domain-footer";

    const note = document.createElement("div");
    note.className = "domain-note";
    note.textContent = `Affichage ${start + 1}-${Math.min(start + pageRows.length, totalRows)} sur ${totalRows}`;

    const pager = document.createElement("div");
    pager.className = "pager";

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.textContent = "Précédent";
    prevBtn.disabled = currentPage <= 1;
    prevBtn.addEventListener("click", () => {
        state.pageByDomain[domain] = Math.max(1, currentPage - 1);
        renderActiveDomain();
    });

    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.textContent = "Suivant";
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.addEventListener("click", () => {
        state.pageByDomain[domain] = Math.min(totalPages, currentPage + 1);
        renderActiveDomain();
    });

    pager.appendChild(prevBtn);
    pager.appendChild(pageInfo);
    pager.appendChild(nextBtn);

    footer.appendChild(note);
    footer.appendChild(pager);
    card.appendChild(footer);

    view.appendChild(card);
}

function normalizeGroupedData(data) {
    const normalized = {};
    domains.forEach((domain) => {
        normalized[domain] = Array.isArray(data[domain]) ? data[domain] : [];
    });
    return normalized;
}

async function loadAdminDashboard() {
    try {
        await loadKpis();

        const response = await fetch("/api/registrations/grouped");

        if (response.status === 401) {
            window.location.href = "/admin-login";
            return;
        }

        if (!response.ok) {
            throw new Error("API indisponible");
        }

        const grouped = normalizeGroupedData(await response.json());
        state.grouped = grouped;

        if (!domains.includes(state.activeDomain)) {
            state.activeDomain = domains[0];
        }

        renderSummary(grouped);
        renderTabs();
        renderActiveDomain();
    } catch (_error) {
        const summary = document.getElementById("summary");
        const view = document.getElementById("admin-view");
        const tabs = document.getElementById("domain-tabs");

        if (summary) {
            summary.innerHTML = '<div class="pill"><strong>Erreur</strong><span>Impossible de charger les inscriptions.</span></div>';
        }

        if (tabs) {
            tabs.innerHTML = "";
        }

        if (view) {
            view.innerHTML = "";
        }
    }
}

async function logout() {
    try {
        await fetch("/api/admin/logout", { method: "POST" });
    } finally {
        window.location.href = "/admin-login";
    }
}

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

const saveKpisBtn = document.getElementById("save-kpis-btn");
if (saveKpisBtn) {
    saveKpisBtn.addEventListener("click", saveKpis);
}

loadAdminDashboard();
setInterval(loadAdminDashboard, 15000);

