// Router for the site: #/<page>[:<anchor>] loads pages/<page>.md and renders it with marked.
// #/glossary/<anchor> is the glossary page scrolled to one term. A page holding
// "<!-- filter -->" gets a type-to-filter box. A wide diagram shrinks to fit the column; if it still doesn't fit, it gets an Expand button.
const content = document.getElementById('content');
const SITE = document.title;

function parseHash() {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, '')) || 'home';
  let [page, anchor] = h.split(':');
  if (page.startsWith('glossary/')) { anchor = page.slice(9); page = 'glossary'; }
  return { page, anchor };
}

let current = null;
async function render() {
  const { page, anchor } = parseHash();
  if (page !== current) {
    const res = await fetch(`pages/${page}.md`);
    if (!res.ok) {
      content.innerHTML = `<h1>Not found</h1><p>No page <code>${page}</code>. <a href="#/home">Home</a></p>`;
      current = null;
      return;
    }
    const md = await res.text();
    content.innerHTML = marked.parse(md);
    current = page;
    const h1 = content.querySelector('h1');
    const menu = document.querySelector(`.masthead__menu-item a[href="#/${page}"]`);
    const name = h1 ? h1.textContent : menu ? menu.textContent : '';
    document.title = (name && page !== 'home' ? name + ' · ' : '') + SITE;
    content.querySelectorAll('a[href^="http"]').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });
    if (md.includes('<!-- filter -->')) addFilter(page === 'glossary');
  }
  fitDiagrams();
  const target = anchor && document.getElementById(anchor);
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
}

// Wide diagrams shrink to fit the column, down to 9 px; one still too wide keeps scrolling and gets an
// Expand button that shows it full screen (Esc or Close returns).
function fitDiagrams() {
  content.querySelectorAll('pre').forEach(pre => {
    pre.style.fontSize = '';
    let size = parseFloat(getComputedStyle(pre).fontSize);
    while (pre.scrollWidth > pre.clientWidth && size > 9) { size -= 0.5; pre.style.fontSize = size + 'px'; }
    const prev = pre.previousElementSibling, has = prev && prev.classList.contains('expand');
    if (pre.scrollWidth > pre.clientWidth && !has) {
      const b = document.createElement('button');
      b.className = 'expand'; b.textContent = '⤢ Expand diagram';
      b.onclick = () => openFull(pre);
      pre.before(b);
    } else if (pre.scrollWidth <= pre.clientWidth && has) prev.remove();
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
