/* ============================================================
   MEMİR — Project detail page
   ============================================================ */
(() => {
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const lerp = (a,b,t) => a + (b-a)*t;
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));

  // ---------- resolve id ----------
  const params = new URLSearchParams(location.search);
  let id = parseInt(params.get('id'), 10);
  if (isNaN(id) || id < 0 || id >= window.PROJECTS.length) id = 0;
  const m = window.getProjectMeta(id);
  const total = window.PROJECTS.length;

  // ---------- cursor ----------
  const cursor = $('.cursor');
  const tgt = {x: innerWidth/2, y: innerHeight/2}, pos = {...tgt};
  addEventListener('mousemove', e => { tgt.x = e.clientX; tgt.y = e.clientY; });
  (function tick(){
    pos.x = lerp(pos.x, tgt.x, 0.22); pos.y = lerp(pos.y, tgt.y, 0.22);
    if (cursor) cursor.style.transform = `translate(${pos.x}px,${pos.y}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  })();
  document.addEventListener('mouseover', e => {
    if (!cursor) return;
    cursor.classList.toggle('is-link', !!e.target.closest('a,button,[data-link]'));
  });

  // ---------- populate ----------
  document.title = `${m.title} — ARKON`;
  $('.p-counter').textContent = `№ ${String(id+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
  $('#pType').textContent = m.typ;
  $('#pScope').textContent = m.scope;
  $('#pLoc').textContent = m.loc;
  $('#pStatus').textContent = m.status;
  $('#pKicker').textContent = `Proje ${String(id+1).padStart(2,'0')} · ${m.year}`;
  $('#pHeroBg').style.backgroundImage = `url('${window.getProjectImg(m)}')`;

  // title with char spans (split into words to allow wrapping)
  const titleEl = $('#pTitle');
  titleEl.innerHTML = m.title.split('').map(c =>
    c === ' ' ? ' ' : `<span class="ch">${c}</span>`
  ).join('');

  // hero meta cells
  $('#pHeroMeta').innerHTML = [
    ['Konum', m.loc],
    ['Yıl', m.year],
    ['Alan', m.area + ' m²'],
    ['Süre', m.months + ' ay']
  ].map(([l,v]) => `<div class="cell"><div class="l">${l}</div><div class="v">${v}</div></div>`).join('');

  // brief
  $('#pBrief').innerHTML = m.brief.replace(/—/g,'—');

  // spec grid
  $('#pSpec').innerHTML = [
    ['Disiplin', m.scope],
    ['Program', m.typ],
    ['Durum', m.status],
    ['Stüdyo ekibi', m.team + ' kişi'],
    ['Brüt alan', m.area + ' m²'],
    ['Tamamlanma', m.year]
  ].map(([l,v]) => `<div class="cell"><div class="l">${l}</div><div class="v">${v}</div></div>`).join('');

  // ---------- gallery ----------
  const g = m.gallery;
  const cap = (n, label) => `<div class="g-cap"><b>Görsel ${String(n).padStart(2,'0')}</b><span>${label}</span></div>`;
  const fig = (src, cls) => `<div class="g-fig ${cls}"><div class="img" style="background-image:url('${src}')"></div></div>`;

  function renderGallery(images, meta){
    if (!meta.customGallery) {
      return `
    <div>
      ${fig(g[0],'full')}
      ${cap(1, meta.title + ' · ana görünüm')}
    </div>
    <div class="g-row">
      <div>${fig(g[1],'')}${cap(2,'İç mekan etüdü')}</div>
      <div>${fig(g[2],'')}${cap(3,'Detay · ' + meta.materials[0].toLowerCase())}</div>
    </div>
    <div class="g-row offset">
      <div>${fig(g[3],'')}${cap(4, meta.loc)}</div>
      <div class="g-note">
        <div class="lbl">Kesit üzerine</div>
        <p>Işık, tek bir derin nişten girer ve planın boyunca ilerleyerek <em>${meta.materials[1].toLowerCase()}</em> yüzeyini öğleden sonra geç saatlerde ısıtır.</p>
      </div>
    </div>
    <div>
      ${fig(g[4],'tall')}
      ${cap(5,'Dinlenen oda')}
    </div>`;
    }

    let html = `<div>${fig(images[0], 'full')}${cap(1, meta.title + ' · ana görünüm')}</div>`;
    for (let i = 1; i < images.length; i += 2) {
      const left = i;
      const right = i + 1;
      if (right < images.length) {
        const offset = Math.floor(i / 2) % 2 === 1 ? ' offset' : '';
        html += `<div class="g-row${offset}">
          <div>${fig(images[left], '')}${cap(left + 1, meta.typ)}</div>
          <div>${fig(images[right], '')}${cap(right + 1, meta.loc)}</div>
        </div>`;
      } else {
        html += `<div>${fig(images[left], 'tall')}${cap(left + 1, meta.title)}</div>`;
      }
    }
    return html;
  }

  $('#pGal').innerHTML = renderGallery(g, m);

  // ---------- materials ----------
  $('#pMat').innerHTML = m.materials.map((mat,i) =>
    `<div class="row"><span class="name">${mat}</span><span class="idx">№ ${String(i+1).padStart(2,'0')}</span></div>`
  ).join('');

  // ---------- next project ----------
  const nextId = (id + 1) % total;
  const next = window.PROJECTS[nextId];
  $('#pNext').href = `project.html?id=${nextId}`;
  $('#pNextBg').style.backgroundImage = `url('${window.getProjectImg(next)}')`;
  $('#pNextTitle').textContent = next.title;
  $('#pNextSub').textContent = `${next.loc} · ${next.typ} · ${next.year}`;

  // ---------- reveals ----------
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.15, rootMargin:'0px 0px -10% 0px'});
  $$('.reveal').forEach(el => io.observe(el));

  // clip-reveal for gallery figures
  const figIo = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting){
        e.target.style.clipPath = 'inset(0 0 0 0)';
        figIo.unobserve(e.target);
      }
    });
  }, {threshold:0.12});
  $$('.g-fig').forEach(f => {
    f.style.clipPath = 'inset(100% 0 0 0)';
    f.style.transition = 'clip-path 1.3s cubic-bezier(.7,0,.3,1)';
    figIo.observe(f);
  });

  // ---------- hero title reveal ----------
  addEventListener('load', () => {
    $$('#pTitle .ch').forEach((ch,i) => {
      ch.animate(
        [{transform:'translateY(110%)'},{transform:'translateY(0)'}],
        {duration:1100, delay:60+i*40, easing:'cubic-bezier(.22,.61,.36,1)', fill:'forwards'}
      );
    });
  });
  // also run immediately in case load already fired
  requestAnimationFrame(() => {
    $$('#pTitle .ch').forEach((ch,i) => {
      ch.animate(
        [{transform:'translateY(110%)'},{transform:'translateY(0)'}],
        {duration:1100, delay:60+i*40, easing:'cubic-bezier(.22,.61,.36,1)', fill:'forwards'}
      );
    });
  });

  // ---------- parallax loop ----------
  const heroBg = $('#pHeroBg');
  const heroSec = $('.p-hero');
  const nextBg = $('#pNextBg');
  const nextSec = $('#pNext');

  (function loop(){
    // hero
    if (heroBg){
      const r = heroSec.getBoundingClientRect();
      heroBg.style.transform = `scale(1.12) translateY(${(-r.top)*0.18}px)`;
    }
    // gallery figure inner parallax
    $$('.g-fig').forEach(f => {
      const img = f.querySelector('.img');
      if (!img) return;
      const r = f.getBoundingClientRect();
      const p = (r.top + r.height/2 - innerHeight/2) / innerHeight;
      img.style.transform = `translateY(${p * 36}px)`;
    });
    // next
    if (nextBg && nextSec){
      const r = nextSec.getBoundingClientRect();
      const p = (r.top + r.height/2 - innerHeight/2) / innerHeight;
      nextBg.style.transform = `translateY(${p * 30}px)`;
    }
    requestAnimationFrame(loop);
  })();
})();
