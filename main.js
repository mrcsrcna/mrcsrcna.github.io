document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    const isDark = theme === "dark";
    themeIcon.className = isDark ? "bi bi-sun" : "bi bi-moon";
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme",
    );
  }

  themeToggle.addEventListener("click", () => {
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

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
  document.getElementById("currentYear").textContent = year;
  document.getElementById("heroYear").textContent = year;

  // Close mobile navigation after selecting a section
  const navCollapse = document.getElementById("portfolioNav");
  document.querySelectorAll("#portfolioNav .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.bootstrap && navCollapse.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  // Use an attractive CSS placeholder if an image has not been added yet.
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
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
        placeholder.innerHTML = `<i class="bi ${icons[kind] || "bi-image"}" aria-hidden="true"></i><span>${labels[kind] || "ADD PROJECT IMAGE"}</span>`;
        img.replaceWith(placeholder);
      },
      { once: true },
    );
    if (img.complete && img.naturalWidth === 0)
      img.dispatchEvent(new Event("error"));
  });

  const githubRepoCount = document.getElementById("githubRepoCount");

  async function updateGithubRepoCount() {
    if (!githubRepoCount) return;

    try {
      const response = await fetch(
        "https://api.github.com/users/mrcsrcna/repos?type=owner&per_page=100",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch GitHub repositories.");
      }

      const repositories = await response.json();

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
