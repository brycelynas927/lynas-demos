(function(){
'use strict';
const lessons=window.MNC_BUSINESS_LESSONS||[];
const tracks=window.MNC_BUSINESS_TRACKS||[];
function profile(){
 if(!state.businessLearning||typeof state.businessLearning!=='object')state.businessLearning={track:'explore',minutes:20,done:[],notes:{},quizzes:{},selected:'',showAll:false};
 let p=state.businessLearning;
 if(!Array.isArray(p.done))p.done=[];
 if(!p.notes||typeof p.notes!=='object')p.notes={};
 if(!p.quizzes||typeof p.quizzes!=='object')p.quizzes={};
 if(!tracks.some(t=>t.id===p.track))p.track='explore';
 if(![15,30,60].includes(Number(p.minutes)))p.minutes=20;
 return p;
}
function courseOrder(){let p=profile(),track=tracks.find(t=>t.id===p.track)||tracks[0];return track.order.map(id=>lessons.find(x=>x.id===id)).filter(Boolean)}
function recommendation(){let p=profile(),ordered=courseOrder();return ordered.find(l=>!p.done.includes(l.id))||ordered[0]}
function quote(s){return esc(String(s||''))}
function photoForLesson(i){
 let photos=window.MNC_PHOTOS||[];
 let filtered=photos.filter(p=>p.category==='Remote work'||p.category==='Learning');
 if(!filtered.length)return '';
 let d=Math.floor(Date.now()/86400000);return filtered[(d*3+i*7)%filtered.length].url;
}
function layoutCard(x,i,active){
 let done=profile().done.includes(x.id),photo=photoForLesson(i),isSelected=active===x.id;
 return '<button type="button" class="biz-module'+(isSelected?' chosen':'')+'" onclick="businessSelect(\''+x.id+'\')">'+
  '<span class="biz-module-image"'+(photo?' style="background-image:url('+photo+')"':'')+'></span>'+
  '<span class="biz-module-body"><span class="biz-pills"><small>'+quote(x.stage)+'</small><small>'+quote(x.priority)+'</small></span>'+
  '<strong>'+quote(x.icon)+' '+quote(x.title)+'</strong><span class="biz-desc">'+quote(x.why)+'</span></span>'+
  '<span class="biz-module-status">'+(done?'✓':'→')+'</span></button>'
}
function selectedLesson(){return lessons.find(x=>x.id===profile().selected)||recommendation()}
function durationActions(x){return '<div class="biz-actions">'+
 [15,30,60].map((n,i)=>'<button type="button" class="biz-time'+(Number(profile().minutes)===n?' selected':'')+'" onclick="businessMinutes('+n+')">'+(n===60?'1 hour':n+' min')+'</button>').join('')+
 '</div><div class="biz-action-note"><strong>Your '+(profile().minutes===60?'1-hour':profile().minutes+'-minute')+' challenge</strong><p>'+quote(x.actions[profile().minutes===15?0:profile().minutes===30?1:2])+'</p></div>'
}
function lessonDetails(x){
 let p=profile(),ans=p.quizzes[x.id],done=p.done.includes(x.id),correct=ans===x.quiz.correct;
 return '<div class="biz-detail"><div class="biz-detail-head"><div><span class="eyebrow muted">WHY THIS MATTERS</span><h3>'+quote(x.icon)+' '+quote(x.title)+'</h3></div><span class="biz-priority">'+quote(x.priority)+'</span></div>'+
  '<p>'+quote(x.why)+'</p><div class="biz-explain"><strong>Understand the idea</strong><p>'+quote(x.concept)+'</p><strong>Real-world example</strong><p>'+quote(x.example)+'</p></div>'+
  '<div class="biz-section-label">PRACTISE WHAT YOU LEARN</div>'+durationActions(x)+
  '<div class="biz-section-label">CHECK YOUR UNDERSTANDING</div><div class="biz-quiz"><strong>'+quote(x.quiz.question)+'</strong>'+
  x.quiz.answers.map((v,i)=>'<button type="button" class="biz-answer'+(ans===i?(correct?' right':' picked'):'')+'" onclick="businessAnswer(\''+x.id+'\','+i+')">'+quote(v)+(ans===i?(correct?' ✓':' · Try again'):'')+'</button>').join('')+
 (ans!==undefined?'<p class="biz-feedback">'+(correct?'✓ Exactly! ':'Not quite. Try another answer. ')+(correct?'': '')+(correct?quote(x.concept):'')+'</p>':'')+'</div>'+
  '<div class="biz-section-label">PERSONAL NOTES</div><textarea rows="3" class="field biz-notes" id="biz-notes-'+x.id+'" oninput="businessWrite(\''+x.id+'\',this.value)" placeholder="What did you learn? What could you try in your own business?">'+quote(p.notes[x.id]||'')+'</textarea>'+
  '<div class="biz-detail-footer"><a href="'+quote(x.resource)+'" target="_blank" rel="noopener noreferrer" class="biz-read">Read a free guide ↗</a>'+
  '<button class="btn '+(done?'light':'sage')+'" type="button" onclick="businessFinish(\''+x.id+'\')">'+(done?'✓ Completed · Undo':'✓ Mark lesson complete')+'</button></div></div>';
}
function pathControls(){
 let p=profile(),track=tracks.find(t=>t.id===p.track);
 return '<div class="biz-path"><label class="eyebrow muted" for="biz-track">YOUR LEARNING DIRECTION</label><select id="biz-track" class="field" onchange="businessTrack(this.value)">'+tracks.map(t=>'<option value="'+t.id+'"'+(p.track===t.id?' selected':'')+'>'+quote(t.label)+'</option>').join('')+'</select><p class="small muted">'+quote(track.description)+'</p></div>'
}
function renderExplorer(full){
 const p=profile(),ordered=courseOrder(),next=recommendation(),done=ordered.filter(l=>p.done.includes(l.id)).length,selected=selectedLesson();
 let listed=full&&p.showAll?ordered:full?ordered.slice(0,6):[];
 return '<section class="biz-area">'+
 '<div class="biz-title"><div><span class="eyebrow muted">FREEDOM BUSINESS SCHOOL</span><h2>Learn to build real online income 💻</h2><p>Learn the essentials, find what suits you, and try small real-world projects.</p></div><span class="biz-count">'+done+' / '+lessons.length+' complete</span></div>'+
 (full?pathControls():'')+
 '<div class="biz-feature"><div class="biz-feature-photo" style="background-image:url('+photoForLesson(2)+')"></div><div class="biz-feature-copy"><span class="eyebrow">RECOMMENDED NEXT</span><h3>'+quote(next.title)+'</h3><p>'+quote(next.why)+'</p><div class="biz-actions"><button class="btn sage small" onclick="businessSelect(\''+next.id+'\')">Start learning →</button>'+(full?'':'<button class="btn light small" onclick="showPage(\'learn\')">See learning plan →</button>')+'</div></div></div>'+
 (full?'<div class="biz-progress"><div class="biz-progress-track"><div class="biz-progress-fill" style="width:'+(done/lessons.length*100)+'%"></div></div><span class="small muted">Learning progress · You can take this at your own pace.</span></div>'+
 '<div class="biz-section-label">YOUR LESSONS</div><div class="biz-modules">'+listed.map((x,i)=>layoutCard(x,i,p.selected||next.id)).join('')+'</div>'+
 '<button type="button" class="biz-showmore" onclick="businessMore()">'+(p.showAll?'Show fewer lessons':'Explore all 12 lessons')+' ↓</button>'+
 lessonDetails(selected):'')+
 '</section>'
}
function homeCard(){
 const p=profile(),next=recommendation();
 return '<section class="biz-area biz-home"><div class="biz-title"><div><span class="eyebrow muted">TODAY IN BUSINESS GROWTH</span><h2>One small step toward freedom</h2></div></div><div class="biz-home-card">'+
 '<div class="biz-home-cover" style="background-image:url('+photoForLesson(4)+')"></div><div class="biz-home-copy"><strong>'+quote(next.icon)+' '+quote(next.title)+'</strong><p>'+quote(next.why)+'</p><div class="biz-actions"><button class="btn sage small" onclick="businessSelect(\''+next.id+'\')">Learn this next →</button></div></div></div></section>'
}
function updateBusinessUi(){
 let parent=document.getElementById('page-'+currentPage);
 if(!parent)return;
 if(currentPage==='learn'||currentPage==='freedom'){
  let intro=parent.querySelector('.intro'),html=renderExplorer(true);
  if(intro)intro.insertAdjacentHTML('afterend',html);
 }else if(currentPage==='home'){
  let gallery=parent.querySelector('.positive-moodboard'),hero=parent.querySelector('.hero');
  if(gallery)gallery.insertAdjacentHTML('afterend',homeCard());
  else if(hero)hero.insertAdjacentHTML('afterend',homeCard())
 }
}
function refresh(){window.drawPage()}
window.businessTrack=function(id){let p=profile();if(!tracks.some(t=>t.id===id))return;p.track=id;p.selected='';save();refresh()};
window.businessMinutes=function(n){let p=profile();p.minutes=[15,30,60].includes(n)?n:15;save();refresh()};
window.businessSelect=function(id){if(!lessons.some(x=>x.id===id))return;let p=profile();p.selected=id;save();if(currentPage==='home'){showPage('learn');return}refresh();document.querySelector('.biz-detail')?.scrollIntoView({behavior:'smooth',block:'start'})};
window.businessFinish=function(id){let p=profile();if(!lessons.some(x=>x.id===id))return;p.done=p.done.includes(id)?p.done.filter(x=>x!==id):[...p.done,id];save();refresh();toast(p.done.includes(id)?'Lesson complete ✨':'Lesson marked incomplete')};
window.businessAnswer=function(id,n){let l=lessons.find(x=>x.id===id);if(!l||!Number.isInteger(n)||n<0||n>=l.quiz.answers.length)return;profile().quizzes[id]=n;save();refresh()};
window.businessWrite=function(id,value){if(!lessons.some(x=>x.id===id))return;profile().notes[id]=String(value).slice(0,2500);save()};
window.businessMore=function(){profile().showAll=!profile().showAll;save();refresh()};
const previousDraw=window.drawPage;
window.drawPage=function(){previousDraw();updateBusinessUi()};
window.drawPage();
})();