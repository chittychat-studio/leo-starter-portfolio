/*
  main.js: renders content.js into the page and adds the interactions
  (theme toggle, mobile menu, GSAP motion, 3D hero, active nav, copy email).
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
    avatar.src = get("person.avatar");
    avatar.alt = "Portrait of " + (get("person.name") || "the site owner");
  } else {
    avatar.parentElement.hidden = true;
  }

  /* ---------- projects ---------- */
  var list = document.getElementById("project-list");
  (get("projects.items") || []).forEach(function (p) {
    var links = el("div", { className: "project-links" });
    if (isSafeUrl(p.live)) links.appendChild(link(p.live, "Live site", "project-link", true));
    if (isSafeUrl(p.code)) links.appendChild(link(p.code, "Source code", "project-link", true));

    var tags = el("ul", { className: "tags", "aria-label": "Built with" });
    (p.tags || []).forEach(function (t) { tags.appendChild(el("li", { text: t })); });

    var media = el("div", { className: "project-media" });
    if (p.image) {
      media.appendChild(el("img", { src: p.image, alt: p.imageAlt || "", loading: "lazy", width: "960", height: "600" }));
    }

    list.appendChild(el("li", { className: "project" }, [
      media,
      el("div", { className: "project-body" }, [
        p.year ? el("p", { className: "project-meta", text: p.year }) : null,
        el("h3", { className: "project-title", text: p.title }),
        el("p", { className: "project-text", text: p.description }),
        tags,
        links.children.length ? links : null
      ])
    ]));
  });

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

  /* ---------- motion (GSAP + ScrollTrigger) ----------
     Content is visible by default. GSAP only animates *from* a start state,
     so if a script fails to load the page still reads normally. */
  var gsap = window.gsap;
  if (gsap && window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
    var mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", function () {
      // The one authored moment: the name lifts out of its masks, then the rest settles.
      var intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .from(".hero-name .word-inner", { yPercent: 115, duration: 1.1, stagger: 0.09 })
        .from(".hero-role, .hero-tagline, .hero-ctas", { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.75")
        .from(".hero-stage", { autoAlpha: 0, scale: 0.92, duration: 1.2 }, 0.1);

      // Project images open from an inset frame as they scroll into view.
      gsap.utils.toArray(".project").forEach(function (project) {
        var media = project.querySelector(".project-media");
        var img = project.querySelector(".project-media img");
        var body = project.querySelector(".project-body");
        gsap.fromTo(media,
          { clipPath: "inset(10% 8% 10% 8% round 14px)" },
          { clipPath: "inset(0% 0% 0% 0% round 14px)", ease: "none",
            scrollTrigger: { trigger: project, start: "top 92%", end: "top 35%", scrub: 0.6 } });
        if (img) {
          gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: "none",
            scrollTrigger: { trigger: project, start: "top 92%", end: "bottom 30%", scrub: 0.6 } });
        }
        gsap.from(body.children, {
          y: 24, autoAlpha: 0, duration: 0.7, ease: "expo.out", stagger: 0.06,
          scrollTrigger: { trigger: project, start: "top 75%", once: true }
        });
      });

      // The career line fills as you read down the timeline.
      gsap.fromTo(".timeline-fill", { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: "#timeline", start: "top 70%", end: "bottom 60%", scrub: 0.4 }
      });
      gsap.utils.toArray(".timeline-item").forEach(function (item) {
        gsap.from(item, { x: -16, autoAlpha: 0, duration: 0.6, ease: "expo.out",
          scrollTrigger: { trigger: item, start: "top 82%", once: true } });
      });

      // The email address arrives with a gentle blur-to-sharp focus pull.
      gsap.from(".contact-email", { autoAlpha: 0, filter: "blur(10px)", y: 12, duration: 0.9, ease: "expo.out",
        scrollTrigger: { trigger: ".contact", start: "top 70%", once: true } });
    });

    mm.add("(prefers-reduced-motion: reduce)", function () {
      // No movement. A short cross-fade on the hero keeps the arrival legible.
      gsap.from(".hero-text, .hero-stage", { autoAlpha: 0, duration: 0.4, ease: "power1.out" });
    });

    // Fonts and lazy images change heights; refresh trigger positions once they settle.
    window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
  }

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
