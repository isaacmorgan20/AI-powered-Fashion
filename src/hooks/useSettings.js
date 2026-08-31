import { useEffect } from 'react';
import useSettingsStore from '../Store/settingsStore';

export function useSettings() {
  const settings = useSettingsStore((s) => s.settings);
  const loading = useSettingsStore((s) => s.loading);
  const error = useSettingsStore((s) => s.error);
  const saving = useSettingsStore((s) => s.saving);
  const fetchSettings = useSettingsStore((s) => s.fetchSettings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  useEffect(() => {
    if (settings === null && loading) {
      fetchSettings();
    }
  }, [settings, loading, fetchSettings]);

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
