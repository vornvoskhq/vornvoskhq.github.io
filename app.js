// Open Matter Labs — site behavior for the "signal" theme (base44 presentation).
// No secrets belong in this file. The board backend is read-only from here:
// posting and moderation live server-side in the private openmatter-board repo.
// The contact email is printed plainly in the HTML (per owner decision) — no
// obfuscation layer anymore, so there is nothing to assemble at runtime.

const BOARD_ENDPOINT = "https://glad-dalmatian-963.convex.site/public/posts";
const BOARD_ORIGIN = "https://glad-dalmatian-963.convex.site";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const fallbackPosts = [
  {
    date: "19 Sep 2026",
    title: "Open Matter Labs is beginning",
    text: "A public home for reproducible materials research, open data, and work in service of human dignity.",
    image: "",
    link: "",
  },
  {
    date: "Coming soon",
    title: "Results and charts",
    text: "Selected findings will be published here with methods, conditions, and provenance—not unfinished research repositories.",
    image: "",
    link: "",
  },
  {
    date: "In preparation",
    title: "A small public noticeboard",
    text: "Secure moderated posting and comments will arrive after the site's backend and moderation rules are reviewed.",
    image: "",
    link: "",
  },
];

function renderPost(post, board) {
  const article = document.createElement("article");
  article.className = "notice";

  if (post.image) {
    const image = document.createElement("img");
    image.className = "notice-image";
    image.src = post.image.startsWith("http")
      ? post.image
      : BOARD_ORIGIN + post.image;
    image.alt = "";
    image.loading = "lazy";
    article.append(image);
  }

  const body = document.createElement("div");
  body.className = "notice-body";
  const meta = document.createElement("p");
  meta.className = "notice-meta";
  meta.textContent = post.date;
  const title = document.createElement("h3");
  title.textContent = post.title;
  const text = document.createElement("p");
  text.textContent = post.text;
  body.append(meta, title, text);

  if (post.link) {
    const link = document.createElement("a");
    link.href = post.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Read more ↗";
    body.append(link);
  }

  article.append(body);
  board.append(article);
}

async function loadPosts() {
  const board = document.querySelector("#noticeboard");
  if (!board) return;

  let remote = null;
  try {
    const response = await fetch(BOARD_ENDPOINT, {
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      const payload = await response.json();
      if (Array.isArray(payload.posts) && payload.posts.length > 0) {
        remote = payload.posts;
      }
    }
  } catch {
    // Network/CORS failure — fall back to the bundled preview below.
  }

  board.replaceChildren();
  const source = remote || fallbackPosts;
  for (const post of source) {
    renderPost(
      {
        date: post.date,
        title: post.title,
        text: post.body || post.text,
        image: post.image || "",
        link: post.externalUrl || post.link || "",
      },
      board
    );
  }
}

// Navigation: Mobile toggle and overlay logic.
function setupNavigation() {
  const toggle = document.querySelector("#nav-toggle");
  const mobileNav = document.querySelector("#nav-mobile");
  if (!toggle || !mobileNav) return;
  const mobileLinks = Array.from(mobileNav.querySelectorAll("a"));
  let returnFocus = toggle;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    mobileNav.setAttribute("aria-hidden", String(!open));
    mobileNav.inert = !open;
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : toggle;
      mobileLinks[0]?.focus();
    } else if (returnFocus instanceof HTMLElement) {
      returnFocus.focus();
    }
  }

  setOpen(false);

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === "Tab" && mobileLinks.length) {
      const first = mobileLinks[0];
      const last = mobileLinks[mobileLinks.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

// Same-page links should land on the panel boundary, not whichever snap point
// the browser considers nearest while a smooth anchor jump is in progress.
function setupAnchorNavigation() {
  const links = document.querySelectorAll("a[href^='#']");
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      const target = hash ? document.querySelector(hash) : null;
      if (!target) return;

      event.preventDefault();
      const destination = target.offsetTop;
      const duration = prefersReducedMotion ? 0 : 700;

      document.documentElement.classList.add("is-jumping");
      window.history.replaceState(null, "", hash);
      window.scrollTo({ top: destination, behavior: duration ? "smooth" : "auto" });
      window.setTimeout(() => document.documentElement.classList.remove("is-jumping"), duration + 150);
    });
  });
}

// Panel navigation: keep the current major section visible in navigation and support arrow key jumping.
function setupPanelNavigation() {
  const links = Array.from(
    document.querySelectorAll(".desktop-nav a, .nav-mobile-inner a, .panel-nav-link")
  );
  const sectionIds = ["top", "archive", "collaboratory", "dispatch", "reading", "convergence", "ledger", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = (section) => {
    links.forEach((link) => {
      const active = link.getAttribute("href") === "#" + section.id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  const goToPanel = (index) => {
    const nextIndex = Math.max(0, Math.min(sections.length - 1, index));
    const destination = sections[nextIndex].offsetTop;
    const duration = prefersReducedMotion ? 0 : 700;
    document.documentElement.classList.add("is-jumping");
    window.history.replaceState(null, "", "#" + sections[nextIndex].id);
    window.scrollTo({ top: destination, behavior: duration ? "smooth" : "auto" });
    window.setTimeout(() => document.documentElement.classList.remove("is-jumping"), duration + 150);
    setActive(sections[nextIndex]);
  };

  let activeIndex = 0;
  let scheduled = false;
  const updateFromScroll = () => {
    scheduled = false;
    const marker = window.scrollY + window.innerHeight * 0.35;
    let closest = 0;
    sections.forEach((section, index) => {
      if (section.offsetTop <= marker) closest = index;
    });
    if (closest !== activeIndex) {
      activeIndex = closest;
      setActive(sections[closest]);
    }
  };
  const scheduleScrollUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateFromScroll);
  };
  window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
  window.addEventListener("resize", scheduleScrollUpdate, { passive: true });
  updateFromScroll();

  document.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) return;
    if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable='true']")) return;

    const position = window.scrollY + window.innerHeight * 0.35;
    let currentIndex = 0;
    sections.forEach((section, index) => {
      if (section.offsetTop <= position) currentIndex = index;
    });

    const direction = event.key === "ArrowUp" || event.key === "PageUp" ? -1 : 1;
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= sections.length) return;

    event.preventDefault();
    goToPanel(nextIndex);
  });

  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target);
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.1, 0.25, 0.5] }
  );

  sections.forEach((section) => observer.observe(section));
}

// Archive of Matter: horizontal specimen scroller with prev/next controls
// and a 01—0N counter, matching the reference's gallery behavior.
function setupArchive() {
  const scroller = document.querySelector("#archive-scroller");
  if (!scroller) return;

  const prev = document.querySelector("#archive-prev");
  const next = document.querySelector("#archive-next");
  const count = document.querySelector("#archive-count");
  const total = scroller.querySelectorAll(".specimen").length;

  function step() {
    const specimen = scroller.querySelector(".specimen");
    return specimen ? specimen.getBoundingClientRect().width + 24 : 444;
  }
  function visibleIndex() {
    return Math.min(
      total - 1,
      Math.round(scroller.scrollLeft / step())
    );
  }
  function refreshCount() {
    if (count) {
      count.textContent =
        String(visibleIndex() + 1).padStart(2, "0") +
        " — " +
        String(total).padStart(2, "0") +
        " SPECIMENS";
    }
  }

  if (prev) {
    prev.addEventListener("click", () => {
      scroller.scrollBy({ left: -step(), behavior: "smooth" });
    });
  }
  if (next) {
    next.addEventListener("click", () => {
      scroller.scrollBy({ left: step(), behavior: "smooth" });
    });
  }
  scroller.addEventListener("scroll", refreshCount, { passive: true });
  refreshCount();
}

// Collaboratory: drag/keyboard comparison slider between input and output.
function setupSlider() {
  const slider = document.querySelector("#collab-slider");
  if (!slider) return;

  const top = slider.querySelector(".slider-top");
  const handle = slider.querySelector(".slider-handle");
  if (!top || !handle) return;

  let pos = 50;

  function apply() {
    top.style.width = pos + "%";
    // Keep the clipped image aligned with the container while the top layer
    // shrinks: the inner image is sized to the full slider width.
    const innerImg = top.querySelector("img");
    if (innerImg) {
      innerImg.style.width = slider.clientWidth + "px";
    }
    handle.style.left = pos + "%";
    slider.setAttribute("aria-valuenow", String(Math.round(pos)));
  }

  function updateFromClientX(clientX) {
    const rect = slider.getBoundingClientRect();
    pos = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    apply();
  }

  let dragging = false;
  slider.addEventListener("pointerdown", (event) => {
    dragging = true;
    slider.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  });
  slider.addEventListener("pointermove", (event) => {
    if (dragging) updateFromClientX(event.clientX);
  });
  slider.addEventListener("pointerup", () => {
    dragging = false;
  });
  slider.addEventListener("pointercancel", () => {
    dragging = false;
  });
  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      pos = Math.max(0, pos - 4);
      apply();
    } else if (event.key === "ArrowRight") {
      pos = Math.min(100, pos + 4);
      apply();
    }
  });

  window.addEventListener("resize", apply, { passive: true });
  apply();
}

// Ledger waveform: bars with randomized peak heights, CSS-animated.
function setupScrollFrequency() {
  const readout = document.querySelector("#scroll-frequency");
  if (!readout) return;
  const hz = readout.querySelector("strong");
  const layer = readout.querySelector("span");
  const bar = readout.querySelector("b");
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    if (hz) hz.textContent = Math.round(432 + progress * 4096).toLocaleString() + " Hz";
    if (layer) layer.textContent = "LAYER " + String(Math.min(7, Math.floor(progress * 7) + 1)).padStart(2, "0") + "/07";
    if (bar) bar.style.height = progress * 100 + "%";
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

function setupWave() {
  const wave = document.querySelector("#ledger-wave");
  if (!wave) return;
  for (let i = 0; i < 60; i += 1) {
    const bar = document.createElement("span");
    bar.style.setProperty("--h", (6 + Math.random() * 36).toFixed(0) + "px");
    bar.style.animationDelay = (i * 0.03).toFixed(2) + "s";
    wave.append(bar);
  }
}

// Hero particle layer, matching the reference: pointer attraction, glowing
// connected neighbors, and full-density material particles.
function setupParticles() {
  if (prefersReducedMotion) return;
  const canvas = document.querySelector("#hero-particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    // Reduce particle count on smaller screens
    const density = width < 768 ? 20000 : 12000;
    const count = Math.min(140, Math.floor((width * height) / density));

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.3,
      base: Math.random() * 0.5 + 0.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 0 && dist < 160) {
        const force = (160 - dist) / 160;
        p.vx += (dx / dist) * force * 0.04;
        p.vy += (dy / dist) * force * 0.04;
      }
      p.vx *= 0.97;
      p.vy *= 0.97;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      const glow = dist < 160 ? 1 - dist / 160 : 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(235, 90%, 72%, ${p.base + glow * 0.6})`;
      ctx.fill();
    }
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 90) {
          ctx.strokeStyle = `hsla(235, 90%, 72%, ${(1 - distance / 90) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  }, { passive: true });
  window.addEventListener("mouseout", () => { mouse.x = -9999; mouse.y = -9999; }, { passive: true });
  window.addEventListener("resize", resize, { passive: true });
  resize();
  draw();
}

// Sensor field: 12 vertical rules; the rule nearest the pointer brightens.
function setupFieldGrid() {
  const grid = document.querySelector("#field-grid");
  if (!grid || prefersReducedMotion) return;

  const COUNT = 12;
  const rules = [];
  for (let i = 0; i < COUNT; i += 1) {
    const span = document.createElement("span");
    span.style.left = (i / COUNT) * 100 + "%";
    grid.append(span);
    rules.push(span);
  }

  let activeIndex = -1;
  window.addEventListener(
    "mousemove",
    (event) => {
      const index = Math.min(
        COUNT - 1,
        Math.max(0, Math.floor((event.clientX / window.innerWidth) * COUNT))
      );
      if (index !== activeIndex) {
        if (activeIndex >= 0 && rules[activeIndex]) {
          rules[activeIndex].classList.remove("active");
        }
        if (rules[index]) {
          rules[index].classList.add("active");
        }
        activeIndex = index;
      }
    },
    { passive: true }
  );
}

// Crosshair cursor with a frequency readout. Fine pointers only.
function setupCursor() {
  if (prefersReducedMotion) return;
  // Strictly only enable for fine pointers (mouse) and where hover is supported.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.body.classList.remove("cursor-override");
    return;
  }

  const dot = document.querySelector("#cursor-dot");
  const ring = document.querySelector("#cursor-ring");
  const readout = document.querySelector("#cursor-readout");
  if (!dot || !ring || !readout) return;

  document.body.classList.add("cursor-override");

  let targetX = -100;
  let targetY = -100;
  let ringX = -100;
  let ringY = -100;
  let freq = 432;
  let active = false;

  window.addEventListener(
    "mousemove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!active) {
        active = true;
        dot.style.display = "block";
        ring.style.display = "block";
        readout.style.display = "block";
      }
      const interactive =
        event.target instanceof Element &&
        event.target.closest("a, button, input, textarea, [data-cursor='hover']");
      freq = interactive ? 888 : 432;
      document.body.classList.toggle("cursor-hover", Boolean(interactive));
      readout.textContent = freq + "Hz";
      dot.style.transform = "translate(" + targetX + "px," + targetY + "px)";
      readout.style.transform =
        "translate(" + targetX + "px," + targetY + "px)";
    },
    { passive: true }
  );

  function loop() {
    if (active) {
      ringX += (targetX - ringX) * 0.15;
      ringY += (targetY - ringY) * 0.15;
      ring.style.transform = "translate(" + ringX + "px," + ringY + "px)";
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

loadPosts();
setupNavigation();
setupAnchorNavigation();
setupPanelNavigation();
setupArchive();
setupSlider();
setupScrollFrequency();
setupWave();
setupFieldGrid();
setupCursor();
setupParticles();
