// Open Matter Labs — static site behavior.
// No secrets belong in this file. The board backend is read-only from here:
// posting and moderation live server-side in the private openmatter-board repo.

// Read-only public endpoint of the Convex board backend (HTTP actions are
// served on the .convex.site domain). If it is unreachable, the noticeboard
// falls back to the bundled preview posts below.
const BOARD_ENDPOINT =
  "https://glad-dalmatian-963.convex.site/public/posts";

// Assembly-encoded contact address. The full string never appears in HTML source.
const EMAIL_PARTS = ["inquiries", "openmatterlabs.org"];

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
    image.src = post.image.startsWith("http") ? post.image : "https://glad-dalmatian-963.convex.site" + post.image;
    image.alt = "";
    image.loading = "lazy";
    article.append(image);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "notice-image";
    placeholder.setAttribute("aria-hidden", "true");
    article.append(placeholder);
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
          image: post.imageUrl,
          link: post.externalUrl,
        },
        board,
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
  const button = document.querySelector(".email-reveal");
  if (!button) return;

  button.addEventListener("click", () => {
    const address = EMAIL_PARTS[0] + "@" + EMAIL_PARTS[1];
    const link = document.createElement("a");
    link.href = "mailto:" + address;
    link.className = "text-link";
    link.textContent = address;
    button.replaceWith(link);
  });
}

loadPosts();
renderBookmarks();
setupEmailReveal();
