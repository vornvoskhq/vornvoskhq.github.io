// Board admin page logic. No secrets are stored here; the admin token is
// supplied per session, kept in sessionStorage only, and verified server-side
// on every request via the X-Admin-Token header.
const API = "https://glad-dalmatian-963.convex.site";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const els = {
  status: document.querySelector("#status"),
  token: document.querySelector("#token"),
  unlock: document.querySelector("#unlock"),
  lock: document.querySelector("#lock"),
  composer: document.querySelector("#composer"),
  postsCard: document.querySelector("#posts-card"),
  postsList: document.querySelector("#posts-list"),
  form: document.querySelector("#post-form"),
  title: document.querySelector("#f-title"),
  body: document.querySelector("#f-body"),
  link: document.querySelector("#f-link"),
  image: document.querySelector("#f-image"),
  previewWrap: document.querySelector("#image-preview-wrap"),
  preview: document.querySelector("#image-preview"),
  previewClear: document.querySelector("#image-clear"),
};

let token = null;
let selectedFile = null;

function setStatus(message, kind) {
  els.status.textContent = message;
  els.status.className = "admin-status" + (kind ? " " + kind : "");
}

function headers() {
  return {
    "Content-Type": "application/json",
    "X-Admin-Token": token,
  };
}

async function api(path, options) {
  const response = await fetch(API + path, options);
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    const message = payload && payload.error ? payload.error : "Request failed (" + response.status + ")";
    throw new Error(message);
  }
  return payload;
}

async function loadPosts() {
  const payload = await api("/admin/posts", { headers: headers() });
  renderPosts(payload.posts);
}

function renderPosts(posts) {
  els.postsList.replaceChildren();

  if (posts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "hint";
    empty.textContent = "No posts yet.";
    els.postsList.append(empty);
    return;
  }

  for (const post of posts) {
    const row = document.createElement("div");
    row.className = "post-row";

    const state = document.createElement("span");
    state.className = "post-state " + (post.published ? "live" : "hidden");
    state.textContent = post.published ? "live" : "hidden";

    if (post.image) {
      const thumb = document.createElement("img");
      thumb.className = "post-thumb";
      thumb.src = API + post.image;
      thumb.alt = "";
      thumb.loading = "lazy";
      row.append(thumb);
    }

    const title = document.createElement("span");
    title.className = "post-title";
    title.textContent = post.title;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = post.published ? "Unpublish" : "Publish";
    toggle.addEventListener("click", () =>
      act(() =>
        api("/admin/posts/publish", {
          method: "POST",
          headers: headers(),
          body: JSON.stringify({
            postId: post.id,
            published: !post.published,
          }),
        }),
      ),
    );

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      if (window.confirm("Delete post: " + post.title + "?")) {
        act(() =>
          api("/admin/posts/delete", {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({ postId: post.id }),
          }),
        );
      }
    });

    row.append(state, title, toggle, remove);
    els.postsList.append(row);
  }
}

async function act(fn) {
  try {
    await fn();
    setStatus("Done.", "ok");
    await loadPosts();
  } catch (error) {
    setStatus(String(error.message || error), "err");
  }
}

// ------------------------------------------------------------ image selection

function clearSelectedImage() {
  selectedFile = null;
  els.image.value = "";
  els.previewWrap.hidden = true;
  els.preview.src = "";
}

els.image.addEventListener("change", () => {
  const file = els.image.files && els.image.files[0] ? els.image.files[0] : null;
  if (file === null) {
    clearSelectedImage();
    return;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    setStatus("Image is larger than 5 MiB.", "err");
    clearSelectedImage();
    return;
  }
  selectedFile = file;
  const reader = new FileReader();
  reader.onload = () => {
    els.preview.src = String(reader.result);
    els.previewWrap.hidden = false;
  };
  reader.readAsDataURL(file);
});

els.previewClear.addEventListener("click", clearSelectedImage);

// ------------------------------------------------------------------- session

function unlock() {
  const value = els.token.value.trim();
  if (value.length < 32) {
    setStatus("Token looks too short.", "err");
    return;
  }
  token = value;
  sessionStorage.setItem("oml_admin_token", value);
  els.token.value = "";
  els.composer.hidden = false;
  els.postsCard.hidden = false;
  setStatus("Unlocked. Loading posts…", "ok");
  act(loadPosts);
}

function lock() {
  token = null;
  sessionStorage.removeItem("oml_admin_token");
  els.composer.hidden = true;
  els.postsCard.hidden = true;
  els.postsList.replaceChildren();
  clearSelectedImage();
  setStatus("Locked.");
}

els.unlock.addEventListener("click", unlock);
els.lock.addEventListener("click", lock);
els.token.addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlock();
});

// ---------------------------------------------------------------- submission

els.form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = new FormData();
  form.append("title", els.title.value);
  form.append("body", els.body.value);
  const externalUrl = els.link.value.trim();
  if (externalUrl) {
    form.append("externalUrl", externalUrl);
  }
  if (selectedFile !== null) {
    form.append("image", selectedFile);
  }

  await act(() =>
    api("/admin/posts", {
      method: "POST",
      headers: { "X-Admin-Token": token },
      body: form,
    }),
  );

  if (!els.status.classList.contains("err")) {
    els.title.value = "";
    els.body.value = "";
    els.link.value = "";
    clearSelectedImage();
  }
});

// Restore an unlocked session within the same tab.
const saved = sessionStorage.getItem("oml_admin_token");
if (saved !== null) {
  token = saved;
  els.composer.hidden = false;
  els.postsCard.hidden = false;
  setStatus("Session restored. Loading posts…", "ok");
  act(loadPosts);
}
