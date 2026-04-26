(function pageTransitions() {
  document.addEventListener("DOMContentLoaded", function () {
    window.requestAnimationFrame(function () {
      document.body.classList.remove("is-entering");
    });
  });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[data-transition]");

    if (!link) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    if (link.target && link.target.toLowerCase() !== "_self") {
      return;
    }

    var destination = new URL(link.href, window.location.href);

    if (destination.origin !== window.location.origin) {
      return;
    }

    event.preventDefault();
    document.body.classList.add("is-leaving");

    window.setTimeout(function () {
      window.location.href = destination.href;
    }, 240);
  });
})();
