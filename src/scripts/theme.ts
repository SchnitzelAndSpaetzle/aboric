export type Theme = 'dark' | 'light';

function readStored(): Theme | null {
  try {
    const stored = localStorage.getItem('theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch {
    return null;
  }
}

function writeStored(theme: Theme): void {
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Storage may be blocked (private mode, denied permission). The dataset
    // attribute still gets set, so the UI works; preference just won't persist.
  }
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  writeStored(theme);
}

export function getTheme(): Theme {
  const stored = readStored();
  if (stored) return stored;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  return prefersDark ? 'dark' : 'light';
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
