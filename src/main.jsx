import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

(function initTheme() {
  try {
    const stored = localStorage.getItem('threados-settings');
    let theme = 'system';
    if (stored) {
      const parsed = JSON.parse(stored);
      theme = parsed?.appearance?.theme || 'system';
    }
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.toggle('dark', mediaQuery.matches);
    }
  } catch (_e) {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    root.classList.toggle('dark', mediaQuery.matches);
  }
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)