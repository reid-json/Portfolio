// Applies the saved theme before first paint and wires up any theme toggle buttons.
(function () {
  const key = "packetpath-theme";
  const root = document.documentElement;

  function preferred() {
    try {
      const saved = localStorage.getItem(key);
      if (saved === "dark" || saved === "light") return saved;
    } catch (error) { /* storage unavailable */ }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function apply(theme) {
    root.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0e1320" : "#f5f7fb");
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const dark = theme === "dark";
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      button.title = dark ? "Switch to light mode" : "Switch to dark mode";
      button.textContent = dark ? "☀" : "☾";
    });
  }

  apply(preferred());

  document.addEventListener("DOMContentLoaded", () => {
    apply(root.dataset.theme);
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const next = root.dataset.theme === "dark" ? "light" : "dark";
        try { localStorage.setItem(key, next); } catch (error) { /* ignore */ }
        apply(next);
      });
    });
  });
})();
