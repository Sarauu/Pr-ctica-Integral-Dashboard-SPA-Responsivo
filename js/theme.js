

(function () {
  const THEME_STORAGE_KEY = 'cloudpulse_theme_preference';
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');
  const themeLabel = document.getElementById('theme-label');

  /**
   * Obtiene la preferencia de tema guardada o la detecta del sistema
   */
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    // Detección nativa del navegador/OS
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  }

  /**
   * Aplica el tema al documento HTML y sincroniza los iconos accesibles
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      themeToggleBtn.setAttribute('title', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }

    if (themeIconSun && themeIconMoon) {
      if (isDark) {
        themeIconSun.style.display = 'block';
        themeIconMoon.style.display = 'none';
      } else {
        themeIconSun.style.display = 'none';
        themeIconMoon.style.display = 'block';
      }
    }

    if (themeLabel) {
      themeLabel.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
    }
  }

  /**
   * Alterna entre modo claro y oscuro
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);

    if (window.showToast) {
      window.showToast(
        'Tema actualizado',
        `Se activó el ${newTheme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}`,
        'info'
      );
    }
  }

  // Inicialización al cargar la página
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Escuchar cambios del sistema operativo si el usuario no ha forzado uno manualmente
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  window.toggleTheme = toggleTheme;
})();
