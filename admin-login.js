const form = document.getElementById("admin-login-form");
const statusNode = document.getElementById("login-status");
const loginBtn = document.getElementById("login-btn");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setLoading(isLoading) {
    if (!loginBtn) return;
    loginBtn.disabled = isLoading;
    loginBtn.textContent = isLoading ? "Connexion..." : "Se connecter";
}

async function checkExistingSession() {
    try {
        const response = await fetch("/api/admin/session");
        if (response.ok) {
            window.location.href = "/admin";
        }
    } catch (_error) {
        // Ignore silent session check errors
    }
}

async function onSubmit(event) {
    event.preventDefault();
    if (!form || !statusNode) return;

    statusNode.textContent = "";
    statusNode.className = "status";

    const payload = {
        email: form.email.value.trim(),
        password: form.password.value
    };

    if (!payload.email || !payload.password) {
        statusNode.textContent = "Merci de renseigner email et mot de passe.";
        statusNode.className = "status error";
        return;
    }

    if (!emailPattern.test(payload.email)) {
        statusNode.textContent = "Adresse email invalide.";
        statusNode.className = "status error";
        return;
    }

    setLoading(true);

    try {
        const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.error || "Connexion refusee.");
        }

        window.location.href = "/admin";
    } catch (error) {
        statusNode.textContent = error.message;
        statusNode.className = "status error";
    } finally {
        setLoading(false);
    }
}

if (form && statusNode && loginBtn) {
    checkExistingSession();
    form.addEventListener("submit", onSubmit);
}
