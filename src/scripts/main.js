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

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId.length <= 1) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
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
