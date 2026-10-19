(function(){
 let contextWindow=window;
 for(let candidate=window;;){try{if(candidate.shelfContext){contextWindow=candidate;break;}if(candidate===candidate.parent)break;candidate=candidate.parent;void candidate.document;}catch{break;}}
 if(!contextWindow.shelfContext){contextWindow.shelfContext={started:null};const start=()=>{contextWindow.shelfContext.started=contextWindow.performance.now();contextWindow.dispatchEvent(new Event('shelf-ready'));};if(contextWindow.document.readyState==='loading')contextWindow.document.addEventListener('DOMContentLoaded',start,{once:true});else start();}
 window.whenShelfReady=fn=>{if(Number.isFinite(contextWindow.shelfContext.started))fn();else contextWindow.addEventListener('shelf-ready',fn,{once:true});};
 window.atShelfTime=(at,fn)=>window.whenShelfReady(()=>setTimeout(fn,Math.max(0,at-(contextWindow.performance.now()-contextWindow.shelfContext.started))));
 window.activateReadingScripts=container=>{for(const node of container.querySelectorAll('script')){const script=document.createElement('script');script.textContent=node.textContent;node.replaceWith(script);}};
 window.refreshReadingAddresses=container=>{for(const a of container.querySelectorAll('a[data-address]')){const u=new URL(a.getAttribute('href'),a.ownerDocument.baseURI);a.href=a.dataset.address==='root'?u.pathname+u.search+u.hash:u.href;}};
 const setup=()=>{
  window.refreshReadingAddresses(document);
  for(const form of document.querySelectorAll('.local-search')){
   const input=form.querySelector('input'),list=form.nextElementSibling,rows=[...list.querySelectorAll('li')],note=form.querySelector('.search-count');
   const update=()=>{const query=input.value.trim();let count=0;for(const row of rows){row.hidden=!row.textContent.includes(query);if(!row.hidden)count++;}note.textContent=count+'개 자료';list.querySelector('.no-match')?.remove();if(!count){const row=document.createElement('li');row.className='no-match';row.textContent='일치하는 자료가 없습니다.';list.append(row);}};
   form.addEventListener('submit',event=>{event.preventDefault();update();});form.addEventListener('reset',()=>{input.value='';update();});
  }
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();