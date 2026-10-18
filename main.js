
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  // Theme toggle
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);

    const isDark = theme === "dark";

    if (themeIcon) {
      themeIcon.className = isDark ? "bi bi-sun" : "bi bi-moon";
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme",
      );
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme");
      setTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  // Skills tabs
  const tabs = document.querySelectorAll(".skill-tab");
  const panels = document.querySelectorAll(".skill-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((item) => {
        const selected = item === tab;

        item.classList.toggle("active", selected);
        item.setAttribute("aria-selected", String(selected));
      });

      panels.forEach((panel) => {
        panel.classList.toggle("d-none", panel.id !== `tab-${target}`);
      });
    });
  });

  // Current year in footer and hero
  const year = new Date().getFullYear();
  const currentYear = document.getElementById("currentYear");
  const heroYear = document.getElementById("heroYear");

  if (currentYear) {
    currentYear.textContent = year;
  }

  if (heroYear) {
    heroYear.textContent = year;
  }

  // Close mobile navigation after selecting a section
  const navCollapse = document.getElementById("portfolioNav");

  document.querySelectorAll("#portfolioNav .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (
        window.bootstrap &&
        navCollapse &&
        navCollapse.classList.contains("show")
      ) {
        window.bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  // Image placeholders for missing images
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    function applyFallback() {
      if (img.dataset.fallbackApplied) return;

      img.dataset.fallbackApplied = "true";

      const kind = img.dataset.fallback;

      const labels = {
        portrait: "ADD YOUR PORTRAIT",
        watch: "CHRONOS TIMEPIECES",
        portfolio: "PERSONAL PORTFOLIO",
        game: "DEADZONE SURVIVAL",
        database: "DATABASE PROJECT",
      };

      const icons = {
        portrait: "bi-person-bounding-box",
        watch: "bi-watch",
        portfolio: "bi-window-stack",
        game: "bi-controller",
        database: "bi-database",
      };

      const placeholder = document.createElement("div");

      placeholder.className = `image-placeholder placeholder-${kind}`;
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute(
        "aria-label",
        labels[kind] || "Project image placeholder",
      );

      const icon = document.createElement("i");
      icon.className = `bi ${icons[kind] || "bi-image"}`;
      icon.setAttribute("aria-hidden", "true");

      const text = document.createElement("span");
      text.textContent = labels[kind] || "ADD PROJECT IMAGE";

      placeholder.append(icon, text);
      img.replaceWith(placeholder);
    }

    img.addEventListener("error", applyFallback, { once: true });

    if (img.complete && img.naturalWidth === 0) {
      applyFallback();
    }
  });

  // GitHub public repository count
  const githubRepoCount = document.getElementById("githubRepoCount");

  async function updateGithubRepoCount() {
    if (!githubRepoCount) return;

    try {
      const response = await fetch(
        "https://api.github.com/users/mrcsrcna/repos?type=owner&per_page=100",
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch GitHub repositories: ${response.status}`,
        );
      }

      const repositories = await response.json();

      if (!Array.isArray(repositories)) {
        throw new Error("Unexpected GitHub API response.");
      }

      const publicRepositories = repositories.filter(
        (repo) => !repo.private && !repo.archived,
      );

      githubRepoCount.textContent = publicRepositories.length;
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
      githubRepoCount.textContent = "—";
    }
  }

  updateGithubRepoCount();
});
