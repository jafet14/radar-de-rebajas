// URL: https://www.newbalance.com/sale/men/  -> descarga radar-nb-men.json
// URL: https://www.newbalance.com/sale/women/ -> descarga radar-nb-women.json
// Correr una vez en cada página (espera 3 s después de cargar).
(async()=>{try{
const tag=location.pathname.includes('women')?'women':'men';
for(const el of document.querySelectorAll('.product[data-pid]')){el.scrollIntoView();await new Promise(r=>setTimeout(r,120))} await new Promise(r=>setTimeout(r,1000));
const arr=[],seen=new Set(); for(const el of document.querySelectorAll('.product[data-pid]')){if(seen.has(el.id))continue;seen.add(el.id); const txt=el.querySelector('.tile-body')?.innerText.replace(/\s+/g,' ').trim(); if(!/% off/.test(txt||''))continue; arr.push({txt,u:el.querySelector('.image-container a')?.href,img:el.querySelector('img.tile-image-default')?.src,qv:el.querySelector('.js-quickview')?.dataset.url})}
const rows=[],img={};
for(const x of arr){const m=x.txt.match(/^(?:Best seller |New colors |New )?(.*?) (Men's|Women's|Unisex) (\w+) \$([\d.]+) \$([\d.]+)/); if(!m||!x.qv)continue; const d=new DOMParser().parseFromString(await fetch(x.qv).then(r=>r.text()),'text/html'); const sz=[...d.querySelectorAll('.size-value.selectable')].map(s=>s.dataset.attrValue); if(!sz.length||sz[0]==='OSZ')continue; const g=m[2]==="Men's"?'Hombre':m[2]==="Women's"?'Mujer':'Unisex'; const style=(x.u.match(/_style=([A-Z0-9]+)/)||[])[1]||''; const url=x.u.split('&')[0]; rows.push(['New Balance',g,'Tenis',m[1].replace(/​/g,'')+' ('+m[3]+')',style,+m[4],+m[5],url,'',sz.join(',')]); try{img[url]=await window.__thumb(x.img)}catch(e){}}
window.__done={rows:rows.length,imgs:Object.keys(img).length,size:window.__save('radar-nb-'+tag+'.json',{rows,img})}}catch(e){window.__done='ERR '+e}})();
