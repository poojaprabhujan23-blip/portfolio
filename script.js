(() => {
  'use strict';
  const EMAIL = 'poojaprabhu.mca.2026@pim.ac.in';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  document.documentElement.classList.add('js');

  // Skills (levels exactly as on the original site: I = Intermediate, B = Basic)
  const SKILLS = [
    ['Core Programming Languages', 'Algorithmic syntax, systems programming & scientific computation',
      [['C', 'I'], ['C++', 'I'], ['Python', 'I'], ['Java', 'B'], ['JavaScript', 'B'], ['R', 'B']]],
    ['Web Markup & Database Query Languages', 'Structuring web documents & database queries',
      [['HTML', 'I'], ['CSS', 'B'], ['SQL', 'B'], ['MySQL', 'B'], ['MongoDB', 'B']]],
    ['Frameworks & Web Development', 'Frontend & backend full-stack development tools',
      [['React.js', 'B'], ['Node.js', 'B'], ['Express.js', 'B'], ['REST APIs', 'B'], ['Responsive Web Design', 'B'], ['UI/UX', 'B']]],
    ['Tools, Data Science & Methodologies', 'Version control, data analysis & CS fundamentals',
      [['VS Code', 'I'], ['GitHub', 'B'], ['Postman', 'B'], ['Google Antigravity', 'B'], ['Jupyter Notebook', 'B'], ['NumPy', 'B'],
       ['Pandas', 'B'], ['Vercel & GitHub Pages', 'B'], ['Google Cloud', 'B'], ['Data Structures and Algorithms (DSA)', 'B'], ['Object-Oriented Programming (OOP)', 'B'], ['Testing and Debugging', 'B'], ['Problem Solving', 'B']]]
  ];
  const grid = $('#skill-grid');
  grid.innerHTML = SKILLS.map(([t, d, items]) => `
    <article class="card reveal"><h3>${t}</h3><p class="sub">${d}</p>
    ${items.map(([n, l]) => `<div class="sk" data-l="${l}"><span>${n}</span>
      <span class="meter" role="img" aria-label="${n}: ${l === 'I' ? 'Intermediate' : 'Basic'}">
        <i class="f"></i><i class="${l === 'I' ? 'f' : ''}"></i><small>${l === 'I' ? 'Intermediate' : 'Basic'}</small></span></div>`).join('')}
    </article>`).join('');

  // Reveal on scroll
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 }) : null;
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 80}ms`; io ? io.observe(el) : el.classList.add('in'); });

  // Mark cards as settled after reveal so hover/tilt can respond instantly
  $$('.reveal').forEach(el => el.addEventListener('transitionend', e => { if (e.propertyName === 'opacity') el.classList.add('done'); }));

  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Typing effect
  const typed = $('#typed'), words = ['Web Developer', 'Data Science Enthusiast', 'MERN Stack Learner', 'Problem Solver'];
  if (calm) typed.textContent = words[0];
  else {
    let w = 0, c = 0, del = false;
    (function tick() {
      const word = words[w];
      typed.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
      if (del && c === 0) { del = false; w = (w + 1) % words.length; return setTimeout(tick, 350); }
      c += del ? -1 : 1; setTimeout(tick, del ? 40 : 85);
    })();
  }

  // Animated counters (hero starts at load, others when scrolled into view)
  const count = (el, wait) => {
    const end = +el.dataset.count, dec = +el.dataset.dec, t0 = performance.now();
    (function step(t) {
      const p = Math.min((t - t0 - wait) / 1400, 1);
      el.textContent = (end * (p < 0 ? 0 : 1 - Math.pow(1 - p, 3))).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  };
  if (!calm) $$('[data-count]').forEach(el => {
    if (el.closest('.hero') || !io) return count(el, 500);
    el.textContent = (0).toFixed(+el.dataset.dec);
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { count(el, 0); o.disconnect(); } }, { threshold: .6 });
    o.observe(el);
  });

  // Scroll progress bar
  const bar = $('#progress');
  const prog = () => { const m = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${m > 0 ? scrollY / m : 0})`; };
  addEventListener('scroll', prog, { passive: true }); prog();

  // Subtle card tilt (mouse devices only)
  if (!calm && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 6 + 'deg');
        card.style.setProperty('--rx', (.5 - (e.clientY - r.top) / r.height) * 6 + 'deg');
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
  }

  // Tech marquee (ticker of existing skills)
  const stack = ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Python', 'C++', 'Java', 'JavaScript', 'SQL', 'MySQL', 'HTML', 'CSS', 'GitHub', 'Postman', 'Pandas', 'NumPy'];
  $('#track').innerHTML = [...stack, ...stack].map(s => `<span>${s}</span>`).join('');

  // Skill level filter
  const fbtn = $$('.filters button');
  fbtn.forEach(b => b.addEventListener('click', () => {
    fbtn.forEach(x => x.setAttribute('aria-pressed', x === b));
    $$('.sk').forEach(r => r.hidden = b.dataset.f !== 'all' && r.dataset.l !== b.dataset.f);
    $$('#skill-grid .card').forEach(c => c.hidden = !$$('.sk:not([hidden])', c).length);
  }));

  // ATS resume: skills text, print, copy
  $('#paper-skills').innerHTML = SKILLS.map(([t, , items]) => `<b>${t}:</b> ${items.map(i => i[0]).join(', ')}`).join('<br>');
  $('#print').addEventListener('click', () => print());
  $('#copyres').addEventListener('click', async () => {
    const m = $('#rcopied');
    try { await navigator.clipboard.writeText($('#paper').innerText); m.textContent = 'Resume text copied!'; }
    catch { m.textContent = 'Copy unavailable. Please select the text manually.'; }
    setTimeout(() => m.textContent = '', 2500);
  });

  // Hero cursor glow
  const hero = $('#hero');
  if (!calm) hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', e.clientX - r.left + 'px'); hero.style.setProperty('--my', e.clientY - r.top + 'px');
  });

  // Resume popup (opens only when requested)
  const rd = $('#resume-dlg');
  const openResume = () => { if (!rd.open) rd.showModal(); };
  $$('.open-resume, a[href="#resume"]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); setMenu(false); openResume(); }));
  $('#rclose').addEventListener('click', () => rd.close());
  rd.addEventListener('click', e => { if (e.target === rd) rd.close(); });
  if (location.hash === '#resume') openResume();

  // Mobile menu
  const burger = $('.burger'), menu = $('#menu');
  const setMenu = (open) => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Nav shadow + active link
  const nav = $('.nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive: true });
  if (io) {
    const links = $$('#menu a[href^="#"]');
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => spy.observe(s));
  }

  // Profile photo fallback (shows initials if profile.jpg is missing)
  const img = $('.photo img');
  img.addEventListener('error', () => { img.removeAttribute('src'); img.alt = ''; });

  // Copy email
  const copied = $('#copied');
  $('#copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(EMAIL); copied.textContent = 'Email copied!'; }
    catch { copied.textContent = EMAIL; }
    setTimeout(() => copied.textContent = '', 2500);
  });

  // Contact form -> pre-filled mailto
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, err = $('#err');
    const v = n => f.elements[n].value.trim();
    if (!v('n') || !v('s') || !v('m') || !/^\S+@\S+\.\S+$/.test(v('e'))) {
      err.textContent = 'Please complete all fields with a valid email address.'; return;
    }
    err.textContent = '';
    const body = `Hello Pooja,\n\n${v('m')}\n\nRegards,\n${v('n')}\n${v('e')}`;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(v('s'))}&body=${encodeURIComponent(body)}`;
  });
})();
