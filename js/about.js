(function bindAboutPage() {
  var links = document.querySelectorAll(".about-links a");

  links.forEach(function (link) {
    link.setAttribute("data-transition", "");
  });
})();
