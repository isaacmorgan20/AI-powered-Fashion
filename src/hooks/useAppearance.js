import { useEffect } from 'react';
import useSettingsStore from '../Store/settingsStore';

export function useAppearance() {
  const settings = useSettingsStore((s) => s.settings);
  const theme = settings?.appearance?.theme || 'system';
  const compact = settings?.appearance?.compact || false;

  useEffect(() => {
    const root = document.documentElement;

    // Compact: add/remove class for spacing reduction
    if (compact) {
      root.classList.add('compact');
    } else {
      root.classList.remove('compact');
    }

    // Theme: Light / Dark / System
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.toggle('dark', mediaQuery.matches);
      const handleSystemTheme = (event) => {
        const currentTheme = useSettingsStore.getState().settings?.appearance?.theme || 'system';
        if (currentTheme === 'system') {
          root.classList.toggle('dark', event.matches);
        }
      };
      mediaQuery.addEventListener('change', handleSystemTheme);
      return () => mediaQuery.removeEventListener('change', handleSystemTheme);
    }
  }, [theme, compact]);

  return { theme, compact };
}
