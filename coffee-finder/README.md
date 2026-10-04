# Manhattan Coffee Finder

A Google-Maps-style map of the five best Manhattan coffee shops for chocolatey, rich coffee with excellent beans and a unique experience. Each pin shows a Street View storefront and the evidence behind the pick.

## Run it

```bash
python3 serve.py          # serves on port 8080
```

- On this computer, open http://localhost:8080 in Chrome.
- On an iPad on the same Wi-Fi, open the `http://<computer-ip>:8080` address the script prints, in Chrome or Safari. Use Share > Add to Home Screen to get a full-screen app.

No build step and no dependencies beyond Python 3. Leaflet is bundled in `vendor/`. Map tiles (CARTO/OpenStreetMap) and Street View load from the internet in the browser.

## Files

- `EVIDENCE.md`: research notes, scoring method and sources
- `data.js`: shop data, scores and evidence shown in the app
- `app.js`, `styles.css`, `index.html`: the app

## Storefront photos

By default, photos use Google's keyless Street View embed, which you can pan. For sharper still photos, open the gear icon, choose "Street View photos with an API key" and paste a Google Maps Platform key that has the Street View Static API turned on. The key is stored only in that browser.
