// NusaStat — main.js. One job: bootstrap the site (ticker + first render).
(function () {
  var D = window.NUSA;

  function buildTicker() {
    var t = document.getElementById("ticker");
    if (!t) return;
    var items = [
      ["Population 2024", "281.6 million", "+1.0%"],
      ["GDP growth 2024", "5.03%", "+5.03%"],
      ["Inflation Dec 2024", "1.57%", "-1.04 pts"],
      ["Unemployment Aug 2024", "4.91%", "-0.41 pts"],
      ["Poverty Sep 2024", "8.57%", "-0.46 pts"]
    ];
    t.innerHTML = items.map(function (it) {
      var cls = it[2].charAt(0) === "+" ? "up" : (it[2].charAt(0) === "-" ? "down" : "");
      return '<span>' + it[0] + ': <b>' + it[1] + '</b> <span class="' + cls + '">' + it[2] + '</span></span>';
    }).join("");
  }

  buildTicker();
  window.NUSA_ROUTER.render();
})();
