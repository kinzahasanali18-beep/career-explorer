import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// App-wide light/dark theme. The actual colors live as CSS custom properties in
// index.css (see :root and :root[data-theme="light"]); this context only tracks
// which mode is active, flips the `data-theme` attribute on <html>, and persists
// the choice. Defaults to dark to match the app's original styling.

const ThemeContext = createContext(null);
const STORAGE_KEY = 'sparq-theme';

export function getStoredTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* localStorage unavailable — fall through */ }
  return 'dark';
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(getStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* ignore */ }
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setMode(m => (m === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, isDark: mode === 'dark', toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
