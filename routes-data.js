/* =========================================================
   Rotalar — route/itinerary data
   Pure data, no markup. Consumed by routes.js.

   Text fields are bilingual ({ tr, en }); distance/duration are
   stored as plain numbers (meters / minutes) so routes.js can
   format them per the active language.

   Coordinates are approximate (landmark-level), enough to
   place numbered markers and draw a sensible walking/driving
   order on the map — not survey-grade GPS.
   ========================================================= */

(function () {
  "use strict";

  var ROUTES_DATA = {
    days: [
      {
        number: "01",
        title: { tr: "Tarihi Bursa", en: "Historic Bursa" },
        theme: { tr: "Osmanlı'nın kalbinde yürüyüş", en: "A walk through the Ottoman heart" },
        transportSummary: { tr: "Yürüyüş", en: "Walking" },
        transportIcon: "🚶",
        mapsTravelMode: "walking",
        stops: [
          {
            name: { tr: "Tophane", en: "Tophane" },
            description: {
              tr: "Şehri ve Uludağ'ı gören tarihi tepe; Osmanlı sultanlarının türbeleri ve saat kulesiyle Bursa'nın ilk durağı.",
              en: "A historic hilltop overlooking the city and Mount Uludağ, with Ottoman sultans' tombs and a clock tower — the first stop of the day."
            },
            image: "assets/tophane.jpg",
            lat: 40.1846, lng: 29.0637,
            durationMin: 20,
            distanceToNextM: 150, timeToNextMin: 2, transportToNext: "walk"
          },
          {
            name: { tr: "Bursa Kalesi", en: "Bursa Castle" },
            description: {
              tr: "Tophane'nin hemen altında uzanan, şehrin en eski savunma hattından kalma taş surlar.",
              en: "Stone ramparts just below Tophane, the last trace of the city's oldest defensive line."
            },
            image: "assets/bursa-kalesi.jpg",
            lat: 40.1839, lng: 29.0628,
            durationMin: 20,
            distanceToNextM: 900, timeToNextMin: 12, transportToNext: "walk"
          },
          {
            name: { tr: "Bursa Ulu Cami", en: "Grand Mosque (Ulu Cami)" },
            description: {
              tr: "Erken Osmanlı mimarisinin anıtsal örneği; yirmi kubbesi ve içindeki şadırvanıyla şehrin manevi merkezi.",
              en: "A monumental example of early Ottoman architecture; its twenty domes and indoor fountain make it the city's spiritual center."
            },
            image: "assets/ulu-cami.jpeg",
            lat: 40.1827, lng: 29.0648,
            durationMin: 30,
            distanceToNextM: 250, timeToNextMin: 3, transportToNext: "walk"
          },
          {
            name: { tr: "Koza Han", en: "Koza Han (Silk Trade Inn)" },
            description: {
              tr: "İpek ticaretinin kalbi; avlusundaki çay bahçesiyle hâlâ gündelik hayatın içinde sessiz bir duraklama noktası.",
              en: "The heart of the silk trade; its courtyard tea garden is still a quiet pause in everyday city life."
            },
            image: "assets/koza-han.jpg",
            lat: 40.1832, lng: 29.0670,
            durationMin: 30,
            distanceToNextM: 200, timeToNextMin: 3, transportToNext: "walk"
          },
          {
            name: { tr: "Bursa Kapalı Çarşı", en: "Grand Bazaar" },
            description: {
              tr: "Dar geçitleri, kuyumcuları ve yüzyıllık dükkânlarıyla şehrin ticari belleği.",
              en: "The city's commercial memory, with narrow passages, jewellers and century-old shops."
            },
            image: "assets/kapali-carsi.jpg",
            lat: 40.1823, lng: 29.0664,
            durationMin: 45,
            distanceToNextM: 350, timeToNextMin: 5, transportToNext: "walk"
          },
          {
            name: { tr: "Kayhan Çarşısı", en: "Kayhan Bazaar" },
            description: {
              tr: "Kapalı Çarşı'nın daha gündelik, daha az turistik uzantısı; yerel esnafın nabzını tuttuğu sokaklar.",
              en: "The Grand Bazaar's more everyday, less touristy extension — streets that keep the pulse of local shopkeepers."
            },
            image: "assets/kayhan-carsisi.webp",
            lat: 40.1812, lng: 29.0656,
            durationMin: 30,
            distanceToNextM: 450, timeToNextMin: 6, transportToNext: "walk"
          },
          {
            name: { tr: "Pirinç Han", en: "Pirinç Han" },
            description: {
              tr: "Rotanın son durağı; sakin avlusuyla günü kapatmak için ideal bir mola noktası.",
              en: "The day's final stop; its calm courtyard is the ideal place to close the day."
            },
            image: "assets/pirinc-han.jpg",
            lat: 40.1830, lng: 29.0678,
            durationMin: 20
          }
        ]
      },
      {
        number: "02",
        title: { tr: "Osmanlı'nın İzinde", en: "On the Trail of the Ottomans" },
        theme: { tr: "Bursa'nın doğusunda erken Osmanlı mirası", en: "Early Ottoman heritage in eastern Bursa" },
        transportSummary: { tr: "Araç + Yürüyüş", en: "Driving + Walking" },
        transportIcon: "🚗",
        mapsTravelMode: "driving",
        stops: [
          {
            name: { tr: "Cumalıkızık", en: "Cumalıkızık" },
            description: {
              tr: "Korunmuş bir Osmanlı köyü; ahşap cumbalı evleri ve taş sokaklarıyla zamanda geriye bir adım.",
              en: "A preserved Ottoman village — timber bay-windowed houses and stone streets, a step back in time."
            },
            image: "assets/cumalikizik.jpg",
            lat: 40.2119, lng: 29.1934,
            durationMin: 60,
            distanceToNextM: 9000, timeToNextMin: 20, transportToNext: "drive"
          },
          {
            name: { tr: "Emir Sultan Külliyesi", en: "Emir Sultan Complex" },
            description: {
              tr: "Yeşil vadiye bakan geniş avlusu ve servi ağaçlarıyla şehrin en huzurlu külliyelerinden biri.",
              en: "One of the city's most peaceful complexes, its wide courtyard and cypress trees looking over a green valley."
            },
            image: "assets/emir-sultan-camii.jpg",
            lat: 40.1859, lng: 29.0778,
            durationMin: 25,
            distanceToNextM: 600, timeToNextMin: 8, transportToNext: "walk"
          },
          {
            name: { tr: "Yeşil Külliyesi", en: "Green Mosque Complex" },
            description: {
              tr: "Bursa'nın çini işçiliğiyle ünlü Yeşil Cami; erken Osmanlı estetiğinin doruk noktası.",
              en: "The Green Mosque, famed for its tilework — the high point of early Ottoman aesthetics."
            },
            image: "assets/yesil-cami.jpg",
            lat: 40.1860, lng: 29.0754,
            durationMin: 30,
            distanceToNextM: 150, timeToNextMin: 2, transportToNext: "walk"
          },
          {
            name: { tr: "Yeşil Türbe", en: "Green Tomb" },
            description: {
              tr: "Çelebi Sultan Mehmed'in türbesi; dıştan turkuvaz çinileriyle Bursa'nın en tanınan silüetlerinden.",
              en: "The tomb of Çelebi Sultan Mehmed; its turquoise tiles make it one of Bursa's most recognisable silhouettes."
            },
            image: "assets/yesil-turbe.jpg",
            lat: 40.1863, lng: 29.0752,
            durationMin: 15,
            distanceToNextM: 900, timeToNextMin: 12, transportToNext: "walk"
          },
          {
            name: { tr: "Irgandı Köprüsü", en: "Irgandı Bridge" },
            description: {
              tr: "Üzeri dükkânlarla kaplı Osmanlı köprüsü; günü Gökdere vadisine bakarak kapatmak için doğru yer.",
              en: "An Ottoman bridge lined with shops — the right place to end the day overlooking the Gökdere valley."
            },
            image: "assets/irgandi-kopru.jpg",
            lat: 40.1836, lng: 29.0722,
            durationMin: 20
          }
        ]
      },
      {
        number: "03",
        title: { tr: "Uludağ & Doğa", en: "Uludağ & Nature" },
        theme: { tr: "Şehirden zirveye", en: "From the city to the summit" },
        transportSummary: { tr: "Teleferik + Araç", en: "Cable Car + Driving" },
        transportIcon: "🚡",
        mapsTravelMode: "driving",
        stops: [
          {
            name: { tr: "Bursa Teleferik", en: "Bursa Cable Car" },
            description: {
              tr: "Şehir merkezinden Uludağ'a uzanan tarihi teleferik hattının alt istasyonu.",
              en: "The lower station of the historic cable car line running from the city center up to Uludağ."
            },
            image: "assets/bursa-teleferik.jpg",
            lat: 40.1963, lng: 29.0997,
            durationMin: 15,
            distanceToNextM: 9000, timeToNextMin: 25, transportToNext: "cable-car"
          },
          {
            name: { tr: "Uludağ", en: "Uludağ" },
            description: {
              tr: "Çam ormanlarının üzerinde, bulutların içinde bir yayla; yaz ve kışın bambaşka iki yüzü.",
              en: "A plateau above the pine forests, up in the clouds — a completely different face in summer and winter."
            },
            image: "assets/uludag-yaz.jpg",
            lat: 40.0958, lng: 29.2306,
            durationMin: 90,
            distanceToNextM: 3000, timeToNextMin: 10, transportToNext: "drive"
          },
          {
            name: { tr: "Uludağ Milli Parkı", en: "Uludağ National Park" },
            description: {
              tr: "Türkiye'nin ilk milli parklarından; doğa yürüyüşü rotaları ve saklı göletleriyle.",
              en: "One of Turkey's first national parks, with hiking trails and hidden ponds."
            },
            image: "assets/uludag-milli-parki.jpg",
            lat: 40.1150, lng: 29.2100,
            durationMin: 60,
            distanceToNextM: 25000, timeToNextMin: 40, transportToNext: "drive"
          },
          {
            name: { tr: "İnkaya Tarihi Çınarı", en: "İnkaya Ancient Plane Tree" },
            description: {
              tr: "600 yaşını aşkın dev çınar; günü şehrin efsanevi bir doğa anıtının gölgesinde bitirmek için.",
              en: "A giant plane tree over 600 years old — end the day in the shade of the city's legendary natural monument."
            },
            image: "assets/inkaya-cinari.jpg",
            lat: 40.2144, lng: 29.1735,
            durationMin: 20
          }
        ]
      }
    ]
  };

  window.ROUTES_DATA = ROUTES_DATA;
})();
