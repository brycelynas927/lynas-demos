(function(){
'use strict';
const resources=window.MNC_BUSINESS_RESOURCES||[];
const tracks=window.MNC_BUSINESS_RESOURCE_TRACKS||[];
const esc2=s=>esc(String(s==null?'':s));
function p(){
 if(!state.externalBusiness||typeof state.externalBusiness!=='object')state.externalBusiness={track:'explore',completed:[],opened:[],notes:{},all:false};
 const v=state.externalBusiness;
 if(!Array.isArray(v.completed))v.completed=[];
 if(!Array.isArray(v.opened))v.opened=[];
 if(!v.notes||typeof v.notes!=='object')v.notes={};
 if(!tracks.some(t=>t.id===v.track))v.track='explore';
 return v
}
function list(){const t=tracks.find(t=>t.id===p().track)||tracks[0];return(t?.ids||[]).map(id=>resources.find(x=>x.id===id)).filter(Boolean)}
function next(){return list().find(x=>!p().completed.includes(x.id))||null}
function link(x,text,klass){
 return '<a class="'+klass+'" href="'+esc2(x.url)+'" target="_blank" rel="noopener noreferrer" onclick="mncBusinessOpened(\''+x.id+'\')">'+esc2(text)+'</a>'
}
function item(x){
 if(!x)return '<div class="blr-finished"><strong>🎉 You finished this learning path!</strong><p>Choose another direction to keep building your skills.</p></div>';
 let v=p(),opened=v.opened.includes(x.id);
 return '<div class="blr-feature"><span class="eyebrow muted">YOUR NEXT USEFUL BUSINESS SKILL</span><h3>'+esc2(x.icon)+' '+esc2(x.title)+'</h3>'+
 '<p class="blr-meta">'+esc2(x.provider)+' · '+esc2(x.type)+' · about '+x.minutes+' min'+(x.type==='Course segment'?' for this step':'')+'</p>'+
 '<div class="blr-explain"><strong>What you will learn</strong><p>'+esc2(x.outcome)+'</p></div>'+
 '<div class="blr-explain"><strong>Apply it</strong><p>'+esc2(x.apply)+'</p></div>'+
 '<div class="blr-actions">'+link(x,'↗ Open '+(x.type==='Video'?'video':x.type==='Course segment'?'course':'article / resource'),'blr-open')+
 '<button class="blr-done" onclick="mncBusinessComplete(\''+x.id+'\')">✓ '+(opened?'Finished the assigned part':'Mark complete → Next')+'</button></div>'+
 '<label class="blr-note-label" for="blr-notes">Save one useful takeaway (optional)</label>'+
 '<textarea id="blr-notes" class="field" rows="2" placeholder="What did you actually learn?" oninput="mncBusinessWrite(\''+x.id+'\',this.value)">'+esc2(v.notes[x.id]||'')+'</textarea></div>'
}
function pathMarkup(){
 let v=p(),active=next(),shown=v.all?list():list().slice(0,6);
 return '<div class="blr-path"><h3>What comes next</h3>'+shown.map((x,i)=>'<div class="blr-path-row'+(v.completed.includes(x.id)?' learned':'')+(active?.id===x.id?' active':'')+'"><span class="blr-num">'+(v.completed.includes(x.id)?'✓':i+1)+'</span><div><strong>'+esc2(x.title)+'</strong><small>'+esc2(x.provider)+' · '+esc2(x.type)+'</small></div>'+link(x,'↗','blr-view')+(v.completed.includes(x.id)?'<button class="blr-undo" onclick="mncBusinessUndo(\''+x.id+'\')">↩</button>':'')+'</div>').join('')+
 '<button class="blr-expand" onclick="mncBusinessExpand()">'+(v.all?'Show fewer':'Show all resources')+'</button></div>'
}
function full(){
 const v=p(),current=next(),t=tracks.find(x=>x.id===v.track)||tracks[0],total=list().length,done=list().filter(x=>v.completed.includes(x.id)).length;
 return '<section class="blr-page"><div class="blr-heading"><span class="eyebrow muted">BUSINESS GROWTH · LEARN FROM REAL SOURCES</span><h2>Practical skills, not random motivation.</h2><p>Open the recommended article, video, or course. Learn the assigned part, mark it complete, and the next resource appears automatically.</p></div>'+
 '<div class="blr-track"><label for="blr-track" class="eyebrow muted">PICK YOUR DIRECTION</label><select class="field" id="blr-track" onchange="mncBusinessTrack(this.value)">'+tracks.map(x=>'<option value="'+x.id+'"'+(x.id===v.track?' selected':'')+'>'+esc2(x.label)+'</option>').join('')+'</select><p>'+esc2(t.desc)+'</p></div>'+
 '<div class="blr-progress">'+done+' / '+total+' learning steps done<div><span style="width:'+(total?done/total*100:0)+'%"></span></div></div>'+item(current)+pathMarkup()+
 '<p class="blr-foot">No hype or guaranteed income. Focus on customers, sales, pricing, profit, practical technology and real projects.</p></section>'
}
function mini(){
 const x=next();
 return '<section class="blr-mini"><span class="eyebrow muted">YOUR NEXT BUSINESS SKILL</span>'+(x?'<h3>'+esc2(x.icon)+' '+esc2(x.title)+'</h3><p>'+esc2(x.outcome)+'</p><div class="blr-actions">'+link(x,'↗ Learn online','blr-open')+'<button class="blr-done" onclick="mncBusinessComplete(\''+x.id+'\')">✓ Done → Next</button></div>':'<h3>All resources finished! 🎉</h3><button class="blr-done" onclick="showPage(\'learn\')">Explore another path</button>')+'</section>'
}
window.mncBusinessOpened=id=>{if(!p().opened.includes(id)){p().opened.push(id);save()}};
window.mncBusinessComplete=id=>{if(!resources.some(x=>x.id===id)||p().completed.includes(id))return;p().completed.push(id);save();drawPage();toast('Great! Your next business resource is ready. ✨')};
window.mncBusinessUndo=id=>{p().completed=p().completed.filter(x=>x!==id);save();drawPage()};
window.mncBusinessWrite=(id,value)=>{p().notes[id]=String(value).slice(0,3000);save()};
window.mncBusinessTrack=id=>{if(tracks.some(t=>t.id===id)){p().track=id;save();drawPage()}};
window.mncBusinessExpand=()=>{p().all=!p().all;save();drawPage()};
window.mncBusinessNext=()=>next();
function decorate(){
 if(!['home','learn','freedom'].includes(currentPage))return;
 const root=document.getElementById('page-'+currentPage);if(!root)return;
 root.querySelectorAll('.biz-area').forEach(el=>el.remove());
 if(currentPage==='home'){
  const dc=root.querySelector('#mnc-daily-checklist'),x=next();
  if(dc){
   const row=[...dc.querySelectorAll('.dc-task')].find(el=>el.querySelector('.dc-task-header strong')?.textContent.includes('💻'));
   if(row){
    const title=row.querySelector('.dc-task-header strong'),description=row.querySelector('.dc-task-text p'),actions=row.querySelector('.dc-task-links'),time=row.querySelector('.dc-minutes');
    if(x){
     if(title)title.textContent=x.icon+' Learn: '+x.title;
     if(description)description.textContent=x.outcome+' '+x.apply;
     if(time)time.textContent='~'+x.minutes+' min';
     if(actions)actions.innerHTML=link(x,'↗ Open '+(x.type==='Video'?'video':'resource'),'dc-start')+'<button class="blr-inline" onclick="mncBusinessComplete(\''+x.id+'\')">✓ Finished → Next</button>';
    }else{
     if(title)title.textContent='🎉 You finished the business learning path';
     if(description)description.textContent='Explore another skill direction.';
     if(actions)actions.innerHTML='<button class="dc-start" onclick="showPage(\'learn\')">Choose next skill →</button>'
    }
   }
  }
  const wrapper=document.createElement('div');wrapper.innerHTML=mini();
  (dc||root.querySelector('.hero'))?.insertAdjacentElement('afterend',wrapper.firstElementChild)
 }else{
  const intro=root.querySelector('.intro');if(intro){const wrapper=document.createElement('div');wrapper.innerHTML=full();intro.insertAdjacentElement('afterend',wrapper.firstElementChild)}
 }
}
const prior=window.drawPage;
window.drawPage=function(){prior();decorate()};
window.drawPage();
})();