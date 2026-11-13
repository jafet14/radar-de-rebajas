// URL: https://www.gymshark.com/   ->  descarga radar-gymshark.json
(async()=>{try{const rows=[],img={};
for(const [p,g] of [['/collections/last-chance/mens','Hombre'],['/collections/last-chance/womens','Mujer']]){
const h=await fetch(p).then(r=>r.text()); const nd=JSON.parse(h.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s)[1]);
let hits=null; const f=o=>{if(!o||typeof o!=='object'||hits)return; if(o.ssrQuery?.hits){hits=o.ssrQuery.hits;return} Object.values(o).forEach(f)}; f(nd);
const cat=t=>{t=t.toLowerCase(); if(/jacket|coat|puffer|gilet|vest\b/.test(t))return'Abrigos'; if(/hoodie|sweatshirt|zip|pullover|crew\b/.test(t))return'Sudaderas'; if(/bra|underwear|boxer|brief|thong|sock/.test(t))return'Ropa interior'; if(/jogger|pant|trouser|sweatpant/.test(t))return'Pantalones'; if(/t-shirt|tee|tank|top|shirt|polo/.test(t))return'Camisetas'; return'Deportiva'};
const per={},seen=new Set();
for(const x of hits.sort((a,b)=>b.discountPercentage-a.discountPercentage)){const c=cat(x.title); if(seen.has(x.title))continue; per[c]=per[c]||0; if(per[c]>=3)continue; const sz=(x.availableSizes||[]).filter(s=>s.inStock).map(s=>s.size.toUpperCase()); if(!sz.length||!(x.price<x.compareAtPrice))continue; seen.add(x.title); per[c]++; const url='https://www.gymshark.com/products/'+x.handle;
 rows.push(['Gymshark',g,c,x.title,x.colour,x.price,x.compareAtPrice,url,'',sz.join(',')]); try{img[url]=await window.__thumb(x.featuredMedia.src.split('?')[0]+'?width=440')}catch(e){}}}
window.__done={rows:rows.length,imgs:Object.keys(img).length,size:window.__save('radar-gymshark.json',{rows,img})}}catch(e){window.__done='ERR '+e}})();
