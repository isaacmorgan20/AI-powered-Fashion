import { create } from "zustand";
import { api } from "../service/api";

const CACHE_KEY = 'threados_settings_cache';
const CACHE_TIMESTAMP_KEY = 'threados_settings_cache_ts';
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

function loadCachedSettings() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age < CACHE_MAX_AGE) {
        return JSON.parse(cached);
      }
    }
  } catch (e) {
    console.warn('Failed to load cached settings:', e);
  }
  return null;
}

function saveSettingsToCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
  } catch (e) {
    console.warn('Failed to cache settings:', e);
  }
}

const cachedSettings = loadCachedSettings();

const useSettingsStore = create((set, get) => ({
  settings: cachedSettings,
  loading: cachedSettings === null,
  error: null,
  saving: false,

  fetchSettings: async () => {
    try {
      set({ loading: true, error: null });
      const data = await api.settings.get();
      saveSettingsToCache(data);
      set({ settings: data, error: null });
    } catch (err) {
      const cached = get().settings;
      if (cached) {
        set({ error: 'Offline — showing saved settings', loading: false });
      } else {
        set({ error: err.message, loading: false });
      }
      console.error("Failed to fetch settings:", err);
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (patch) => {
    try {
      set({ saving: true });
      const updated = await api.settings.update(patch);
      saveSettingsToCache(updated);
      set({ settings: updated, saving: false });
      return updated;
    } catch (err) {
      set({ saving: false });
      console.error("Failed to update settings:", err);
      throw err;
    }
  },
}));

export default useSettingsStore;
