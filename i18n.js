/* =========================================================
   Language switcher — TR / EN
   Swaps textContent/innerHTML/alt/href on [data-i18n*] elements
   and broadcasts a "bursa:langchange" event so other scripts
   (routes.js) can re-render their own dynamic content.
   ========================================================= */

(function () {
  "use strict";

  var STRINGS = {
    "nav.home": { tr: "Anasayfa", en: "Home" },
    "nav.routes": { tr: "Rotalar", en: "Routes" },
    "nav.food": { tr: "Yöresel Lezzetler", en: "Local Flavors" },
    "nav.gallery": { tr: "Fotoğraflar", en: "Photos" },

    "site.logo": { tr: "Bursa, Türkiye", en: "Bursa, Turkey" },

    "intro.text": {
      tr: "Dağın eteğinde kurulmuş, imparatorluğun, ipeğin, taşın, ormanların ve yüzyıllara yayılan bir tarihin biçimlendirdiği bir şehir.",
      en: "A city founded at the foot of a mountain, shaped by an empire, by silk, by stone, by forests and by centuries of history."
    },
    "intro.pill1": { tr: "Uludağ", en: "Uludağ" },
    "intro.pill2": { tr: "Osmanlı Başkenti", en: "Ottoman Capital" },
    "intro.pill3": { tr: "Yeşil Şehir", en: "Green City" },

    "history.title": { tr: "Şehir, dağın altında büyüdü.", en: "The city grew beneath the mountain." },
    "history.text": {
      tr: "Bursa, Osmanlı Devleti'nin ilk başkenti oldu ve yüzyıllar boyunca camiler, hanlar, çarşılar, türbeler, bahçeler ve mahalleler etrafında şekillenerek büyüdü.",
      en: "Bursa became the first capital of the Ottoman state, growing over the centuries around mosques, caravanserais, bazaars, tombs, gardens and neighborhoods."
    },
    "history.fact1": { tr: "Osmanlı başkenti", en: "Ottoman capital" },
    "history.fact2": { tr: "Tarihi Bursa ve Cumalıkızık, UNESCO listesinde", en: "Historic Bursa and Cumalıkızık, on the UNESCO list" },

    "bazaar.title": { tr: "Eski şehir hâlâ yaşıyor.", en: "The old city is still alive." },
    "bazaar.text": {
      tr: "Koza Han'dan Ulu Cami'ye, kapalı çarşılardan geleneksel sokaklara ve çay bahçelerine kadar, Bursa'nın tarihi merkezi hâlâ gündelik hayatın bir parçası.",
      en: "From Koza Han to the Grand Mosque, from covered bazaars to traditional streets and tea gardens, Bursa's historic center is still part of everyday life."
    },

    "routes.kicker": { tr: "Rotalar", en: "Routes" },
    "routes.title": { tr: "Bursa'yı nasıl keşfetmek istersin?", en: "How do you want to explore Bursa?" },
    "routes.desc": {
      tr: "Kalan sürene göre optimize edilmiş, adım adım bir gezi planı — durak durak, harita eşliğinde.",
      en: "A step-by-step itinerary optimized for the time you have — stop by stop, with the map alongside."
    },
    "routes.day1": { tr: "1 Gün", en: "1 Day" },
    "routes.day2": { tr: "2 Gün", en: "2 Days" },
    "routes.day3": { tr: "3 Gün", en: "3 Days" },

    "food.kicker": { tr: "Yöresel Lezzetler", en: "Local Flavors" },
    "food.title": { tr: "Bursa'nın sofrası", en: "The taste of Bursa" },
    "food.desc": {
      tr: "İskender'den kestane şekerine, Bursa'yı damakta hatırlatan tatlar.",
      en: "From İskender kebab to candied chestnuts — the flavors that bring Bursa back to mind."
    },
    "food.iskender.name": { tr: "İskender Kebap", en: "İskender Kebab" },
    "food.iskender.desc": {
      tr: "Kızarmış pide, tereyağı-domates sosu ve yoğurtla servis edilen Bursa'nın en tanınmış lezzeti.",
      en: "Grilled meat over toasted pide, served with butter-tomato sauce and yogurt — Bursa's most iconic dish."
    },
    "food.inegol.name": { tr: "İnegöl Köfte", en: "İnegöl Meatballs" },
    "food.inegol.desc": {
      tr: "Soğan ve baharatla harmanlanmış, yağsız ve gevrek dokusuyla ünlü İnegöl usulü köfte.",
      en: "Onion-and-spice blended meatballs from İnegöl, known for their lean, crisp texture."
    },
    "food.kestane.name": { tr: "Kestane Şekeri", en: "Candied Chestnut" },
    "food.kestane.desc": {
      tr: "Bursa kestanesinden yapılan, şerbetle kaplanmış geleneksel şekerleme.",
      en: "A traditional syrup-glazed sweet made from Bursa's own chestnuts."
    },
    "food.cantik.name": { tr: "Cantık", en: "Cantık" },
    "food.cantik.desc": {
      tr: "İç harcı etli ya da peynirli, mayalı hamurdan yapılan Bursa'ya özgü mini pide.",
      en: "A Bursa specialty — small yeasted flatbreads filled with meat or cheese."
    },
    "food.kemalpasa.name": { tr: "Kemalpaşa Tatlısı", en: "Kemalpaşa Dessert" },
    "food.kemalpasa.desc": {
      tr: "Hafif şerbetli, küçük boyutlu bir hamur tatlısı; Kemalpaşa ilçesinin adını taşır.",
      en: "A lightly syruped, bite-sized pastry dessert named after the Kemalpaşa district."
    },
    "food.suthelvasi.name": { tr: "Süt Helvası", en: "Süt Helvası (Milk Halva)" },
    "food.suthelvasi.desc": {
      tr: "Fırında kavrulmuş un ve sütle yapılan, üzeri tarçınlı, yumuşak dokulu geleneksel bir tatlı.",
      en: "A traditional dessert of oven-toasted flour and milk, soft in texture and topped with cinnamon."
    },
    "food.tahinlipide.name": { tr: "Tahinli Pide", en: "Tahini Flatbread" },
    "food.tahinlipide.desc": {
      tr: "İnce açılmış hamurun üzerine bol tahin sürülüp fırınlanan, sevilen bir Bursa kahvaltılığı.",
      en: "A thin flatbread generously brushed with tahini and baked — a beloved Bursa breakfast treat."
    },
    "food.seftali.name": { tr: "Bursa Şeftalisi", en: "Bursa Peach" },
    "food.seftali.desc": {
      tr: "Bursa ovasının sulak topraklarında yetişen, sulu ve aromatik yönüyle ünlü şeftali çeşidi.",
      en: "A juicy, aromatic peach variety grown in the fertile plains around Bursa."
    },

    "gallery.kicker": { tr: "Fotoğraflar", en: "Photos" },
    "gallery.title": { tr: "Bursa'dan kareler", en: "Frames from Bursa" },
    "gallery.desc": {
      tr: "Köprüden dağa, handan köye — şehri oluşturan yedi görüntü.",
      en: "From bridge to mountain, from caravanserai to village — seven images that make up the city."
    },
    "gallery.item1.html": {
      tr: "<span>İrgandı Köprüsü</span>Osmanlı dönemine ait, üzeri dükkânlarla kaplı tarihi köprü.",
      en: "<span>Irgandı Bridge</span>A historic Ottoman-era bridge lined with shops."
    },
    "gallery.item2.html": {
      tr: "<span>Ulu Cami</span>Erken Osmanlı mimarisinin anıtsal örneği.",
      en: "<span>Grand Mosque</span>A monumental example of early Ottoman architecture."
    },
    "gallery.item3.html": {
      tr: "<span>Koza Han</span>İpek ticaretinin kalbi, sessiz bir avlu.",
      en: "<span>Koza Han</span>The heart of the silk trade, a quiet courtyard."
    },
    "gallery.item4.html": {
      tr: "<span>Cumalıkızık</span>Korunmuş bir Osmanlı köyü, dar taş sokaklar.",
      en: "<span>Cumalıkızık</span>A preserved Ottoman village of narrow stone streets."
    },
    "gallery.item5.html": {
      tr: "<span>Tophane</span>Şehri ve Uludağ'ı gören tarihi tepe.",
      en: "<span>Tophane</span>A historic hilltop overlooking the city and Uludağ."
    },
    "gallery.item6.html": {
      tr: "<span>Uludağ — Yaz</span>Sık çam ormanları ve teleferik hattı.",
      en: "<span>Uludağ — Summer</span>Dense pine forests and the cable car line."
    },
    "gallery.item7.html": {
      tr: "<span>Uludağ — Kış</span>Zirveye uzanan pistler ve kar örtüsü.",
      en: "<span>Uludağ — Winter</span>Ski runs reaching the summit under snow."
    },

    "footer.brand": {
      tr: "Dağın altında kurulmuş, ilk Osmanlı başkenti. Sinematik bir gezi hikâyesi.",
      en: "Founded beneath the mountain, the first Ottoman capital. A cinematic travel story."
    },
    "footer.copyright": { tr: "© 2026 Bursa, Türkiye — tanıtım ve gezi rehberi.", en: "© 2026 Bursa, Turkey — a travel and discovery guide." },
    "footer.credits": {
      tr: "Görseller: yazara ait fotoğraflar ve Wikimedia Commons (CC BY-SA).",
      en: "Images: author's own photographs and Wikimedia Commons (CC BY-SA)."
    }
  };

  var STORAGE_KEY = "bursa-lang";
  var lang = "tr";
  try {
    var saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "tr" || saved === "en") lang = saved;
  } catch (e) { /* localStorage unavailable — default to tr */ }

  function applyLanguage(nextLang) {
    lang = nextLang === "en" ? "en" : "tr";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var entry = STRINGS[el.getAttribute("data-i18n")];
      if (entry) el.textContent = entry[lang];
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var entry = STRINGS[el.getAttribute("data-i18n-html")];
      if (entry) el.innerHTML = entry[lang];
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var entry = STRINGS[el.getAttribute("data-i18n-alt")];
      if (entry) el.alt = entry[lang];
    });
    document.querySelectorAll("[data-href-tr]").forEach(function (el) {
      el.setAttribute("href", el.getAttribute(lang === "en" ? "data-href-en" : "data-href-tr"));
    });

    document.documentElement.lang = lang;

    var switchBtn = document.getElementById("langSwitch");
    if (switchBtn) {
      switchBtn.querySelectorAll(".lang-option").forEach(function (opt) {
        opt.classList.toggle("is-active", opt.getAttribute("data-lang") === lang);
      });
      switchBtn.setAttribute("aria-pressed", lang === "en" ? "true" : "false");
    }

    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }

    document.dispatchEvent(new CustomEvent("bursa:langchange", { detail: { lang: lang } }));
  }

  window.BursaI18N = {
    getLang: function () { return lang; },
    applyLanguage: applyLanguage
  };

  // Script tag sits at the end of body, so the DOM above it already
  // exists by the time this runs — no need to wait for DOMContentLoaded.
  var switchBtn = document.getElementById("langSwitch");
  if (switchBtn) {
    switchBtn.addEventListener("click", function () {
      applyLanguage(lang === "tr" ? "en" : "tr");
    });
  }
  applyLanguage(lang);
})();
