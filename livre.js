function getBookIdFromUrl() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const maybeId = parts[parts.length - 1];
    const id = decodeURIComponent(String(maybeId || "").trim());
    return id || null;
}

function renderBook(book) {
    const head = document.getElementById("reader-head");
    const content = document.getElementById("reader-content");

    head.innerHTML = `
        <h1>${book.title}</h1>
        <p><strong>Auteur:</strong> ${book.author}</p>
        <p><strong>Theme:</strong> ${book.theme} | <strong>Niveau:</strong> ${book.level} | <strong>Annee:</strong> ${book.year}</p>
    `;

    const chaptersHtml = book.reading.chapters.map((chapter) => `
        <article class="chapter">
            <h3>${chapter.title}</h3>
            <p>${chapter.content}</p>
        </article>
    `).join("");

    const keyPointsHtml = book.reading.keyPoints.map((point) => `<li>${point}</li>`).join("");

    content.innerHTML = `
        <p>${book.reading.intro}</p>
        ${chaptersHtml}
        <h3>Points cles</h3>
        <ul class="key-points">${keyPointsHtml}</ul>
    `;
}

async function loadBook() {
    const content = document.getElementById("reader-content");
    content.innerHTML = '<p class="loading">Chargement du livre...</p>';

    const id = getBookIdFromUrl();
    if (!id) {
        content.innerHTML = '<p class="error">Identifiant livre invalide.</p>';
        return;
    }

    try {
        const response = await fetch(`/api/library/books/${id}`);
        if (!response.ok) {
            throw new Error("Livre introuvable");
        }

        const book = await response.json();
        renderBook(book);
    } catch (error) {
        content.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

loadBook();
