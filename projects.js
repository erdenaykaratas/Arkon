// 40 proje — mevcut 6 render arasında döngü
window.PROJECTS = [
  { title: "Obsidyen Çatı Katı", loc: "İstanbul · TR",   year: "2025", typ: "Çatı Katı",       img: 1 },
  { title: "Taş Ocak Loft",      loc: "Bodrum · TR",     year: "2025", typ: "Konut",           img: 3 },
  { title: "Kara Konak",         loc: "Paris · FR",      year: "2024", typ: "Konut",           img: 2 },
  { title: "Cavendish Rezidans", loc: "Londra · UK",     year: "2024", typ: "Çatı Katı",       img: 4 },
  { title: "Avlu 14",            loc: "Milano · IT",     year: "2024", typ: "Daire",           img: 5 },
  { title: "Soho Rezidans",      loc: "New York · US",   year: "2024", typ: "Konut",           img: 6 },
  { title: "Koru Villa",         loc: "Çeşme · TR",      year: "2023", typ: "Villa",           img: 1 },
  { title: "Boucheron Konağı",   loc: "Cenevre · CH",    year: "2023", typ: "Konut",           img: 2 },
  { title: "Antrasit Ev",        loc: "Barselona · ES",  year: "2023", typ: "Şehir Evi",       img: 3 },
  { title: "Fener Ev",           loc: "Kyoto · JP",      year: "2023", typ: "Rezidans",        img: 4 },
  { title: "Kara Zeytin",        loc: "Bodrum · TR",     year: "2023", typ: "Villa",           img: 5 },
  { title: "Oniks Atölye",       loc: "Lizbon · PT",     year: "2023", typ: "Stüdyo",          img: 6 },
  { title: "Dingin Tepe",        loc: "İstanbul · TR",   year: "2022", typ: "Çatı Katı",       img: 1 },
  { title: "Mahzen 1908",        loc: "Bordeaux · FR",   year: "2022", typ: "Konaklama",       img: 6 },
  { title: "Marais Dairesi",     loc: "Paris · FR",      year: "2022", typ: "Daire",           img: 2 },
  { title: "Ravello İnziva",     loc: "Amalfi · IT",     year: "2022", typ: "Villa",           img: 3 },
  { title: "Nehir Süiti",        loc: "Hamburg · DE",    year: "2022", typ: "Konut",           img: 4 },
  { title: "Akıncı Evi",         loc: "İzmir · TR",      year: "2022", typ: "Konut",           img: 5 },
  { title: "Taş Ocağı",          loc: "Oslo · NO",       year: "2022", typ: "Villa",           img: 1 },
  { title: "Karbon Ev",          loc: "Roma · IT",       year: "2022", typ: "Konut",           img: 6 },
  { title: "Yıldız Konak",       loc: "İstanbul · TR",   year: "2021", typ: "Restorasyon",     img: 2 },
  { title: "Belgravia Avlusu",   loc: "Londra · UK",     year: "2021", typ: "Şehir Evi",       img: 3 },
  { title: "Antrasit Köşk",      loc: "Zermatt · CH",    year: "2021", typ: "Dağ Evi",         img: 4 },
  { title: "Vapur Loftu",        loc: "Karaköy · TR",    year: "2021", typ: "Loft",            img: 5 },
  { title: "Mercer Rezidans",    loc: "New York · US",   year: "2021", typ: "Konut",           img: 6 },
  { title: "Katman Ev",          loc: "Atina · GR",      year: "2021", typ: "Villa",           img: 1 },
  { title: "Kara Köşk",          loc: "Brüksel · BE",    year: "2021", typ: "Stüdyo",          img: 2 },
  { title: "Ortaköy Süitleri",   loc: "İstanbul · TR",   year: "2020", typ: "Konaklama",       img: 3 },
  { title: "Dingin Villa",       loc: "Como · IT",       year: "2020", typ: "Villa",           img: 4 },
  { title: "Işık Dairesi",       loc: "Kopenhag · DK",   year: "2020", typ: "Daire",           img: 5 },
  { title: "Bebek Yalısı",       loc: "İstanbul · TR",   year: "2020", typ: "Restorasyon",     img: 6 },
  { title: "Tilki Konağı",       loc: "Floransa · IT",   year: "2020", typ: "Konut",           img: 1 },
  { title: "Granit Stüdyo",      loc: "Berlin · DE",     year: "2020", typ: "Stüdyo",          img: 2 },
  { title: "Halia Konutu",       loc: "Antalya · TR",    year: "2019", typ: "Villa",           img: 3 },
  { title: "Tribeca Loftu",      loc: "New York · US",   year: "2019", typ: "Loft",            img: 4 },
  { title: "Faubourg Konağı",    loc: "Paris · FR",      year: "2019", typ: "Daire",           img: 5 },
  { title: "Çırağan Süiti",      loc: "İstanbul · TR",   year: "2019", typ: "Konaklama",       img: 6 },
  { title: "Dökümhane",          loc: "Manchester · UK", year: "2018", typ: "Dönüşüm",         img: 1 },
  { title: "Yaz Villası",        loc: "Marbella · ES",   year: "2018", typ: "Villa",           img: 2 },
  { title: "Atölye Arkon",       loc: "İstanbul · TR",   year: "2017", typ: "Stüdyo · Kendi",  img: 3 }
];

window.FEATURED = [0, 2, 3, 9, 11, 18, 26];

/* ------------------------------------------------------------
   Zenginleştirme — her proje için deterministik detay verisi.
   Elimizde yalnızca 6 render var, galeriler bunlar arasında döner.
   ------------------------------------------------------------ */
window.IMG_COUNT = 6;

const _briefByType = {
  "Konut":        "Tek bir öğleden sonra ışık demeti çevresinde kurgulanmış bir aile konutu; taşıyıcı taş, siyah meşe doğramanın dingin disipliniyle buluşuyor.",
  "Çatı Katı":    "Şehrin gürültüsünü havanın yavaş tiyatrosuyla değiştiren bir çatı konutu — teraslar, siluet yerine göğü çerçevelemek için hacme derinlemesine oyulmuş.",
  "Daire":        "Yapısal dürüstlüğüne kadar soyulmuş, ardından sıva, traverten ve sıcak gölgeyle yeniden giydirilmiş bir daire.",
  "Villa":        "Yamacın üstüne değil içine oturan, yaşam katının altından manzarayı geçiren bir villa.",
  "Şehir Evi":    "Kesitte yeniden planlanmış dar bir şehir evi; tepeden ışık alan çekirdek, ışığı dört kat aşağıdaki mutfak masasına indiriyor.",
  "Loft":         "Bütün halde korunmuş eski bir endüstriyel hacim — tek oda, tek tavan, nesnelerden oluşan küçük bir şehir gibi döşenmiş.",
  "Stüdyo":       "Kendi manifestosu olarak tasarlanmış çalışan bir stüdyo: tezgah, duvar, pencere ve hakkını vermeyen hiçbir şey.",
  "Rezidans":     "Bir eşikler dizisi olarak kurgulanmış bir rezidans; her oda bir sonrakinden önce tutulmuş bir nefes.",
  "Restorasyon":  "Eski yapının izlerini korumasına izin veren, yeniyi tek ve okunaklı bir malzemeyle yerleştiren özenli bir restorasyon.",
  "Konaklama":    "Tekrar ziyaretler için kurulmuş bir konaklama iç mekanı — kendini kapıda değil, bir konaklama boyunca yavaşça açan odalar.",
  "Dağ Evi":      "Tek bir taş ocak çevresinde demir atmış, mevsimlerle koyulaşan ahşaplı bir dağ evi.",
  "Dönüşüm":      "Özgününün iskeletini koruyan, her yeni eklentiyi bir konuk gibi ağırlayan uyarlamalı bir dönüşüm.",
  "Stüdyo · Kendi":"Atölyenin kendi stüdyosu — Karaköy'de bir arka oda, sonradan müşterilere emanet ettiğimiz her detayın denendiği bir test alanı olarak yeniden kuruldu."
};

const _materialsPool = [
  ["Honlu traverten","Siyah meşe","Kireç sıva","Patine pirinç"],
  ["Anadolu bazaltı","İsli ceviz","Mikro çimento","Yaşlanmış bronz"],
  ["Carrara mermeri","Oluklu cam","Kireç badana","Karartılmış çelik"],
  ["Tüf taşı","Douglas çamı","Tadelakt","Fırçalanmış nikel"],
  ["Pietra serena","Yanık sedir","Venedik stukko","Antika meşe"]
];

const _scopePool = [
  "Mimarlık · İç Mekan · Doğrama",
  "Mimarlık · İç Mimarlık",
  "İç Mekan · Mobilya · Sanat Yönetimi",
  "Tüm tasarım · Yapım denetimi",
  "Mimarlık · Peyzaj · Aydınlatma"
];

window.getGallery = function(p, idx){
  const imgs = [];
  let cur = p.img;
  const used = new Set();
  for (let k = 0; k < 5; k++){
    if (!used.has(cur)){ imgs.push(cur); used.add(cur); }
    else {
      let n = cur;
      for (let s = 1; s <= window.IMG_COUNT; s++){
        const cand = ((cur - 1 + s) % window.IMG_COUNT) + 1;
        if (!used.has(cand)){ n = cand; break; }
      }
      imgs.push(n); used.add(n);
    }
    cur = ((cur - 1 + 2 + (idx % 3)) % window.IMG_COUNT) + 1;
  }
  while (imgs.length < 5) imgs.push(((imgs.length + p.img) % window.IMG_COUNT) + 1);
  return imgs.slice(0,5).map(n => `img/0${n}.jpg`);
};

window.getProjectMeta = function(idx){
  const p = window.PROJECTS[idx];
  if (!p) return null;
  const t = (p.typ || "").trim();
  const brief = _briefByType[t] ||
    "Atölyenin tek inancıyla biçimlenmiş bir proje — mimarlık, gürültünün bittiği yerde başlar.";
  const area = 90 + ((idx * 47) % 760);
  const months = 9 + ((idx * 5) % 28);
  const team = 3 + (idx % 4);
  const materials = _materialsPool[idx % _materialsPool.length];
  const scope = _scopePool[idx % _scopePool.length];
  const status = parseInt(p.year,10) >= 2024 ? "Yeni tamamlandı" : "Tamamlandı";
  return {
    ...p, index: idx, brief, area, months, team, materials, scope, status,
    gallery: window.getGallery(p, idx)
  };
};
