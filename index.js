const fallbackData = {
    formations: [
        { title: "Entrepreneuriat Digital", description: "Apprenez à lancer votre startup digitale." },
        { title: "Marketing Digital", description: "Maîtrisez Facebook Ads, SEO et branding." },
        { title: "Finance pour Entrepreneurs", description: "Gérez efficacement vos finances." }
    ],
    events: [
        { title: "Atelier Startup", description: "Comment creer une startup a Lome." },
        { title: "Conference Innovation", description: "Rencontrez des entrepreneurs inspirants." }
    ],
    network: [
        { title: "Meetup Entrepreneurs", description: "Connectez-vous avec d'autres createurs." },
        { title: "Afterwork UNIPOD", description: "Echanges et opportunites business." }
    ]
};

const formationLevels = {
    "Entrepreneuriat Digital": [
        {
            level: "Débutant",
            details: [
                "Comprendre les fondamentaux d'une startup digitale.",
                "Définir une proposition de valeur claire.",
                "Identifier son premier segment client."
            ]
        },
        {
            level: "Intermédiaire",
            details: [
                "Construire un MVP et organiser les tests utilisateurs.",
                "Mettre en place un tunnel de conversion simple.",
                "Suivre les indicateurs de traction (activation, retention)."
            ]
        },
        {
            level: "Avancé",
            details: [
                "Stratégie de croissance et partenariats business.",
                "Structuration juridique et modèles de revenus.",
                "Préparation au pitch investisseur."
            ]
        }
    ],
    "Marketing Digital": [
        {
            level: "Débutant",
            details: [
                "Bases du branding et positionnement de marque.",
                "Introduction SEO et reseaux sociaux.",
                "Création de contenu orienté client."
            ]
        },
        {
            level: "Intermédiaire",
            details: [
                "Lancer des campagnes Facebook/Instagram Ads.",
                "Analyser les performances via KPI marketing.",
                "Optimiser landing pages et parcours client."
            ]
        },
        {
            level: "Avancé",
            details: [
                "Automatisation marketing et segmentation avancée.",
                "Stratégie multicanale et attribution.",
                "Pilotage ROI et budget media professionnel."
            ]
        }
    ],
    "Finance pour Entrepreneurs": [
        {
            level: "Débutant",
            details: [
                "Lire un compte de résultat et un budget simple.",
                "Différencier charges fixes et variables.",
                "Mettre en place un suivi de trésorerie."
            ]
        },
        {
            level: "Intermédiaire",
            details: [
                "Construire un prévisionnel financier fiable.",
                "Calculer seuil de rentabilité et marge.",
                "Organiser la gestion des flux de caisse."
            ]
        },
        {
            level: "Avancé",
            details: [
                "Structurer un dossier de financement bancaire.",
                "Négocier avec investisseurs et partenaires financiers.",
                "Mettre en place un pilotage financier par objectifs."
            ]
        }
    ]
};

const cafe = [
    {
        title: "Networking Cafe",
        description: "Rencontrez des entrepreneurs et developpez votre reseau."
    },
    {
        title: "Coworking",
        description: "Travaillez dans un espace calme avec Wi-Fi et ressources."
    },
    {
        title: "Mini Talks",
        description: "Participez a des discussions et partages d'experience."
    },
    {
        title: "Pitch Libre",
        description: "Presentez votre idee et obtenez des retours instantanes."
    }
];

const fallbackMenus = [
    {
        day: "Lundi",
        items: [
            { name: "Pinon au poisson", price: 1500, currency: "FCFA", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80" },
            { name: "Riz curie + viande de boeuf", price: 2000, currency: "FCFA", imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80" }
        ]
    },
    {
        day: "Mardi",
        items: [
            { name: "Riz banc + sauce de mouton", price: 2500, currency: "FCFA", imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80" },
            { name: "Patte de mais + Gboma", price: 1500, currency: "FCFA", imageUrl: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=500&q=80" }
        ]
    },
    {
        day: "Mercredi",
        items: [
            { name: "Petit poids a la viande + saucisse", price: 2000, currency: "FCFA", imageUrl: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=500&q=80" },
            { name: "Couscous au gras + poulets", price: 2500, currency: "FCFA", imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80" }
        ]
    },
    {
        day: "Jeudi",
        items: [
            { name: "Frites au poulet", price: 2000, currency: "FCFA", imageUrl: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=500&q=80" },
            { name: "Spaghetti a la boulette de viande", price: 2500, currency: "FCFA", imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=500&q=80" }
        ]
    },
    {
        day: "Vendredi",
        items: [
            { name: "Riz au gras + poulet braise", price: 2500, currency: "FCFA", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80" },
            { name: "Pate rouge + poisson", price: 2000, currency: "FCFA", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80" }
        ]
    }
];

let menuCatalog = fallbackMenus.slice();

const reservationPrices = {
    "Table Espace Cafe": 1500,
    "Espace coworking": 2000,
    "Session networking": 2500
};

const partnerCatalog = [
    {
        name: "Universite de Lome",
        partnershipTypes: [
            "Partenariat academique (co-certification et validation pedagogique).",
            "Mise a disposition d'espaces (amphis, salles de co-working, laboratoires).",
            "Recherche appliquee et accompagnement scientifique des projets.",
            "Orientation des etudiants vers les programmes d'incubation."
        ]
    },
    {
        name: "Incubateurs Regionaux",
        partnershipTypes: [
            "Co-incubation de startups entre structures partenaires.",
            "Echanges de mentors, experts metier et formateurs.",
            "Programmes communs d'acceleration et de demo day.",
            "Mutualisation des outils d'accompagnement et reseaux d'affaires."
        ]
    },
    {
        name: "Banques partenaires",
        partnershipTypes: [
            "Financement des startups (credits, lignes dediees, micro-finance).",
            "Education financiere et gestion de tresorerie pour entrepreneurs.",
            "Produits bancaires preferentiels pour les entreprises incubes.",
            "Coorganisation d'appels a projets finances."
        ]
    },
    {
        name: "ONG innovation",
        partnershipTypes: [
            "Subventions pour projets a impact social et environnemental.",
            "Appui technique sur inclusion, genre et entrepreneuriat jeune.",
            "Programmes communautaires et accompagnement terrain.",
            "Suivi-evaluation d'impact et reporting de performance."
        ]
    },
    {
        name: "Investisseurs angels",
        partnershipTypes: [
            "Pre-seed et seed funding pour startups prometteuses.",
            "Mentorat strategique post-investissement.",
            "Mise en relation avec fonds VC et partenaires internationaux.",
            "Preparation a la levee de fonds (pitch, due diligence, gouvernance)."
        ]
    }
];

function getNode(id) {
    return document.getElementById(id);
}

function openRegistrationForm(activityTitle, domain, sourcePage = "index") {
    const params = new URLSearchParams({
        domain,
        activity: activityTitle,
        source: sourcePage
    });

    window.location.href = `/inscription?${params.toString()}`;
}

function displayData(data, containerId, domain) {
    const container = getNode(containerId);
    if (!container) return;

    container.innerHTML = "";

    data.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const title = document.createElement("h3");
        title.textContent = item.title;

        const description = document.createElement("p");
        description.textContent = item.description;

        const button = document.createElement("button");
        button.textContent = "S'inscrire";
        let selectedLevel = null;
        button.addEventListener("click", () => {
            const activityLabel = selectedLevel
                ? `${item.title} - Niveau ${selectedLevel}`
                : item.title;
            openRegistrationForm(activityLabel, domain);
        });

        card.appendChild(title);
        card.appendChild(description);

        if (domain === "formations" && formationLevels[item.title]) {
            const levelsBox = document.createElement("div");
            levelsBox.className = "levels-box";

            const levelsHead = document.createElement("p");
            levelsHead.className = "levels-head";
            levelsHead.textContent = "Niveaux disponibles";
            levelsBox.appendChild(levelsHead);

            const levelsTabs = document.createElement("div");
            levelsTabs.className = "levels-tabs";

            const infoPanel = document.createElement("ul");
            infoPanel.className = "level-info";
            infoPanel.classList.add("level-collapsed");

            const levels = formationLevels[item.title];
            let activeLevel = levels[0].level;
            selectedLevel = activeLevel;

            function renderLevelInfo(levelName) {
                const current = levels.find((l) => l.level === levelName) || levels[0];
                infoPanel.innerHTML = "";
                current.details.forEach((line) => {
                    const li = document.createElement("li");
                    li.textContent = line;
                    infoPanel.appendChild(li);
                });
            }

            levels.forEach((entry) => {
                const tab = document.createElement("button");
                tab.type = "button";
                tab.className = "level-tab";
                tab.textContent = entry.level;
                tab.classList.toggle("active", entry.level === activeLevel);
                tab.addEventListener("click", () => {
                    activeLevel = entry.level;
                    selectedLevel = activeLevel;
                    document.querySelectorAll(".level-info").forEach((panel) => panel.classList.add("level-collapsed"));
                    Array.from(levelsTabs.querySelectorAll(".level-tab")).forEach((btn) => {
                        btn.classList.toggle("active", btn.textContent === activeLevel);
                    });
                    renderLevelInfo(activeLevel);
                    infoPanel.classList.remove("level-collapsed");
                });
                levelsTabs.appendChild(tab);
            });

            levelsBox.appendChild(levelsTabs);
            levelsBox.appendChild(infoPanel);
            card.appendChild(levelsBox);
        }

        card.appendChild(button);
        container.appendChild(card);
    });
}

function getMenuPrices() {
    return menuCatalog.reduce((prices, dayMenu) => {
        (dayMenu.items || []).forEach((item) => {
            prices[item.name] = Number(item.price) || 0;
        });
        return prices;
    }, {});
}

function populateCommandFields() {
    const daySelect = getNode("cmd-day");
    const itemSelect = getNode("cmd-item");
    if (!daySelect || !itemSelect) return;

    const previousDay = daySelect.value;
    const previousItem = itemSelect.value;

    daySelect.innerHTML = '<option value="">Jour</option>';
    menuCatalog.forEach((dayMenu) => {
        const option = document.createElement("option");
        option.value = dayMenu.day;
        option.textContent = dayMenu.day;
        daySelect.appendChild(option);
    });

    if (menuCatalog.some((dayMenu) => dayMenu.day === previousDay)) {
        daySelect.value = previousDay;
    }

    const selectedDay = daySelect.value || menuCatalog[0]?.day || "";
    const currentMenu = menuCatalog.find((dayMenu) => dayMenu.day === selectedDay);
    const items = currentMenu?.items || [];

    itemSelect.innerHTML = '<option value="">Menu</option>';
    items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.name;
        option.textContent = item.name;
        itemSelect.appendChild(option);
    });

    if (items.some((item) => item.name === previousItem)) {
        itemSelect.value = previousItem;
    }
}

function renderMenuGrid() {
    const container = getNode("menu-grid");
    if (!container) return;

    container.innerHTML = "";
    menuCatalog.forEach((dayMenu) => {
        const card = document.createElement("article");
        card.className = "menu-card";

        const title = document.createElement("h3");
        title.textContent = dayMenu.day;
        card.appendChild(title);

        const itemsWrap = document.createElement("div");
        itemsWrap.className = "menu-items";

        (dayMenu.items || []).forEach((item) => {
            const itemNode = document.createElement("article");
            itemNode.className = "menu-item";
            itemNode.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p class="menu-price">A partir de ${formatFcfa(item.price)}</p>
                </div>
            `;
            itemsWrap.appendChild(itemNode);
        });

        card.appendChild(itemsWrap);
        container.appendChild(card);
    });
}

async function loadMenus() {
    try {
        const response = await fetch("/api/menus");
        if (!response.ok) {
            throw new Error("API menus indisponible");
        }

        const menus = await response.json();
        if (Array.isArray(menus) && menus.length > 0) {
            menuCatalog = menus;
        }
    } catch (_error) {
        menuCatalog = fallbackMenus.slice();
        console.warn("Mode fallback menus actif.");
    }

    renderMenuGrid();
    populateCommandFields();
}

async function loadData() {
    try {
        const [formationsRes, eventsRes, networkRes] = await Promise.all([
            fetch("/api/formations"),
            fetch("/api/events"),
            fetch("/api/network")
        ]);

        if (!formationsRes.ok || !eventsRes.ok || !networkRes.ok) {
            throw new Error("Une ou plusieurs routes API ne repondent pas.");
        }

        const [formations, events, network] = await Promise.all([
            formationsRes.json(),
            eventsRes.json(),
            networkRes.json()
        ]);

        displayData(formations, "formations-list", "formations");
        displayData(events, "events-list", "events");
        displayData(network, "network-list", "network");
    } catch (_error) {
        displayData(fallbackData.formations, "formations-list", "formations");
        displayData(fallbackData.events, "events-list", "events");
        displayData(fallbackData.network, "network-list", "network");
        console.warn("Mode fallback actif: backend indisponible.");
    }
}

function scrollToSection(id) {
    const section = getNode(id);
    if (!section) return;

    section.scrollIntoView({
        behavior: "smooth"
    });
}

function renderPartnerDetails(partner) {
    const titleNode = getNode("partner-title");
    const typesNode = getNode("partner-types");
    const ctaNode = getNode("partner-cta");
    if (!titleNode || !typesNode || !ctaNode) return;

    titleNode.textContent = partner.name;
    typesNode.innerHTML = "";

    partner.partnershipTypes.forEach((type) => {
        const li = document.createElement("li");
        li.textContent = type;
        typesNode.appendChild(li);
    });

    ctaNode.onclick = () => {
        openRegistrationForm(`Partenariat - ${partner.name}`, "autre", "partners");
    };
}

function renderPartners() {
    const listNode = getNode("partner-list");
    if (!listNode || partnerCatalog.length === 0) return;

    let activeName = partnerCatalog[0].name;
    listNode.innerHTML = "";

    partnerCatalog.forEach((partner) => {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("role", "tab");
        button.textContent = partner.name;
        button.classList.toggle("active", partner.name === activeName);

        button.addEventListener("click", () => {
            activeName = partner.name;
            Array.from(listNode.querySelectorAll("button")).forEach((btn) => {
                btn.classList.toggle("active", btn.textContent === activeName);
            });
            renderPartnerDetails(partner);
        });

        listNode.appendChild(button);
    });

    renderPartnerDetails(partnerCatalog[0]);
}

function renderCafe() {
    displayData(cafe, "cafe-list", "network");
}

function hideCafePanels() {
    ["menu-semaine", "commande-reservation"].forEach((id) => {
        const section = getNode(id);
        if (section) {
            section.classList.add("is-hidden");
        }
    });
}

function showCafePanel(panelId, focusId = "") {
    hideCafePanels();
    const panel = getNode(panelId);
    if (!panel) return;

    panel.classList.remove("is-hidden");
    panel.scrollIntoView({ behavior: "smooth", block: "start" });

    if (focusId) {
        setTimeout(() => {
            const focusNode = getNode(focusId);
            if (focusNode) {
                focusNode.focus();
            }
        }, 250);
    }
}

function voirMenuCafe() {
    showCafePanel("menu-semaine");
}

function reserverPlace() {
    showCafePanel("commande-reservation", "res-fullname");
}

function rejoindreCafe() {
    showCafePanel("commande-reservation", "cmd-fullname");
}

async function submitToRegisterApi(payload) {
    const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(body.error || "Impossible d'envoyer la demande.");
    }

    return body;
}

function getPaymentLabel(method) {
    const map = {
        mixx: "Mobile Money Mixx by Yas",
        flooz: "Mobile Money Flooz",
        ussd: "USSD",
        sur_place: "Paiement sur place"
    };

    return map[method] || "Non defini";
}

function paymentNeedsNumber(method) {
    return method === "mixx" || method === "flooz" || method === "ussd";
}

function getPaymentStatusLabel(status) {
    return status === "paye" ? "Paye" : "En attente";
}

function formatFcfa(value) {
    const number = Number(value) || 0;
    return `${number.toLocaleString("fr-FR")} FCFA`;
}

function getCommandAmount() {
    const item = (getNode("cmd-item")?.value || "").trim();
    const qty = Number((getNode("cmd-qty")?.value || "1").trim());
    const unitPrice = getMenuPrices()[item] || 0;
    const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;
    return unitPrice * safeQty;
}

function getReservationAmount() {
    const type = (getNode("res-type")?.value || "").trim();
    const places = Number((getNode("res-places")?.value || "1").trim());
    const unitPrice = reservationPrices[type] || 0;
    const safePlaces = Number.isFinite(places) && places > 0 ? places : 1;
    return unitPrice * safePlaces;
}

function updateCommandAmount() {
    const amountNode = getNode("cmd-amount");
    if (!amountNode) return;
    const total = getCommandAmount();
    amountNode.value = total > 0 ? formatFcfa(total) : "";
}

function updateReservationAmount() {
    const amountNode = getNode("res-amount");
    if (!amountNode) return;
    const total = getReservationAmount();
    amountNode.value = total > 0 ? formatFcfa(total) : "";
}

function togglePaymentUi(prefix) {
    const method = (getNode(`${prefix}-payment-method`)?.value || "").trim();
    const numberField = getNode(`${prefix}-payment-number`);
    const ussdField = getNode(`${prefix}-payment-ussd`);
    const ussdHint = getNode(`${prefix}-ussd-hint`);
    const amount = prefix === "cmd" ? getCommandAmount() : getReservationAmount();

    if (numberField) {
        numberField.required = paymentNeedsNumber(method);
        numberField.placeholder = paymentNeedsNumber(method)
            ? "Numero mobile money (obligatoire)"
            : "Numero mobile money (optionnel)";
    }

    if (ussdField) {
        ussdField.classList.toggle("is-hidden", method !== "ussd");
    }

    if (ussdHint) {
        if (method === "ussd" && amount > 0) {
            ussdHint.textContent = `Exemple USSD: *145*1*NUMERO*${amount}#`;
            ussdHint.classList.remove("is-hidden");
        } else if (method === "ussd") {
            ussdHint.textContent = "Selectionnez d'abord le menu/type pour generer le code USSD.";
            ussdHint.classList.remove("is-hidden");
        } else {
            ussdHint.classList.add("is-hidden");
            ussdHint.textContent = "";
        }
    }
}

function setupOrderReservationForms() {
    const cmdForm = getNode("commande-form");
    const resForm = getNode("reservation-form");

    if (cmdForm) {
        getNode("cmd-day")?.addEventListener("change", () => {
            populateCommandFields();
            updateCommandAmount();
            togglePaymentUi("cmd");
        });
        getNode("cmd-item")?.addEventListener("change", () => {
            updateCommandAmount();
            togglePaymentUi("cmd");
        });
        getNode("cmd-qty")?.addEventListener("input", () => {
            updateCommandAmount();
            togglePaymentUi("cmd");
        });
        getNode("cmd-payment-method")?.addEventListener("change", () => togglePaymentUi("cmd"));
        updateCommandAmount();
        togglePaymentUi("cmd");

        cmdForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const status = getNode("cmd-status");

            const fullName = (getNode("cmd-fullname")?.value || "").trim();
            const email = (getNode("cmd-email")?.value || "").trim();
            const phone = (getNode("cmd-phone")?.value || "").trim();
            const day = (getNode("cmd-day")?.value || "").trim();
            const item = (getNode("cmd-item")?.value || "").trim();
            const qty = (getNode("cmd-qty")?.value || "1").trim();
            const note = (getNode("cmd-note")?.value || "").trim();
            const paymentMethod = (getNode("cmd-payment-method")?.value || "").trim();
            const paymentStatus = (getNode("cmd-payment-status")?.value || "").trim();
            const paymentNumber = (getNode("cmd-payment-number")?.value || "").trim();
            const paymentReference = (getNode("cmd-payment-ref")?.value || "").trim();
            const paymentUssdCode = (getNode("cmd-payment-ussd")?.value || "").trim();
            const paymentAmount = getCommandAmount();
            const consent = Boolean(getNode("cmd-consent")?.checked);

            if (!fullName || !email || !day || !item || !paymentMethod || !paymentStatus || !consent) {
                if (status) {
                    status.style.color = "#b91c1c";
                    status.textContent = "Veuillez remplir tous les champs obligatoires.";
                }
                return;
            }

            if (paymentNeedsNumber(paymentMethod) && !paymentNumber) {
                if (status) {
                    status.style.color = "#b91c1c";
                    status.textContent = "Le numero Mobile Money est obligatoire pour Mixx ou Flooz.";
                }
                return;
            }

            try {
                await submitToRegisterApi({
                    fullName,
                    email,
                    phone,
                    domain: "commande",
                    activityTitle: `Commande menu - ${day} - ${item}`,
                    sourcePage: "commande-menu",
                    message: `Commande repas: ${item} | Jour: ${day} | Quantite: ${qty} | Montant: ${formatFcfa(paymentAmount)} | Paiement: ${getPaymentLabel(paymentMethod)} | Statut: ${getPaymentStatusLabel(paymentStatus)}${paymentNumber ? ` | Numero paiement: ${paymentNumber}` : ""}${paymentReference ? ` | Ref transaction: ${paymentReference}` : ""}${paymentUssdCode ? ` | Code USSD: ${paymentUssdCode}` : ""}${note ? ` | Note: ${note}` : ""}`,
                    paymentMethod,
                    paymentStatus,
                    paymentNumber,
                    paymentReference,
                    paymentUssdCode,
                    paymentAmount,
                    consent
                });

                if (status) {
                    status.style.color = "#0b7a39";
                    status.textContent = "Commande enregistree avec succes.";
                }
                cmdForm.reset();
                if (getNode("cmd-qty")) getNode("cmd-qty").value = "1";
                updateCommandAmount();
                togglePaymentUi("cmd");
            } catch (error) {
                if (status) {
                    status.style.color = "#b91c1c";
                    status.textContent = error.message;
                }
            }
        });
    }

    if (resForm) {
        getNode("res-type")?.addEventListener("change", () => {
            updateReservationAmount();
            togglePaymentUi("res");
        });
        getNode("res-places")?.addEventListener("input", () => {
            updateReservationAmount();
            togglePaymentUi("res");
        });
        getNode("res-payment-method")?.addEventListener("change", () => togglePaymentUi("res"));
        updateReservationAmount();
        togglePaymentUi("res");

        resForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const status = getNode("res-status");

            const fullName = (getNode("res-fullname")?.value || "").trim();
            const email = (getNode("res-email")?.value || "").trim();
            const phone = (getNode("res-phone")?.value || "").trim();
            const type = (getNode("res-type")?.value || "").trim();
            const date = (getNode("res-date")?.value || "").trim();
            const time = (getNode("res-time")?.value || "").trim();
            const places = (getNode("res-places")?.value || "1").trim();
            const note = (getNode("res-note")?.value || "").trim();
            const paymentMethod = (getNode("res-payment-method")?.value || "").trim();
            const paymentStatus = (getNode("res-payment-status")?.value || "").trim();
            const paymentNumber = (getNode("res-payment-number")?.value || "").trim();
            const paymentReference = (getNode("res-payment-ref")?.value || "").trim();
            const paymentUssdCode = (getNode("res-payment-ussd")?.value || "").trim();
            const paymentAmount = getReservationAmount();
            const consent = Boolean(getNode("res-consent")?.checked);

            if (!fullName || !email || !type || !date || !time || !paymentMethod || !paymentStatus || !consent) {
                if (status) {
                    status.style.color = "#b91c1c";
                    status.textContent = "Veuillez remplir tous les champs obligatoires.";
                }
                return;
            }

            if (paymentNeedsNumber(paymentMethod) && !paymentNumber) {
                if (status) {
                    status.style.color = "#b91c1c";
                    status.textContent = "Le numero Mobile Money est obligatoire pour Mixx ou Flooz.";
                }
                return;
            }

            try {
                await submitToRegisterApi({
                    fullName,
                    email,
                    phone,
                    domain: "reservation",
                    activityTitle: `Reservation - ${type}`,
                    sourcePage: "reservation-cafe",
                    message: `Reservation ${type} | Date: ${date} | Heure: ${time} | Places: ${places} | Montant: ${formatFcfa(paymentAmount)} | Paiement: ${getPaymentLabel(paymentMethod)} | Statut: ${getPaymentStatusLabel(paymentStatus)}${paymentNumber ? ` | Numero paiement: ${paymentNumber}` : ""}${paymentReference ? ` | Ref transaction: ${paymentReference}` : ""}${paymentUssdCode ? ` | Code USSD: ${paymentUssdCode}` : ""}${note ? ` | Note: ${note}` : ""}`,
                    paymentMethod,
                    paymentStatus,
                    paymentNumber,
                    paymentReference,
                    paymentUssdCode,
                    paymentAmount,
                    consent
                });

                if (status) {
                    status.style.color = "#0b7a39";
                    status.textContent = "Reservation enregistree avec succes.";
                }
                resForm.reset();
                if (getNode("res-places")) getNode("res-places").value = "1";
                updateReservationAmount();
                togglePaymentUi("res");
            } catch (error) {
                if (status) {
                    status.style.color = "#b91c1c";
                    status.textContent = error.message;
                }
            }
        });
    }
}

function setupActiveNavHighlight() {
    const navLinks = Array.from(document.querySelectorAll("header nav a[href^='#']"));
    if (!navLinks.length) return;

    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    function setActiveById(id) {
        navLinks.forEach((link) => {
            const target = (link.getAttribute("href") || "").slice(1);
            link.classList.toggle("active", target === id);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) {
            setActiveById(visible[0].target.id);
        }
    }, {
        root: null,
        threshold: [0.35, 0.55, 0.75],
        rootMargin: "-20% 0px -55% 0px"
    });

    sections.forEach((section) => observer.observe(section));

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const targetId = (link.getAttribute("href") || "").slice(1);
            if (targetId) {
                setActiveById(targetId);
            }
        });
    });

    setActiveById("accueil");
}

function setupImpactAccordion() {
    const allDetails = Array.from(document.querySelectorAll(".impact-list details"));
    if (!allDetails.length) return;

    allDetails.forEach((current) => {
        current.addEventListener("toggle", () => {
            if (!current.open) return;
            allDetails.forEach((other) => {
                if (other !== current) {
                    other.open = false;
                }
            });
        });
    });
}

function setupOddActions() {
    const oddActionsMap = {
        odd4: {
            title: "ODD 4 - Actions prioritaires",
            actions: [
                "Parcours certifiants en entrepreneuriat pour etudiants et jeunes diplomes.",
                "Bootcamps pratiques avec mentorat et mise en situation reelle.",
                "Bibliotheque digitale de ressources professionnelles en acces direct."
            ]
        },
        odd5: {
            title: "ODD 5 - Actions prioritaires",
            actions: [
                "Programmes dedies a l'entrepreneuriat feminin et au leadership.",
                "Quotas de participation et suivi de performance par genre.",
                "Mentorat cible pour accelerer l'autonomisation economique des femmes."
            ]
        },
        odd8: {
            title: "ODD 8 - Actions prioritaires",
            actions: [
                "Incubation de startups orientees emploi et croissance locale.",
                "Renforcement des competences business, digitales et financieres.",
                "Mise en relation avec partenaires de financement et opportunites de marche."
            ]
        },
        odd9: {
            title: "ODD 9 - Actions prioritaires",
            actions: [
                "Soutien aux projets innovants (AgriTech, EduTech, HealthTech, e-services).",
                "Accompagnement a la digitalisation des TPE/PME.",
                "Promotion de solutions technologiques durables et adaptables."
            ]
        },
        odd17: {
            title: "ODD 17 - Actions prioritaires",
            actions: [
                "Partenariats operationnels avec Universite de Lome, PNUD et secteur prive.",
                "Co-construction de programmes avec incubateurs, ONG et institutions.",
                "Partage de ressources, expertise et reseaux pour augmenter l'impact."
            ]
        }
    };

    const chips = Array.from(document.querySelectorAll(".odd-chip"));
    const panel = getNode("odd-actions");
    const titleNode = getNode("odd-actions-title");
    const listNode = getNode("odd-actions-list");
    if (!chips.length || !titleNode || !listNode || !panel) return;

    let activeOdd = "";

    function renderOdd(key) {
        const model = oddActionsMap[key];
        if (!model) return;

        chips.forEach((chip) => chip.classList.toggle("active", chip.dataset.odd === key));
        titleNode.textContent = model.title;
        listNode.innerHTML = "";
        model.actions.forEach((line) => {
            const li = document.createElement("li");
            li.textContent = line;
            listNode.appendChild(li);
        });
        panel.classList.remove("is-hidden");
        activeOdd = key;
    }

    chips.forEach((chip) => {
        chip.addEventListener("click", () => {
            const key = chip.dataset.odd || "";
            if (activeOdd === key) {
                chip.classList.remove("active");
                panel.classList.add("is-hidden");
                activeOdd = "";
                return;
            }
            renderOdd(key);
        });
    });
}

function setupPnudActions() {
    const axisMap = {
        inclusion: {
            title: "Inclusion economique - Actions correspondantes",
            actions: [
                "Programmes de formation entrepreneuriale pour jeunes et femmes.",
                "Mentorat cible pour insertion economique et employabilite.",
                "Acces facilite aux opportunites de revenus et micro-activites."
            ]
        },
        innovation: {
            title: "Innovation & transformation digitale - Actions correspondantes",
            actions: [
                "Ateliers de digitalisation des modeles d'affaires.",
                "Accompagnement des startups sur outils numeriques de productivite.",
                "Visibilite en ligne, branding digital et strategie de croissance."
            ]
        },
        gouvernance: {
            title: "Gouvernance & leadership - Actions correspondantes",
            actions: [
                "Renforcement des capacites de gestion et de pilotage financier.",
                "Structuration de gouvernance pour startups et TPE/PME.",
                "Coaching leadership pour fondateurs et equipes dirigeantes."
            ]
        },
        partenariats: {
            title: "Partenariats multi-acteurs - Actions correspondantes",
            actions: [
                "Cooperation operationnelle avec institutions publiques et privees.",
                "Programmes conjoints avec incubateurs, ONG et partenaires techniques.",
                "Mobilisation de financements et d'expertises sectorielles."
            ]
        }
    };

    const cards = Array.from(document.querySelectorAll(".pnud-card[data-axis]"));
    const panel = getNode("pnud-actions");
    const titleNode = getNode("pnud-actions-title");
    const listNode = getNode("pnud-actions-list");
    if (!cards.length || !panel || !titleNode || !listNode) return;

    let activeAxis = "";

    function renderAxis(key) {
        const model = axisMap[key];
        if (!model) return;

        cards.forEach((card) => card.classList.toggle("active", card.dataset.axis === key));
        titleNode.textContent = model.title;
        listNode.innerHTML = "";
        model.actions.forEach((line) => {
            const li = document.createElement("li");
            li.textContent = line;
            listNode.appendChild(li);
        });
        panel.classList.remove("is-hidden");
        activeAxis = key;
    }

    cards.forEach((card) => {
        const button = card.querySelector(".pnud-connect");
        if (!button) return;

        button.addEventListener("click", () => {
            const key = card.dataset.axis || "";
            if (!key) return;
            if (activeAxis === key) {
                card.classList.remove("active");
                panel.classList.add("is-hidden");
                activeAxis = "";
                return;
            }
            renderAxis(key);
        });
    });
}

function setupKpiActions() {
    const kpiMap = {
        entrepreneurs: {
            title: "Entrepreneurs formes - Actions prioritaires",
            actions: [
                "Renforcer les cohortes de formation pratique sectorielle (digital, finance, operations).",
                "Etendre les parcours certifiants en partenariat avec experts metier et institutions.",
                "Augmenter les sessions de coaching individuel post-formation."
            ]
        },
        incubation: {
            title: "Startups incubees - Actions prioritaires",
            actions: [
                "Selection trimestrielle de nouvelles startups a fort potentiel.",
                "Programme d'incubation structure sur 6 a 9 mois avec mentorat.",
                "Mise en relation avec investisseurs et partenaires de marche."
            ]
        },
        femmes: {
            title: "Participation feminine - Actions prioritaires",
            actions: [
                "Bourses et facilitation d'acces pour entrepreneures et porteuses de projet.",
                "Mentorat feminin et clubs de leadership entrepreneurial.",
                "Suivi par indicateurs genre pour maintenir une progression durable."
            ]
        },
        partenaires: {
            title: "Partenaires actifs - Actions prioritaires",
            actions: [
                "Consolider les partenariats existants via plans annuels conjoints.",
                "Signer de nouveaux accords avec banques, ONG et acteurs tech.",
                "Mettre en place un cadre de contribution et de redevabilite commun."
            ]
        }
    };

    const cards = Array.from(document.querySelectorAll(".kpi-card[data-kpi]"));
    const titleNode = getNode("kpi-actions-title");
    const listNode = getNode("kpi-actions-list");
    if (!cards.length || !titleNode || !listNode) return;

    function renderKpi(key) {
        const model = kpiMap[key];
        if (!model) return;

        cards.forEach((card) => card.classList.toggle("active", card.dataset.kpi === key));
        titleNode.textContent = model.title;
        listNode.innerHTML = "";
        model.actions.forEach((line) => {
            const li = document.createElement("li");
            li.textContent = line;
            listNode.appendChild(li);
        });
    }

    cards.forEach((card) => {
        card.addEventListener("click", () => renderKpi(card.dataset.kpi));
    });

    renderKpi("entrepreneurs");
}

async function loadKpis() {
    try {
        const response = await fetch("/api/kpis");
        if (!response.ok) {
            throw new Error("KPI indisponibles");
        }

        const kpis = await response.json();
        Object.entries(kpis).forEach(([key, kpi]) => {
            const card = document.querySelector(`.kpi-card[data-kpi="${key}"]`);
            if (!card) return;

            const title = card.querySelector("h3");
            const value = card.querySelector(".kpi-value");
            const target = card.querySelector("small");
            const bar = card.querySelector(".kpi-bar span");

            const numericValue = Number(kpi.value) || 0;
            const numericTarget = Number(kpi.target) || 0;
            const ratio = numericTarget > 0 ? Math.max(0, Math.min((numericValue / numericTarget) * 100, 100)) : 0;

            if (title) title.textContent = kpi.title || key;
            if (value) value.textContent = kpi.displayValue || `${kpi.prefix || ""}${numericValue}${kpi.suffix || ""}`;
            if (target) target.textContent = `Objectif annuel: ${numericTarget}${kpi.targetSuffix || ""}`;
            if (bar) bar.style.width = `${ratio}%`;
        });
    } catch (_error) {
        // Keep server-rendered defaults if the API is unavailable.
    }
}

function setupCafeHashRouting() {
    function applyHashState() {
        const hash = (window.location.hash || "").toLowerCase();
        if (hash === "#menu-semaine") {
            showCafePanel("menu-semaine");
        } else if (hash === "#commande-reservation") {
            showCafePanel("commande-reservation");
        }
    }

    applyHashState();
    window.addEventListener("hashchange", applyHashState);
}

function setupMobileMenu() {
    const header = document.querySelector("header");
    const nav = getNode("main-nav");
    const toggle = getNode("menu-toggle");
    if (!header || !nav || !toggle) return;

    function closeMenu() {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Ouvrir le menu");
    }

    function openMenu() {
        header.classList.add("nav-open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Fermer le menu");
    }

    toggle.addEventListener("click", () => {
        const isOpen = header.classList.contains("nav-open");
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

function setupMobileAppQr() {
    const qrImage = document.getElementById("mobile-app-qr");
    const appLink = document.getElementById("mobile-app-link");
    const appNote = document.getElementById("mobile-app-note");

    if (!qrImage || !appLink) {
        return;
    }

    const appPort = qrImage.dataset.appPort || "5050";
    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    const hostname = window.location.hostname || "127.0.0.1";
    const targetUrl = `${protocol}//${hostname}:${appPort}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(targetUrl)}`;

    qrImage.src = qrUrl;
    appLink.href = targetUrl;
    appLink.textContent = `Ouvrir l'application web: ${targetUrl}`;

    if (!appNote) {
        return;
    }

    if (hostname === "localhost" || hostname === "127.0.0.1") {
        appNote.textContent = "Pour scanner depuis un telephone, ouvrez d'abord ce site avec l'IP locale du PC, par exemple http://192.168.x.x:3000.";
        return;
    }

    appNote.textContent = `Scan local pret: connectez votre telephone au meme reseau Wi-Fi et ouvrez ${targetUrl}.`;
}

window.openRegistrationForm = openRegistrationForm;
window.scrollToSection = scrollToSection;
window.voirMenuCafe = voirMenuCafe;
window.reserverPlace = reserverPlace;
window.rejoindreCafe = rejoindreCafe;

loadData();
loadMenus();
renderPartners();
renderCafe();
hideCafePanels();
setupOrderReservationForms();
setupImpactAccordion();
setupOddActions();
setupPnudActions();
setupKpiActions();
loadKpis();
setupCafeHashRouting();
setupActiveNavHighlight();
setupMobileMenu();
setupMobileAppQr();


// Gestion du dropdown menu
function initDropdown() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');

    if (!dropdown || !dropdownToggle) return;

    // Gestion du clic sur mobile
    dropdownToggle.addEventListener('click', function (e) {
        if (window.innerWidth <= 900) {
            e.preventDefault();
            dropdown.classList.toggle('is-open');
        }
    });

    // Fermer le dropdown quand on clique ailleurs
    document.addEventListener('click', function (e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('is-open');
        }
    });
}

// Initialiser le dropdown au chargement
document.addEventListener('DOMContentLoaded', initDropdown);
