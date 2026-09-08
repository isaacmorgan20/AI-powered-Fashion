import { useEffect } from 'react';
import useSettingsStore from '../Store/settingsStore';
import useAuthStore from '../Store/AuthStore';

export function useSettings() {
  const settings = useSettingsStore((s) => s.settings);
  const loading = useSettingsStore((s) => s.loading);
  const error = useSettingsStore((s) => s.error);
  const saving = useSettingsStore((s) => s.saving);
  const fetchSettings = useSettingsStore((s) => s.fetchSettings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  // Wait for AuthStore to be ready (auth initialized and user available)
  const authLoading = useAuthStore((s) => s.loading);
  const authUser = useAuthStore((s) => s.user);

  useEffect(() => {
    // Only fetch settings when:
    // 1. Settings not loaded yet
    // 2. Settings store is in loading state (initial fetch)
    // 3. AuthStore has finished initializing (not loading)
    // 4. User is authenticated (user exists)
    if (settings === null && loading && !authLoading && authUser) {
      fetchSettings();
    }
  }, [settings, loading, authLoading, authUser, fetchSettings]);

  return {
    settings,
    loading,
    error,
    saving,
    refetch: fetchSettings,
    updateSettings,
    setSettings: (s) => useSettingsStore.setState({ settings: s }),
  };
}
