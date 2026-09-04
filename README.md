# Bursa — The Green Capital

İlk Osmanlı başkenti Bursa'yı tanıtan, sinematik scroll deneyimli, çift dilli (TR/EN) bir tanıtım sitesi.

**🔗 Canlı link:** [furkanturan8.github.io/bursa-website](https://furkanturan8.github.io/bursa-website/)

## Özellikler

- **Sinematik giriş** — Scroll ilerlemesine bağlı katmanlı fotoğraf geçişleri, parallax ve metin panelleri (build adımı gerektirmeyen saf CSS custom property + `requestAnimationFrame` ile).
- **Rotalar** — 1/2/3 günlük hazır gezi planları; her gün için numaralı durak zaman çizelgesi, Leaflet + OpenStreetMap üzerinde interaktif harita (durak ↔ harita işaretçisi senkronizasyonu) ve tek tıkla Google Maps yol tarifi linki.
- **Yöresel Lezzetler** — Bursa mutfağından öne çıkan lezzetlerin tanıtıldığı galeri bölümü.
- **Fotoğraf galerisi** — Şehri temsil eden kareler.
- **TR / EN dil desteği** — Sayfadaki tüm metinler ve Rotalar/Lezzetler içerikleri arasında anında geçiş yapan hafif bir i18n katmanı.
- **Responsive tasarım** — Masaüstü, tablet ve mobil için ayrı ayrı optimize edilmiş düzen (mobilde dikey istiflenen görsel çerçeveler dahil).
- Tüm görseller yerel `assets/` klasöründen servis edilir — dış bağlantıya (hotlink) bağımlılık yoktur.

## Teknoloji

Saf **HTML / CSS / JavaScript** — herhangi bir build aracı veya framework kullanılmadan yazıldı. Harita için [Leaflet](https://leafletjs.com/) + [OpenStreetMap](https://www.openstreetmap.org/) (CDN üzerinden), yazı tipleri için Google Fonts (Fraunces & Inter) kullanılır.

## Proje yapısı

```
.
├── index.html         # Sayfa içeriği ve bölüm iskeleti
├── styles.css          # Tüm görsel tasarım ve responsive kurallar
├── script.js           # Sinematik scroll/parallax koreografisi
├── i18n.js             # TR/EN dil değiştirici ve statik metin çevirileri
├── routes-data.js      # Rotalar bölümü için çift dilli veri (gün/durak/koordinat)
├── routes.js           # Rotalar bölümünü veriden render eden ve haritayı yöneten script
└── assets/             # Tüm fotoğraflar (yerel, optimize edilmiş)
```
