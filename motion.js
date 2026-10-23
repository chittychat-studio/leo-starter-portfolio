/*
  motion.js: the page's choreography, built only on browser features.
  No animation library: the Web Animations API (element.animate),
  IntersectionObserver, and CSS scroll-driven animations where supported.

  main.js calls these few functions:
    LeoMotion.intro()                 the hero arrival (name lifts out of its masks)
    LeoMotion.scrubFill(el, trigger)  scales el from 0 to 1 while trigger scrolls past

  Every function is a no-op with reduced motion (the intro becomes a short
  fade) and content is visible by default, so if this file fails to load the
  page still reads normally.

  Original code for Leo's starter. MIT licence, see LICENSE.
*/
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"; // strong ease-out for entrances
  var canAnimate = typeof Element !== "undefined" && "animate" in Element.prototype;
  var cssScrub = window.CSS && CSS.supports && CSS.supports("animation-timeline: view()");

  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  // fill "backwards" holds the start frame during the delay only; nothing is hidden before
  // the script runs, and nothing stays hidden if an animation is cancelled.
  function play(el, frames, opts) {
    if (!el || !canAnimate) return null;
    return el.animate(frames, Object.assign({ easing: EASE_OUT, fill: "backwards" }, opts));
  }

  window.LeoMotion = {
    get ready() { return canAnimate && !reduce.matches; },

    intro: function () {
      if (!canAnimate) return;
      if (reduce.matches) {
        all(".hero-text, .hero-stage").forEach(function (el) {
          play(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease" });
        });
        return;
      }
      all(".hero-name .word-inner").forEach(function (el, i) {
        play(el, [{ transform: "translateY(115%)" }, { transform: "none" }], { duration: 1000, delay: i * 90 });
      });
      all(".hero-role, .hero-tagline, .hero-ctas").forEach(function (el, i) {
        play(el, [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 700, delay: 380 + i * 70 });
      });
      play(document.querySelector(".hero-stage"), [{ opacity: 0, transform: "scale(0.94)" }, { opacity: 1, transform: "none" }], { duration: 1100, delay: 100 });
    },

    scrubFill: function (el, trigger) {
      if (!el || reduce.matches) return;
      // Native scroll-driven animation where the browser has it (see .timeline-fill in styles.css).
      if (cssScrub) { el.classList.add("is-scrubbed"); return; }
      // Fallback: compute progress on scroll, one write per frame, transform only.
      var box = document.querySelector(trigger);
      if (!box) return;
      var ticking = false;
      function update() {
        ticking = false;
        var r = box.getBoundingClientRect();
        var start = window.innerHeight * 0.7, end = window.innerHeight * 0.6 - r.height;
        var p = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
        el.style.transform = "scaleY(" + p.toFixed(3) + ")";
      }
      window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      update();
    },

  };
})();
