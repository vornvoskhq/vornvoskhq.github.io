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

  if (!prefersReducedMotion) {
    window.addEventListener("resize", apply, { passive: true });
  }
  apply();
}

// Ledger waveform: bars with randomized peak heights, CSS-animated.
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

// Hero particle layer: slow drifting motes with a signal-tinted glow.
// Skipped entirely under reduced motion.
function setupParticles() {
  if (prefersReducedMotion) return;
  const canvas = document.querySelector("#hero-particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let running = true;
  let lastPhase = 0;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    // Density: one mote per ~38k px² capped at 48 — sparse field, not a blizzard.
    const count = Math.min(48, Math.floor((width * height) / 38000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.5,
      vx: (Math.random() - 0.5) * 0.06, // slow drift
      vy: (Math.random() - 0.5) * 0.06,
      a: Math.random() * 0.35 + 0.12,
      phase: Math.random() * Math.PI * 2, // twinkle phase
      tw: Math.random() * 0.02 + 0.006,  // twinkle speed
    }));
  }

  function tick(timestamp) {
    if (running) {
      const dt = lastPhase === 0 ? 16 : Math.min(48, timestamp - lastPhase);
      lastPhase = timestamp;
      const k = dt / 16.7; // frame-rate independent motion
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx * k;
        p.y += p.vy * k;
        p.phase += p.tw * k;
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;
        if (p.y < -4) p.y = height + 4;
        if (p.y > height + 4) p.y = -4;
        // Twinkle: alpha gently oscillates around its base value.
        const alpha = p.a * (0.75 + 0.25 * Math.sin(p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(235, 90%, 72%, " + alpha + ")";
        ctx.fill();
      }
    }
    requestAnimationFrame(tick);
  }

  // Pause drawing while the hero is scrolled off-screen.
  const visibility = new IntersectionObserver(
    (entries) => {
      running = entries[0] !== undefined && entries[0].isIntersecting;
    },
    { threshold: 0.02 }
  );
  visibility.observe(canvas);

  resize();
  window.addEventListener("resize", resize, { passive: true });
  requestAnimationFrame(tick);
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
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

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

  window.addEventListener(
    "mousemove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
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
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    ring.style.transform = "translate(" + ringX + "px," + ringY + "px)";
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

loadPosts();
setupArchive();
setupSlider();
setupWave();
setupFieldGrid();
setupCursor();
setupParticles();
