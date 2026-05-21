import { toggleTheme } from './theme';

const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
button?.addEventListener('click', () => {
  toggleTheme();
});
