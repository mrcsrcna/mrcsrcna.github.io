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

  // ---------------------------------------------------------------
  // Hero: rotating role, cursor spotlight, portrait tilt
  // ---------------------------------------------------------------
  const hero = document.getElementById("home");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (hero) {
    // Rotating role in the eyebrow (a no-op if there is only one role)
    const roles = Array.from(hero.querySelectorAll(".role-item"));
    let roleIndex = 0;
    let roleTimer = null;

    function showNextRole() {
      roles[roleIndex].classList.remove("is-active");
      roles[roleIndex].setAttribute("aria-hidden", "true");

      roleIndex = (roleIndex + 1) % roles.length;

      roles[roleIndex].classList.add("is-active");
      roles[roleIndex].removeAttribute("aria-hidden");
    }

    function startRoles() {
      if (roles.length < 2 || roleTimer || reducedMotion.matches) return;
      roleTimer = setInterval(showNextRole, 2800);
    }

    function stopRoles() {
      clearInterval(roleTimer);
      roleTimer = null;
    }

    startRoles();

    // Save battery: stop rotating when the tab or the hero is not visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopRoles();
      else startRoles();
    });

    if (reducedMotion.addEventListener) {
      reducedMotion.addEventListener("change", (event) => {
        if (event.matches) stopRoles();
        else startRoles();
      });
    }

    // Pause the ambient CSS animations while the hero is off screen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        hero.classList.toggle("is-offscreen", !entry.isIntersecting);

        if (entry.isIntersecting) startRoles();
        else stopRoles();
      }).observe(hero);
    }

    // Cursor spotlight and subtle 3D tilt on the portrait.
    // Only on devices with a real mouse, and never with reduced motion.
    const portraitWrap = hero.querySelector(".hero-portrait-wrap");
    const portraitMedia = hero.querySelector(".portrait-media");
    let pointerX = 0;
    let pointerY = 0;
    let frame = null;

    function updatePointerEffects() {
      frame = null;

      const rect = hero.getBoundingClientRect();
      const x = pointerX - rect.left;
      const y = pointerY - rect.top;

      hero.style.setProperty("--mx", `${x}px`);
      hero.style.setProperty("--my", `${y}px`);

      const nx = x / rect.width - 0.5;
      const ny = y / rect.height - 0.5;

      // Photo + frame tilt in 3D
      if (portraitMedia) {
        portraitMedia.style.transform = `perspective(1100px) rotateX(${(ny * -6).toFixed(2)}deg) rotateY(${(nx * 7).toFixed(2)}deg)`;
      }

      // Caption slides in the opposite direction, in whole pixels so the
      // text stays crisp
      if (portraitWrap) {
        portraitWrap.style.setProperty("--cx", `${Math.round(nx * -14)}px`);
        portraitWrap.style.setProperty("--cy", `${Math.round(ny * -10)}px`);
      }
    }

    function resetPointerEffects() {
      hero.classList.remove("is-pointer");

      if (portraitMedia) portraitMedia.style.transform = "";

      if (portraitWrap) {
        portraitWrap.style.removeProperty("--cx");
        portraitWrap.style.removeProperty("--cy");
      }
    }

    if (finePointer.matches && !reducedMotion.matches) {
      hero.addEventListener("pointermove", (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;

        hero.classList.add("is-pointer");

        if (!frame) frame = requestAnimationFrame(updatePointerEffects);
      });

      hero.addEventListener("pointerleave", resetPointerEffects);
    }
  }
});