// Theme management
class ThemeManager {
  constructor() {
    this.htmlElement = document.documentElement;
    this.storageKey = 'unifyroute-theme';
    this.themes = {
      light: 'light-mode',
      dark: 'dark-mode'
    };
    this.init();
  }

  init() {
    // Check saved preference
    const savedTheme = localStorage.getItem(this.storageKey);

    if (savedTheme) {
      // Use saved preference
      this.setTheme(savedTheme);
    } else if (this.prefersDarkMode()) {
      // Use system preference
      this.setTheme(this.themes.dark);
    } else {
      // Default to light mode
      this.setTheme(this.themes.light);
    }
  }

  prefersDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  setTheme(theme) {
    // Remove all theme classes
    Object.values(this.themes).forEach(t => {
      this.htmlElement.classList.remove(t);
    });

    // Add new theme class
    this.htmlElement.classList.add(theme);

    // Save preference
    localStorage.setItem(this.storageKey, theme);

    // Update icon only if it's safe to do so (window.themeManager is set)
    if (window.themeManager && document.getElementById('theme-toggle')) {
      updateThemeToggleIcon();
    }

    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme } }));
  }

  toggle() {
    const currentTheme = this.htmlElement.classList.contains(this.themes.dark)
      ? this.themes.dark
      : this.themes.light;

    const newTheme = currentTheme === this.themes.dark
      ? this.themes.light
      : this.themes.dark;

    this.setTheme(newTheme);
  }

  getCurrentTheme() {
    return this.htmlElement.classList.contains(this.themes.dark)
      ? this.themes.dark
      : this.themes.light;
  }
}

// Initialize theme manager and setup event listeners
function initializeTheme() {
  // Create theme manager first, but don't trigger icon update yet
  window.themeManager = new ThemeManager();

  // Now that window.themeManager exists, we can safely update the icon
  updateThemeToggleIcon();

  // Attach click handler to theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      window.themeManager.toggle();
    });

    // Listen for theme changes
    window.addEventListener('themechanged', (e) => {
      updateThemeToggleIcon();
    });
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTheme);
} else {
  initializeTheme();
}

function updateThemeToggleIcon() {
  const themeToggle = document.getElementById('theme-toggle');
  const isDark = window.themeManager.getCurrentTheme() === 'dark-mode';

  if (themeToggle) {
    if (isDark) {
      // Show sun for dark mode
      themeToggle.innerHTML = '<svg width="20" height="20" viewBox="-5.5 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M11.875 6v2.469c0 .844-.375 1.25-1.156 1.25s-1.156-.406-1.156-1.25V6c0-.813.375-1.219 1.156-1.219s1.156.406 1.156 1.219zM14.219 9.25l1.438-2.031c.469-.625 1.063-.75 1.656-.313s.656 1 .188 1.688l-1.438 2c-.469.688-1.031.75-1.656.313-.594-.438-.656-.969-.188-1.656zM5.781 7.25l1.469 2c.469.688.406 1.219-.219 1.656-.594.469-1.156.375-1.625-.313l-1.469-2c-.469-.688-.406-1.219.219-1.656.594-.469 1.156-.375 1.625.313zM10.719 11.125c2.688 0 4.875 2.188 4.875 4.875 0 2.656-2.188 4.813-4.875 4.813s-4.875-2.156-4.875-4.813c0-2.688 2.188-4.875 4.875-4.875zM1.594 11.813l2.375.75c.781.25 1.063.719.813 1.469-.219.75-.75.969-1.563.719l-2.313-.75c-.781-.25-1.063-.75-.844-1.5.25-.719.75-.938 1.531-.688zM17.5 12.563l2.344-.75c.813-.25 1.313-.031 1.531.688.25.75-.031 1.25-.844 1.469l-2.313.781c-.781.25-1.281.031-1.531-.719-.219-.75.031-1.219.813-1.469zM10.719 18.688c1.5 0 2.719-1.219 2.719-2.688 0-1.5-1.219-2.719-2.719-2.719s-2.688 1.219-2.688 2.719c0 1.469 1.188 2.688 2.688 2.688zM.906 17.969l2.344-.75c.781-.25 1.313-.063 1.531.688.25.75-.031 1.219-.813 1.469l-2.375.781c-.781.25-1.281.031-1.531-.719-.219-.75.063-1.219.844-1.469zM18.219 17.219l2.344.75c.781.25 1.063.719.813 1.469-.219.75-.719.969-1.531.719l-2.344-.781c-.813-.25-1.031-.719-.813-1.469.25-.75.75-.938 1.531-.688zM3.938 23.344l1.469-1.969c.469-.688 1.031-.781 1.625-.313.625.438.688.969.219 1.656l-1.469 1.969c-.469.688-1.031.813-1.656.375-.594-.438-.656-1.031-.188-1.719zM16.063 21.375l1.438 1.969c.469.688.406 1.281-.188 1.719s-1.188.281-1.656-.344l-1.438-2c-.469-.688-.406-1.219.188-1.656.625-.438 1.188-.375 1.656.313zM11.875 23.469v2.469c0 .844-.375 1.25-1.156 1.25s-1.156-.406-1.156-1.25v-2.469c0-.844.375-1.25 1.156-1.25s1.156.406 1.156 1.25z" fill="currentColor"/></svg>';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      // Show moon for light mode
      themeToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.0174 2.80157C6.37072 3.29221 2.75 7.22328 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C16.7767 21.25 20.7078 17.6293 21.1984 12.9826C19.8717 14.6669 17.8126 15.75 15.5 15.75C11.4959 15.75 8.25 12.5041 8.25 8.5C8.25 6.18738 9.33315 4.1283 11.0174 2.80157ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C12.7166 1.25 13.0754 1.82126 13.1368 2.27627C13.196 2.71398 13.0342 3.27065 12.531 3.57467C10.8627 4.5828 9.75 6.41182 9.75 8.5C9.75 11.6756 12.3244 14.25 15.5 14.25C17.5882 14.25 19.4172 13.1373 20.4253 11.469C20.7293 10.9658 21.286 10.804 21.7237 10.8632C22.1787 10.9246 22.75 11.2834 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12Z" fill="currentColor"/></svg>';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }
}
