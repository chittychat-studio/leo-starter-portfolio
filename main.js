/*
  main.js: renders content.js into the page and adds the interactions
  (theme toggle, mobile menu, story, horizontal work rail, gallery,
  project pages, custom cursor, 3D hero, active nav, copy email).
  Authored motion lives in motion.js. No animation library: browser APIs only.
  Original code for Leo's starter. MIT licence, see LICENSE.
*/
(function () {
  "use strict";

  var data = window.PORTFOLIO;
  if (!data) {
    var warn = document.createElement("p");
    warn.className = "noscript";
    warn.textContent = "content.js did not load. Check that it sits next to index.html.";
    document.body.prepend(warn);
    return;
  }

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- helpers ---------- */
  function get(path) {
    return path.split(".").reduce(function (obj, key) {
      return obj == null ? undefined : obj[key];
    }, data);
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (key === "text") node.textContent = attrs[key];
      else if (key === "className") node.className = attrs[key];
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) { if (child) node.appendChild(child); });
    return node;
  }

  var SVG_NS = "http://www.w3.org/2000/svg";
  function arrowIcon() {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M4.5 11.5l7-7M5.5 4.5h6v6");
    svg.appendChild(path);
    return svg;
  }

  function isSafeUrl(url) {
    // Allow normal web links, mail links, in-page anchors and relative paths only.
    return typeof url === "string" && url !== "" &&
      !/^\s*(javascript|data|vbscript):/i.test(url);
  }

  function link(href, label, className, withArrow) {
    var a = el("a", { href: href, className: className });
    a.appendChild(document.createTextNode(label));
    if (/^https?:/i.test(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      if (withArrow) a.appendChild(arrowIcon());
    }
    return a;
  }

  /* ---------- page text ---------- */
  document.title = get("site.title") || get("person.name") || "Portfolio";
  var desc = document.querySelector('meta[name="description"]');
  if (desc && get("site.description")) desc.setAttribute("content", get("site.description"));

  document.querySelectorAll("[data-bind]").forEach(function (node) {
    var value = get(node.getAttribute("data-bind"));
    if (value == null || value === "") node.hidden = true;
    else node.textContent = value;
  });
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- hero ---------- */
  // Each word sits in its own mask so the intro can lift it into place.
  var nameEl = document.getElementById("hero-name");
  var words = String(get("person.name") || "").split(/\s+/).filter(Boolean);
  words.forEach(function (word, i) {
    var inner = el(i === words.length - 1 && words.length > 1 ? "em" : "span", { className: "word-inner", text: word });
    nameEl.appendChild(el("span", { className: "word" }, [inner]));
  });

  var ctas = document.getElementById("hero-ctas");
  [["hero.primaryCta", "btn btn-primary"], ["hero.secondaryCta", "btn btn-ghost"]].forEach(function (pair) {
    var cta = get(pair[0]);
    if (cta && cta.label && isSafeUrl(cta.href)) ctas.appendChild(link(cta.href, cta.label, pair[1]));
  });
  if (isSafeUrl(get("person.resume"))) ctas.appendChild(link(get("person.resume"), "Download CV", "btn btn-ghost"));

  /* ---------- about ---------- */
  var aboutText = document.getElementById("about-text");
  (get("about.paragraphs") || []).forEach(function (p) { aboutText.appendChild(el("p", { text: p })); });
  var skills = document.getElementById("skills");
  (get("about.skills") || []).forEach(function (s) { skills.appendChild(el("li", { text: s })); });
  var avatar = document.getElementById("avatar");
  if (get("person.avatar")) {
    // A missing or broken image hides the portrait instead of showing a broken icon.
    avatar.addEventListener("error", function () { avatar.parentElement.hidden = true; });
    avatar.src = get("person.avatar");
    avatar.alt = "Portrait of " + (get("person.name") || "the site owner");
  } else {
    avatar.parentElement.hidden = true;
  }

  /* ---------- story (pinned "how I work") ---------- */
  var chapters = get("story.chapters") || [];
  var storyFrame = document.getElementById("story-frame");
  var storySteps = document.getElementById("story-steps");
  chapters.forEach(function (c, i) {
    if (c.image) {
      storyFrame.appendChild(el("img", { src: c.image, alt: "", width: "800", height: "1000", className: storyFrame.children.length ? "" : "is-active", "data-step": String(i) }));
    }
    var step = el("li", { className: "story-step" + (i === 0 ? " is-active" : ""), "data-step": String(i) }, [
      el("h3", { className: "story-step-title", text: c.title }),
      el("p", { className: "story-step-text", text: c.text }),
      c.image ? el("img", { className: "story-step-media", src: c.image, alt: c.imageAlt || "", loading: "lazy", width: "800", height: "1000" }) : null
    ]);
    storySteps.appendChild(step);
  });
  var storyProgress = document.getElementById("story-progress");
  chapters.forEach(function (c, i) { storyProgress.appendChild(el("span", { className: i === 0 ? "is-on" : "" })); });
  if (!chapters.length) document.getElementById("story").hidden = true;

  /* ---------- projects (horizontal rail cards) ---------- */
  var projectItems = (get("projects.items") || []).filter(function (p) { return p && p.title; });
  projectItems.forEach(function (p, i) {
    if (!p.slug) p.slug = String(p.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    p.slug = String(p.slug).toLowerCase();
    p._index = i;
  });
  var list = document.getElementById("project-list");
  projectItems.forEach(function (p, i) {
    var tags = el("ul", { className: "tags", "aria-label": "Built with" });
    (p.tags || []).forEach(function (t) { tags.appendChild(el("li", { text: t })); });
    // No image: the card leads with its title instead of an empty box.
    var media = p.image ? el("div", { className: "rail-media" }, [
      el("img", { src: p.image, alt: p.imageAlt || "", loading: "lazy", width: "960", height: "600", "data-slug": p.slug })
    ]) : null;
    list.appendChild(el("li", { className: "rail-card" }, [
      el("a", { className: "rail-link", href: "#/work/" + p.slug, "data-cursor": "View" }, [
        media,
        el("p", { className: "rail-meta" }, [
          p.year ? el("span", { text: p.year }) : null,
          p.role ? el("span", { text: p.role }) : null
        ]),
        el("h3", { className: "rail-title", text: p.title }),
        el("p", { className: "rail-text", text: p.description }),
        tags
      ])
    ]));
  });

  /* ---------- gallery ---------- */
  var galleryGrid = document.getElementById("gallery-grid");
  var galleryItems = get("gallery.items") || [];
  galleryItems.forEach(function (g) {
    var tall = g.shape === "tall";
    galleryGrid.appendChild(el("li", { className: "gallery-item " + (tall ? "is-tall" : "is-wide") }, [
      el("figure", { className: "reveal-media" }, [
        el("div", { className: "reveal-frame" }, [
          el("img", { src: g.src, alt: g.alt || "", loading: "lazy", width: tall ? "800" : "960", height: tall ? "1000" : "600" })
        ]),
        g.caption ? el("figcaption", { text: g.caption }) : null
      ])
    ]));
  });
  if (!galleryItems.length) document.getElementById("gallery").hidden = true;

  /* ---------- experience ---------- */
  var timeline = document.getElementById("timeline");
  (get("experience.items") || []).forEach(function (job) {
    timeline.appendChild(el("li", { className: "timeline-item" }, [
      el("p", { className: "timeline-period", text: job.period }),
      el("h3", { className: "timeline-role" }, [
        document.createTextNode(job.role + " "),
        el("span", { className: "timeline-company", text: "at " + job.company })
      ]),
      el("p", { className: "timeline-summary", text: job.summary })
    ]));
  });

  /* ---------- contact ---------- */
  var email = get("person.email") || "";
  var mailto = document.getElementById("mailto");
  var copyBtn = document.getElementById("copy-email");
  var copyStatus = document.getElementById("copy-status");
  if (email) {
    mailto.href = "mailto:" + email;
  } else {
    mailto.hidden = true;
    copyBtn.hidden = true;
  }

  function fallbackCopy(text) {
    var area = el("textarea", { readonly: "", "aria-hidden": "true" });
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  var statusTimer;
  function showStatus(message) {
    copyStatus.textContent = message;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () { copyStatus.textContent = ""; }, 3000);
  }

  copyBtn.addEventListener("click", function () {
    var done = function () { showStatus("Copied to your clipboard."); };
    var failed = function () {
      showStatus(fallbackCopy(email) ? "Copied to your clipboard." : "Could not copy. The address is " + email + ".");
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(email).then(done, failed);
    else failed();
  });

  /* ---------- social ---------- */
  var social = document.getElementById("social");
  (data.social || []).forEach(function (s) {
    if (isSafeUrl(s.href)) social.appendChild(el("li", {}, [link(s.href, s.label, "")]));
  });

  /* ---------- theme toggle ---------- */
  var themeBtn = document.querySelector(".theme-toggle");
  function syncThemeButton() {
    var dark = root.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("leo-theme", next); } catch (e) {}
    syncThemeButton();
  });
  // Follow the system setting until the visitor picks a theme themselves.
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  if (darkQuery.addEventListener) {
    darkQuery.addEventListener("change", function (e) {
      var saved = null;
      try { saved = localStorage.getItem("leo-theme"); } catch (err) {}
      if (!saved) { root.setAttribute("data-theme", e.matches ? "dark" : "light"); syncThemeButton(); }
    });
  }
  syncThemeButton();

  /* ---------- mobile menu ---------- */
  var menuBtn = document.querySelector(".menu-toggle");
  var navLinks = document.getElementById("nav-links");
  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    navLinks.classList.toggle("is-open", open);
  }
  menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
  navLinks.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
  });

  /* ---------- header border on scroll ---------- */
  var header = document.querySelector(".site-header");
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- active nav highlight ---------- */
  var navMap = {};
  navLinks.querySelectorAll('a[href^="#"]').forEach(function (a) { navMap[a.getAttribute("href").slice(1)] = a; });
  function setActive(id) {
    Object.keys(navMap).forEach(function (key) {
      var on = key === id;
      navMap[key].classList.toggle("is-active", on);
      if (on) navMap[key].setAttribute("aria-current", "true");
      else navMap[key].removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(navMap).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) navObserver.observe(section);
    });
    window.addEventListener("scroll", function () { if (window.scrollY < 80) setActive(""); }, { passive: true });
  }

  /* ---------- reveal on scroll (native, no library) ----------
     Sections and images start hidden only when html.motion-ok is set,
     so with JavaScript off or reduced motion on, everything is visible.
     Only opacity, transform and clip-path change: no layout shift. */
  var noop = function () {};
  var M = window.LeoMotion || { ready: false, intro: noop, scrubFill: noop };
  var canObserve = "IntersectionObserver" in window;
  function syncMotionClass() { root.classList.toggle("motion-ok", canObserve && !reduceMotion.matches); }
  syncMotionClass();
  if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", syncMotionClass);

  var revealObserver = canObserve ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }) : null;
  function observeReveals(scope) {
    (scope || document).querySelectorAll("[data-reveal], .reveal-media").forEach(function (n) {
      if (revealObserver) revealObserver.observe(n);
      else n.classList.add("is-in");
    });
  }
  [
    ["#home-view .section-title", 0], ["#home-view .section-intro", 80],
    ["#home-view .about-body", 80], ["#home-view .about-portrait", 160],
    ["#home-view .contact-text", 80], ["#home-view .timeline-item", 0],
    ["#home-view .contact-email", 160]
  ].forEach(function (pair) {
    document.querySelectorAll(pair[0]).forEach(function (n) {
      n.setAttribute("data-reveal", "");
      if (pair[1]) n.style.setProperty("--reveal-delay", pair[1] + "ms");
    });
  });
  observeReveals(document.getElementById("home-view"));

  /* ---------- authored motion (motion.js: Web Animations API, scroll-driven CSS) ---------- */
  M.intro();
  M.scrubFill(document.querySelector(".timeline-fill"), "#timeline");

  /* ---------- pinned story: the active chapter swaps the picture ---------- */
  function setChapter(i) {
    // A chapter without a picture keeps the previous one on screen.
    var hasImage = !!storyFrame.querySelector('img[data-step="' + i + '"]');
    storySteps.querySelectorAll(".story-step").forEach(function (s) { s.classList.toggle("is-active", s.getAttribute("data-step") === String(i)); });
    if (hasImage) storyFrame.querySelectorAll("img").forEach(function (img) { img.classList.toggle("is-active", img.getAttribute("data-step") === String(i)); });
    Array.prototype.forEach.call(storyProgress.children, function (bar, k) { bar.classList.toggle("is-on", k <= i); });
  }
  if (canObserve) {
    var storyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) setChapter(+entry.target.getAttribute("data-step")); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    storySteps.querySelectorAll(".story-step").forEach(function (s) { storyObserver.observe(s); });
  }

  /* ---------- views (home and project detail) ---------- */
  var homeView = document.getElementById("home-view");
  var projectView = document.getElementById("project-view");

  /* ---------- pinned horizontal rail ----------
     On wide screens with motion allowed, the rail gets a tall outer box and a
     sticky inner box; vertical scroll progress moves the track sideways.
     Native scrolling is never hijacked. Everywhere else the track is a normal
     swipeable row (phones) or a two-column grid (reduced motion). */
  var rail = document.getElementById("rail");
  var railSticky = rail.querySelector(".rail-sticky");
  var track = list;
  var meter = document.getElementById("rail-meter");
  var railQuery = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
  var railShift = 0, railTicking = false;

  function railActive() { return railQuery.matches && !homeView.hidden && projectItems.length > 1; }
  function layoutRail() {
    if (!railActive()) {
      root.classList.remove("rail-pinned");
      rail.style.height = "";
      track.style.transform = "";
      return;
    }
    root.classList.add("rail-pinned");
    railShift = Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
    rail.style.height = (railSticky.offsetHeight + railShift) + "px";
    rail.style.setProperty("--rail-shift", railShift + "px"); // read by the CSS scroll-driven animation
    updateRail();
  }
  function railTravel() { return rail.offsetHeight - railSticky.offsetHeight; }
  // Browsers with CSS scroll-driven animations move the track in CSS (styles.css);
  // this handler is the fallback for the rest.
  var cssRail = !!(window.CSS && CSS.supports && CSS.supports("animation-timeline: view()"));
  function updateRail() {
    railTicking = false;
    if (cssRail || !root.classList.contains("rail-pinned")) return;
    var travel = railTravel();
    var p = travel > 0 ? Math.min(1, Math.max(0, -rail.getBoundingClientRect().top / travel)) : 0;
    track.style.transform = "translate3d(" + (-p * railShift).toFixed(1) + "px, 0, 0)";
    meter.style.transform = "scaleX(" + p.toFixed(4) + ")";
  }
  window.addEventListener("scroll", function () {
    if (!railTicking) { railTicking = true; requestAnimationFrame(updateRail); }
  }, { passive: true });
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { layoutRail();  }, 120);
  });
  if (railQuery.addEventListener) railQuery.addEventListener("change", layoutRail);
  // Keyboard users: tabbing to a card scrolls the page so that card is in view.
  track.addEventListener("focusin", function (e) {
    if (!root.classList.contains("rail-pinned") || railShift <= 0) return;
    var card = e.target.closest(".rail-card");
    if (!card) return;
    var gutter = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    var p = Math.min(1, Math.max(0, (card.offsetLeft - gutter) / railShift));
    var top = rail.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + p * railTravel(), behavior: "auto" });
  });

  /* ---------- custom cursor (fine pointers only, never with reduced motion) ----------
     A ring that trails the real pointer and grows over links and images.
     The system cursor stays visible, so nothing depends on this. */
  var cursor = document.getElementById("cursor");
  var cursorLabel = document.getElementById("cursor-label");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  var cx = -100, cy = -100, tx = -100, ty = -100, cursorRaf = 0;
  function cursorOn() { return finePointer.matches && !reduceMotion.matches; }
  function cursorLoop() {
    cx += (tx - cx) * 0.22;
    cy += (ty - cy) * 0.22;
    cursor.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
    cursorRaf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.2 ? requestAnimationFrame(cursorLoop) : 0;
  }
  function syncCursor() {
    root.classList.toggle("has-cursor", cursorOn());
    if (!cursorOn()) cursor.classList.remove("is-visible");
  }
  syncCursor();
  if (finePointer.addEventListener) finePointer.addEventListener("change", syncCursor);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", syncCursor);
  document.addEventListener("pointermove", function (e) {
    if (!cursorOn() || e.pointerType !== "mouse") return;
    tx = e.clientX; ty = e.clientY;
    if (!cursor.classList.contains("is-visible")) { cx = tx; cy = ty; cursor.classList.add("is-visible"); }
    if (!cursorRaf) cursorRaf = requestAnimationFrame(cursorLoop);
  }, { passive: true });
  document.addEventListener("pointerover", function (e) {
    if (!cursorOn() || !e.target.closest) return;
    var labelled = e.target.closest("[data-cursor]");
    var media = e.target.closest("img, .hero-stage");
    var hot = e.target.closest("a, button, label, select, input, textarea, summary");
    cursor.classList.toggle("is-media", !!labelled || !!media);
    cursor.classList.toggle("is-link", !labelled && !media && !!hot);
    cursorLabel.textContent = labelled ? labelled.getAttribute("data-cursor") : "";
  });
  document.documentElement.addEventListener("pointerleave", function () { cursor.classList.remove("is-visible"); });
  document.addEventListener("pointerdown", function () { cursor.classList.add("is-down"); });
  document.addEventListener("pointerup", function () { cursor.classList.remove("is-down"); });

  /* ---------- project detail view (#/work/<slug>) ----------
     Uses the View Transitions API where the browser has it, so the card
     image grows into the page header. Elsewhere the view simply swaps. */
  var siteTitle = document.title;
  var homeScroll = 0;
  var lastSlug = null;

  function routeSlug() {
    var m = location.hash.match(/^#\/work\/([a-z0-9-]+)\/?$/i);
    return m ? m[1].toLowerCase() : null;
  }
  function findProject(slug) {
    for (var i = 0; i < projectItems.length; i++) if (projectItems[i].slug === slug) return projectItems[i];
    return null;
  }
  function backIcon() {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M10 3.5L5.5 8l4.5 4.5");
    svg.appendChild(path);
    return svg;
  }

  function renderProject(p) {
    projectView.textContent = "";
    var facts = el("dl", { className: "pv-facts" });
    [["Year", p.year], ["Role", p.role], ["Client", p.client], ["Built with", (p.tags || []).join(", ")]].forEach(function (f) {
      if (f[1]) facts.appendChild(el("div", {}, [el("dt", { text: f[0] }), el("dd", { text: f[1] })]));
    });
    var back = el("a", { className: "pv-back", href: "#projects" }, [backIcon(), document.createTextNode("All work")]);
    var hero = p.image ? el("figure", { className: "pv-hero" }, [el("img", { src: p.image, alt: p.imageAlt || "", width: "960", height: "600" })]) : null;
    var storyBox = el("div", { className: "pv-story" });
    (p.story && p.story.length ? p.story : [p.description]).forEach(function (t) { storyBox.appendChild(el("p", { text: t })); });
    var results = el("ul", { className: "pv-results", "aria-labelledby": "pv-results-title" });
    (p.results || []).forEach(function (r) {
      results.appendChild(el("li", {}, [el("span", { className: "pv-result-value", text: r.value }), el("span", { className: "pv-result-label", text: r.label })]));
    });
    var resultsBox = results.children.length ? el("div", {}, [el("h2", { className: "pv-results-title", id: "pv-results-title", text: "Results" }), results]) : null;
    var gallery = el("div", { className: "pv-gallery" });
    (p.gallery || []).forEach(function (g) {
      gallery.appendChild(el("figure", { className: "reveal-media" }, [
        el("div", { className: "reveal-frame" }, [el("img", { src: g.src, alt: g.alt || "", loading: "lazy", width: "960", height: "600" })]),
        g.caption ? el("figcaption", { text: g.caption }) : null
      ]));
    });
    var links = el("div", { className: "project-links" });
    if (isSafeUrl(p.live)) links.appendChild(link(p.live, "Live site", "project-link", true));
    if (isSafeUrl(p.code)) links.appendChild(link(p.code, "Source code", "project-link", true));
    var next = projectItems[(p._index + 1) % projectItems.length];
    var nextLink = next && next !== p ? el("a", { className: "pv-next", href: "#/work/" + next.slug, "data-cursor": "Next" }, [
      el("span", { className: "pv-next-title", text: next.title }),
      el("span", { className: "pv-next-label", text: "Next project" })
    ]) : null;

    projectView.appendChild(el("div", { className: "container pv" }, [
      back,
      el("header", { className: "pv-head" }, [
        el("h1", { className: "pv-title", id: "pv-title", tabindex: "-1", text: p.title }),
        el("p", { className: "pv-lede", text: p.description }),
        facts
      ]),
      hero,
      el("div", { className: "pv-body" }, [storyBox, resultsBox]),
      gallery.children.length ? gallery : null,
      links.children.length ? links : null,
      nextLink
    ]));
    observeReveals(projectView);
  }

  // Exactly one rendered element may carry the shared transition name at a time.
  function nameSharedImage(slug) {
    list.querySelectorAll("img[data-slug]").forEach(function (img) {
      img.style.viewTransitionName = img.getAttribute("data-slug") === slug ? "project-hero" : "";
    });
  }
  function swapView(update) {
    if (!document.startViewTransition || reduceMotion.matches) { update(); return; }
    document.startViewTransition(update);
  }

  function showRoute(initial) {
    var slug = routeSlug();
    var p = slug ? findProject(slug) : null;
    var fromProject = !projectView.hidden;
    if (p) {
      if (!fromProject) homeScroll = window.scrollY;
      nameSharedImage(p.slug);
      lastSlug = p.slug;
      var open = function () {
        renderProject(p);
        homeView.hidden = true;
        projectView.hidden = false;
        document.title = p.title + " | " + siteTitle;
        root.classList.add("is-project");
        layoutRail();
        window.scrollTo(0, 0);
        var h = document.getElementById("pv-title");
        if (h && !initial) h.focus({ preventScroll: true });
      };
      if (initial) open(); else swapView(open);
      return;
    }
    if (!fromProject) return; // a normal in-page anchor on the home view: the browser scrolls
    var hash = location.hash;
    var target = hash.length > 1 && hash.indexOf("#/") !== 0 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    nameSharedImage(lastSlug);
    swapView(function () {
      projectView.hidden = true;
      projectView.textContent = "";
      homeView.hidden = false;
      document.title = siteTitle;
      root.classList.remove("is-project");
      layoutRail();
      
      if (hash === "#projects" || hash === "" || hash === "#/") {
        window.scrollTo(0, homeScroll);
        var card = lastSlug && list.querySelector('a[href="#/work/' + lastSlug + '"]');
        if (card) card.focus({ preventScroll: true });
      } else if (target) {
        target.scrollIntoView();
      }
    });
  }
  window.addEventListener("hashchange", function () { showRoute(false); });
  showRoute(true);
  layoutRail();
  window.addEventListener("load", layoutRail);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutRail);

  /* ---------- 3D hero (three.js, lazy loaded) ----------
     Only when WebGL works and reduced motion is off. three.js is an ES module,
     so it needs the page served over http(s); opened from disk, the static
     SVG artwork stays in place. */
  var stage = document.getElementById("hero-stage");
  function webglAvailable() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) { return false; }
  }
  function loadHero3d() {
    if (reduceMotion.matches || location.protocol === "file:" || !webglAvailable()) return;
    import("./hero3d.js")
      .then(function (mod) { mod.startHero(stage); })
      .catch(function (err) {
        // Keep the static artwork; log quietly for whoever is editing the template.
        if (window.console) console.info("3D hero not started, static artwork shown:", err && err.message);
      });
  }
  if ("requestIdleCallback" in window) requestIdleCallback(loadHero3d, { timeout: 1200 });
  else setTimeout(loadHero3d, 300);
})();
