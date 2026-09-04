/* =========================================================
   Rotalar — day-based itinerary planner
   Renders ROUTES_DATA (routes-data.js) into #routesBody,
   drives the day-count selector, the Leaflet maps, the
   timeline/marker sync and the Google Maps deep links.

   Language-aware: reads the active language from
   window.BursaI18N and re-renders on "bursa:langchange".
   ========================================================= */

(function () {
  "use strict";

  var DATA = window.ROUTES_DATA;
  if (!DATA) return;

  var body = document.getElementById("routesBody");
  var tabs = document.querySelectorAll(".day-tab");
  if (!body || !tabs.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var activeMaps = [];
  var revealObserver = null;
  var currentDayCount = 3;

  var UI = {
    tr: { stops: "Durak", start: "Başlangıç", end: "Bitiş", min: "dk", hour: "saat", openMaps: "Google Maps'te Rotayı Aç" },
    en: { stops: "Stops", start: "Start", end: "End", min: "min", hour: "hr", openMaps: "Open Route in Google Maps" }
  };

  function getLang() {
    return window.BursaI18N ? window.BursaI18N.getLang() : "tr";
  }

  /* ---------------------------------------------------------
     Small DOM + formatting helpers
     --------------------------------------------------------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function formatDistance(meters) {
    if (meters >= 1000) {
      var km = meters / 1000;
      return (km % 1 === 0 ? km.toFixed(0) : km.toFixed(1)) + " km";
    }
    return Math.round(meters) + " m";
  }

  function formatMinutes(minutes, lang) {
    return Math.round(minutes) + " " + UI[lang].min;
  }

  function formatDurationAggregate(minutes, lang) {
    if (minutes >= 60) {
      var hours = minutes / 60;
      var rounded = Math.round(hours * 2) / 2;
      return "~" + (rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)) + " " + UI[lang].hour;
    }
    return "~" + Math.round(minutes) + " " + UI[lang].min;
  }

  function transportIcon(kind) {
    if (kind === "drive") return "🚗";
    if (kind === "cable-car") return "🚡";
    return "🚶";
  }

  function daySummary(day, lang) {
    var distance = 0;
    var minutes = 0;
    day.stops.forEach(function (stop) {
      minutes += stop.durationMin;
      if (stop.distanceToNextM) distance += stop.distanceToNextM;
      if (stop.timeToNextMin) minutes += stop.timeToNextMin;
    });
    return {
      stopCount: day.stops.length,
      distance: formatDistance(distance),
      duration: formatDurationAggregate(minutes, lang),
      start: day.stops[0].name[lang],
      end: day.stops[day.stops.length - 1].name[lang]
    };
  }

  /* ---------------------------------------------------------
     Google Maps Directions deep link
     origin -> waypoint -> waypoint -> destination
     Always keyed off the Turkish (canonical) place name for
     more reliable geocoding, regardless of display language.
     --------------------------------------------------------- */

  function buildGoogleMapsUrl(day) {
    var place = function (stop) { return encodeURIComponent(stop.name.tr + ", Bursa"); };
    var stops = day.stops;
    var url = "https://www.google.com/maps/dir/?api=1"
      + "&origin=" + place(stops[0])
      + "&destination=" + place(stops[stops.length - 1])
      + "&travelmode=" + (day.mapsTravelMode || "walking");
    if (stops.length > 2) {
      var waypoints = stops.slice(1, -1).map(place).join("|");
      url += "&waypoints=" + waypoints;
    }
    return url;
  }

  /* ---------------------------------------------------------
     Timeline stop card
     --------------------------------------------------------- */

  function buildStopCard(stop, index, lang) {
    var li = el("li", "route-stop");
    li.setAttribute("data-stop-index", String(index));

    var number = el("span", "route-stop-number", String(index + 1));

    var card = el("div", "route-stop-card");
    var img = document.createElement("img");
    img.className = "route-stop-image";
    img.src = stop.image;
    img.alt = stop.name[lang];
    img.loading = "lazy";

    var cardBody = el("div", "route-stop-body");
    cardBody.appendChild(el("h4", null, stop.name[lang]));
    cardBody.appendChild(el("p", null, stop.description[lang]));

    var meta = el("div", "route-stop-meta");
    meta.appendChild(el("span", "route-stop-duration", "⏱ " + formatMinutes(stop.durationMin, lang)));
    if (stop.distanceToNextM) {
      meta.appendChild(el(
        "span",
        "route-stop-next",
        transportIcon(stop.transportToNext) + " " + formatDistance(stop.distanceToNextM) + " · " + formatMinutes(stop.timeToNextMin, lang)
      ));
    }
    cardBody.appendChild(meta);

    card.appendChild(img);
    card.appendChild(cardBody);

    li.appendChild(number);
    li.appendChild(card);

    function activate() { setActiveStop(li, index); }
    li.addEventListener("mouseenter", activate);
    li.addEventListener("focus", activate);
    li.addEventListener("click", activate);
    li.setAttribute("tabindex", "0");

    return li;
  }

  var activeMarkers = {};

  function setActiveStop(li, index) {
    var timeline = li.closest(".route-timeline");
    if (timeline) {
      var items = timeline.querySelectorAll(".route-stop");
      for (var i = 0; i < items.length; i++) items[i].classList.remove("is-active");
    }
    li.classList.add("is-active");

    var dayIndex = timeline ? timeline.getAttribute("data-day-index") : null;
    if (dayIndex !== null && activeMarkers[dayIndex]) {
      var markers = activeMarkers[dayIndex];
      markers.forEach(function (m) { m.getElement() && m.getElement().classList.remove("is-active"); });
      var marker = markers[index];
      if (marker) {
        marker.getElement() && marker.getElement().classList.add("is-active");
        marker.openPopup();
      }
    }
  }

  /* ---------------------------------------------------------
     Leaflet map for one day
     --------------------------------------------------------- */

  function buildMap(day, dayIndex, container, timeline, lang) {
    if (typeof L === "undefined") {
      container.textContent = "Harita yüklenemedi.";
      return;
    }

    var map = L.map(container, { scrollWheelZoom: false });
    activeMaps.push(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    var latlngs = day.stops.map(function (s) { return [s.lat, s.lng]; });
    var markers = [];

    L.polyline(latlngs, {
      color: "#b5662f",
      weight: 3,
      opacity: 0.75,
      dashArray: "1 10",
      lineCap: "round"
    }).addTo(map);

    day.stops.forEach(function (stop, index) {
      var icon = L.divIcon({
        className: "route-marker-wrap",
        html: '<span class="route-marker">' + (index + 1) + "</span>",
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      var marker = L.marker([stop.lat, stop.lng], { icon: icon }).addTo(map);
      marker.bindPopup("<strong>" + stop.name[lang] + "</strong>");
      marker.on("click", function () {
        var stopEl = timeline.querySelector('[data-stop-index="' + index + '"]');
        if (stopEl) {
          setActiveStop(stopEl, index);
          stopEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        }
      });
      markers.push(marker);
    });

    activeMarkers[String(dayIndex)] = markers;
    map.fitBounds(L.latLngBounds(latlngs), { padding: [32, 32] });
  }

  /* ---------------------------------------------------------
     One full day block
     --------------------------------------------------------- */

  function buildDayBlock(day, index, lang) {
    var summary = daySummary(day, lang);
    var strings = UI[lang];
    var section = el("article", "route-day");

    var hero = el("div", "route-day-hero");
    hero.appendChild(el("span", "route-day-number", day.number));
    var heroText = el("div", "route-day-heroText");
    heroText.appendChild(el("h3", null, day.title[lang]));
    heroText.appendChild(el("p", "route-day-theme", day.theme[lang]));

    var meta = el("div", "route-day-meta");
    [summary.stopCount + " " + strings.stops, summary.distance, summary.duration, day.transportIcon + " " + day.transportSummary[lang]]
      .forEach(function (text) { meta.appendChild(el("span", null, text)); });
    heroText.appendChild(meta);

    var endpoints = el("div", "route-day-endpoints");
    endpoints.appendChild(el("span", null, strings.start + " → " + summary.start));
    endpoints.appendChild(el("span", null, strings.end + " → " + summary.end));
    heroText.appendChild(endpoints);

    hero.appendChild(heroText);

    var columns = el("div", "route-day-columns");

    var timeline = el("ol", "route-timeline");
    timeline.setAttribute("data-day-index", String(index));
    day.stops.forEach(function (stop, stopIndex) {
      timeline.appendChild(buildStopCard(stop, stopIndex, lang));
    });

    var mapWrap = el("div", "route-map");
    var mapInner = el("div", "route-map-inner");
    mapInner.id = "routeMap-" + index;
    mapWrap.appendChild(mapInner);

    columns.appendChild(timeline);
    columns.appendChild(mapWrap);

    var cta = document.createElement("a");
    cta.className = "route-maps-cta";
    cta.href = buildGoogleMapsUrl(day);
    cta.target = "_blank";
    cta.rel = "noopener";
    var ctaArrow = el("span", "cta-arrow", "↗");
    ctaArrow.setAttribute("aria-hidden", "true");
    cta.appendChild(ctaArrow);
    cta.appendChild(document.createTextNode(" " + strings.openMaps));

    section.appendChild(hero);
    section.appendChild(columns);
    section.appendChild(cta);

    requestAnimationFrame(function () {
      buildMap(day, index, mapInner, timeline, lang);
    });

    return section;
  }

  /* ---------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------- */

  function observeReveal(root) {
    if (reduceMotion) {
      root.querySelectorAll(".route-stop, .route-day-hero").forEach(function (n) {
        n.classList.add("is-visible");
      });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
    }
    root.querySelectorAll(".route-stop, .route-day-hero").forEach(function (n) {
      revealObserver.observe(n);
    });
  }

  /* ---------------------------------------------------------
     Render N days, tear down old maps first
     --------------------------------------------------------- */

  function render(dayCount) {
    currentDayCount = dayCount;
    var lang = getLang();

    activeMaps.forEach(function (map) { map.remove(); });
    activeMaps = [];
    activeMarkers = {};
    body.innerHTML = "";

    DATA.days.slice(0, dayCount).forEach(function (day, index) {
      body.appendChild(buildDayBlock(day, index, lang));
    });

    observeReveal(body);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      render(parseInt(tab.getAttribute("data-days"), 10));
    });
  });

  document.addEventListener("bursa:langchange", function () {
    render(currentDayCount);
  });

  render(3);
})();
