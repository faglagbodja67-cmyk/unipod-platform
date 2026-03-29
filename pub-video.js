const fallbackVideos = [
    { title: "Spot institutionnel", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { title: "Temoignage startup", embedUrl: "https://www.youtube.com/embed/ysz5S6PUM-U" },
    { title: "Aftermovie evenement", embedUrl: "https://www.youtube.com/embed/jNQXAC9IVRw" }
];

function openRegistrationFromVideo(title) {
    const params = new URLSearchParams({
        domain: "videos",
        activity: title,
        source: "pub-video"
    });

    window.location.href = `/inscription?${params.toString()}`;
}

function renderVideos(videos) {
    const container = document.getElementById("videos");
    container.innerHTML = "";

    videos.forEach((video) => {
        const card = document.createElement("article");
        card.className = "video-card";

        const title = document.createElement("h3");
        title.textContent = video.title;

        const frame = document.createElement("iframe");
        frame.src = video.embedUrl;
        frame.title = video.title;
        frame.loading = "lazy";
        frame.allowFullscreen = true;

        const button = document.createElement("button");
        button.className = "video-register-btn";
        button.textContent = "S'inscrire à cette activité";
        button.addEventListener("click", () => openRegistrationFromVideo(video.title));

        card.appendChild(title);
        card.appendChild(frame);
        card.appendChild(button);
        container.appendChild(card);
    });
}

async function loadVideos() {
    try {
        const response = await fetch("/api/videos");
        if (!response.ok) {
            throw new Error("API videos indisponible");
        }

        const videos = await response.json();
        renderVideos(videos);
    } catch (error) {
        renderVideos(fallbackVideos);
        console.warn("Mode fallback videos actif: backend indisponible.");
    }
}

loadVideos();
