// Board admin page logic. No secrets are stored here; the admin token is
// supplied per session, kept in sessionStorage only, and verified server-side
// on every request via the X-Admin-Token header.
const API = "https://glad-dalmatian-963.convex.site";

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
};

let token = null;

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
  setStatus("Locked.");
}

els.unlock.addEventListener("click", unlock);
els.lock.addEventListener("click", lock);
els.token.addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlock();
});

els.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const externalUrl = els.link.value.trim();
  const imageUrl = els.image.value.trim();
  await act(() =>
    api("/admin/posts", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        title: els.title.value,
        body: els.body.value,
        ...(externalUrl ? { externalUrl } : {}),
        ...(imageUrl ? { imageUrl } : {}),
      }),
    }),
  );
  if (!els.status.classList.contains("err")) {
    els.title.value = "";
    els.body.value = "";
    els.link.value = "";
    els.image.value = "";
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
