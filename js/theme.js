(function themeController() {
  var storageKey = "theme-mode";
  var systemMode = "system";
  var darkTheme = "dark";
  var lightTheme = "light";
  var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  var iconByMode = {
    system: "◐",
    dark: "☾",
    light: "☀"
  };

  var nextModeByMode = {
    system: darkTheme,
    dark: lightTheme,
    light: systemMode
  };

  function getSavedMode() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function saveMode(mode) {
    try {
      window.localStorage.setItem(storageKey, mode);
    } catch (error) {
      // Ignore storage errors and keep runtime-only theme.
    }
  }

  function getSystemTheme() {
    return mediaQuery.matches
      ? darkTheme
      : lightTheme;
  }

  function resolveMode() {
    var savedMode = getSavedMode();
    if (savedMode === systemMode || savedMode === darkTheme || savedMode === lightTheme) {
      return savedMode;
    }
    return systemMode;
  }

  function getThemeFromMode(mode) {
    if (mode === darkTheme || mode === lightTheme) {
      return mode;
    }
    return getSystemTheme();
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function updateToggle(mode, appliedTheme) {
    var nextMode = nextModeByMode[mode];
    var pressedValue = mode === systemMode ? "mixed" : String(mode === darkTheme);
    var buttons = document.querySelectorAll("[data-theme-toggle]");

    buttons.forEach(function (button) {
      button.textContent = iconByMode[mode] || iconByMode[systemMode];
      button.setAttribute("aria-pressed", pressedValue);
      button.setAttribute("data-theme-mode", mode);
      button.setAttribute(
        "aria-label",
        "Theme mode: " +
          mode +
          ". Current theme: " +
          appliedTheme +
          ". Click to switch to " +
          nextMode +
          " mode."
      );
      button.title = "Theme: " + mode + " (next: " + nextMode + ")";
    });
  }

  var currentMode = resolveMode();
  applyTheme(getThemeFromMode(currentMode));

  document.addEventListener("DOMContentLoaded", function () {
    updateToggle(currentMode, getThemeFromMode(currentMode));

    var buttons = document.querySelectorAll("[data-theme-toggle]");
    if (!buttons.length) {
      return;
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        currentMode = nextModeByMode[currentMode] || systemMode;
        var nextTheme = getThemeFromMode(currentMode);

        applyTheme(nextTheme);
        saveMode(currentMode);
        updateToggle(currentMode, nextTheme);
      });
    });
  });

  function handleSystemThemeChange() {
    if (currentMode !== systemMode) {
      return;
    }

    var systemTheme = getSystemTheme();
    applyTheme(systemTheme);
    updateToggle(currentMode, systemTheme);
  }

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleSystemThemeChange);
  } else if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(handleSystemThemeChange);
  }
})();
