const requestForm = document.getElementById("request-form");
const confirmForm = document.getElementById("confirm-form");
const statusNode = document.getElementById("reset-status");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showStatus(message, isError = false) {
    if (!statusNode) return;
    statusNode.textContent = message;
    statusNode.className = isError ? "status error" : "status";
}

async function onRequestReset(event) {
    event.preventDefault();
    const emailInput = document.getElementById("request-email");
    const email = emailInput ? emailInput.value.trim() : "";

    if (!email) {
        showStatus("Merci d'indiquer un email.", true);
        return;
    }

    if (!emailPattern.test(email)) {
        showStatus("Adresse email invalide.", true);
        return;
    }

    try {
        const response = await fetch("/api/admin/request-reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(body.error || "Impossible de generer le code");
        }

        const confirmEmail = document.getElementById("confirm-email");
        const resetCode = document.getElementById("reset-code");
        if (confirmEmail) confirmEmail.value = email;

        if (body.resetCode) {
            if (resetCode) resetCode.value = body.resetCode;
            showStatus(`Mode dev: code genere ${body.resetCode}. Configurez SMTP pour l'envoi email.`);
        } else {
            showStatus(body.message || "Code envoye par email.");
        }
    } catch (error) {
        showStatus(error.message, true);
    }
}

async function onConfirmReset(event) {
    event.preventDefault();

    const payload = {
        email: (document.getElementById("confirm-email")?.value || "").trim(),
        code: (document.getElementById("reset-code")?.value || "").trim(),
        newPassword: document.getElementById("new-password")?.value || ""
    };

    if (!emailPattern.test(payload.email)) {
        showStatus("Adresse email invalide.", true);
        return;
    }

    if (!payload.code || !payload.newPassword) {
        showStatus("Code et mot de passe sont obligatoires.", true);
        return;
    }

    try {
        const response = await fetch("/api/admin/confirm-reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(body.error || "Echec de reinitialisation");
        }

        showStatus("Mot de passe reinitialise. Vous pouvez maintenant vous connecter.");
        confirmForm.reset();
    } catch (error) {
        showStatus(error.message, true);
    }
}

if (requestForm && confirmForm && statusNode) {
    requestForm.addEventListener("submit", onRequestReset);
    confirmForm.addEventListener("submit", onConfirmReset);
}
