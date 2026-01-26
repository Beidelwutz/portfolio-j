/* Mobil-Navigation: Hamburger öffnen/schließen */
const siteHeader = document.getElementById("site-header");
const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.getElementById("site-nav");
const navOverlay = document.querySelector("[data-nav-overlay]");

function openNav() {
  if (!siteHeader || !navToggle || !siteNav) return;
  siteHeader.classList.add("is-menu-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Menü schließen");
  document.body.style.overflow = "hidden";
}

function closeNav() {
  if (!siteHeader || !navToggle || !siteNav) return;
  siteHeader.classList.remove("is-menu-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Menü öffnen");
  document.body.style.overflow = "";
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const open = siteHeader?.classList.contains("is-menu-open");
    if (open) closeNav();
    else openNav();
  });
}

if (navOverlay) {
  navOverlay.addEventListener("click", closeNav);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && siteHeader?.classList.contains("is-menu-open")) {
    closeNav();
  }
});

siteNav?.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    closeNav();
  });
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealElements = document.querySelectorAll("[data-reveal]");
if (!prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("is-visible"));
}

function formatCount(value) {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`.replace(".0", "");
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}k`.replace(".0", "");
  return `${value}`;
}

function countUpInCard(card) {
  if (prefersReducedMotion) return;
  const viewsEl = card.querySelector(".stats-badge--views .stats-badge__count[data-value]");
  const likesEl = card.querySelector(".stats-badge--likes .stats-badge__count[data-value]");
  if (!viewsEl && !likesEl) return;

  const viewTarget = viewsEl ? parseInt(viewsEl.getAttribute("data-value"), 10) : 0;
  const likeTarget = likesEl ? parseInt(likesEl.getAttribute("data-value"), 10) : 0;
  if (!Number.isFinite(viewTarget) && !Number.isFinite(likeTarget)) return;

  card._countUpRunId = (card._countUpRunId || 0) + 1;
  const runId = card._countUpRunId;
  if (viewsEl) viewsEl.textContent = "0";
  if (likesEl) likesEl.textContent = "0";

  const duration = 1100;
  const start = performance.now();
  let lastViewsDisplay = "";
  let lastLikesDisplay = "";

  const tick = (now) => {
    if (runId !== card._countUpRunId) return;
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - t) * (1 - t) * (1 - t);

    if (viewsEl && Number.isFinite(viewTarget)) {
      const current = Math.round(viewTarget * eased);
      const display = formatCount(current);
      if (display !== lastViewsDisplay) {
        lastViewsDisplay = display;
        viewsEl.textContent = display;
      }
      if (t >= 1) viewsEl.textContent = formatCount(viewTarget);
    }
    if (likesEl && Number.isFinite(likeTarget)) {
      const current = Math.round(likeTarget * eased);
      const display = formatCount(current);
      if (display !== lastLikesDisplay) {
        lastLikesDisplay = display;
        likesEl.textContent = display;
      }
      if (t >= 1) likesEl.textContent = formatCount(likeTarget);
    }

    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const enableScrollBadges = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const statsCards = document.querySelectorAll(".portfolio-card");
const featuredCards = document.querySelectorAll(".featured-projects .portfolio-card");

// Featured projects: count up every time they scroll into view
if (featuredCards.length) {
  const featuredObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Reset to 0 first, then count up after a short delay
          const viewsEl = entry.target.querySelector(".stats-badge--views .stats-badge__count[data-value]");
          const likesEl = entry.target.querySelector(".stats-badge--likes .stats-badge__count[data-value]");
          if (viewsEl) viewsEl.textContent = "0";
          if (likesEl) likesEl.textContent = "0";
          
          // Small delay so user sees it start from 0
          setTimeout(() => {
            countUpInCard(entry.target);
          }, 150);
        }
      });
    },
    { threshold: 0.4 }
  );
  featuredCards.forEach((card) => featuredObserver.observe(card));
}

// Regular portfolio cards: scroll badges on mobile only
if (enableScrollBadges && statsCards.length) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-active");
          countUpInCard(entry.target);
        } else {
          entry.target.classList.remove("is-active");
        }
      });
    },
    { threshold: 0.4 }
  );

  statsCards.forEach((card) => statsObserver.observe(card));
}

// Regular cards: count up on hover
statsCards.forEach((card) => {
  if (!card.closest(".featured-projects")) {
    card.addEventListener("mouseenter", () => countUpInCard(card));
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId.length <= 1) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Home Progress – aktiver Abschnitt beim Scrollen (Startseite)
const homeProgress = document.querySelector(".home-progress");
if (homeProgress) {
  const homeSections = document.querySelectorAll("#main > section[id]");
  const homeProgressItems = homeProgress.querySelectorAll(".home-progress__item");

  if (homeSections.length > 0 && homeProgressItems.length > 0) {
    const homeProgressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            homeProgressItems.forEach((item) => {
              const isMatch = item.dataset.section === sectionId;
              item.classList.toggle("is-active", isMatch);
            });
          }
        });
      },
      { threshold: 0.15, rootMargin: "-10% 0px -70% 0px" }
    );

    homeSections.forEach((section) => homeProgressObserver.observe(section));
  }
}

const lightboxOverlay = document.querySelector("[data-lightbox-overlay]");
const lightboxMedia = document.querySelector("[data-lightbox-media]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

const openLightbox = (title, type, imageSrc) => {
  if (!lightboxOverlay || !lightboxMedia || !lightboxTitle) return;
  lightboxMedia.innerHTML = "";
  
  if (type === "image" && imageSrc) {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = title;
    img.className = "lightbox-image";
    lightboxMedia.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "lightbox-placeholder";
    placeholder.textContent = type === "video" ? "Video-Clip Vorschau" : "Foto Vorschau";
    lightboxMedia.appendChild(placeholder);
  }
  
  lightboxTitle.textContent = title;
  lightboxOverlay.removeAttribute("hidden");
};

const closeLightbox = () => {
  if (!lightboxOverlay) return;
  lightboxOverlay.setAttribute("hidden", "true");
};

document.querySelectorAll("[data-lightbox], [data-link]").forEach((card) => {
  card.addEventListener("click", () => {
    // Skip if this is a short content player
    if (card.hasAttribute("data-short-player")) return;
    
    const link = card.getAttribute("data-link");
    if (link) {
      window.location.href = link;
      return;
    }
    const title = card.getAttribute("data-title") ?? "Projekt";
    const type = card.getAttribute("data-type") ?? "image";
    const img = card.querySelector("img[data-full]");
    const imageSrc = img?.getAttribute("data-full") || img?.src;
    openLightbox(title, type, imageSrc);
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxOverlay?.addEventListener("click", (event) => {
  if (event.target === lightboxOverlay) closeLightbox();
});

const contactForm = document.querySelector("[data-contact]");
if (contactForm) {
  const button = contactForm.querySelector("button");
  button?.addEventListener("click", () => {
    const name = contactForm.querySelector('input[name="name"]')?.value ?? "";
    const email = contactForm.querySelector('input[name="email"]')?.value ?? "";
    const message = contactForm.querySelector('textarea[name="message"]')?.value ?? "";
    const target = contactForm.getAttribute("data-email") ?? "";
    const subject = encodeURIComponent("Portfolio Anfrage");
    const body = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\n${message}`);
    if (!target) return;
    window.location.href = `mailto:${target}?subject=${subject}&body=${body}`;
  });
}

/* Short Content Video Player */
const shortPlayers = document.querySelectorAll("[data-short-player]");

shortPlayers.forEach((card) => {
  const video = card.querySelector(".short-video");
  const playBtn = card.querySelector(".short-play-btn");
  const muteBtn = card.querySelector(".short-mute-btn");
  const progressBar = card.querySelector(".short-progress__bar");
  
  if (!video) return;
  
  let isHovering = false;
  let isTouchDevice = "ontouchstart" in window;
  
  // Update progress bar
  const updateProgress = () => {
    if (video.duration) {
      const percent = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${percent}%`;
    }
  };
  
  video.addEventListener("timeupdate", updateProgress);
  
  // Desktop: Hover to play
  if (!isTouchDevice) {
    card.addEventListener("mouseenter", () => {
      isHovering = true;
      video.play().catch(() => {});
      card.classList.add("is-playing");
    });
    
    card.addEventListener("mouseleave", () => {
      isHovering = false;
      video.pause();
      video.currentTime = 0;
      card.classList.remove("is-playing");
      progressBar.style.width = "0%";
    });
  }
  
  // Play button click (mobile)
  playBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (video.paused) {
      video.play().catch(() => {});
      card.classList.add("is-playing");
    } else {
      video.pause();
      card.classList.remove("is-playing");
    }
  });
  
  // Mute button click
  muteBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    card.classList.toggle("is-unmuted", !video.muted);
  });
  
  // Handle card clicks
  card.addEventListener("click", (e) => {
    // Always prevent default behavior (no lightbox)
    e.stopPropagation();
    e.preventDefault();
    
    // Only handle if not clicking on buttons
    if (e.target.closest(".short-play-btn") || e.target.closest(".short-mute-btn")) {
      return;
    }
    
    // On mobile only: toggle play/pause on tap
    if (isTouchDevice) {
      if (video.paused) {
        video.play().catch(() => {});
        card.classList.add("is-playing");
      } else {
        video.pause();
        card.classList.remove("is-playing");
      }
    }
    // Desktop: do nothing on click (hover handles playback)
  });
  
  // Reset when video ends
  video.addEventListener("ended", () => {
    if (!isHovering) {
      card.classList.remove("is-playing");
      progressBar.style.width = "0%";
    }
  });
});
