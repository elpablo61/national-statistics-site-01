[![Best National Statistics Site](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/elpablo61/national-statistics-site-01/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Entries](https://make.fun/badge/best-national-statistics-site-20261126-0539/elpablo61/national-statistics-site-01/entries.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/elpablo61/national-statistics-site-01/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# NusaStat — National Statistics of Indonesia

NusaStat is a national statistics site for Indonesia: population, economy, prices, labour and regions, built from real public figures (BPS — Badan Pusat Statistik, and the World Bank, 2019–2024).

- **Overview** — key indicators for 2024, a year picker, GDP-growth and population trend charts, and four numbers that matter.
- **Population** — age pyramid for 2024, population trend 2019–2024, and the ten largest provinces.
- **Economy** — year picker, real GDP growth and nominal GDP charts, and the 2024 industry mix.
- **Prices** — monthly inflation for 2024 vs 2023 (switchable), December inflation 2019–2024, and what drives prices.
- **Labour** — unemployment and participation trends, wages, and where Indonesians work.
- **Regions** — all 38 provinces in a searchable, sortable table with an island filter, a population / GDP-per-capita bar toggle, and a detail panel per province.
- **About** — sources, method, and definitions for every indicator.

The site is plain static files under `app/` with no build step and no network requests: every figure lives in its own files, charts are hand-drawn SVG, and it works on desktop and on a phone.

## Run locally

```sh
node serve.ts
# open http://localhost:8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`).

## License

MIT — see `LICENSE`.
