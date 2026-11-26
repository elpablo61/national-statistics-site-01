// NusaStat — charts.js. One job: draw SVG charts from plain data, no library.
(function () {
  // SVG namespace identifier (a name, never fetched over the network).
  var NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function text(parent, x, y, s, attrs) {
    var t = el("text", attrs || {}, parent);
    t.setAttribute("x", x); t.setAttribute("y", y);
    t.textContent = s;
    return t;
  }
  function title(parent, s) {
    var t = el("title", {}, parent);
    t.textContent = s;
    return t;
  }
  function fmt(v, d) { return Number(v).toLocaleString("en-US", { maximumFractionDigits: d == null ? 1 : d }); }

  // Shared frame: returns {svg, x0, y0, w, h} for a plot area.
  function frame(width, height, pad) {
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.setAttribute("class", "chart");
    svg.setAttribute("role", "img");
    return { svg: svg, x0: pad.l, y0: pad.t, w: width - pad.l - pad.r, h: height - pad.t - pad.b };
  }
  function axis(svg, f, ymin, ymax, yLabel) {
    var steps = 4;
    var dec = (ymax - ymin) < 10 ? 1 : 0;
    for (var i = 0; i <= steps; i++) {
      var v = ymin + (ymax - ymin) * i / steps;
      var y = f.y0 + f.h - (v - ymin) / (ymax - ymin) * f.h;
      el("line", { x1: f.x0, y1: y, x2: f.x0 + f.w, y2: y, stroke: "#e3e8f0", "stroke-width": 1 }, svg);
      text(svg, f.x0 - 6, y + 4, fmt(v, dec), { "text-anchor": "end", "font-size": 11, fill: "#6b7688" });
    }
    if (yLabel) text(svg, f.x0, f.y0 - 8, yLabel, { "font-size": 11, fill: "#6b7688" });
  }

  // Line chart: points [{label, value}], valueLabel shown on hover.
  function lineChart(container, points, opts) {
    opts = opts || {};
    var W = 640, H = 300, pad = { l: 52, t: 34, r: 14, b: 34 };
    var vals = points.map(function (p) { return p.value; });
    var ymin = opts.ymin != null ? opts.ymin : Math.min(0, Math.min.apply(null, vals));
    var ymax = opts.ymax != null ? opts.ymax : Math.max.apply(null, vals);
    if (ymax === ymin) ymax = ymin + 1;
    ymin = ymin - (ymax - ymin) * 0.06; ymax = ymax + (ymax - ymin) * 0.06;
    var f = frame(W, H, pad);
    axis(f.svg, f, ymin, ymax, opts.yLabel || "");
    var n = points.length;
    function X(i) { return f.x0 + (n === 1 ? f.w / 2 : i / (n - 1) * f.w); }
    function Y(v) { return f.y0 + f.h - (v - ymin) / (ymax - ymin) * f.h; }
    var path = points.map(function (p, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(p.value).toFixed(1); }).join(" ");
    el("path", { d: path, fill: "none", stroke: opts.color || "#b4232a", "stroke-width": 2.5, "stroke-linejoin": "round" }, f.svg);
    points.forEach(function (p, i) {
      var c = el("circle", { cx: X(i), cy: Y(p.value), r: 4.5, fill: "#fff", stroke: opts.color || "#b4232a", "stroke-width": 2.5 }, f.svg);
      title(c, p.label + ": " + fmt(p.value, opts.decimals == null ? 2 : opts.decimals) + (opts.unit || ""));
      text(f.svg, X(i), f.y0 + f.h + 20, p.label, { "text-anchor": "middle", "font-size": 11, fill: "#3d4a63" });
      if (opts.showValues) text(f.svg, X(i), Y(p.value) - 10, fmt(p.value, opts.decimals == null ? 2 : opts.decimals), { "text-anchor": "middle", "font-size": 11, fill: "#14213d", "font-weight": "bold" });
    });
    container.appendChild(f.svg);
  }

  // Vertical bar chart: bars [{label, value, color?}]
  function barChart(container, bars, opts) {
    opts = opts || {};
    var W = 640, H = 300, pad = { l: 52, t: 34, r: 14, b: 34 };
    var vals = bars.map(function (b) { return b.value; });
    var vmax = Math.max.apply(null, vals);
    var ymin = opts.ymin != null ? opts.ymin : 0;
    var f = frame(W, H, pad);
    axis(f.svg, f, ymin, vmax * 1.08, opts.yLabel || "");
    var slot = f.w / bars.length;
    var bw = Math.min(46, slot * 0.62);
    bars.forEach(function (b, i) {
      var h = (b.value - ymin) / (vmax * 1.08 - ymin) * f.h;
      var x = f.x0 + i * slot + (slot - bw) / 2;
      var r = el("rect", { x: x, y: f.y0 + f.h - h, width: bw, height: h, rx: 3, fill: b.color || opts.color || "#1d4ed8" }, f.svg);
      title(r, b.label + ": " + fmt(b.value, opts.decimals == null ? 2 : opts.decimals) + (opts.unit || ""));
      text(f.svg, x + bw / 2, f.y0 + f.h + 20, b.label, { "text-anchor": "middle", "font-size": 11, fill: "#3d4a63" });
      if (opts.showValues) text(f.svg, x + bw / 2, f.y0 + f.h - h - 6, fmt(b.value, opts.decimals == null ? 2 : opts.decimals), { "text-anchor": "middle", "font-size": 11, fill: "#14213d", "font-weight": "bold" });
    });
    container.appendChild(f.svg);
  }

  // Horizontal bar list: rows [{label, value, max?}] — used for sector shares.
  function hbarChart(container, rows, opts) {
    opts = opts || {};
    var W = 640, rowH = 30, H = rows.length * rowH + 16;
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("class", "chart");
    var max = opts.max || Math.max.apply(null, rows.map(function (r) { return r.value != null ? r.value : r.share; }));
    rows.forEach(function (r, i) {
      var v = r.value != null ? r.value : r.share;
      var lab = r.label != null ? r.label : r.name;
      var y = 8 + i * rowH;
      text(svg, 0, y + 13, lab, { "font-size": 12.5, fill: "#14213d" });
      var bw = (v / max) * 380;
      var bar = el("rect", { x: 200, y: y, width: Math.max(2, bw), height: 16, rx: 3, fill: r.color || opts.color || "#0f766e" }, svg);
      title(bar, lab + ": " + fmt(v, opts.decimals == null ? 1 : opts.decimals) + (opts.unit || "%"));
      text(svg, 200 + Math.max(2, bw) + 8, y + 13, fmt(v, opts.decimals == null ? 1 : opts.decimals) + (opts.unit || "%"), { "font-size": 12.5, fill: "#14213d", "font-weight": "bold" });
    });
    container.appendChild(svg);
  }

  // Population pyramid: rows [{group, male, female}] in millions.
  function pyramidChart(container, rows) {
    var W = 640, rowH = 24, H = rows.length * rowH + 52;
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("class", "chart");
    var max = 0;
    rows.forEach(function (r) { max = Math.max(max, r.male, r.female); });
    var mid = W / 2, gap = 34, half = (W - 120 - gap * 2) / 2;
    text(svg, mid - gap - half / 2, 16, "Male (million)", { "text-anchor": "middle", "font-size": 12, fill: "#1d4ed8", "font-weight": "bold" });
    text(svg, mid + gap + half / 2, 16, "Female (million)", { "text-anchor": "middle", "font-size": 12, fill: "#b4232a", "font-weight": "bold" });
    rows.forEach(function (r, i) {
      var y = 26 + i * rowH;
      var mw = r.male / max * half, fw = r.female / max * half;
      var m = el("rect", { x: mid - gap - mw, y: y, width: mw, height: 17, fill: "#1d4ed8" }, svg);
      title(m, r.group + " male: " + fmt(r.male) + " million");
      var f2 = el("rect", { x: mid + gap, y: y, width: fw, height: 17, fill: "#b4232a" }, svg);
      title(f2, r.group + " female: " + fmt(r.female) + " million");
      text(svg, mid, y + 13, r.group, { "text-anchor": "middle", "font-size": 11, fill: "#14213d", "font-weight": "bold" });
    });
    container.appendChild(svg);
  }

  window.NUSA_CHARTS = { lineChart: lineChart, barChart: barChart, hbarChart: hbarChart, pyramidChart: pyramidChart };
})();
