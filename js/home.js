(function renderHomeProjects() {
  var projects = window.PROJECTS || [];
  var list = document.querySelector("[data-project-list]");
  var filterSelect = document.querySelector("[data-project-filter]");

  var monthOrder = {
    january: 0,
    february: 1,
    febrary: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11
  };

  function getProjectDateRank(project) {
    var rawDate = String((project && project.date) || "").trim().toLowerCase();
    var monthMatch = rawDate.match(
      /january|february|febrary|march|april|may|june|july|august|september|october|november|december/
    );
    var yearMatch = rawDate.match(/\b(19|20)\d{2}\b/);
    var monthIndex = monthMatch ? monthOrder[monthMatch[0]] : -1;
    var year = yearMatch ? Number(yearMatch[0]) : 0;

    return year * 100 + (monthIndex + 1);
  }

  if (!list || !projects.length) {
    return;
  }

  function renderProjectList(activeCategory) {
    var normalizedCategory = (activeCategory || "all").toLowerCase();
    var visibleProjects = projects
      .filter(function (project) {
      var categories = Array.isArray(project.category)
        ? project.category
        : [project.category];
      return (
        normalizedCategory === "all" ||
        categories.some(function (category) {
          return String(category).toLowerCase() === normalizedCategory;
        })
      );
      })
      .slice()
      .sort(function (a, b) {
        return getProjectDateRank(b) - getProjectDateRank(a);
      });

    if (!visibleProjects.length) {
      list.innerHTML =
        "<p class='project-empty-state'>No projects found in this category yet.</p>";
      return;
    }

    list.innerHTML = visibleProjects
      .map(function (project) {
        var toneClass = "tone-blue";
        var accent = "var(--blue)";
        var categoryLabel = Array.isArray(project.category)
          ? project.category.join(" / ")
          : project.category;
        var detailHref = "project.html?slug=" + encodeURIComponent(project.slug);
        var dotOverlay =
          project.overlay === "dots"
            ? "<div class='image-overlay-dots'><span></span><span></span><span></span><span></span><span></span></div>"
            : "";

        return (
          "<article class='project-row " +
          toneClass +
          "' style='--accent: " +
          accent +
          ";'>" +
          "<div class='project-content'>" +
          "<p class='project-category'>" +
          categoryLabel +
          "</p>" +
          "<h2 class='project-title'>" +
          project.title +
          "</h2>" +
          "<p class='project-date'>" +
          project.date +
          "</p>" +
          "<a class='project-link' href='" +
          detailHref +
          "' data-transition>Explore</a>" +
          "</div>" +
          "<a class='project-image-link' href='" +
          detailHref +
          "' data-transition aria-label='Open " +
          project.title +
          " details'>" +
          "<div class='project-image'><img src='" +
          project.image +
          "' alt='Descriptive view for " +
          project.title +
          "'>" +
          dotOverlay +
          "</div>" +
          "</a>" +
          "</article>"
        );
      })
      .join("");
  }

  if (filterSelect) {
    filterSelect.addEventListener("change", function (event) {
      renderProjectList(event.target.value);
    });
  }

  renderProjectList(filterSelect ? filterSelect.value : "all");
})();
