// Builds the site from content/site.json and content/works.json, the two files the editor changes.
(async function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Paths may be written as "/media/x.jpg" or "media/x.jpg"; both work from any folder.
  const src = (p) => String(p || "").replace(/^\//, "");
  const paras = (t) => String(t || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join("");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const load = (path) => fetch(path, { cache: "no-cache" }).then((r) => r.json());
  let S, ALL;
  try { [S, ALL] = await Promise.all([load("content/site.json"), load("content/works.json")]); }
  catch (e) { $("view-work").innerHTML = `<p class="empty">The content could not be loaded.</p>`; return; }
  const A = S.about || {}, C = S.contact || {};
  const W = (ALL || []).filter((w) => !w.hidden && w.image);

  document.title = S.name || document.title;
  $("name").textContent = S.name || "";
  $("mail").textContent = C.email || "";
  $("city").textContent = S.city || "";
  $("draft").textContent = S.draft_note || "";
  const introHTML = paras(S.intro);

  // The layout repeats a pattern of rows, so new works always find a place.
  // Each slot is [first column of 12, columns wide, drop from the row's top in px].
  // The pattern depends on the window's width: one piece per row on phones,
  // one or two on tablets and small laptops, two or three on larger screens.
  const LAYOUTS = [
    { name: "narrow", maxWidth: 819, pattern: [
      [[1, 10, 0]],
      [[3, 10, 0]],
      [[2, 9, 0]],
      [[4, 9, 0]],
      [[1, 9, 0]],
      [[3, 8, 0]]
    ] },
    { name: "medium", maxWidth: 1199, pattern: [
      [[2, 4, 0], [8, 3, 120]],
      [[4, 6, 0]],
      [[1, 3, 60], [7, 4, 0]],
      [[3, 6, 0]],
      [[1, 4, 140], [6, 6, 0]],
      [[2, 3, 0], [7, 5, 70]],
      [[4, 4, 0], [10, 2, 40]]
    ] },
    { name: "wide", maxWidth: Infinity, pattern: [
      [[1, 3, 0], [5, 4, 90], [10, 3, 30]],
      [[2, 4, 40], [8, 4, 0]],
      [[1, 4, 0], [6, 3, 120], [10, 3, 20]],
      [[3, 4, 0], [8, 5, 60]],
      [[1, 3, 80], [5, 4, 0], [10, 3, 140]],
      [[2, 5, 0], [8, 4, 50]]
    ] }
  ];
  const layoutFor = (width) => LAYOUTS.find((l) => width <= l.maxWidth);
  let layout = null, rowOf = [];

  function render() {
    layout = layoutFor(window.innerWidth);
    const rows = [];
    for (let i = 0, p = 0; i < W.length; p++) {
      const slots = layout.pattern[p % layout.pattern.length];
      rows.push(slots.slice(0, W.length - i).map((slot) => ({ i: i++, slot })));
    }
    rowOf = [];
    rows.forEach((row, r) => row.forEach(({ i, slot }) => { rowOf[i] = { r, col: slot[0] }; }));
    $("view-work").dataset.layout = layout.name;
    $("view-work").innerHTML = W.length ? rows.map((row, r) => `<div class="row" id="row-${r}">${row.map(({ i, slot: [col, span, drop] }) => {
      const w = W[i];
      return `<button class="obj ${w.cutout ? "cut" : "flat"}" type="button" id="obj-${i}" data-i="${i}" aria-expanded="false"
          style="grid-column:${col} / span ${span};margin-top:${drop}px" aria-label="${esc(w.title)}${w.year ? ", " + esc(w.year) : ""}">
          <span class="pic"><img src="${esc(src(w.image))}" alt="" loading="${i < 4 ? "eager" : "lazy"}"></span>
          <span class="cap"><i>${esc(w.title)}</i>${esc(w.year)}</span>
        </button>`;
    }).join("")}</div>`).join("") : `<p class="empty">No works yet.</p>`;
  }
  render();
  // Rebuild only when the window crosses into another layout, not on every pixel of a resize.
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (layoutFor(window.innerWidth) !== layout) { close(); render(); } }, 150);
  });

  function descHTML(i, headingId) {
    const w = W[i];
    const meta = [w.type, w.client, w.year].filter(Boolean).map(esc).join(" · ");
    return `<div class="desc">
      <h2 id="${headingId}">${esc(w.title)}</h2>
      ${meta ? `<p class="meta small">${meta}</p>` : ""}
      <div class="text">${paras(w.description)}</div>
      ${w.image_credit ? `<p class="credit small">${esc(w.image_credit)}</p>` : ""}
      <div class="steps"><button class="link" type="button" data-step="-1">Previous</button><button class="link" type="button" data-step="1">Next</button><button class="link" type="button" data-close>Close</button></div>
    </div>`;
  }

  const MODES = ["column", "unfold", "lift"];
  let mode = MODES.includes(S.detail_style) ? S.detail_style : "column";
  let current = null;
  const mark = (i) => document.querySelectorAll(".obj").forEach((o) => o.setAttribute("aria-expanded", String(+o.dataset.i === i)));

  /* Column: the description takes the intro's place in the left column; the other pieces fade back. */
  const column = {
    open(i) {
      $("slot").innerHTML = descHTML(i, "d-title");
      $("view-work").classList.add("dim");
      if (window.matchMedia("(max-width: 820px)").matches) $("slot").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    },
    close() { $("slot").innerHTML = introHTML; $("view-work").classList.remove("dim"); }
  };

  /* Unfold: the description opens directly beneath the piece, pushing the next row down. */
  const unfold = {
    open(i) {
      const old = document.querySelector(".unfold");
      if (old) old.remove();
      const { r, col } = rowOf[i];
      const el = document.createElement("div");
      el.className = "unfold";
      const cols = layout.name === "narrow" ? "1 / -1" : `${Math.min(col, 7)} / span 6`;
      el.innerHTML = `<div><div class="row" style="margin:0"><div style="grid-column:${cols};min-width:0">${descHTML(i, "d-title")}</div></div></div>`;
      $("row-" + r).after(el);
      if (reduced) el.classList.add("open");
      else requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("open")));
      setTimeout(() => el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" }), 380);
    },
    close() {
      const el = document.querySelector(".unfold");
      if (!el) return;
      el.classList.remove("open");
      setTimeout(() => el.remove(), reduced ? 0 : 550);
    }
  };

  /* Lift: the picture grows from where it hangs to the middle of the screen, over a pale veil. */
  const lift = {
    el: null,
    art(i) { const w = W[i]; return `<img class="${w.cutout ? "cutimg" : "flat"}" src="${esc(src(w.image))}" alt="${esc(w.title)}">`; },
    open(i, stepping) {
      if (this.el && stepping) {
        this.el.querySelector(".art").innerHTML = this.art(i);
        this.el.querySelector(".desc").outerHTML = descHTML(i, "d-title");
        this.el.querySelector(".art img").animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350 });
        return;
      }
      const el = document.createElement("div");
      el.className = "lift"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-labelledby", "d-title");
      el.innerHTML = `<button class="link x" type="button" data-close>Close</button><div class="art">${this.art(i)}</div>${descHTML(i, "d-title")}`;
      document.body.appendChild(el);
      this.el = el;
      el.addEventListener("click", (e) => { if (e.target === el) close(); });
      const big = el.querySelector(".art img"), small = $("obj-" + i).querySelector("img");
      const fly = () => {
        const a = small.getBoundingClientRect(), b = big.getBoundingClientRect();
        el.classList.add("show");
        if (!b.width) return;
        small.style.visibility = "hidden";
        big.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width})`, transformOrigin: "0 0" },
          { transform: "none", transformOrigin: "0 0" }], { duration: 650, easing: "cubic-bezier(.2, .7, .2, 1)" })
          .onfinish = () => { small.style.visibility = ""; };
      };
      if (reduced) el.classList.add("show");
      else if (big.complete) requestAnimationFrame(fly);
      else big.addEventListener("load", () => requestAnimationFrame(fly), { once: true });
      el.querySelector("[data-close]").focus({ preventScroll: true });
    },
    close() {
      const el = this.el; if (!el) return;
      this.el = null;
      el.classList.remove("show");
      setTimeout(() => el.remove(), reduced ? 0 : 450);
    }
  };

  const STYLES = { column, unfold, lift };
  function open(i, stepping) {
    if (current !== null && !(mode === "lift" && stepping)) STYLES[mode].close();
    current = i; mark(i);
    STYLES[mode].open(i, stepping);
  }
  function close() {
    if (current === null) return;
    const i = current;
    STYLES[mode].close();
    current = null; mark(null);
    const o = $("obj-" + i); if (o) o.focus({ preventScroll: true });
  }
  const step = (d) => open((current + d + W.length) % W.length, true);

  $("view-work").addEventListener("click", (e) => {
    const o = e.target.closest(".obj");
    if (o) return +o.dataset.i === current ? close() : open(+o.dataset.i, false);
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) return close();
    const s = e.target.closest("[data-step]"); if (s) step(+s.dataset.step);
  });
  document.addEventListener("keydown", (e) => {
    if (current === null) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  // ?styles in the address shows a switch for trying the three detail styles.
  const q = new URLSearchParams(location.search);
  const sw = document.querySelector(".switch");
  function setMode(m) {
    close(); mode = m;
    sw.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
  }
  if (q.has("styles")) {
    sw.hidden = false;
    sw.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setMode(b.dataset.mode); });
    setMode(MODES.includes(q.get("styles")) ? q.get("styles") : mode);
  }

  const practice = (A.practice || []).filter(Boolean);
  const selected = (A.selected || []).filter((s) => s && (s.year || s.text));
  const contact = [["Mail", C.email], ["Insta", C.instagram], ["Studio", C.studio]].filter(([, v]) => v);
  $("view-about").innerHTML = `
    <section class="about">
      ${A.portrait ? `<figure>
        <img class="${A.portrait_cutout ? "" : "flat"}" src="${esc(src(A.portrait))}" alt="${esc(S.name)}">
        ${A.portrait_caption ? `<figcaption class="small">${esc(A.portrait_caption)}</figcaption>` : ""}
      </figure>` : "<div></div>"}
      <div>
        ${A.lead ? `<p class="lead">${esc(A.lead)}</p>` : ""}
        <div class="body">${paras(A.body)}</div>
        ${practice.length ? `<h3>Practice</h3><p class="practice">${practice.map(esc).join(", ")}</p>` : ""}
        ${selected.length ? `<h3>Selected</h3><ul>${selected.map((s) => `<li><span>${esc(s.year)}</span><span>${esc(s.text)}</span></li>`).join("")}</ul>` : ""}
        ${contact.length ? `<h3>Contact</h3><ul>${contact.map(([k, v]) => `<li><span>${k}</span><span>${esc(v)}</span></li>`).join("")}</ul>` : ""}
      </div>
    </section>`;

  function route() {
    const about = location.hash === "#about";
    close();
    $("view-work").hidden = about; $("view-about").hidden = !about;
    $("nav-work").removeAttribute("aria-current"); $("nav-about").removeAttribute("aria-current");
    $(about ? "nav-about" : "nav-work").setAttribute("aria-current", "page");
    if (q.has("styles")) sw.hidden = about;
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  $("slot").innerHTML = introHTML;
  route();
  if (q.has("open")) open(Math.max(0, Math.min(W.length - 1, +q.get("open") || 0)), false);
})();
