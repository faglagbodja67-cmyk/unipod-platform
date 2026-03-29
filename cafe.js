function byId(id) {
    return document.getElementById(id);
}

const fallbackMenus = [
    { day: "Lundi", items: [{ name: "Pinon au poisson" }, { name: "Riz curie + viande de boeuf" }] },
    { day: "Mardi", items: [{ name: "Riz banc + sauce de mouton" }, { name: "Patte de mais + Gboma" }] },
    { day: "Mercredi", items: [{ name: "Petit poids a la viande + saucisse" }, { name: "Couscous au gras + poulets" }] },
    { day: "Jeudi", items: [{ name: "Frites au poulet" }, { name: "Spaghetti a la boulette de viande" }] },
    { day: "Vendredi", items: [{ name: "Riz au gras + poulet braise" }, { name: "Pate rouge + poisson" }] }
];

function renderMenus(menus) {
    const container = byId("cafe-menu-grid");
    if (!container) return;

    container.innerHTML = "";
    menus.forEach((dayMenu) => {
        const article = document.createElement("article");
        const title = document.createElement("strong");
        title.textContent = dayMenu.day;
        const details = document.createElement("span");
        details.textContent = (dayMenu.items || []).map((item) => item.name).join(" / ");
        article.appendChild(title);
        article.appendChild(details);
        container.appendChild(article);
    });
}

async function loadMenus() {
    try {
        const response = await fetch("/api/menus");
        if (!response.ok) {
            throw new Error("API menus indisponible");
        }

        const menus = await response.json();
        renderMenus(Array.isArray(menus) && menus.length > 0 ? menus : fallbackMenus);
    } catch (_error) {
        renderMenus(fallbackMenus);
    }
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
}

function setupReservationForm() {
    const form = byId("reservation-form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = byId("res-status");

        const fullName = (byId("res-fullname")?.value || "").trim();
        const email = (byId("res-email")?.value || "").trim();
        const phone = (byId("res-phone")?.value || "").trim();
        const date = (byId("res-date")?.value || "").trim();
        const time = (byId("res-time")?.value || "").trim();
        const places = (byId("res-places")?.value || "1").trim();
        const note = (byId("res-note")?.value || "").trim();
        const consent = Boolean(byId("res-consent")?.checked);

        if (!fullName || !email || !date || !time || !consent) {
            if (status) {
                status.style.color = "#b91c1c";
                status.textContent = "Veuillez remplir tous les champs obligatoires.";
            }
            return;
        }

        try {
            await submitToRegisterApi({
                fullName,
                email,
                phone,
                domain: "reservation",
                activityTitle: "Réservation Espace Café",
                sourcePage: "cafe-reservation",
                message: `Réservation | Date: ${date} | Heure: ${time} | Places: ${places}${note ? ` | Note: ${note}` : ""}`,
                consent
            });

            if (status) {
                status.style.color = "#0b7a39";
                status.textContent = "Réservation enregistrée avec succès.";
            }
            form.reset();
            if (byId("res-places")) byId("res-places").value = "1";
        } catch (error) {
            if (status) {
                status.style.color = "#b91c1c";
                status.textContent = error.message;
            }
        }
    });
}

function setupJoinForm() {
    const form = byId("join-form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = byId("join-status");

        const fullName = (byId("join-fullname")?.value || "").trim();
        const email = (byId("join-email")?.value || "").trim();
        const phone = (byId("join-phone")?.value || "").trim();
        const interest = (byId("join-interest")?.value || "").trim();
        const note = (byId("join-note")?.value || "").trim();
        const consent = Boolean(byId("join-consent")?.checked);

        if (!fullName || !email || !interest || !consent) {
            if (status) {
                status.style.color = "#b91c1c";
                status.textContent = "Veuillez remplir tous les champs obligatoires.";
            }
            return;
        }

        try {
            await submitToRegisterApi({
                fullName,
                email,
                phone,
                domain: "cafe",
                activityTitle: `Rejoindre Espace Café - ${interest}`,
                sourcePage: "cafe-join",
                message: note || "Demande d'adhésion à l'Espace Café.",
                consent
            });

            if (status) {
                status.style.color = "#0b7a39";
                status.textContent = "Demande envoyée avec succès.";
            }
            form.reset();
        } catch (error) {
            if (status) {
                status.style.color = "#b91c1c";
                status.textContent = error.message;
            }
        }
    });
}

setupReservationForm();
setupJoinForm();
loadMenus();
