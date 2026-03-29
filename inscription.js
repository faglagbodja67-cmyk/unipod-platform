const form = document.getElementById("registration-form");
const statusNode = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const messageInput = document.getElementById("message");
const messageCount = document.getElementById("message-count");

const errorFields = [
    "fullName",
    "email",
    "phone",
    "domain",
    "activityTitle",
    "message",
    "consent"
];

function setError(fieldId, message) {
    const errorNode = document.getElementById(`${fieldId}-error`);
    if (errorNode) {
        errorNode.textContent = message || "";
    }
}

function clearErrors() {
    errorFields.forEach((id) => setError(id, ""));
}

function fillFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const domain = params.get("domain") || "autre";
    const activity = params.get("activity") || "";
    const source = params.get("source") || "";

    document.getElementById("domain").value = domain;
    document.getElementById("activityTitle").value = activity;
    document.getElementById("sourcePage").value = source;
}

function validate(payload) {
    let ok = true;

    if (!payload.fullName || payload.fullName.length < 3) {
        setError("fullName", "Merci d'indiquer un nom complet valide (3 caractères min).");
        ok = false;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
    if (!emailOk) {
        setError("email", "Adresse email invalide.");
        ok = false;
    }

    if (payload.phone && !/^[+0-9\s-]{7,20}$/.test(payload.phone)) {
        setError("phone", "Format téléphone invalide.");
        ok = false;
    }

    if (!payload.domain) {
        setError("domain", "Sélectionnez un domaine d'activité.");
        ok = false;
    }

    if (!payload.message || payload.message.length < 10) {
        setError("message", "Merci de préciser votre demande (10 caractères min).");
        ok = false;
    }

    if (!payload.consent) {
        setError("consent", "Le consentement est obligatoire pour envoyer le formulaire.");
        ok = false;
    }

    return ok;
}

function updateCounter() {
    const currentLength = messageInput.value.length;
    messageCount.textContent = `${currentLength} / 600`;
}

function setSubmitting(isSubmitting) {
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? "Envoi en cours..." : "Envoyer l'inscription";
}

async function onSubmit(event) {
    event.preventDefault();
    clearErrors();

    const payload = {
        fullName: form.fullName.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        organization: form.organization.value.trim(),
        domain: form.domain.value,
        activityTitle: form.activityTitle.value.trim(),
        sourcePage: form.sourcePage.value.trim(),
        message: form.message.value.trim(),
        consent: form.consent.checked
    };

    if (!validate(payload)) {
        statusNode.textContent = "Le formulaire contient des erreurs. Merci de vérifier les champs.";
        statusNode.className = "status error";
        return;
    }

    setSubmitting(true);

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.error || "Erreur inconnue");
        }

        statusNode.textContent = "Inscription enregistrée avec succès. Elle apparaît dans le tableau admin.";
        statusNode.className = "status success";
        form.reset();
        fillFromQuery();
        updateCounter();
    } catch (error) {
        statusNode.textContent = `Erreur: ${error.message}`;
        statusNode.className = "status error";
    } finally {
        setSubmitting(false);
    }
}

fillFromQuery();
updateCounter();
messageInput.addEventListener("input", updateCounter);
form.addEventListener("submit", onSubmit);
