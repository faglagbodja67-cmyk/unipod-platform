// Gestion des vidéos pour l'admin
const API_URL = '/api/videos';

// Charger les vidéos
async function loadVideos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erreur chargement');

        const videos = await response.json();
        renderVideos(videos);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('videos-container').innerHTML =
            '<p>Erreur de chargement. Vérifiez votre connexion.</p>';
    }
}

// Afficher les vidéos
function renderVideos(videos) {
    const container = document.getElementById('videos-container');

    if (videos.length === 0) {
        container.innerHTML = '<p>Aucune vidéo enregistrée.</p>';
        return;
    }

    container.innerHTML = videos.map(video => `
        <div class="video-item" data-id="${video.id}">
            <div class="video-info">
                <h4>${escapeHtml(video.title)}</h4>
                <small>Catégorie: ${video.category} | ID: ${video.id}</small>
            </div>
            <div>
                <button class="preview-btn" onclick="previewVideo('${video.embedUrl}')">Aperçu</button>
                <button class="btn-danger" onclick="deleteVideo(${video.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// Échapper le HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Ajouter une vidéo
document.getElementById('video-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('video-title').value.trim();
    const embedUrl = document.getElementById('video-url').value.trim();
    const category = document.getElementById('video-category').value;

    // Validation URL YouTube
    if (!embedUrl.includes('youtube.com/embed/')) {
        alert('URL invalide. Utilisez le format: https://www.youtube.com/embed/VIDEO_ID');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ title, embedUrl, category })
        });

        if (response.status === 401) {
            alert('Session expirée. Veuillez vous reconnecter.');
            window.location.href = '/admin-login';
            return;
        }

        if (!response.ok) throw new Error('Erreur ajout');

        // Reset form et recharger
        document.getElementById('video-form').reset();
        loadVideos();
        alert('Vidéo ajoutée avec succès !');

    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'ajout. Réessayez.');
    }
});

// Supprimer une vidéo
async function deleteVideo(id) {
    if (!confirm('Supprimer cette vidéo ?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.status === 401) {
            alert('Session expirée.');
            window.location.href = '/admin-login';
            return;
        }

        if (!response.ok) throw new Error('Erreur suppression');

        loadVideos();
        alert('Vidéo supprimée !');

    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression.');
    }
}

// Aperçu vidéo
function previewVideo(url) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 1000;
    `;
    modal.innerHTML = `
        <div style="position: relative; max-width: 800px; width: 90%;">
            <button onclick="this.closest('.modal').remove()" 
                style="position: absolute; top: -40px; right: 0; 
                background: white; border: none; padding: 8px 16px; 
                cursor: pointer; border-radius: 4px;">Fermer ✕</button>
            <iframe src="${url}" width="100%" height="450" 
                frameborder="0" allowfullscreen></iframe>
        </div>
    `;
    modal.className = 'modal';
    document.body.appendChild(modal);
}

// Déconnexion
document.getElementById('logout-btn').addEventListener('click', async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin-login';
});

// Charger au démarrage
document.addEventListener('DOMContentLoaded', loadVideos);