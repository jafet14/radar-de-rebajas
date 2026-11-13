// URL: https://www.calvinklein.us/en/sale/men   ->  descarga radar-calvinklein.json  (tarda ~1-2 min)
(async()=>{try{
const cks=async(u)=>{const d=new DOMParser().parseFromString(await fetch(u.split('?')[0]).then(r=>r.text()),'text/html'); return {name:d.querySelector('h1')?.innerText?.trim(), all:[...d.querySelectorAll('input.variant-size')].map(i=>i.dataset.attrValue||i.value)}};
const out=[],seen=new Set();
for(const [p,g] of [['/en/sale/men','Hombre'],['/en/sale/women','Mujer'],['/en/sale/men/underwear','Hombre'],['/en/sale/women/underwear','Mujer']]) for(const st of [0,32]){
 const d=new DOMParser().parseFromString(await fetch(p+'?sz=32&start='+st).then(r=>r.text()),'text/html');
 for(const el of d.querySelectorAll('.product[data-pid]')){if(seen.has(el.dataset.pid))continue; seen.add(el.dataset.pid); let catg=''; try{catg=JSON.parse(el.querySelector('.product-tile').dataset.category).product_master_category}catch(e){}
  let img=null,url=null; try{const a=JSON.parse(el.querySelector('[data-product-image-attr]').dataset.productImageAttr); img=a.product.images[0].absURL; url=a.product.url}catch(e){}
  const pr=(el.querySelector('.price')?.innerText||'').replace(/\s+/g,' '); const m=[...pr.matchAll(/\$([\d.,]+)/g)].map(x=>+x[1].replace(',',''));
  if(url&&m.length>=2){const was=Math.max(...m); const rest=m.slice(); rest.splice(rest.indexOf(was),1); const now=Math.max(...rest), lo=Math.min(...rest); if(now<was) out.push({g,catg,was,now,lo,img,url})}}}
const cat=(c,n)=>{const s=(c+' '+n).toLowerCase(); if(/underwear|brief|trunk|boxer|bra|bikini|thong|panties|sleep|lounge|boyshort/.test(s))return'Ropa interior'; if(/jacket|coat|puffer|vest/.test(s))return'Abrigos'; if(/hoodie|sweatshirt|sweater|cardigan|quarter zip/.test(s))return'Sudaderas'; if(/short|legging|active/.test(s))return'Deportiva'; if(/pant|jean|jogger|trouser/.test(s))return'Pantalones'; return'Camisetas'};
const per={},rows=[],img={};
for(const x of out.sort((a,b)=>(b.was-b.now)/b.was-(a.was-a.now)/a.was)){if(rows.length>=26)break; let r; try{r=await cks(x.url)}catch(e){continue} if(!r.all.length||!r.name)continue; const c=cat(x.catg,r.name); const k=x.g+c; per[k]=per[k]||0; if(per[k]>=(c==='Ropa interior'?6:3))continue; if(rows.some(q=>q[3]===r.name&&q[1]===x.g))continue; per[k]++; const url='https://www.calvinklein.us'+x.url.split('?')[0]; rows.push(['Calvin Klein',x.g,c,r.name,'',x.now,x.was,url,'',r.all.join(','),x.lo<x.now?x.lo:0]); try{img[url]=await window.__thumb(x.img+'?wid=440')}catch(e){}}
window.__done={rows:rows.length,imgs:Object.keys(img).length,size:window.__save('radar-calvinklein.json',{rows,img})}}catch(e){window.__done='ERR '+e}})();
