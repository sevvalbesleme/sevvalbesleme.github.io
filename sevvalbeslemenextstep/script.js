(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav");
  const filters = [...document.querySelectorAll(".filter")];
  const projects = [...document.querySelectorAll(".project-card")];
  const yearLabel = document.querySelector("#year");

  // Update the footer year automatically.
  if (yearLabel) {
    yearLabel.textContent = new Date().getFullYear();
  }

  // Accessible mobile navigation.
  if (menuButton && navigation) {
    const closeMenu = () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Menüyü aç");
    };

    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      navigation.classList.toggle("open", !expanded);
      menuButton.setAttribute("aria-expanded", String(!expanded));
      menuButton.setAttribute("aria-label", expanded ? "Menüyü aç" : "Menüyü kapat");
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (
        navigation.classList.contains("open") &&
        !navigation.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // Filter portfolio projects by category.
  const setFilter = (selectedFilter) => {
    projects.forEach((project) => {
      const categories = (project.dataset.category || "").split(/\s+/);
      const shouldShow =
        selectedFilter === "all" || categories.includes(selectedFilter);

      project.classList.toggle("is-hidden", !shouldShow);
      project.setAttribute("aria-hidden", String(!shouldShow));
    });

    filters.forEach((filter) => {
      const isActive = filter.dataset.filter === selectedFilter;
      filter.classList.toggle("active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });
  };

  filters.forEach((filter) => {
    filter.setAttribute(
      "aria-pressed",
      String(filter.classList.contains("active"))
    );

    filter.addEventListener("click", () => {
      setFilter(filter.dataset.filter || "all");
    });
  });

  // Start with all projects visible.
  setFilter("all");
})();
