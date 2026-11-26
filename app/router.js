// NusaStat — router.js. One job: map hash routes to views and render them.
(function () {
  var ROUTES = {
    "": "overview",
    "/": "overview",
    "/population": "population",
    "/economy": "economy",
    "/prices": "prices",
    "/labour": "labour",
    "/regions": "regions",
    "/about": "about"
  };

  function currentRoute() {
    var hash = window.location.hash || "#/";
    var path = hash.slice(1);
    return ROUTES[path] || "overview";
  }

  function render() {
    var route = currentRoute();
    var view = window.NUSA_VIEWS[route];
    var app = document.getElementById("app");
    if (!view || !app) return;
    var built = view();
    app.innerHTML = built.html;
    if (built.after) built.after();
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-route") === route);
    });
    document.title = "NusaStat — " + route.charAt(0).toUpperCase() + route.slice(1) + " | National Statistics of Indonesia";
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", render);
  window.NUSA_ROUTER = { render: render, currentRoute: currentRoute };
})();
