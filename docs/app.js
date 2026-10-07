// Router for the site: #/<page>[:<anchor>] loads pages/<page>.md and renders it with marked.
// #/glossary/<anchor> is the glossary page scrolled to one term. A page holding
// "<!-- filter -->" gets a type-to-filter box. A wide diagram scales to fit the column and gets an Expand button.
const content = document.getElementById('content');
const SITE = document.title;

function parseHash() {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, '')) || 'home';
  let [page, anchor] = h.split(':');
  if (page.startsWith('glossary/')) { anchor = page.slice(9); page = 'glossary'; }
  return { page, anchor };
}

// Big pages (the glossary, the papers list) render in pieces: the first piece, and every piece up to the
// requested anchor, at once; the rest a piece per task, so a slow device shows the page without waiting for
// the whole of it. Pieces split before a '<a id="' line, which every heading follows.
const PIECE = 16000;  // characters of Markdown
function pieces(md) {
  const out = [];
  for (const part of md.split(/\n(?=<a id=")/)) {
    if (out.length && out[out.length - 1].length + part.length < PIECE) out[out.length - 1] += '\n' + part;
    else out.push(part);
  }
  return out;
}
function add(md) {
  const t = document.createElement('template');
  t.innerHTML = marked.parse(md);
  t.content.querySelectorAll('a[href^="http"]').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });
  content.append(t.content);
}

let current = null, generation = 0, rendering = Promise.resolve();
async function render() {
  const { page, anchor } = parseHash();
  if (page !== current) {
    const mine = ++generation;
    const res = await fetch(`pages/${page}.md`);
    if (mine !== generation) return;  // another page was asked for meanwhile
    if (!res.ok) {
      content.innerHTML = `<h1>Not found</h1><p>No page <code>${page}</code>. <a href="#/home">Home</a></p>`;
      current = null;
      return;
    }
    const md = await res.text();
    if (mine !== generation) return;
    const parts = pieces(md);
    const at = anchor ? md.indexOf(`<a id="${anchor}">`) : -1;
    let i = 0, seen = 0;
    content.innerHTML = '';
    do { seen += parts[i].length + 1; add(parts[i++]); } while (i < parts.length && at >= seen);
    current = page;
    const h1 = content.querySelector('h1');
    const menu = document.querySelector(`.masthead__menu-item a[href="#/${page}"]`);
    const name = h1 ? h1.textContent : menu ? menu.textContent : '';
    document.title = (name && page !== 'home' ? name + ' · ' : '') + SITE;
    const box = md.includes('<!-- filter -->') ? addFilter(page === 'glossary') : null;
    rendering = new Promise(done => {
      const next = () => {
        if (mine !== generation) return done();
        if (i >= parts.length) { fitDiagrams(); return done(); }
        add(parts[i++]);
        if (box && box.value) box.dispatchEvent(new Event('input'));  // a filter typed early covers the new piece
        setTimeout(next, 0);
      };
      next();
    });
  }
  fitDiagrams();
  if (document.fonts) document.fonts.ready.then(fitDiagrams);  // again once the diagram font has loaded
  let target = anchor && document.getElementById(anchor);
  if (anchor && !target) { await rendering; target = document.getElementById(anchor); }  // a later piece
  if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
  document.querySelectorAll('.masthead__menu-item a').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#/' + page.split('/')[0]));
}

// Sections: each h2 or h3 with the elements after it, up to the next h2 or h3.
function sections() {
  const out = [];
  for (const el of content.children) {
    if (el.tagName === 'H2' || el.tagName === 'H3') out.push({ head: el, body: [] });
    else if (out.length) out[out.length - 1].body.push(el);
  }
  return out;
}

// Lists: hide items that don't match, and headings whose items are all hidden.
// Glossary: show only the entries whose term matches.
function addFilter(byHeading) {
  const box = document.createElement('input');
  box.type = 'search';
  box.placeholder = byHeading ? 'Filter terms…' : 'Filter…';
  box.className = 'filter';
  const h1 = content.querySelector('h1');
  if (h1) h1.after(box); else content.prepend(box);
  box.addEventListener('input', () => {
    const q = box.value.trim().toLowerCase();
    if (byHeading) {
      for (const s of sections()) {
        const hide = q && !s.head.textContent.toLowerCase().includes(q);
        [s.head, ...s.body].forEach(el => { el.hidden = hide; });
      }
      return;
    }
    content.querySelectorAll('li').forEach(li => { li.hidden = q && !li.textContent.toLowerCase().includes(q); });
    for (const s of sections()) {
      const items = s.body.flatMap(el => [...el.querySelectorAll('li')]);
      if (items.length) s.head.hidden = q && items.every(li => li.hidden);
    }
  });
  return box;
}

// A wide diagram scales to fit the column (its font shrinks, down to 4 px); one that had to shrink gets an
// Expand button that shows it full size (Esc or Close returns). Past 4 px it scrolls.
function fitDiagrams() {
  content.querySelectorAll('pre').forEach(pre => {
    pre.style.fontSize = '';
    const full = parseFloat(getComputedStyle(pre).fontSize);
    let size = full;
    if (pre.scrollWidth > pre.clientWidth) {  // monospace text scales with its font size, so one step, then trim
      size = Math.max(4, full * pre.clientWidth / pre.scrollWidth);
      pre.style.fontSize = size + 'px';
      while (pre.scrollWidth > pre.clientWidth && size > 4) { size -= 0.25; pre.style.fontSize = size + 'px'; }
    }
    const prev = pre.previousElementSibling, has = prev && prev.classList.contains('expand');
    if (size < full && !has) {
      const b = document.createElement('button');
      b.className = 'expand'; b.textContent = '⤢ Expand diagram';
      b.onclick = () => openFull(pre);
      pre.before(b);
    } else if (size >= full && has) prev.remove();
  });
}

function openFull(pre) {
  const o = document.createElement('div'), x = document.createElement('button');
  o.className = 'overlay'; x.className = 'close'; x.textContent = '✕ Close (Esc)';
  const close = () => { o.remove(); document.removeEventListener('keydown', esc); };
  const esc = e => { if (e.key === 'Escape') close(); };
  x.onclick = close;
  document.addEventListener('keydown', esc);
  const copy = pre.cloneNode(true);
  copy.style.fontSize = '';
  o.append(x, copy);
  document.body.append(o);
}

window.addEventListener('resize', fitDiagrams);
window.addEventListener('hashchange', render);
render();
