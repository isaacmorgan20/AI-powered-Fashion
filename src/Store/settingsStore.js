import { create } from "zustand";
import { api } from "../service/api";

const useSettingsStore = create((set, get) => ({
  settings: null,
  loading: true,
  error: null,
  saving: false,

  fetchSettings: async () => {
    try {
      set({ loading: true, error: null });
      const data = await api.settings.get();
      set({ settings: data, error: null });
    } catch (err) {
      set({ error: err.message });
      console.error("Failed to fetch settings:", err);
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (patch) => {
    try {
      set({ saving: true });
      const updated = await api.settings.update(patch);
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
