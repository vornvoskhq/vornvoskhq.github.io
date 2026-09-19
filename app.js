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

const board = document.querySelector("#noticeboard");

for (const post of posts) {
  const article = document.createElement("article");
  article.className = "notice";

  if (post.image) {
    const image = document.createElement("img");
    image.className = "notice-image";
    image.src = post.image;
    image.alt = "";
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
