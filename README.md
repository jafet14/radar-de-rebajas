# Radar de Rebajas

Web estática con ofertas en SALE de Nike, Adidas, Levi's (vía Macy's), Calvin Klein, Lululemon, New Balance y Gymshark en USA.

- `site/` — la web que publica Netlify (`index.html`, `data.js` con las prendas, `images.js` con las fotos).
- `scraper/` — scripts que leen el sale de cada tienda desde un navegador real y `merge.js`, que arma `site/data.js` e `site/images.js`.

## Cómo se actualiza
Una tarea programada de Claude corre a diario en la computadora del dueño:
1. Abre cada URL indicada en la primera línea de `scraper/<tienda>.js` en el navegador de la app de Claude.
2. Ejecuta `scraper/_helpers.js` y luego el script de la tienda; cada uno descarga un `radar-<tienda>.json`.
3. Corre `node scraper/merge.js <carpeta> "<fecha>"`, hace commit y push a `main`.
4. Netlify publica la nueva versión automáticamente.
