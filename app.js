/* ============================================================
   MEMİR — Interactions & Scroll Animations
   ============================================================ */

(() => {
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const lerp = (a,b,t) => a + (b-a)*t;
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));

  // ---------- 1. Custom cursor ----------
  const cursor = $('.cursor');
  const target = {x: window.innerWidth/2, y: window.innerHeight/2};
  const pos    = {x: target.x, y: target.y};
  window.addEventListener('mousemove', e => {
    target.x = e.clientX; target.y = e.clientY;
  });
  function tickCursor(){
    pos.x = lerp(pos.x, target.x, 0.22);
    pos.y = lerp(pos.y, target.y, 0.22);
    if (cursor) cursor.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
    requestAnimationFrame(tickCursor);
  }
  tickCursor();

  document.addEventListener('mouseover', e => {
    const el = e.target;
    if (!cursor) return;
    if (el.closest('a, button, .idx-row, .f-card, [data-link]')) cursor.classList.add('is-link');
    else cursor.classList.remove('is-link');
    if (el.closest('.h-scroll')) cursor.classList.add('is-drag');
    else cursor.classList.remove('is-drag');
  });

  // ---------- 2. Loader ----------
  const loader     = $('.loader');
  const loaderDots = $('.loader__count .dots');
  const loadDuration = 1800;
  const loadStart = performance.now();

  function tickLoad(now){
    const t = clamp((now - loadStart) / loadDuration, 0, 1);
    if (loaderDots){
      const n = 1 + (Math.floor(now / 400) % 3);
      loaderDots.textContent = '.'.repeat(n);
    }
    if (t < 1) requestAnimationFrame(tickLoad);
    else finishLoad();
  }
  requestAnimationFrame(tickLoad);

  function finishLoad(){
    setTimeout(() => {
      loader.classList.add('done');
      revealHero();
    }, 350);
  }

  // ---------- 3. Hero reveal ----------
  function revealHero(){
    const chars = $$('.hero__title h1 .ch');
    chars.forEach((ch, i) => {
      ch.animate(
        [{transform:'translateY(110%)', opacity:0}, {transform:'translateY(0)', opacity:1}],
        {duration: 1200, delay: 80 + i*55, easing:'cubic-bezier(.22,.61,.36,1)', fill:'forwards'}
      );
    });
    setTimeout(() => {
      $$('.hero__sub p, .hero__sub .num').forEach(el => el.classList.add('in'));
    }, 200);
  }

  // ---------- 4. Hero parallax (mouse) ----------
  const heroBg = $('.hero__bg');
  if (heroBg){
    let hx = 0, hy = 0, hxT = 0, hyT = 0;
    window.addEventListener('mousemove', e => {
      hxT = (e.clientX / window.innerWidth - 0.5) * 24;
      hyT = (e.clientY / window.innerHeight - 0.5) * 16;
    });
    (function tickHero(){
      hx = lerp(hx, hxT, 0.05);
      hy = lerp(hy, hyT, 0.05);
      heroBg.style.transform = `scale(1.08) translate(${hx}px, ${hy}px)`;
      requestAnimationFrame(tickHero);
    })();
  }

  // ---------- 5. Manifesto word reveal ----------
  // Walk the DOM, splitting only text nodes into <span class="word"> spans.
  // This preserves any element children (including attributes added by the host)
  // such as <em>...</em> which we keep as wrappers around the inner word spans.
  function wrapWordsIn(node){
    const children = Array.from(node.childNodes);
    for (const child of children){
      if (child.nodeType === Node.TEXT_NODE){
        const text = child.nodeValue;
        if (!text || !text.trim()){ continue; }
        const frag = document.createDocumentFragment();
        const parts = text.split(/(\s+)/);
        for (const part of parts){
          if (!part) continue;
          if (/^\s+$/.test(part)){
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = part;
            frag.appendChild(span);
          }
        }
        child.parentNode.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE){
        wrapWordsIn(child);
      }
    }
  }
  const manifesto = $('.manifesto__body');
  if (manifesto){ wrapWordsIn(manifesto); }

  // ---------- 6. IntersectionObserver reveals ----------
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('in');
        if (e.target.dataset.once === '1') io.unobserve(e.target);
      }
    });
  }, {threshold: 0.15, rootMargin:'0px 0px -10% 0px'});
  $$('.reveal, .clip-reveal').forEach(el => { el.dataset.once='1'; io.observe(el); });

  // word-level reveals for manifesto (scroll-progress based, not IO)
  // (handled in scroll loop below)

  // ---------- 7. Counters ----------
  const counters = $$('[data-counter]');
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        const el = e.target;
        const target = parseInt(el.dataset.counter, 10);
        const dur = 1800; const start = performance.now();
        (function tick(now){
          const t = clamp((now - start)/dur, 0, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(eased * target);
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        })(performance.now());
        counterIO.unobserve(el);
      }
    });
  }, {threshold:0.5});
  counters.forEach(el => counterIO.observe(el));

  // ---------- 8. Horizontal sticky scroll (featured) ----------
  const hScroll = $('.h-scroll');
  const hViewport = $('.h-scroll__sticky');
  const hTrack  = $('.h-scroll__track');
  const hProg   = $('.h-scroll__progress span');
  function updateHProgress(){
    if (!hViewport || !hProg) return;
    const max = hViewport.scrollWidth - hViewport.clientWidth;
    const prog = max > 0 ? hViewport.scrollLeft / max : 0;
    hProg.style.width = (prog * 100) + '%';
  }
  function computeHScroll(){ updateHProgress(); }
  if (hViewport){
    hViewport.addEventListener('scroll', updateHProgress, {passive:true});
    // Note: vertical mouse wheel is intentionally NOT hijacked — scrolling down
    // keeps the page moving down. Horizontal panning is available via trackpad
    // swipe, shift+wheel, and click-drag below.
    // Click-drag to pan (desktop). Suppress the card link click only if the
    // pointer actually moved, so a plain click still navigates.
    let dragging=false, moved=false, startX=0, startLeft=0;
    hViewport.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch') return; // let native touch scroll handle it
      dragging=true; moved=false; startX=e.clientX; startLeft=hViewport.scrollLeft;
    });
    hViewport.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4){
        moved=true;
        if (!hViewport.hasPointerCapture(e.pointerId)) hViewport.setPointerCapture(e.pointerId);
      }
      hViewport.scrollLeft = startLeft - dx;
    });
    const endDrag = () => { dragging=false; };
    hViewport.addEventListener('pointerup', endDrag);
    hViewport.addEventListener('pointercancel', endDrag);
    hViewport.addEventListener('click', e => {
      if (moved){ e.preventDefault(); e.stopPropagation(); moved=false; }
    }, true);
  }
  computeHScroll();
  window.addEventListener('resize', computeHScroll);
  window.addEventListener('load', computeHScroll);

  // ---------- 9. Build & render projects ----------
  function renderFeatured(){
    if (!hTrack) return;
    const projects = window.PROJECTS;
    const featured = window.FEATURED;
    hTrack.innerHTML = featured.map((idx, i) => {
      const p = projects[idx];
      return `
        <a class="f-card" href="project.html?id=${idx}" data-link>
          <div class="f-card__img" style="background-image:url('${window.getProjectImg(p)}')"></div>
          <div class="f-card__num">${String(i+1).padStart(2,'0')} / ${String(featured.length).padStart(2,'0')}</div>
          <div class="f-card__meta">
            <h3>${p.title}</h3>
            <div class="right">
              <b>${p.loc}</b><br>${p.typ} · ${p.year}
            </div>
          </div>
        </a>`;
    }).join('') + `<div style="flex:0 0 30vw"></div>`;
    // ensure layout has resolved before measuring
    requestAnimationFrame(computeHScroll);
  }

  function renderIndex(){
    const list = $('.index__list');
    if (!list) return;
    list.innerHTML = window.PROJECTS.map((p, i) => `
      <a class="idx-row" href="project.html?id=${i}" data-img="${window.getProjectImg(p)}">
        <div class="idx-row__no">№ ${String(i+1).padStart(2,'0')}</div>
        <div class="idx-row__title">${p.title}</div>
        <div class="idx-row__loc">${p.loc}</div>
        <div class="idx-row__year">${p.typ} · ${p.year}</div>
        <div class="idx-row__arrow">→</div>
      </a>
    `).join('');
    wireIndexHover();
  }

  // ---------- 10. Index hover preview ----------
  function wireIndexHover(){
    const preview = $('.idx-preview');
    if (!preview) return;
    $$('.idx-row').forEach(row => {
      row.addEventListener('mouseenter', () => {
        preview.style.backgroundImage = `url('${row.dataset.img}')`;
        preview.classList.add('in');
      });
      row.addEventListener('mouseleave', () => {
        preview.classList.remove('in');
      });
    });
    let px=window.innerWidth/2, py=window.innerHeight/2, pxT=px, pyT=py;
    window.addEventListener('mousemove', e => { pxT = e.clientX; pyT = e.clientY; });
    (function tickPrev(){
      px = lerp(px, pxT, 0.12);
      py = lerp(py, pyT, 0.12);
      preview.style.left = px + 'px';
      preview.style.top  = py + 'px';
      requestAnimationFrame(tickPrev);
    })();
  }

  renderFeatured();
  renderIndex();

  // ---------- 11. Scroll-driven loop ----------
  const stripBgs = $$('.strip__bg, .f-card__img');
  const heroSection = $('.hero');
  const manifestoWords = () => $$('.manifesto__body .word');

  let scrollY = window.scrollY;
  function onScroll(){ scrollY = window.scrollY; }
  window.addEventListener('scroll', onScroll, {passive:true});

  (function tickScroll(){
    // Hero parallax on scroll
    if (heroBg){
      const r = heroSection.getBoundingClientRect();
      const p = -r.top * 0.35;
      heroBg.style.transform = `scale(1.08) translate(0, ${p}px)`;
    }
    // Manifesto word reveal
    const words = manifestoWords();
    if (words.length){
      const sect = $('.manifesto__body');
      const r = sect.getBoundingClientRect();
      const vh = window.innerHeight;
      const top = r.top;
      const h   = r.height;
      // map: when top=vh*0.7 -> 0 ; top + h - vh*0.4 = h -> 1
      const start = vh * 0.75;
      const end   = -h * 0.2;
      const prog = clamp((start - top) / (start - end), 0, 1);
      const reveal = Math.floor(prog * words.length * 1.2);
      words.forEach((w,i) => w.classList.toggle('in', i < reveal));
    }
    // Strip parallax
    $$('.strip').forEach(strip => {
      const bg = strip.querySelector('.strip__bg');
      if (!bg) return;
      const r = strip.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (r.top - vh/2) * 0.18;
      bg.style.transform = `translateY(${-p}px)`;
    });
    // F-card image parallax
    $$('.f-card').forEach(card => {
      const img = card.querySelector('.f-card__img');
      if (!img) return;
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const off = (cx - window.innerWidth/2) / window.innerWidth;
      img.style.transform = `translateX(${off * 30}px) scale(1.08)`;
    });
    requestAnimationFrame(tickScroll);
  })();

  // ---------- 12. CTA title line stagger ----------
  const ctaLines = $$('.cta__title .line span');
  const ctaIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        ctaLines.forEach((s, i) => {
          s.animate(
            [{transform:'translateY(110%)'},{transform:'translateY(0)'}],
            {duration:1100, delay: 80 + i*90, easing:'cubic-bezier(.22,.61,.36,1)', fill:'forwards'}
          );
        });
        ctaIO.disconnect();
      }
    });
  }, {threshold:0.3});
  if (ctaLines.length) ctaIO.observe(ctaLines[0].closest('.cta'));

  // ---------- 13. Live clock in nav ----------
  const clock = $('.nav__clock');
  if (clock){
    function tickClock(){
      const d = new Date();
      // Istanbul-ish (UTC+3 fixed)
      const fmt = n => String(n).padStart(2,'0');
      clock.textContent = `İST · ${fmt(d.getHours())}:${fmt(d.getMinutes())}:${fmt(d.getSeconds())}`;
    }
    tickClock(); setInterval(tickClock, 1000);
  }

  // ---------- 14. Smooth wheel — passive (use browser default; just enrich) ----------
  // (We intentionally avoid hijacking native scroll for accessibility.)

})();
