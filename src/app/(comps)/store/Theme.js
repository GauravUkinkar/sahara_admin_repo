import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: true, 
      toggleTheme: () =>
        set((state) => {
          const newMode = !state.isDarkMode;
          document.body.classList.toggle('light', !newMode);
          return { isDarkMode: newMode };
        }),
    }),
    { name: 'theme-storage' } 
  )
);

export default ThemeStore;