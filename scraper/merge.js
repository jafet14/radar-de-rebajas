// Uso: node scraper/merge.js <carpeta-con-los-json> "<texto de fecha>"
// Une los radar-*.json en site/data.js y site/images.js.
// Si falta el archivo de una marca (o vino vacío), conserva las piezas anteriores de esa marca.
const fs = require('fs'), path = require('path');
const dir = process.argv[2], stamp = process.argv[3];
const SITE = path.join(__dirname, '..', 'site');
const FILES = { 'Nike': ['radar-nike'], 'Adidas': ['radar-adidas'], "Levi's": ['radar-levis'],
  'Calvin Klein': ['radar-calvinklein'], 'Lululemon': ['radar-lululemon'], 'Gymshark': ['radar-gymshark'],
  'New Balance': ['radar-nb-men', 'radar-nb-women'] };

// datos anteriores
const oldP = new Function(fs.readFileSync(path.join(SITE, 'data.js'), 'utf8') + ';return P;')();
const oldI = JSON.parse(fs.readFileSync(path.join(SITE, 'images.js'), 'utf8').replace(/^window\.IMG=/, '').replace(/;\s*$/, ''));

const rows = [], img = {}, seen = new Set(), report = {};
const add = (r, im) => {
  if (!(r[5] > 0 && r[6] > r[5]) || !r[9] || typeof r[3] !== 'string' || /object/.test(r[9])) return;
  if (seen.has(r[7])) return; seen.add(r[7]);
  if (r[0] === 'New Balance' && rows.some(q => q[0] === r[0] && q[3] === r[3] && q[4] === r[4])) return;
  if (im) img[rows.length] = im; rows.push(r);
};
for (const [brand, names] of Object.entries(FILES)) {
  let fresh = [];
  for (const n of names) {
    const f = path.join(dir, n + '.json');
    if (!fs.existsSync(f)) continue;
    try { const j = JSON.parse(fs.readFileSync(f, 'utf8')); for (const r of j.rows || []) fresh.push([r, j.img[r[7]]]); } catch (e) {}
  }
  if (fresh.length >= 3) { fresh.forEach(([r, im]) => add(r, im)); report[brand] = 'nuevo (' + fresh.length + ')'; }
  else { oldP.forEach((r, i) => { if (r[0] === brand) add(r, oldI[i]); }); report[brand] = 'sin cambios (se conservó lo anterior)'; }
}
fs.writeFileSync(path.join(SITE, 'data.js'),
  '// [marca, genero, tipo, nombre, color, ahora, antes, url, imagen, tallas]\nconst P = [\n' + rows.map(r => JSON.stringify(r)).join(',\n') + '\n];\n');
fs.writeFileSync(path.join(SITE, 'images.js'), 'window.IMG=' + JSON.stringify(img) + ';');
if (stamp) {
  const ip = path.join(SITE, 'index.html');
  fs.writeFileSync(ip, fs.readFileSync(ip, 'utf8').replace(/Precios revisados · [^<]*/, 'Precios revisados · ' + stamp));
}
console.log(JSON.stringify({ total: rows.length, marcas: report }, null, 1));
