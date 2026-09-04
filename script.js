(function () {
  "use strict";

  var root = document.documentElement;
  var cinema = document.getElementById("cinema");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SCALE = window.innerWidth <= 640 ? 0.82 : 1;
  var SCROLL_LENGTH = Math.round(4000 * SCALE);
  root.style.setProperty("--scroll-length", SCROLL_LENGTH + "px");

  /* Real viewport height (fixes mobile browser toolbar show/hide jumps,
     which is what breaks the sticky stage when the page scrolls quickly,
     e.g. right after a nav click). */
  function setVH() {
    root.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
  }
  setVH();
  window.addEventListener("resize", setVH);
  window.addEventListener("orientationchange", setVH);

  /* ---------------------------------------------------------
     Scroll + pointer driven cinematic choreography
     --------------------------------------------------------- */

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function progress(a, b, v) { return clamp01((v - a) / (b - a)); }
  // trapezoid: 0 -> ramps up between inStart/inEnd -> holds at 1 -> ramps
  // down between outStart/outEnd -> 0. Used for layers that should fully
  // appear, hold for a comfortable read, then fully disappear.
  function trapezoid(v, inStart, inEnd, outStart, outEnd) {
    if (v <= inStart) return 0;
    if (v < inEnd) return (v - inStart) / (inEnd - inStart);
    if (v <= outStart) return 1;
    if (v < outEnd) return 1 - (v - outStart) / (outEnd - outStart);
    return 0;
  }

  var rawScroll = 0;
  var smoothScroll = 0;
  var targetMouseX = 0;
  var targetMouseY = 0;
  var mouseX = 0;
  var mouseY = 0;

  function readScroll() {
    var top = cinema.offsetTop;
    rawScroll = Math.max(0, Math.min(SCROLL_LENGTH, window.scrollY - top));
  }

  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("resize", readScroll);

  if (!reduceMotion) {
    window.addEventListener("pointermove", function (e) {
      targetMouseX = e.clientX / window.innerWidth - 0.5;
      targetMouseY = e.clientY / window.innerHeight - 0.5;
    });
  }

  /* ---------------------------------------------------------
     Scene bands (scaled to SCROLL_LENGTH so mobile keeps the
     same pacing proportions as desktop)
     --------------------------------------------------------- */
  function band(a, b) { return [a * SCALE, b * SCALE]; }

  var HERO = band(0, 500);
  var BRIDGE_OUT = band(800, 1300);
  var SPLIT_IN = band(700, 1300);
  var SPLIT_OUT = band(2000, 2300);
  // Koza Han gets a long, unhurried hold (2300 -> 3200) before it
  // crossfades into Cumalıkızık — it used to be covered by frame-two-img
  // fading in underneath it well before its own fade-out even started.
  var BAZAAR = band(2000, 2300).concat(band(3200, 3500));
  var LIVING_IN = band(3200, 3600);
  var PANEL2 = band(2300, 2700).concat(band(3600, 3900));

  function applyProgress(v) {
    var heroP = progress(HERO[0], HERO[1], v);
    var splitReveal = progress(SPLIT_IN[0], SPLIT_IN[1], v);
    var splitOp = splitReveal * (1 - progress(SPLIT_OUT[0], SPLIT_OUT[1], v));
    var bridgeOp = 1 - progress(BRIDGE_OUT[0], BRIDGE_OUT[1], v);
    var bazaarOp = trapezoid(v, BAZAAR[0], BAZAAR[1], BAZAAR[2], BAZAAR[3]);
    var livingOp = progress(LIVING_IN[0], LIVING_IN[1], v);
    var panel1Op = splitOp;
    var panel2Op = trapezoid(v, PANEL2[0], PANEL2[1], PANEL2[2], PANEL2[3]);

    root.style.setProperty("--hero-p", heroP.toFixed(4));
    root.style.setProperty("--bridge-op", bridgeOp.toFixed(4));
    root.style.setProperty("--split-reveal", splitReveal.toFixed(4));
    root.style.setProperty("--split-op", splitOp.toFixed(4));
    root.style.setProperty("--bazaar-op", bazaarOp.toFixed(4));
    root.style.setProperty("--living-op", livingOp.toFixed(4));
    root.style.setProperty("--panel1-op", panel1Op.toFixed(4));
    root.style.setProperty("--panel2-op", Math.max(0, panel2Op).toFixed(4));
  }

  /* ---------------------------------------------------------
     Nav: two kinds of links.

     1) Links with [data-scroll] point at a moment inside the
        pinned cinema stage (Intro). We scroll there
        programmatically instead of relying on the browser's
        default anchor jump — anchor jump computes its target
        from the (absolutely positioned) target element's flow
        position, which does not line up with the pinned stage
        and was landing outside the animated range, which is
        what caused the glitch/seam after clicking a menu item.

     2) Plain "#id" links (Rotalar, Fotoğraflar) point at real,
        normal-flow content that lives after the cinema stage
        (the routes planner, the gallery, the footer). Those
        are scrolled to directly with scrollIntoView, which is
        safe for normal-flow elements.
     --------------------------------------------------------- */
  var navLinks = document.querySelectorAll('a[href^="#"]');
  for (var n = 0; n < navLinks.length; n++) {
    navLinks[n].addEventListener("click", function (e) {
      var scrollAttr = this.getAttribute("data-scroll");
      if (scrollAttr !== null) {
        e.preventDefault();
        var target = parseFloat(scrollAttr) * SCALE;
        var top = cinema.offsetTop + target;
        window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
        return;
      }
      var id = this.getAttribute("href").slice(1);
      var el = id && document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    });
  }

  if (reduceMotion) {
    readScroll();
    applyProgress(rawScroll);
    root.style.setProperty("--mx", "0");
    root.style.setProperty("--my", "0");
    window.addEventListener("scroll", function () {
      readScroll();
      applyProgress(rawScroll);
    }, { passive: true });
  } else {
    readScroll();

    (function tick() {
      smoothScroll += (rawScroll - smoothScroll) * 0.09;
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      applyProgress(smoothScroll);
      root.style.setProperty("--mx", mouseX.toFixed(4));
      root.style.setProperty("--my", mouseY.toFixed(4));

      requestAnimationFrame(tick);
    })();
  }
})();
