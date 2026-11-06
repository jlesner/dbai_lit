// Router for the site: #/<page>[:<anchor>] loads pages/<page>.md and renders it with marked.
// #/glossary/<anchor> is the glossary page scrolled to one term. A page holding
// "<!-- filter -->" gets a type-to-filter box. A wide diagram scales to fit the column and gets an Expand button.
// #/tags/<expression> combines tags (combo below); a removed subtag's old link redirects to its expression.
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
    let md = null;
    if (/^tags\/.*[+,!]/.test(page)) md = await combo(page.slice(5));
    else {
      const res = await fetch(`pages/${page}.md`);
      if (res.ok) md = await res.text();
      else if (page.startsWith('tags/')) {
        const to = (await tagSets()).redirects[page.slice(5)];
        if (mine === generation && to) { location.replace(`#/tags/${to}`); return; }
      }
    }
    if (mine !== generation) return;  // another page was asked for meanwhile
    if (md === null) {
      content.innerHTML = `<h1>Not found</h1><p>No page <code>${page}</code>. <a href="#/home">Home</a></p>`;
      current = null;
      return;
    }
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
    if (page === 'tags') addCombine();
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

// Combined tags: '+' joins clauses that must all hold, ',' joins alternatives within one, '!' negates a tag
// (against every tagged item). The members and their list lines come from pages/tagsets.md (JSON, build.py).
let sets = null;
async function tagSets() {
  if (!sets) sets = fetch('pages/tagsets.md').then(r => r.json());
  return sets;
}
async function combo(expr) {
  const { tags, lines } = await tagSets();
  const clauses = expr.split('+').map(c => c.split(',').map(l => ({ not: l.startsWith('!'), tag: l.replace(/^!/, '') })));
  const unknown = clauses.flat().map(l => l.tag).filter(t => !tags[t]);
  const esc = t => t.replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);
  if (unknown.length) return `# Tags ${esc(expr)}\n\nNo tag ${unknown.map(t => '<code>' + esc(t) + '</code>').join(', ')}. <a href="#/tags">All tags</a>\n`;
  const has = Object.fromEntries(Object.entries(tags).map(([t, ms]) => [t, new Set(ms)]));
  const hits = Object.keys(lines).filter(m => clauses.every(c => c.some(l => has[l.tag].has(m) !== l.not)));
  const chip = l => `${l.not ? 'not ' : ''}<a class="tag${l.tag.includes('-') ? ' sub' : ''}" href="#/tags/${l.tag}">${l.tag}</a>`;
  const head = clauses.map(c => c.map(chip).join(' or ')).join(' and ');
  const part = (title, kind) => {
    const ls = hits.filter(m => m.startsWith(kind + ':')).sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
    return ls.length ? `## ${title}\n\n${ls.map(m => lines[m]).join('\n')}\n\n` : '';
  };
  return `# Tags: ${hits.length} items\n\n<p class="jump">${head}</p>\n\n<!-- filter -->\n\n` +
    part('Papers', 'paper') + part('Projects', 'project');
}
function addCombine() {
  const box = document.createElement('input');
  box.type = 'search';
  box.placeholder = 'Combine tags, e.g. harness+!dsl-sql, then Enter';
  box.className = 'filter';
  box.addEventListener('keydown', e => {
    const q = box.value.replace(/\s+/g, '').replace(/&/g, '+').replace(/\|/g, ',');
    if (e.key === 'Enter' && q) location.hash = `#/tags/${q}`;
  });
  const h1 = content.querySelector('h1');
  if (h1) h1.after(box); else content.prepend(box);
}

// Sections: each h2, h3 or h4 with the elements after it, up to the next of those; level is the 2, 3 or 4.
function sections() {
  const out = [];
  for (const el of content.children) {
    if (/^H[234]$/.test(el.tagName)) out.push({ head: el, body: [], level: +el.tagName[1] });
    else if (out.length) out[out.length - 1].body.push(el);
  }
  return out;
}

// Lists: hide items that don't match, headings whose items are all hidden, and headings without items of their
// own (a group) whose deeper headings are all hidden.
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
    const ss = sections();
    for (let i = ss.length - 1; i >= 0; i--) {  // from the end, so a group's deeper headings are settled first
      const s = ss[i], items = s.body.flatMap(el => [...el.querySelectorAll('li')]);
      if (items.length) { s.head.hidden = q && items.every(li => li.hidden); continue; }
      const kids = [];
      for (let j = i + 1; j < ss.length && ss[j].level > s.level; j++) kids.push(ss[j]);
      if (kids.length) s.head.hidden = q && kids.every(k => k.head.hidden);
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
