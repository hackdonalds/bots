import { types, presets } from '../src/index.js';
import { initTheme } from './theme.js';
import { libUrl, CDN_URL } from './lib-url.js';

initTheme(document.getElementById('theme'));

const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  e.append(...kids);
  return e;
};

// Parade: a few bots in the hero.
const parade = document.getElementById('parade');
[
  { type: 'cat', face: 'mouth', hat: 'party' },
  { type: 'droid', glasses: 'round' },
  { type: 'clover', state: 'working', face: 'mouth' },
  { type: 'ghost', blush: true },
  { type: 'mech', headphones: true },
  { type: 'star', hat: 'crown', face: 'mouth' },
  { type: 'alien', state: 'sleeping' },
].forEach((o, i) => parade.append(el('bot-avatar', { ...o, size: 112, seed: (i + 1) / 9 })));

// Grid of every type.
const grid = document.getElementById('grid');
const cards = types.map((t, i) => {
  const bot = el('bot-avatar', { type: t, size: 96, seed: i / types.length });
  const card = el('a', { class: 'card', href: `playground/#type=${t}` }, bot, el('span', { class: 'name' }, presets[t].label), el('span', { class: 'meta' }, presets[t].color));
  grid.append(card);
  return bot;
});

function segmented(id, onChange) {
  const seg = document.getElementById(id);
  seg.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    seg.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    onChange(b.dataset.v);
  });
}
segmented('state-seg', (v) => cards.forEach((b) => b.setAttribute('state', v)));
segmented('shading-seg', (v) => cards.forEach((b) => b.setAttribute('shading', v)));
segmented('face-seg', (v) => cards.forEach((b) => b.setAttribute('face', v)));
segmented('code-seg', (v) => ['html', 'js', 'react'].forEach((k) => (document.getElementById(`code-${k}`).hidden = k !== v)));

// Wear.
const wear = document.getElementById('wear');
[
  ['Beanie', { type: 'blob', hat: 'beanie', 'accessory-color': '#e85d4a' }],
  ['Party hat', { type: 'triangle', hat: 'party', 'accessory-color': '#5b5bf7' }],
  ['Crown', { type: 'circle', hat: 'crown', face: 'mouth' }],
  ['Beret', { type: 'pebble', hat: 'beret' }],
  ['Top hat', { type: 'square', hat: 'tophat', 'bow-tie': true }],
  ['Glasses', { type: 'flower', glasses: 'round' }],
  ['Shades', { type: 'drop', glasses: 'shades', state: 'working' }],
  ['Headphones', { type: 'pill', headphones: true, 'accessory-color': '#f4efe6' }],
].forEach(([name, o], i) => wear.append(el('div', { class: 'card' }, el('bot-avatar', { ...o, size: 96, seed: i / 8 }), el('span', { class: 'name' }, name))));

document.getElementById('heart').setAttribute('path', 'M50 88C50 88 12 64 12 38C12 24 23 14 35 14C42 14 47 18 50 23C53 18 58 14 65 14C77 14 88 24 88 38C88 64 50 88 50 88Z');

// Options table.
const rows = [
  ['type', types.join(', '), 'clover'],
  ['state', 'default (idle), working, sleeping', 'default'],
  ['face', 'eyes, mouth', 'eyes'],
  ['size', 'px', '64'],
  ['color', 'any CSS hex colour', "the type's own"],
  ['ink', 'face colour', 'auto (dark on light bodies)'],
  ['brightness / saturation', '0–2', '1'],
  ['shading', 'fabric, plastic, smooth, crisp, flat', 'fabric'],
  ['light', 'degrees clockwise from the top', '295 (upper left)'],
  ['shadow / highlight / rim', '0–2', 'per shading'],
  ['spread', '0.4–2.5, how far the light wraps', '1.4'],
  ['depth', '0.2–2, thickness when turned', '0.65'],
  ['fur-length / fur-density / fur-fuzz / fur-curl / fur-gravity', 'fabric only', '1 / 1.6 / 0.9 / 0.7 / 0.9'],
  ['hat', 'none, beanie, party, crown, beret, tophat', 'none'],
  ['glasses', 'none, round, square, shades', 'none'],
  ['headphones / bow-tie / blush', 'boolean', 'false'],
  ['accessory-color', 'colour of hats, headphones, bow tie', '#2b2833'],
  ['path', 'SVG path data, 100×100 box', '—'],
  ['speed', 'animation multiplier', '1'],
  ['paused', 'boolean: freeze on the current frame', 'false'],
  ['interactive', 'follow the pointer, hop on click', 'true'],
  ['seed', '0–1, offsets blinks and glances', 'random'],
];
const tbody = document.getElementById('props');
rows.forEach(([a, b, c]) => tbody.append(el('tr', {}, el('td', {}, el('code', {}, a)), el('td', {}, b), el('td', {}, c))));

// Point the snippets at wherever this site is served from.
const lib = libUrl();
for (const pre of document.querySelectorAll('pre.code')) for (const s of pre.querySelectorAll('.s')) {
  if (s.textContent.includes(CDN_URL)) s.textContent = s.textContent.replace(CDN_URL, lib);
}
