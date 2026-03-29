const MENUS_API = "/api/menus";

function byId(id) {
    return document.getElementById(id);
}

function formatFcfa(value) {
    return `${Number(value || 0).toLocaleString("fr-FR")} FCFA`;
}

function setStatus(message, isError = false) {
    const node = byId("menu-status");
    if (!node) return;
    node.textContent = message;
    node.style.color = isError ? "#b91c1c" : "#0b7a39";
}

async function loadMenus() {
    const container = byId("menus-container");
    if (!container) return;

    try {
        const response = await fetch(MENUS_API, { credentials: "include" });
        if (!response.ok) {
            throw new Error("Impossible de charger les menus.");
        }

        const menus = await response.json();
        if (!Array.isArray(menus) || menus.length === 0) {
            container.innerHTML = "<p class='empty'>Aucun menu enregistre.</p>";
            return;
        }

        container.innerHTML = menus.map((dayMenu) => `
            <section class="menu-day">
                <h3>${dayMenu.day}</h3>
                ${(dayMenu.items || []).map((item) => `
                    <div class="menu-item-row">
                        <div>
                            <strong>${item.name}</strong><br>
                            <span>${formatFcfa(item.price)}</span>
                        </div>
                        <button class="btn-danger" type="button" data-day="${dayMenu.day}" data-id="${item.id}">Supprimer</button>
                    </div>
                `).join("")}
            </section>
        `).join("");

        container.querySelectorAll(".btn-danger").forEach((button) => {
            button.addEventListener("click", async () => {
                const day = button.getAttribute("data-day");
                const id = button.getAttribute("data-id");
                await deleteMenuItem(day, id);
            });
        });
    } catch (error) {
        container.innerHTML = `<p class='empty'>${error.message}</p>`;
    }
}

async function deleteMenuItem(day, id) {
    if (!confirm("Supprimer ce plat du menu ?")) {
        return;
    }

    const response = await fetch(`${MENUS_API}/${encodeURIComponent(day)}/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (response.status === 401) {
        window.location.href = "/admin-login";
        return;
    }

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Suppression impossible.");
    }

    setStatus("Plat supprime avec succes.");
    await loadMenus();
}

byId("menu-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const day = byId("menu-day")?.value || "";
    const name = byId("menu-name")?.value.trim() || "";
    const price = Number(byId("menu-price")?.value || 0);
    const imageUrl = byId("menu-image")?.value.trim() || "";

    try {
        const response = await fetch(MENUS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                day,
                name,
                price,
                currency: "FCFA",
                imageUrl
            })
        });

        if (response.status === 401) {
            window.location.href = "/admin-login";
            return;
        }

        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.error || "Ajout impossible.");
        }

        byId("menu-form")?.reset();
        setStatus("Plat ajoute avec succes.");
        await loadMenus();
    } catch (error) {
        setStatus(error.message, true);
    }
});

byId("logout-btn")?.addEventListener("click", async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin-login";
});

loadMenus();
