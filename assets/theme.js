// Light / dark toggle shared by the site pages. The choice is remembered per browser.
export function initTheme(button, onChange) {
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('bots-theme'); } catch {}
  if (saved) root.dataset.theme = saved;
  const current = () => root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  onChange?.(current());
  button?.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('bots-theme', next); } catch {}
    onChange?.(next);
  });
  return current;
}
