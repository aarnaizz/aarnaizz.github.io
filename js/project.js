(function renderProjectPage() {
  var projects = window.PROJECTS || [];
  var container = document.querySelector("[data-project-detail]");

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

  var projectsByDate = projects.slice().sort(function (a, b) {
    return getProjectDateRank(b) - getProjectDateRank(a);
  });

  if (!container || !projects.length) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var slug = params.get("slug");
  var selected = projectsByDate.find(function (project) {
    return project.slug === slug;
  });
  var isFallback = false;

  if (!selected) {
    selected = projectsByDate[0];
    isFallback = Boolean(slug);
  }

  var toneClass = "tone-blue";
  var accent = "var(--blue)";
  var categoryLabel = Array.isArray(selected.category)
    ? selected.category.join(" / ")
    : selected.category;
  var highlights = (selected.highlights || [])
    .map(function (item) {
      return "<li>" + item + "</li>";
    })
    .join("");

  container.innerHTML =
    "<article class='project-detail " +
    toneClass +
    "' style='--accent: " +
    accent +
    ";'>" +
    (isFallback
      ? "<p class='project-fallback'>Project not found. Showing default project.</p>"
      : "") +
    "<h2 class='project-title project-detail-title'>" +
    selected.title +
    "</h2>" +
    "<div class='project-detail-body'>" +
    "<div class='project-detail-copy'>" +
    "<p class='project-category'>" +
      categoryLabel +
    "</p>" +
    "<p class='project-date'>" +
    selected.date +
    "</p>" +
    "<p class='project-description'>" +
    selected.description +
    "</p>" +
    "<ul class='project-highlights'>" +
    highlights +
    "</ul>" +
    "<a class='project-back-link' href='index.html' data-transition>Back to home</a>" +
    "</div>" +
    "<figure class='project-image-large'><img src='" +
    selected.image +
    "' alt='Descriptive view for " +
    selected.title +
    "'></figure>" +
    "</div>" +
    "</article>";
})();
