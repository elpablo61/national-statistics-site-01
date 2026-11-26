// NusaStat — data.js
// Semua angka adalah angka publik BPS (Badan Pusat Statistik) dan World Bank
// 2019-2024. Angka provinsi adalah perkiraan dari publikasi BPS (dibulatkan).
// File ini ditulis fresh di sesi builder pemulih v2 untuk repo
// /home/hatch/workspace/github-trending/makedotfun/national-statistics-site-01
window.NUSA = {
  meta: {
    brand: "NusaStat",
    title: "NusaStat — National Statistics of Indonesia",
    country: "Indonesia",
    updated: "26 November 2026",
    sources: [
      "BPS — Badan Pusat Statistik (bps.go.id)",
      "World Bank — World Development Indicators",
      "BPS — Statistik Indonesia 2025"
    ]
  },

  // Indikator kunci, tahun terakhir tersedia
  kpi: [
    { id: "population", label: "Population", value: 281.6, unit: "million", year: 2024, change: 1.02, changeLabel: "vs 2023", format: "m" },
    { id: "gdp", label: "GDP (nominal)", value: 22139, unit: "Rp trillion", year: 2024, change: 5.03, changeLabel: "real growth", format: "rp-trillion" },
    { id: "gdpPerCapita", label: "GDP per capita", value: 78.6, unit: "Rp million", year: 2024, change: 4.8, changeLabel: "vs 2023", format: "rp-million" },
    { id: "inflation", label: "Inflation (Dec, y-on-y)", value: 1.57, unit: "%", year: 2024, change: -1.04, changeLabel: "vs Dec 2023", format: "pct" },
    { id: "unemployment", label: "Unemployment rate", value: 4.91, unit: "%", year: 2024, change: -0.41, changeLabel: "vs Aug 2023", format: "pct" },
    { id: "poverty", label: "Poverty rate", value: 8.57, unit: "%", year: 2024, change: -0.46, changeLabel: "vs Mar 2024", format: "pct" }
  ],

  // Deret tahunan 2019-2024 (angka BPS)
  yearly: [
    { year: 2019, population: 268.1, gdpGrowth: 5.02, gdpNominal: 15834, inflation: 2.72, unemployment: 5.28, lfpr: 68.49, poverty: 9.22, gdpPerCapita: 59.1 },
    { year: 2020, population: 270.2, gdpGrowth: -2.07, gdpNominal: 15444, inflation: 1.68, unemployment: 7.07, lfpr: 67.77, poverty: 10.19, gdpPerCapita: 57.2 },
    { year: 2021, population: 272.7, gdpGrowth: 3.70, gdpNominal: 16976, inflation: 1.87, unemployment: 6.49, lfpr: 67.77, poverty: 9.71, gdpPerCapita: 62.2 },
    { year: 2022, population: 275.8, gdpGrowth: 5.31, gdpNominal: 19588, inflation: 5.51, unemployment: 5.86, lfpr: 68.63, poverty: 9.57, gdpPerCapita: 71.0 },
    { year: 2023, population: 278.7, gdpGrowth: 5.05, gdpNominal: 20892, inflation: 2.61, unemployment: 5.32, lfpr: 69.48, poverty: 9.36, gdpPerCapita: 75.0 },
    { year: 2024, population: 281.6, gdpGrowth: 5.03, gdpNominal: 22139, inflation: 1.57, unemployment: 4.91, lfpr: 70.63, poverty: 8.57, gdpPerCapita: 78.6 }
  ],

  // Inflasi bulanan 2024 (y-on-y, %)
  monthlyInflation2024: [
    { m: "Jan", v: 2.57 }, { m: "Feb", v: 2.75 }, { m: "Mar", v: 3.05 },
    { m: "Apr", v: 3.00 }, { m: "May", v: 2.84 }, { m: "Jun", v: 2.51 },
    { m: "Jul", v: 2.13 }, { m: "Aug", v: 2.12 }, { m: "Sep", v: 1.84 },
    { m: "Oct", v: 1.71 }, { m: "Nov", v: 1.55 }, { m: "Dec", v: 1.57 }
  ],

  // Inflasi bulanan 2023 (y-on-y, %) untuk perbandingan
  monthlyInflation2023: [
    { m: "Jan", v: 5.28 }, { m: "Feb", v: 5.47 }, { m: "Mar", v: 4.97 },
    { m: "Apr", v: 4.33 }, { m: "May", v: 4.00 }, { m: "Jun", v: 3.52 },
    { m: "Jul", v: 3.08 }, { m: "Aug", v: 3.27 }, { m: "Sep", v: 2.28 },
    { m: "Oct", v: 2.56 }, { m: "Nov", v: 2.86 }, { m: "Dec", v: 2.61 }
  ],

  // Struktur PDB menurut lapangan usaha, 2024 (% dari PDB)
  sectors: [
    { name: "Manufacturing", share: 18.9 },
    { name: "Wholesale & retail trade", share: 12.9 },
    { name: "Agriculture, forestry & fishing", share: 12.5 },
    { name: "Construction", share: 9.9 },
    { name: "Mining & quarrying", share: 8.2 },
    { name: "Transportation & storage", share: 6.0 },
    { name: "Information & communication", share: 4.4 },
    { name: "Financial & insurance", share: 4.2 },
    { name: "Public administration", share: 3.6 },
    { name: "Education", share: 3.3 },
    { name: "Real estate", share: 2.8 },
    { name: "Other services", share: 13.3 }
  ],

  // Ketenagakerjaan
  labour: {
    employed2024: 144.64, // juta orang, Agustus 2024
    labourForce2024: 152.11, // juta orang
    avgWage2024: 3.27, // Rp juta/bulan, Agustus 2024
    avgWage2023: 3.18,
    informalShare: 59.17, // % pekerja informal, Agustus 2024
    sectors2024: [
      { name: "Agriculture", share: 28.2 },
      { name: "Trade", share: 18.7 },
      { name: "Manufacturing", share: 13.5 },
      { name: "Construction", share: 8.3 },
      { name: "Other services", share: 31.3 }
    ]
  },

  // 38 provinsi: penduduk 2024 (ribu jiwa), PDRB per kapita 2024 (Rp juta),
  // kemiskinan Sep 2024 (%), pulau. Angka dibulatkan dari publikasi BPS.
  provinces: [
    { name: "Aceh", island: "Sumatra", pop: 5554, gdpPc: 48.9, poverty: 14.23 },
    { name: "North Sumatra", island: "Sumatra", pop: 15590, gdpPc: 67.4, poverty: 8.15 },
    { name: "West Sumatra", island: "Sumatra", pop: 5862, gdpPc: 58.3, poverty: 5.78 },
    { name: "Riau", island: "Sumatra", pop: 6975, gdpPc: 155.2, poverty: 6.21 },
    { name: "Riau Islands", island: "Sumatra", pop: 2243, gdpPc: 176.4, poverty: 5.26 },
    { name: "Jambi", island: "Sumatra", pop: 3682, gdpPc: 71.5, poverty: 7.33 },
    { name: "South Sumatra", island: "Sumatra", pop: 8837, gdpPc: 67.9, poverty: 11.09 },
    { name: "Bangka Belitung", island: "Sumatra", pop: 1521, gdpPc: 76.8, poverty: 4.35 },
    { name: "Bengkulu", island: "Sumatra", pop: 2126, gdpPc: 44.6, poverty: 14.06 },
    { name: "Lampung", island: "Sumatra", pop: 9433, gdpPc: 46.7, poverty: 10.69 },
    { name: "Jakarta", island: "Java", pop: 10684, gdpPc: 322.5, poverty: 4.27 },
    { name: "West Java", island: "Java", pop: 50345, gdpPc: 57.2, poverty: 7.53 },
    { name: "Banten", island: "Java", pop: 12435, gdpPc: 71.1, poverty: 5.48 },
    { name: "Central Java", island: "Java", pop: 38095, gdpPc: 46.3, poverty: 10.47 },
    { name: "Yogyakarta", island: "Java", pop: 3785, gdpPc: 49.8, poverty: 11.14 },
    { name: "East Java", island: "Java", pop: 41815, gdpPc: 71.8, poverty: 9.79 },
    { name: "Bali", island: "Bali & Nusa Tenggara", pop: 4417, gdpPc: 65.9, poverty: 3.93 },
    { name: "West Nusa Tenggara", island: "Bali & Nusa Tenggara", pop: 5630, gdpPc: 36.4, poverty: 12.79 },
    { name: "East Nusa Tenggara", island: "Bali & Nusa Tenggara", pop: 5656, gdpPc: 28.1, poverty: 19.26 },
    { name: "West Kalimantan", island: "Kalimantan", pop: 5850, gdpPc: 56.2, poverty: 6.71 },
    { name: "Central Kalimantan", island: "Kalimantan", pop: 2795, gdpPc: 68.4, poverty: 5.20 },
    { name: "South Kalimantan", island: "Kalimantan", pop: 4244, gdpPc: 61.7, poverty: 4.11 },
    { name: "East Kalimantan", island: "Kalimantan", pop: 4033, gdpPc: 290.3, poverty: 6.11 },
    { name: "North Kalimantan", island: "Kalimantan", pop: 738, gdpPc: 182.6, poverty: 6.71 },
    { name: "North Sulawesi", island: "Sulawesi", pop: 2740, gdpPc: 66.8, poverty: 7.36 },
    { name: "Gorontalo", island: "Sulawesi", pop: 1271, gdpPc: 41.2, poverty: 14.07 },
    { name: "Central Sulawesi", island: "Sulawesi", pop: 3139, gdpPc: 82.4, poverty: 12.10 },
    { name: "South Sulawesi", island: "Sulawesi", pop: 9463, gdpPc: 63.5, poverty: 8.24 },
    { name: "West Sulawesi", island: "Sulawesi", pop: 1602, gdpPc: 43.9, poverty: 11.47 },
    { name: "Southeast Sulawesi", island: "Sulawesi", pop: 2857, gdpPc: 67.1, poverty: 10.99 },
    { name: "Maluku", island: "Maluku", pop: 1993, gdpPc: 34.8, poverty: 16.30 },
    { name: "North Maluku", island: "Maluku", pop: 1443, gdpPc: 82.9, poverty: 6.03 },
    { name: "Papua", island: "Papua", pop: 1133, gdpPc: 71.6, poverty: 21.10 },
    { name: "West Papua", island: "Papua", pop: 561, gdpPc: 88.4, poverty: 19.98 },
    { name: "South Papua", island: "Papua", pop: 522, gdpPc: 62.3, poverty: 21.40 },
    { name: "Central Papua", island: "Papua", pop: 1395, gdpPc: 58.7, poverty: 28.50 },
    { name: "Highland Papua", island: "Papua", pop: 1472, gdpPc: 31.2, poverty: 33.20 },
    { name: "Southwest Papua", island: "Papua", pop: 621, gdpPc: 74.5, poverty: 17.30 }
  ],

  // Piramida penduduk 2024 (juta jiwa per kelompok umur, BPS)
  agePyramid: [
    { group: "0–4", male: 11.4, female: 10.9 },
    { group: "5–9", male: 12.2, female: 11.6 },
    { group: "10–14", male: 12.6, female: 12.0 },
    { group: "15–19", male: 12.4, female: 11.8 },
    { group: "20–24", male: 12.1, female: 11.6 },
    { group: "25–29", male: 11.6, female: 11.2 },
    { group: "30–34", male: 11.1, female: 10.7 },
    { group: "35–39", male: 10.6, female: 10.3 },
    { group: "40–44", male: 10.0, female: 9.8 },
    { group: "45–49", male: 9.1, female: 9.0 },
    { group: "50–54", male: 8.0, female: 8.1 },
    { group: "55–59", male: 6.7, female: 6.9 },
    { group: "60–64", male: 5.3, female: 5.6 },
    { group: "65+", male: 7.4, female: 8.6 }
  ],

  highlights: [
    { title: "5.03% growth in 2024", text: "Indonesia's economy grew 5.03% in 2024, driven by household consumption and investment, even as global demand stayed soft." },
    { title: "Poverty below 9% for the first time", text: "The poverty rate fell to 8.57% in September 2024 — the first time it has gone below 9% — down from 10.19% in the pandemic year 2020." },
    { title: "Inflation back inside target", text: "December 2024 inflation of 1.57% sits at the bottom of Bank Indonesia's 1.5–3.5% target band, after peaking at 5.51% in 2022." },
    { title: "Lowest unemployment in a decade", text: "Open unemployment reached 4.91% in August 2024, the lowest since before the pandemic, with the labour force participation rate at 70.63%." }
  ]
};
