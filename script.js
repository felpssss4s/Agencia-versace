const WHATSAPP_NUMBER = "555591373311";

const standardViews = [
  { quantity: 250, price: 5 },
  { quantity: 500, price: 10 },
  { quantity: 1000, price: 20 },
  { quantity: 2000, price: 30 },
  { quantity: 3000, price: 40 },
  { quantity: 4000, price: 50 },
  { quantity: 5000, price: 100 },
  { quantity: 10000, price: 200 },
];

const catalog = {
  instagram: {
    label: "Instagram",
    services: [
      {
        id: "story-views",
        label: "Visualizações nos Stories",
        description: "Alcance para conteúdos publicados nos stories.",
        offers: standardViews,
      },
      {
        id: "reels-views",
        label: "Visualizações nos Reels",
        description: "Impulso de visualizações para vídeos Reels.",
        offers: standardViews,
      },
      {
        id: "followers-by-state",
        label: "Seguidores brasileiros por estado",
        description: "Seguidores brasileiros com segmentação estadual.",
        offers: [
          { quantity: 250, price: 20 }, { quantity: 500, price: 30 },
          { quantity: 1000, price: 50 }, { quantity: 2000, price: 90 },
          { quantity: 3000, price: 140 }, { quantity: 4000, price: 190 },
          { quantity: 5000, price: 210 },
        ],
      },
      {
        id: "brazilian-likes",
        label: "Likes brasileiros",
        description: "Interações brasileiras para publicações.",
        offers: [
          { quantity: 250, price: 15 }, { quantity: 500, price: 25 },
          { quantity: 1000, price: 40 }, { quantity: 2000, price: 70 },
          { quantity: 3000, price: 100 }, { quantity: 4000, price: 190 },
          { quantity: 5000, price: 230 },
        ],
      },
      {
        id: "brazilian-male-followers",
        label: "Seguidores brasileiros masculinos",
        description: "Seguidores brasileiros com segmentação masculina.",
        offers: [
          { quantity: 250, price: 12 }, { quantity: 500, price: 25 },
          { quantity: 1000, price: 45 }, { quantity: 2000, price: 91 },
          { quantity: 3000, price: 131 }, { quantity: 4000, price: 171 },
          { quantity: 5000, price: 220 },
        ],
      },
    ],
  },
  facebook: {
    label: "Facebook",
    services: [
      {
        id: "facebook-likes",
        label: "Curtidas Facebook",
        description: "Curtidas para conteúdos publicados.",
        offers: [
          { quantity: 250, price: 15 }, { quantity: 500, price: 28 },
          { quantity: 1000, price: 50 }, { quantity: 2000, price: 100 },
          { quantity: 3000, price: 200 }, { quantity: 4000, price: 400 },
        ],
      },
      {
        id: "facebook-comments",
        label: "Comentários Facebook",
        description: "Comentários para publicações selecionadas.",
        offers: [
          { quantity: 250, price: 25 }, { quantity: 500, price: 50 },
          { quantity: 1000, price: 100 }, { quantity: 2000, price: 200 },
          { quantity: 3000, price: 400 },
        ],
      },
      {
        id: "facebook-page-followers",
        label: "Seguidores página Facebook",
        description: "Seguidores para ampliar a base da página.",
        offers: [
          { quantity: 250, price: 15 }, { quantity: 500, price: 28 },
          { quantity: 1000, price: 50 }, { quantity: 2000, price: 100 },
          { quantity: 3000, price: 200 }, { quantity: 4000, price: 400 },
        ],
      },
    ],
  },
  twitter: {
    label: "Twitter",
    services: [
      {
        id: "twitter-followers",
        label: "Seguidores Twitter",
        description: "Seguidores para ampliar a presença do perfil.",
        offers: [
          { quantity: 100, price: 10 }, { quantity: 200, price: 20 },
          { quantity: 300, price: 30 }, { quantity: 400, price: 40 },
          { quantity: 5000, price: 50, requiresConfirmation: true },
          { quantity: 10000, price: 100 },
        ],
      },
      {
        id: "twitter-poll-votes",
        label: "Votos enquete Twitter",
        description: "Votos para enquetes publicadas.",
        offers: [
          { quantity: 250, price: 12 }, { quantity: 500, price: 24 },
          { quantity: 1000, price: 48 }, { quantity: 2000, price: 96 },
          { quantity: 3000, price: 192 }, { quantity: 4000, price: 384 },
        ],
      },
    ],
  },
};

const state = {
  platform: null,
  service: null,
  offer: null,
};

const money = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const amount = (value) => new Intl.NumberFormat("pt-BR").format(value);

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const elements = {
  serviceFieldset: $("[data-service-fieldset]"),
  servicePlaceholder: $("[data-service-placeholder]"),
  serviceOptions: $("[data-service-options]"),
  quantityFieldset: $("[data-quantity-fieldset]"),
  quantityPlaceholder: $("[data-quantity-placeholder]"),
  quantityOptions: $("[data-quantity-options]"),
  price: $("[data-price]"),
  summaryPlatform: $("[data-summary-platform]"),
  summaryService: $("[data-summary-service]"),
  summaryQuantity: $("[data-summary-quantity]"),
  summaryStatus: $("[data-summary-status]"),
  outputStatus: $("[data-output-status]"),
  catalogWarning: $("[data-catalog-warning]"),
  whatsapp: $("[data-whatsapp-action]"),
};

let displayedPrice = 0;
let priceAnimationFrame = 0;

function renderPrice(value, animate = false) {
  window.cancelAnimationFrame(priceAnimationFrame);

  if (value === null) {
    displayedPrice = 0;
    elements.price.textContent = "R$ —";
    return;
  }

  if (!animate || prefersReducedMotion()) {
    displayedPrice = value;
    elements.price.textContent = money(value);
    return;
  }

  const from = displayedPrice;
  const startedAt = performance.now();
  const duration = 460;

  elements.price.classList.remove("is-updating");
  requestAnimationFrame(() => elements.price.classList.add("is-updating"));

  const tick = (now) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (value - from) * eased);
    elements.price.textContent = money(current);

    if (progress < 1) {
      priceAnimationFrame = requestAnimationFrame(tick);
      return;
    }

    displayedPrice = value;
  };

  priceAnimationFrame = requestAnimationFrame(tick);
}

function selectPlatform(platformKey, shouldScroll = false) {
  state.platform = platformKey;
  state.service = null;
  state.offer = null;

  $$('[data-platform]').forEach((button) => {
    const selected = button.dataset.platform === platformKey;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  renderServices();
  renderQuantities();
  updateOutput();

  if (shouldScroll) {
    $("#configurador").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

function selectService(serviceId) {
  state.service = catalog[state.platform].services.find((service) => service.id === serviceId);
  state.offer = null;

  $$('[data-service-id]').forEach((button) => {
    const selected = button.dataset.serviceId === serviceId;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  renderQuantities();
  updateOutput();
}

function selectOffer(quantity) {
  state.offer = state.service.offers.find((offer) => offer.quantity === Number(quantity));

  $$('[data-quantity]').forEach((button) => {
    const selected = Number(button.dataset.quantity) === state.offer.quantity;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  updateOutput(true);
}

function renderServices() {
  const services = catalog[state.platform].services;
  elements.serviceFieldset.disabled = false;
  elements.servicePlaceholder.hidden = true;
  elements.serviceOptions.innerHTML = services
    .map(
      (service) => `
        <button type="button" data-service-id="${service.id}" aria-pressed="false">
          <span><strong>${service.label}</strong><small>${service.description}</small></span>
          <b></b>
        </button>`,
    )
    .join("");

  $$('[data-service-id]').forEach((button) =>
    button.addEventListener("click", () => selectService(button.dataset.serviceId)),
  );
}

function renderQuantities() {
  if (!state.service) {
    elements.quantityFieldset.disabled = true;
    elements.quantityPlaceholder.hidden = false;
    elements.quantityOptions.innerHTML = "";
    return;
  }

  elements.quantityFieldset.disabled = false;
  elements.quantityPlaceholder.hidden = true;
  elements.quantityOptions.innerHTML = state.service.offers
    .map(
      (offer) => `
        <button type="button" data-quantity="${offer.quantity}" aria-pressed="false">
          <strong>${amount(offer.quantity)}</strong>
          <span>${money(offer.price)}</span>
          ${offer.requiresConfirmation ? "<small>CONFIRMAR ITEM</small>" : ""}
          <b></b>
        </button>`,
    )
    .join("");

  $$('[data-quantity]').forEach((button) =>
    button.addEventListener("click", () => selectOffer(button.dataset.quantity)),
  );
}

function updateOutput(animatePrice = false) {
  const completeCount = [state.platform, state.service, state.offer].filter(Boolean).length;
  const ready = completeCount === 3;

  elements.summaryPlatform.textContent = state.platform ? catalog[state.platform].label.toUpperCase() : "—";
  elements.summaryService.textContent = state.service?.label.toUpperCase() || "—";
  elements.summaryQuantity.textContent = state.offer ? amount(state.offer.quantity) : "—";
  elements.summaryStatus.textContent = ready ? "PRONTO PARA ENVIO" : "INCOMPLETO";
  renderPrice(state.offer?.price ?? null, animatePrice);
  elements.outputStatus.classList.toggle("is-ready", ready);
  elements.catalogWarning.hidden = !state.offer?.requiresConfirmation;

  if (!ready) {
    elements.whatsapp.href = "#configurador";
    elements.whatsapp.classList.add("is-disabled");
    elements.whatsapp.setAttribute("aria-disabled", "true");
    elements.whatsapp.removeAttribute("target");
    return;
  }

  const message = [
    "Olá! Quero fazer um pedido na Agência Versace.",
    `Plataforma: ${catalog[state.platform].label}`,
    `Serviço: ${state.service.label}`,
    `Quantidade: ${amount(state.offer.quantity)}`,
    `Preço: ${money(state.offer.price)}`,
  ].join("\n");

  elements.whatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  elements.whatsapp.classList.remove("is-disabled");
  elements.whatsapp.setAttribute("aria-disabled", "false");
  elements.whatsapp.target = "_blank";
  elements.whatsapp.rel = "noreferrer";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setupNavigation() {
  const header = $("[data-header]");
  const nav = $("[data-nav]");
  const toggle = $("[data-nav-toggle]");

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });

  $$('[data-nav-link]').forEach((link) =>
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }),
  );

  window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 20), { passive: true });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$('[data-nav-link]').forEach((link) =>
          link.classList.toggle("is-active", link.dataset.navLink === entry.target.dataset.section),
        );
      });
    },
    { rootMargin: "-35% 0px -55%", threshold: 0 },
  );

  $$('[data-section]').forEach((section) => observer.observe(section));
}

function setupReveal() {
  [".platform-deck", ".advantage-list", ".faq-list"].forEach((selector) => {
    const group = $(selector);
    if (!group) return;
    $$(".reveal", group).forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * 80}ms`);
    });
  });

  if (prefersReducedMotion()) {
    $$(".reveal").forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 },
  );

  $$(".reveal").forEach((item) => observer.observe(item));
}

function setupIntroSparkles() {
  const canvas = $("[data-sparkles-canvas]");
  if (!canvas || prefersReducedMotion()) return () => {};

  const context = canvas.getContext("2d");
  if (!context) return () => {};

  let width = 0;
  let height = 0;
  let particles = [];
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  const createParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 0.35 + Math.random() * 1.05,
    alpha: 0.12 + Math.random() * 0.8,
    phase: Math.random() * Math.PI * 2,
    speed: 0.003 + Math.random() * 0.008,
    driftX: (Math.random() - 0.5) * 0.08,
    driftY: 0.03 + Math.random() * 0.16,
  });

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const density = Math.min(230, Math.max(90, Math.round((width * height) / 850)));
    particles = Array.from({ length: density }, createParticle);
  };

  const draw = (time) => {
    if (!canvas.isConnected) return;
    context.clearRect(0, 0, width, height);

    for (const particle of particles) {
      particle.x += particle.driftX;
      particle.y += particle.driftY;
      if (particle.y > height + 3) particle.y = -3;
      if (particle.x < -3) particle.x = width + 3;
      if (particle.x > width + 3) particle.x = -3;

      const pulse = 0.35 + 0.65 * ((Math.sin(time * particle.speed + particle.phase) + 1) / 2);
      context.globalAlpha = particle.alpha * pulse;
      context.fillStyle = particle.radius > 1.05 ? "#c9ff38" : "#f4f1e9";
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = 1;
    requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });
  requestAnimationFrame(draw);
  return () => window.removeEventListener("resize", resize);
}

function setupPagePolish() {
  const intro = $("[data-site-intro]");
  const header = $("[data-header]");

  if (intro) {
    if (prefersReducedMotion()) {
      intro.remove();
    } else {
      document.body.classList.add("intro-active");
      const cleanupSparkles = setupIntroSparkles();
      window.setTimeout(() => {
        cleanupSparkles();
        document.body.classList.remove("intro-active");
        intro.remove();
      }, 2550);
    }
  }

  let scrollTicking = false;
  const updateScrollEffects = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    header.style.setProperty("--page-progress", `${progress * 100}%`);
    document.documentElement.style.setProperty("--page-scroll", String(progress));
    scrollTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(updateScrollEffects);
    },
    { passive: true },
  );
  updateScrollEffects();

  if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  $$(".platform-module").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
    });
  });

  $$(".ignition-button, .channel-whatsapp, .contact-primary, .contact-secondary").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      button.style.setProperty("--magnet-x", `${x * 7}px`);
      button.style.setProperty("--magnet-y", `${y * 5}px`);
    });

    button.addEventListener("pointerleave", () => {
      button.style.setProperty("--magnet-x", "0px");
      button.style.setProperty("--magnet-y", "0px");
    });
  });
}

function setupParallax() {
  if (prefersReducedMotion()) return;

  const core = $("[data-launch-core]");
  const stage = $("[data-parallax-stage]");
  const glow = $(".cursor-glow");

  window.addEventListener(
    "pointermove",
    (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    },
    { passive: true },
  );

  core.addEventListener("pointermove", (event) => {
    const rect = core.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.transform = `translate3d(${x * 18}px, ${y * 14}px, 0) rotateY(${x * 5}deg) rotateX(${-y * 4}deg)`;
  });

  core.addEventListener("pointerleave", () => {
    stage.style.transform = "translate3d(0, 0, 0) rotateY(0) rotateX(0)";
  });
}

function setupConfigurator() {
  $$('[data-platform]').forEach((button) =>
    button.addEventListener("click", () => selectPlatform(button.dataset.platform)),
  );

  $$('[data-service-platform]').forEach((button) =>
    button.addEventListener("click", () => selectPlatform(button.dataset.servicePlatform, true)),
  );

  elements.whatsapp.addEventListener("click", (event) => {
    if (elements.whatsapp.getAttribute("aria-disabled") === "true") event.preventDefault();
  });

  updateOutput();
}

setupNavigation();
setupReveal();
setupParallax();
setupConfigurator();
setupPagePolish();
