(function pageTransitions() {
  var forceCleanupTimer = null;

  function clearTransitionState() {
    var body = document.body;

    if (!body) {
      return;
    }

    body.classList.remove("is-entering");
    body.classList.remove("is-leaving");
  }

  function scheduleForceCleanup() {
    if (forceCleanupTimer) {
      window.clearTimeout(forceCleanupTimer);
    }

    // If navigation is interrupted, recover from a stuck hidden page state.
    forceCleanupTimer = window.setTimeout(function () {
      clearTransitionState();
      forceCleanupTimer = null;
    }, 1200);
  }

  document.addEventListener("DOMContentLoaded", function () {
    window.requestAnimationFrame(function () {
      clearTransitionState();
    });
  });

  window.addEventListener("pageshow", function () {
    // pageshow also fires when coming from bfcache via Back/Forward.
    clearTransitionState();
  });

  window.addEventListener("popstate", function () {
    clearTransitionState();
  });

  window.addEventListener("load", function () {
    clearTransitionState();
  });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      clearTransitionState();
    }
  });

  document.addEventListener("click", function (event) {
    var target = event.target;

    if (!target || typeof target.closest !== "function") {
      return;
    }

    var link = target.closest("a[data-transition]");

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

    if (destination.href === window.location.href) {
      return;
    }

    event.preventDefault();
    document.body.classList.add("is-leaving");
    scheduleForceCleanup();

    window.setTimeout(function () {
      window.location.assign(destination.href);
    }, 240);
  });
})();
