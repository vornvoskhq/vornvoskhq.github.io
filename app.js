// Open Matter Labs — site behavior for the "signal" theme.
// No secrets belong in this file. The board backend is read-only from here:
// posting and moderation live server-side in the private openmatter-board repo.

const BOARD_ENDPOINT = "https://glad-dalmatian-963.convex.site/public/posts";
const BOARD_ORIGIN = "https://glad-dalmatian-963.convex.site";

// Assembly-encoded contact address. The full string never appears in HTML source.
const EMAIL_PARTS = ["inquiries", "openmatterlabs.org"];

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const posts = [
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
    text: "Secure moderated posting and comments will arrive after the site’s backend and moderation rules are reviewed.",
    image: "",
    link: "",
  },
];

const bookmarks = [
  {
    label: "Open Matter Labs",
    url: "https://openmatterlabs.org/",
    desc: "This site — public notices and selected results.",
  },
  {
    label: "GitHub — vornvoskhq",
    url: "https://github.com/vornvoskhq",
    desc: "Public code and organization presence.",
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

  if (remote) {
    board.replaceChildren();
    for (const post of remote) {
      renderPost(
        {
          date: post.date,
          title: post.title,
          text: post.body,
          image: post.image || "",
          link: post.externalUrl || "",
        },
        board
      );
    }
  } else {
    for (const post of posts) {
      renderPost(post, board);
    }
  }
}

function renderBookmarks() {
  const grid = document.querySelector("#bookmarks-grid");
  if (!grid) return;

  bookmarks.forEach((bookmark, index) => {
    const row = document.createElement("article");
    row.className = "bookmark";

    const num = document.createElement("span");
    num.className = "bookmark-index";
    num.textContent = String(index + 1).padStart(2, "0");

    const link = document.createElement("a");
    link.href = bookmark.url;
    link.textContent = bookmark.label;
    if (/^https?:\/\//i.test(bookmark.url)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    const desc = document.createElement("span");
    desc.className = "bookmark-desc";
    desc.textContent = bookmark.desc;

    row.append(num, link, desc);
    grid.append(row);
  });
}

function setupEmailReveal() {
  const buttons = document.querySelectorAll(".email-reveal");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const address = EMAIL_PARTS[0] + "@" + EMAIL_PARTS[1];
      const link = document.createElement("a");
      link.href = "mailto:" + address;
      link.className = "text-link";
      link.textContent = address;
      button.replaceWith(link);
    });
  });
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

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(90, Math.floor((width * height) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.5 + 0.15,
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -4) p.x = width + 4;
      if (p.x > width + 4) p.x = -4;
      if (p.y < -4) p.y = height + 4;
      if (p.y > height + 4) p.y = -4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "hsla(235, 90%, 72%, " + p.a + ")";
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

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
      freq = interactive ? 880 : 432;
      readout.textContent = freq + " Hz";
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
renderBookmarks();
setupEmailReveal();
setupFieldGrid();
setupCursor();
setupParticles();
