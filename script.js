/* =========================================================
   Pulse — interaction logic
   Vanilla JS only. Each block is independent and safe to
   delete on its own if you only want part of the collection.
========================================================= */

(function () {
  "use strict";

  /* ---------- Theme toggle (persisted) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "pulse-theme";

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeToggle.setAttribute("aria-pressed", "true");
    } else {
      root.removeAttribute("data-theme");
      themeToggle.setAttribute("aria-pressed", "false");
    }
  }

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable, ignore */ }
  }

  (function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
    if (saved) {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyTheme("dark");
    }
  })();

  themeToggle.addEventListener("click", toggleTheme);

  /* ---------- Magnetic / glow hero card ---------- */
  const magnetCard = document.getElementById("magnetCard");
  if (magnetCard) {
    magnetCard.addEventListener("pointermove", (e) => {
      const rect = magnetCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) * 6;
      magnetCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      magnetCard.style.setProperty("--mx", `${x}px`);
      magnetCard.style.setProperty("--my", `${y}px`);
    });
    magnetCard.addEventListener("pointerleave", () => {
      magnetCard.style.transform = "rotateX(0) rotateY(0)";
    });
  }

  /* ---------- Tilt card in hover grid ---------- */
  const tiltCard = document.getElementById("tiltCard");
  if (tiltCard) {
    const inner = tiltCard.querySelector(".hcard-inner");
    tiltCard.addEventListener("pointermove", (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      inner.style.transform = `rotateX(${py * -10}deg) rotateY(${px * 10}deg)`;
    });
    tiltCard.addEventListener("pointerleave", () => {
      inner.style.transform = "rotateX(0) rotateY(0)";
    });
  }

  /* ---------- Ripple button ---------- */
  document.querySelectorAll(".ripple-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * 1.4;
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  /* ---------- Flexbox / Grid layout switcher ---------- */
  const layoutBox = document.getElementById("layoutBox");
  const layoutCaption = document.getElementById("layoutCaption");
  const captions = {
    flex: "display: flex; flex-wrap: wrap; align-items: flex-end;",
    grid: "display: grid; grid-template-columns: repeat(3, 1fr);",
  };

  document.querySelectorAll(".layout-switch-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".layout-switch-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const mode = btn.dataset.mode;
      layoutBox.setAttribute("data-mode", mode);
      layoutCaption.textContent = captions[mode];
    });
  });

  /* ---------- Sliding gallery: arrows + dots ---------- */
  const track = document.getElementById("gallery-track");
  const dotsWrap = document.getElementById("galleryDots");
  const prevBtn = document.getElementById("galleryPrev");
  const nextBtn = document.getElementById("galleryNext");

  if (track && dotsWrap) {
    const cards = Array.from(track.children);
    cards.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", () => {
        cards[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      });
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function scrollByCard(dir) {
      const cardWidth = cards[0].getBoundingClientRect().width + 18;
      track.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
    }
    prevBtn.addEventListener("click", () => scrollByCard(-1));
    nextBtn.addEventListener("click", () => scrollByCard(1));

    let scrollTimeout;
    track.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const trackCenter = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let closestDist = Infinity;
        cards.forEach((c, i) => {
          const dist = Math.abs((c.offsetLeft + c.clientWidth / 2) - trackCenter);
          if (dist < closestDist) { closestDist = dist; closest = i; }
        });
        dots.forEach((d, i) => d.classList.toggle("is-active", i === closest));
      }, 80);
    });
  }

  /* ---------- Command palette ---------- */
  const paletteOverlay = document.getElementById("paletteOverlay");
  const paletteInput = document.getElementById("paletteInput");
  const paletteList = document.getElementById("paletteList");
  const paletteTrigger = document.getElementById("paletteTrigger");

  const commands = [
    { label: "Go to Layout patterns", meta: "section", action: () => scrollToId("layout") },
    { label: "Go to Hover & motion", meta: "section", action: () => scrollToId("hover") },
    { label: "Go to Sliding gallery", meta: "section", action: () => scrollToId("gallery") },
    { label: "Go to Glass & gradient", meta: "section", action: () => scrollToId("glass") },
    { label: "Go to CSS-only modal", meta: "section", action: () => scrollToId("modal") },
    { label: "Toggle light / dark theme", meta: "⌘D", action: toggleTheme },
    { label: "Switch layout demo to Flexbox", meta: "layout", action: () => setLayoutMode("flex") },
    { label: "Switch layout demo to Grid", meta: "layout", action: () => setLayoutMode("grid") },
    { label: "Open CSS-only modal", meta: "modal", action: () => { location.hash = "css-modal"; } },
    { label: "Scroll to top", meta: "⌘↑", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
  ];

  function setLayoutMode(mode) {
    const btn = document.querySelector(`.layout-switch-btn[data-mode="${mode}"]`);
    if (btn) btn.click();
    scrollToId("layout");
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  let activeIndex = 0;
  let filtered = commands.slice();

  function renderPalette() {
    paletteList.innerHTML = "";
    filtered.forEach((cmd, i) => {
      const li = document.createElement("li");
      li.className = i === activeIndex ? "is-active" : "";
      const label = document.createElement("span");
      label.textContent = cmd.label;
      const meta = document.createElement("span");
      meta.className = "p-meta";
      meta.textContent = cmd.meta;
      li.appendChild(label);
      li.appendChild(meta);
      li.addEventListener("mouseenter", () => { activeIndex = i; renderPalette(); });
      li.addEventListener("click", () => runActive());
      paletteList.appendChild(li);
    });
  }

  function runActive() {
    const cmd = filtered[activeIndex];
    if (cmd) {
      cmd.action();
      closePalette();
    }
  }

  function openPalette() {
    paletteOverlay.classList.add("is-open");
    paletteInput.value = "";
    filtered = commands.slice();
    activeIndex = 0;
    renderPalette();
    setTimeout(() => paletteInput.focus(), 30);
  }

  function closePalette() {
    paletteOverlay.classList.remove("is-open");
  }

  paletteInput.addEventListener("input", () => {
    const q = paletteInput.value.trim().toLowerCase();
    filtered = commands.filter((c) => c.label.toLowerCase().includes(q));
    activeIndex = 0;
    renderPalette();
  });

  paletteInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
      renderPalette();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      renderPalette();
    } else if (e.key === "Enter") {
      e.preventDefault();
      runActive();
    } else if (e.key === "Escape") {
      closePalette();
    }
  });

  paletteOverlay.addEventListener("click", (e) => {
    if (e.target === paletteOverlay) closePalette();
  });
  paletteTrigger.addEventListener("click", openPalette);

  document.addEventListener("keydown", (e) => {
    const meta = e.metaKey || e.ctrlKey;
    if (meta && e.key.toLowerCase() === "k") {
      e.preventDefault();
      paletteOverlay.classList.contains("is-open") ? closePalette() : openPalette();
    } else if (meta && e.key.toLowerCase() === "d") {
      e.preventDefault();
      toggleTheme();
    } else if (e.key === "Escape") {
      closePalette();
      if (location.hash === "#css-modal") {
        location.hash = "modal";
      }
    }
  });
})();
