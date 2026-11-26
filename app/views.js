// NusaStat — views.js. One job: render one page per hash route from window.NUSA.
(function () {
  var D = window.NUSA;
  var C = window.NUSA_CHARTS;

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function num(v, d) { return Number(v).toLocaleString("en-US", { minimumFractionDigits: d == null ? 0 : d, maximumFractionDigits: d == null ? 0 : d }); }
  function yearRow(y) { return D.yearly.filter(function (r) { return r.year === y; })[0]; }
  function srcNote(extra) {
    return '<p class="source-note"><strong>Source:</strong> ' + esc(extra || "BPS — Badan Pusat Statistik, Statistik Indonesia 2025; World Bank WDI.") + ' Figures rounded from official publications.</p>';
  }
  function kpiCard(label, value, unit, sub) {
    return '<div class="kpi"><div class="kpi-label">' + esc(label) + '</div>' +
      '<div class="kpi-value">' + value + ' <small>' + esc(unit) + '</small></div>' +
      '<div class="kpi-sub">' + sub + '</div></div>';
  }
  function changeHtml(v, suffix) {
    var cls = v > 0 ? "up" : (v < 0 ? "down" : "");
    var sign = v > 0 ? "+" : "";
    return '<span class="' + cls + '">' + sign + v.toFixed(2) + (suffix || " pts") + '</span>';
  }
  function mountChart(id, draw) {
    var host = document.getElementById(id);
    if (host) { host.innerHTML = ""; draw(host); }
  }

  // ---------- Overview ----------
  function viewOverview() {
    var k = D.kpi;
    var html = '<div class="page-head"><h1>Indonesia at a glance</h1>' +
      '<p>Key national statistics for 2024 — population, output, prices, jobs and poverty — ' +
      'from the official publications of BPS and the World Bank. Pick a year to see that year\'s figures.</p></div>' +
      '<div class="controls"><label for="ov-year">Year in focus</label>' +
      '<select id="ov-year">' + D.yearly.map(function (r) { return '<option value="' + r.year + '"' + (r.year === 2024 ? " selected" : "") + '>' + r.year + '</option>'; }).join("") + '</select>' +
      '<span id="ov-yearline" class="kpi-sub"></span></div>' +
      '<div class="kpi-grid">' +
      kpiCard("Population", "281.6", "million", "2024 · " + changeHtml(1.02, "%") + " vs 2023") +
      kpiCard("GDP (nominal)", "Rp 22,139", "trillion", "2024 · growth " + changeHtml(5.03, "%")) +
      kpiCard("GDP per capita", "Rp 78.6", "million", "2024 · " + changeHtml(4.8, "%") + " vs 2023") +
      kpiCard("Inflation (Dec)", "1.57", "% y-on-y", "2024 · " + changeHtml(-1.04, " pts") + " vs Dec 2023") +
      kpiCard("Unemployment", "4.91", "%", "Aug 2024 · " + changeHtml(-0.41, " pts") + " vs Aug 2023") +
      kpiCard("Poverty rate", "8.57", "%", "Sep 2024 · " + changeHtml(-0.46, " pts") + " vs Mar 2024") +
      '</div>' +
      '<div class="grid-2"><div class="card"><h2>Real GDP growth, 2019–2024</h2>' +
      '<p class="chart-sub">Annual change in real GDP, percent. The 2020 dip is the pandemic recession; growth has held above 5% since 2022.</p>' +
      '<div id="ov-growth"></div></div>' +
      '<div class="card"><h2>Population, 2019–2024</h2>' +
      '<p class="chart-sub">Mid-year population, million people. Indonesia passed 280 million in 2024.</p>' +
      '<div id="ov-pop"></div></div></div>' +
      '<div class="card"><h2>Four numbers that matter</h2><div class="highlights">' +
      D.highlights.map(function (h) { return '<div class="highlight"><h3>' + esc(h.title) + '</h3><p>' + esc(h.text) + '</p></div>'; }).join("") +
      '</div>' + srcNote() + '</div>';
    return { html: html, after: function () {
      mountChart("ov-growth", function (h) { C.lineChart(h, D.yearly.map(function (r) { return { label: String(r.year), value: r.gdpGrowth }; }), { unit: "%", showValues: true, decimals: 2 }); });
      mountChart("ov-pop", function (h) { C.lineChart(h, D.yearly.map(function (r) { return { label: String(r.year), value: r.population }; }), { unit: " million", color: "#1d4ed8", showValues: true, decimals: 1, ymin: 240, ymax: 290 }); });
      var sel = document.getElementById("ov-year");
      var line = document.getElementById("ov-yearline");
      function updateYear() {
        var r = yearRow(Number(sel.value));
        line.textContent = r.year + ": population " + r.population.toFixed(1) + "m · GDP growth " + r.gdpGrowth.toFixed(2) + "% · inflation " + r.inflation.toFixed(2) + "% · unemployment " + r.unemployment.toFixed(2) + "% · poverty " + r.poverty.toFixed(2) + "%";
      }
      sel.addEventListener("change", updateYear);
      updateYear();
    } };
  }

  // ---------- Population ----------
  function viewPopulation() {
    var top = D.provinces.slice().sort(function (a, b) { return b.pop - a.pop; }).slice(0, 10);
    var html = '<div class="page-head"><h1>Population</h1>' +
      '<p>281.6 million people in 2024 — the world\'s fourth-largest population — spread across 38 provinces and more than 17,000 islands. Java holds over half of everyone.</p></div>' +
      '<div class="grid-2"><div class="card"><h2>Age pyramid, 2024</h2>' +
      '<p class="chart-sub">Population by age group, million. Hover a bar for the exact figure. The wide base is a young country: median age about 30.</p>' +
      '<div id="pop-pyramid"></div></div>' +
      '<div class="card"><h2>Population growth, 2019–2024</h2>' +
      '<p class="chart-sub">Mid-year population, million. Growth has slowed to about 1% a year.</p>' +
      '<div id="pop-trend"></div>' +
      '<p>Java is home to 56% of Indonesians on 7% of the land. The three largest provinces — West Java, East Java and Central Java — together hold 130 million people.</p></div></div>' +
      '<div class="card"><h2>Largest provinces by population, 2024</h2>' +
      '<div class="table-wrap"><table><thead><tr><th>#</th><th>Province</th><th>Island</th><th>Population (thousand)</th><th>Share of Indonesia</th></tr></thead><tbody>' +
      top.map(function (p, i) {
        return '<tr><td class="rank-col">' + (i + 1) + '</td><td>' + esc(p.name) + '</td><td>' + esc(p.island) + '</td><td>' + num(p.pop) + '</td><td>' + (p.pop / 281600 * 100).toFixed(1) + '%</td></tr>';
      }).join("") +
      '</tbody></table></div><p>Full table with all 38 provinces, search and sorting: <a href="#/regions">Regions</a>.</p>' +
      srcNote("BPS — Population Projection 2020–2045 and Statistik Indonesia 2025 (mid-year estimates).") + '</div>';
    return { html: html, after: function () {
      mountChart("pop-pyramid", function (h) { C.pyramidChart(h, D.agePyramid); });
      mountChart("pop-trend", function (h) { C.lineChart(h, D.yearly.map(function (r) { return { label: String(r.year), value: r.population }; }), { unit: " million", color: "#1d4ed8", showValues: true, decimals: 1, ymin: 240, ymax: 290 }); });
    } };
  }

  // ---------- Economy ----------
  function viewEconomy() {
    var html = '<div class="page-head"><h1>Economy</h1>' +
      '<p>Indonesia\'s economy — Southeast Asia\'s largest — grew 5.03% in 2024 to Rp 22,139 trillion. Manufacturing, trade and agriculture are its biggest sectors.</p></div>' +
      '<div class="controls"><label for="ec-year">Year</label>' +
      '<select id="ec-year">' + D.yearly.map(function (r) { return '<option value="' + r.year + '"' + (r.year === 2024 ? " selected" : "") + '>' + r.year + '</option>'; }).join("") + '</select>' +
      '<span id="ec-yearline" class="kpi-sub"></span></div>' +
      '<div class="kpi-grid" id="ec-kpis"></div>' +
      '<div class="grid-2"><div class="card"><h2>Real GDP growth, 2019–2024</h2>' +
      '<p class="chart-sub">Annual percent change in real GDP. Hover a point for the exact figure.</p>' +
      '<div id="ec-growth"></div></div>' +
      '<div class="card"><h2>Nominal GDP, 2019–2024</h2>' +
      '<p class="chart-sub">GDP at current prices, Rp trillion.</p>' +
      '<div id="ec-nominal"></div></div></div>' +
      '<div class="card"><h2>What the economy is made of — 2024</h2>' +
      '<p class="chart-sub">Share of GDP by industry, percent. Manufacturing alone is nearly one-fifth of output.</p>' +
      '<div id="ec-sectors"></div>' +
      '<div class="legend"><span><span class="sw" style="background:#0f766e"></span>Industry share of GDP</span></div>' +
      srcNote("BPS — National Accounts (PDB), Statistik Indonesia 2025.") + '</div>';
    return { html: html, after: function () {
      mountChart("ec-growth", function (h) { C.lineChart(h, D.yearly.map(function (r) { return { label: String(r.year), value: r.gdpGrowth }; }), { unit: "%", showValues: true, decimals: 2 }); });
      mountChart("ec-nominal", function (h) { C.barChart(h, D.yearly.map(function (r) { return { label: String(r.year), value: r.gdpNominal }; }), { unit: " Rp trillion", color: "#0f766e", showValues: true, decimals: 0 }); });
      mountChart("ec-sectors", function (h) { C.hbarChart(h, D.sectors, { unit: "%" }); });
      var sel = document.getElementById("ec-year");
      var line = document.getElementById("ec-yearline");
      var kpis = document.getElementById("ec-kpis");
      function updateYear() {
        var r = yearRow(Number(sel.value));
        line.textContent = r.year + " in one line: nominal GDP Rp " + num(r.gdpNominal) + " trillion, " + r.gdpGrowth.toFixed(2) + "% real growth, Rp " + r.gdpPerCapita.toFixed(1) + " million per person.";
        kpis.innerHTML =
          kpiCard("Real GDP growth", r.gdpGrowth.toFixed(2), "%", String(r.year)) +
          kpiCard("Nominal GDP", "Rp " + num(r.gdpNominal), "trillion", String(r.year)) +
          kpiCard("GDP per capita", "Rp " + r.gdpPerCapita.toFixed(1), "million", String(r.year));
      }
      sel.addEventListener("change", updateYear);
      updateYear();
    } };
  }

  // ---------- Prices ----------
  function viewPrices() {
    var html = '<div class="page-head"><h1>Prices &amp; inflation</h1>' +
      '<p>Consumer-price inflation fell to 1.57% in December 2024 — the bottom of Bank Indonesia\'s 1.5–3.5% target band — after peaking at 5.51% in 2022. Food and administered prices drove the 2022 spike.</p></div>' +
      '<div class="card"><h2>Monthly inflation, year on year</h2>' +
      '<p class="chart-sub">Consumer Price Index change vs the same month a year earlier, percent. Switch years to compare 2024 with 2023.</p>' +
      '<div class="controls"><span class="seg" role="group" aria-label="Year"><button id="pr-2024" class="active">2024</button><button id="pr-2023">2023</button></span>' +
      '<span id="pr-note" class="kpi-sub">2024: inflation eased every quarter, from 3.05% in March to 1.57% in December.</span></div>' +
      '<div id="pr-monthly"></div></div>' +
      '<div class="grid-2"><div class="card"><h2>December inflation, 2019–2024</h2>' +
      '<p class="chart-sub">Year-on-year CPI inflation each December, percent.</p>' +
      '<div id="pr-yearly"></div></div>' +
      '<div class="card"><h2>What to watch</h2>' +
      '<p><strong>Food prices.</strong> Rice and chillies are the most volatile CPI items; a bad harvest shows up here within a month.</p>' +
      '<p><strong>Administered prices.</strong> Fuel-subsidy changes moved headline inflation by more than 1 point in 2022.</p>' +
      '<p><strong>Core inflation.</strong> Excluding volatile food and administered prices, core inflation stayed near 2% through 2024.</p>' +
      '<p><strong>The target.</strong> Bank Indonesia targets 1.5–3.5% inflation; December 2024 printed 1.57%, just inside the band.</p></div></div>' +
      srcNote("BPS — Consumer Price Index releases, monthly 2023–2024; Bank Indonesia inflation target 2024–2026.");
    return { html: html, after: function () {
      function drawMonthly(year) {
        var data = year === 2024 ? D.monthlyInflation2024 : D.monthlyInflation2023;
        mountChart("pr-monthly", function (h) {
          C.barChart(h, data.map(function (m) { return { label: m.m, value: m.v }; }), { unit: "%", color: year === 2024 ? "#b4232a" : "#1d4ed8", showValues: true, decimals: 2, ymin: 0 });
        });
      }
      drawMonthly(2024);
      var b24 = document.getElementById("pr-2024"), b23 = document.getElementById("pr-2023"), note = document.getElementById("pr-note");
      b24.addEventListener("click", function () { b24.classList.add("active"); b23.classList.remove("active"); note.textContent = "2024: inflation eased every quarter, from 3.05% in March to 1.57% in December."; drawMonthly(2024); });
      b23.addEventListener("click", function () { b23.classList.add("active"); b24.classList.remove("active"); note.textContent = "2023: inflation fell from 5.47% in February to 2.61% in December as the 2022 fuel-price shock faded."; drawMonthly(2023); });
      mountChart("pr-yearly", function (h) { C.lineChart(h, D.yearly.map(function (r) { return { label: String(r.year), value: r.inflation }; }), { unit: "%", showValues: true, decimals: 2 }); });
    } };
  }

  // ---------- Labour ----------
  function viewLabour() {
    var L = D.labour;
    var html = '<div class="page-head"><h1>Labour</h1>' +
      '<p>152.11 million Indonesians were in the labour force in August 2024 and 144.64 million were working. Unemployment fell to 4.91% — the lowest in a decade — while the average wage reached Rp 3.27 million a month.</p></div>' +
      '<div class="kpi-grid">' +
      kpiCard("Unemployment rate", "4.91", "%", "Aug 2024 · " + changeHtml(-0.41, " pts") + " vs Aug 2023") +
      kpiCard("Labour force participation", "70.63", "%", "Aug 2024 · " + changeHtml(1.15, " pts") + " vs Aug 2023") +
      kpiCard("Average monthly wage", "Rp 3.27", "million", "Aug 2024 · " + changeHtml(0.09, " Rp m") + " vs Aug 2023") +
      kpiCard("People employed", "144.64", "million", "Aug 2024") +
      kpiCard("Labour force", "152.11", "million", "Aug 2024") +
      kpiCard("Informal workers", "59.17", "% of employed", "Aug 2024 · still the majority of jobs") +
      '</div>' +
      '<div class="grid-2"><div class="card"><h2>Unemployment, 2019–2024</h2>' +
      '<p class="chart-sub">Open unemployment rate each August, percent. The pandemic pushed it to 7.07% in 2020; it has fallen every year since.</p>' +
      '<div id="lb-unemp"></div></div>' +
      '<div class="card"><h2>Participation, 2019–2024</h2>' +
      '<p class="chart-sub">Labour force participation rate each August, percent. A record 70.63% of working-age Indonesians were in the labour force in 2024.</p>' +
      '<div id="lb-lfpr"></div></div></div>' +
      '<div class="card"><h2>Where Indonesians work — 2024</h2>' +
      '<p class="chart-sub">Share of the employed by sector, percent. Agriculture still employs more than a quarter of workers.</p>' +
      '<div id="lb-sectors"></div>' +
      srcNote("BPS — Sakernas (National Labour Force Survey), August rounds 2019–2024.") + '</div>';
    return { html: html, after: function () {
      mountChart("lb-unemp", function (h) { C.lineChart(h, D.yearly.map(function (r) { return { label: String(r.year), value: r.unemployment }; }), { unit: "%", showValues: true, decimals: 2 }); });
      mountChart("lb-lfpr", function (h) { C.lineChart(h, D.yearly.map(function (r) { return { label: String(r.year), value: r.lfpr }; }), { unit: "%", color: "#0f766e", showValues: true, decimals: 2 }); });
      mountChart("lb-sectors", function (h) { C.hbarChart(h, L.sectors2024, { unit: "%", color: "#1d4ed8" }); });
    } };
  }

  // ---------- Regions ----------
  function viewRegions() {
    var islands = ["All islands"].concat(Array.from(new Set(D.provinces.map(function (p) { return p.island; }))));
    var html = '<div class="page-head"><h1>Regions — all 38 provinces</h1>' +
      '<p>Compare every province: population, output per person and poverty. Search, filter by island, sort any column, or click a row to see that province in detail. Jakarta\'s output per person is more than ten times Highland Papua\'s — the widest gap in the country.</p></div>' +
      '<div class="card"><div class="controls">' +
      '<label for="rg-search">Search province</label><input type="search" id="rg-search" placeholder="e.g. Java, Papua, Bali…" autocomplete="off">' +
      '<label for="rg-island">Island group</label><select id="rg-island">' + islands.map(function (i) { return '<option value="' + esc(i) + '">' + esc(i) + '</option>'; }).join("") + '</select>' +
      '<span class="seg" role="group" aria-label="Bar metric"><button id="rg-pop" class="active">Bars: population</button><button id="rg-gdp">Bars: GDP per capita</button></span>' +
      '<span id="rg-count" class="kpi-sub"></span></div>' +
      '<div id="rg-detail"></div>' +
      '<div class="table-wrap"><table id="rg-table"><thead><tr>' +
      '<th data-key="name">Province ↕</th><th data-key="island">Island ↕</th><th data-key="pop">Population (thousand) ↕</th><th data-key="gdpPc">GDP per capita (Rp m) ↕</th><th data-key="poverty">Poverty (%) ↕</th><th>Bar</th>' +
      '</tr></thead><tbody id="rg-body"></tbody></table></div>' +
      '<p class="source-note"><strong>Source:</strong> BPS provincial releases, 2024 (mid-year population; PDRB per capita; poverty rate September 2024). Click a column header to sort; click a row for detail.</p></div>';
    return { html: html, after: function () {
      var state = { q: "", island: "All islands", sortKey: "pop", sortDir: -1, metric: "pop" };
      var search = document.getElementById("rg-search");
      var islandSel = document.getElementById("rg-island");
      var body = document.getElementById("rg-body");
      var count = document.getElementById("rg-count");
      var detail = document.getElementById("rg-detail");
      var maxPop = Math.max.apply(null, D.provinces.map(function (p) { return p.pop; }));
      var maxGdp = Math.max.apply(null, D.provinces.map(function (p) { return p.gdpPc; }));

      function filtered() {
        var rows = D.provinces.filter(function (p) {
          var okQ = !state.q || p.name.toLowerCase().indexOf(state.q) !== -1;
          var okI = state.island === "All islands" || p.island === state.island;
          return okQ && okI;
        });
        rows.sort(function (a, b) {
          var va = a[state.sortKey], vb = b[state.sortKey];
          if (typeof va === "string") return state.sortDir * va.localeCompare(vb);
          return state.sortDir * (va - vb);
        });
        return rows;
      }
      function render() {
        var rows = filtered();
        count.textContent = rows.length + " of 38 provinces";
        body.innerHTML = rows.map(function (p) {
          var mv = state.metric === "pop" ? p.pop / maxPop * 100 : p.gdpPc / maxGdp * 100;
          return '<tr data-name="' + esc(p.name) + '"><td>' + esc(p.name) + '</td><td>' + esc(p.island) + '</td><td>' + num(p.pop) + '</td><td>' + p.gdpPc.toFixed(1) + '</td><td>' + p.poverty.toFixed(2) + '</td>' +
            '<td class="bar-cell"><span class="mini-bar" style="width:' + Math.max(3, mv).toFixed(0) + '%"></span></td></tr>';
        }).join("") || '<tr><td colspan="6">No province matches that search.</td></tr>';
        body.querySelectorAll("tr[data-name]").forEach(function (tr) {
          tr.addEventListener("click", function () { showDetail(tr.getAttribute("data-name")); });
        });
      }
      function showDetail(name) {
        var p = D.provinces.filter(function (x) { return x.name === name; })[0];
        if (!p) return;
        var rankPop = D.provinces.slice().sort(function (a, b) { return b.pop - a.pop; }).findIndex(function (x) { return x.name === name; }) + 1;
        var rankGdp = D.provinces.slice().sort(function (a, b) { return b.gdpPc - a.gdpPc; }).findIndex(function (x) { return x.name === name; }) + 1;
        var rankPov = D.provinces.slice().sort(function (a, b) { return b.poverty - a.poverty; }).findIndex(function (x) { return x.name === name; }) + 1;
        detail.innerHTML = '<div class="card detail"><h2>' + esc(p.name) + ' <small style="color:var(--muted)">— ' + esc(p.island) + '</small></h2>' +
          '<div class="detail-grid">' +
          '<div><div class="stat-num">' + num(p.pop) + '</div><div class="stat-label">Population (thousand) · rank #' + rankPop + ' of 38</div></div>' +
          '<div><div class="stat-num">Rp ' + p.gdpPc.toFixed(1) + 'm</div><div class="stat-label">GDP per capita · rank #' + rankGdp + ' of 38</div></div>' +
          '<div><div class="stat-num">' + p.poverty.toFixed(2) + '%</div><div class="stat-label">Poverty rate · rank #' + rankPov + ' of 38 (lowest first)</div></div>' +
          '<div><div class="stat-num">' + (p.pop / 281600 * 100).toFixed(2) + '%</div><div class="stat-label">Share of Indonesia</div></div>' +
          '</div><p>' + esc(p.name) + ' holds ' + num(p.pop) + ' thousand people — ' + (p.pop / 281600 * 100).toFixed(2) + '% of Indonesia — with output of Rp ' + p.gdpPc.toFixed(1) + ' million per person and a poverty rate of ' + p.poverty.toFixed(2) + '%.</p></div>';
        body.querySelectorAll("tr").forEach(function (tr) { tr.classList.toggle("selected", tr.getAttribute("data-name") === name); });
        detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      search.addEventListener("input", function () { state.q = search.value.trim().toLowerCase(); render(); });
      islandSel.addEventListener("change", function () { state.island = islandSel.value; render(); });
      document.querySelectorAll("#rg-table thead th[data-key]").forEach(function (th) {
        th.addEventListener("click", function () {
          var k = th.getAttribute("data-key");
          if (state.sortKey === k) state.sortDir = -state.sortDir; else { state.sortKey = k; state.sortDir = k === "name" || k === "island" ? 1 : -1; }
          render();
        });
      });
      var bPop = document.getElementById("rg-pop"), bGdp = document.getElementById("rg-gdp");
      bPop.addEventListener("click", function () { state.metric = "pop"; bPop.classList.add("active"); bGdp.classList.remove("active"); render(); });
      bGdp.addEventListener("click", function () { state.metric = "gdpPc"; bGdp.classList.add("active"); bPop.classList.remove("active"); render(); });
      render();
    } };
  }

  // ---------- About ----------
  function viewAbout() {
    var html = '<div class="page-head"><h1>About NusaStat</h1>' +
      '<p>NusaStat is an independent portal that puts Indonesia\'s headline national statistics in one place — readable on a desktop and on a phone, with every figure traceable to its source and year.</p></div>' +
      '<div class="card"><h2>Sources</h2><dl class="kv">' +
      '<dt>Population</dt><dd>BPS, Statistik Indonesia 2025 and Population Projection 2020–2045 (mid-year estimates).</dd>' +
      '<dt>Economy</dt><dd>BPS, National Accounts (PDB) — nominal GDP, real growth and industry shares, 2019–2024.</dd>' +
      '<dt>Prices</dt><dd>BPS, Consumer Price Index monthly releases 2023–2024; Bank Indonesia inflation target 1.5–3.5%.</dd>' +
      '<dt>Labour</dt><dd>BPS, Sakernas (National Labour Force Survey), August rounds 2019–2024.</dd>' +
      '<dt>Poverty</dt><dd>BPS, poverty releases — March and September rounds; provincial rates September 2024.</dd>' +
      '<dt>Provinces</dt><dd>BPS provincial releases, 2024 — population, PDRB per capita and poverty, rounded.</dd>' +
      '<dt>World Bank</dt><dd>World Development Indicators, used to cross-check GDP per capita and population totals.</dd>' +
      '</dl></div>' +
      '<div class="card"><h2>Method &amp; notes</h2><ul class="method-list">' +
      '<li>All figures are as published; where BPS revises a series, the latest published value is used.</li>' +
      '<li>GDP per capita divides nominal GDP by mid-year population. Provincial PDRB per capita uses each province\'s own PDRB and population.</li>' +
      '<li>Unemployment and participation are August-round Sakernas figures; the poverty rate is the September-round figure unless stated.</li>' +
      '<li>Provincial figures are rounded from BPS provincial releases; small differences from the national total come from rounding.</li>' +
      '<li>This site works fully offline: every figure lives in its own files and no network request is made.</li>' +
      '</ul></div>' +
      '<div class="card"><h2>Definitions</h2><dl class="kv">' +
      '<dt>Real GDP growth</dt><dd>Change in GDP at constant prices from the previous year, percent.</dd>' +
      '<dt>Inflation (y-on-y)</dt><dd>Change in the Consumer Price Index vs the same month a year earlier, percent.</dd>' +
      '<dt>Unemployment rate</dt><dd>Unemployed people as a share of the labour force, percent.</dd>' +
      '<dt>Labour force participation</dt><dd>People in the labour force as a share of the working-age population, percent.</dd>' +
      '<dt>Poverty rate</dt><dd>People below the BPS poverty line as a share of the population, percent.</dd>' +
      '</dl></div>';
    return { html: html, after: function () {} };
  }

  window.NUSA_VIEWS = {
    overview: viewOverview,
    population: viewPopulation,
    economy: viewEconomy,
    prices: viewPrices,
    labour: viewLabour,
    regions: viewRegions,
    about: viewAbout
  };
})();
