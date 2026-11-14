(() => {
  const galleryEl = document.getElementById("gallery");
  const videosEl = document.getElementById("videos-list");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxText = document.getElementById("lightbox-text");

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  };

  const observeReveal = () => {
    const items = document.querySelectorAll(".gallery-item, .video-card");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  };

  const openLightbox = (src, title, caption) => {
    lightboxImg.src = src;
    lightboxImg.alt = title || "";
    lightboxTitle.textContent = title || "";
    lightboxText.textContent = caption || "";
    if (typeof lightbox.showModal === "function") lightbox.showModal();
  };

  document.querySelector(".lightbox-close")?.addEventListener("click", () => {
    lightbox.close();
  });

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  const renderFotos = (fotos = []) => {
    galleryEl.innerHTML = "";
    if (!fotos.length) {
      galleryEl.innerHTML =
        '<p class="about-note">Nenhuma foto no manifesto ainda. Edite <code>media/manifest.json</code>.</p>';
      return;
    }

    fotos.forEach((foto) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-item";
      btn.setAttribute("role", "listitem");

      const src = `media/fotos/${foto.arquivo}`;
      const img = document.createElement("img");
      img.loading = "lazy";
      img.alt = foto.titulo || "Foto da pesquisa";
      img.src = src;
      img.onerror = () => {
        img.remove();
        const ph = document.createElement("div");
        ph.className = "gallery-ph";
        ph.textContent = `Adicione o arquivo media/fotos/${foto.arquivo}`;
        btn.prepend(ph);
      };

      const meta = document.createElement("div");
      meta.className = "gallery-meta";
      meta.innerHTML = `<strong>${foto.titulo || "Sem título"}</strong><span>${
        foto.legenda || ""
      }</span>`;

      btn.append(img, meta);
      btn.addEventListener("click", () => {
        if (btn.querySelector("img")) {
          openLightbox(src, foto.titulo, foto.legenda);
        }
      });
      galleryEl.appendChild(btn);
    });
  };

  const renderVideos = (videos = []) => {
    videosEl.innerHTML = "";
    if (!videos.length) {
      videosEl.innerHTML =
        '<p class="about-note">Nenhum vídeo no manifesto ainda. Edite <code>media/manifest.json</code>.</p>';
      return;
    }

    videos.forEach((video) => {
      const card = document.createElement("article");
      card.className = "video-card";

      const frame = document.createElement("div");
      frame.className = "video-frame";

      if (video.tipo === "youtube" && video.id) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
          video.id
        )}`;
        iframe.title = video.titulo || "Vídeo";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.loading = "lazy";
        frame.appendChild(iframe);
      } else if (video.tipo === "arquivo" && video.arquivo) {
        const el = document.createElement("video");
        el.controls = true;
        el.preload = "metadata";
        el.src = `media/videos/${video.arquivo}`;
        frame.appendChild(el);
      } else {
        const empty = document.createElement("div");
        empty.className = "video-empty";
        empty.textContent =
          "Configure o vídeo em media/manifest.json (ID do YouTube ou arquivo local).";
        frame.appendChild(empty);
      }

      const title = document.createElement("h3");
      title.textContent = video.titulo || "Vídeo";
      const caption = document.createElement("p");
      caption.textContent = video.legenda || "";

      card.append(frame, title, caption);
      videosEl.appendChild(card);
    });
  };

  const onScrollHeader = () => {
    const header = document.querySelector(".site-header");
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  fetch("media/manifest.json")
    .then((res) => {
      if (!res.ok) throw new Error("Falha ao carregar manifesto");
      return res.json();
    })
    .then((data) => {
      document.title = `${data.titulo || "Olhares"} — Pesquisa Fotográfica`;
      setText("hero-title", (data.titulo || "Olhares").split("—")[0].trim());
      setText("hero-sub", data.subtitulo);
      setText("hero-local", data.local || "Projeto extensionista");
      setText("sobre-texto", data.sobre);
      setText("footer-brand", (data.titulo || "Olhares").split("—")[0].trim());
      setText("footer-local", data.local);
      renderFotos(data.fotos || []);
      renderVideos(data.videos || []);
      observeReveal();
    })
    .catch(() => {
      setText(
        "sobre-texto",
        "Não foi possível carregar media/manifest.json. Verifique o arquivo e publique novamente."
      );
      observeReveal();
    });
})();
