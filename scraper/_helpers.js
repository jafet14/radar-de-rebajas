// Helpers compartidos. Se pegan al inicio de cada script de tienda.
window.__thumb = async (u) => {
  const b = await fetch(u).then(r => { if (!r.ok) throw r.status; return r.blob(); });
  const bm = await createImageBitmap(b);
  const W = 320, H = Math.round(bm.height * W / bm.width);
  const c = new OffscreenCanvas(W, H); const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.drawImage(bm, 0, 0, W, H);
  const o = await c.convertToBlob({ type: 'image/webp', quality: 0.62 });
  return await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(o); });
};
window.__save = (name, obj) => {
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.append(a); a.click(); return blob.size;
};
window.__done = null;
