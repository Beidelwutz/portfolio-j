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

const lightboxOverlay = document.querySelector("[data-lightbox-overlay]");
const lightboxMedia = document.querySelector("[data-lightbox-media]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

const openLightbox = (title, type) => {
  if (!lightboxOverlay || !lightboxMedia || !lightboxTitle) return;
  lightboxMedia.innerHTML = "";
  const placeholder = document.createElement("div");
  placeholder.className = "lightbox-placeholder";
  placeholder.textContent = type === "video" ? "Video-Clip Vorschau" : "Foto Vorschau";
  lightboxMedia.appendChild(placeholder);
  lightboxTitle.textContent = title;
  lightboxOverlay.removeAttribute("hidden");
};

const closeLightbox = () => {
  if (!lightboxOverlay) return;
  lightboxOverlay.setAttribute("hidden", "true");
};

document.querySelectorAll("[data-lightbox]").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.getAttribute("data-title") ?? "Projekt";
    const type = card.getAttribute("data-type") ?? "image";
    openLightbox(title, type);
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
