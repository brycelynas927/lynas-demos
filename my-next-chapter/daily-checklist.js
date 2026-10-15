(function(){
'use strict';
const learningLinks=[
 {name:'Startup School',what:'Find customers & test business ideas',url:'https://www.startupschool.org/',icon:'🚀',key:'startup'},
 {name:'HubSpot Academy',what:'Free digital marketing course',url:'https://academy.hubspot.com/courses/digital-marketing',icon:'📣',key:'marketing'},
 {name:'freeCodeCamp',what:'Build websites & learn coding',url:'https://www.freecodecamp.org/learn',icon:'💻',key:'code'},
 {name:'Language Transfer',what:'Free spoken Spanish audio lessons',url:'https://www.languagetransfer.org/complete-spanish',icon:'🎧',key:'spanish'},
 {name:'SpanishDict',what:'Spanish listening, grammar & pronunciation',url:'https://www.spanishdict.com/guide/how-to-learn-spanish-online-for-free',icon:'🇪🇸',key:'spanishdict'}
];
const byKey=Object.fromEntries(learningLinks.map(x=>[x.key,x]));
function safe(s){return esc(String(s==null?'':s))}
function record(){
 if(!state.dailyChecklist||typeof state.dailyChecklist!=='object'||Array.isArray(state.dailyChecklist))state.dailyChecklist={};
 if(![15,30,60].includes(Number(state.dailyPlanMinutes)))state.dailyPlanMinutes=30;
 let key=dayKey();
 if(!Array.isArray(state.dailyChecklist[key]))state.dailyChecklist[key]=[];
 return {key,checked:state.dailyChecklist[key],duration:state.dailyPlanMinutes}
}
function learningNext(){
 const lessons=window.MNC_BUSINESS_LESSONS||[];
 const tracks=window.MNC_BUSINESS_TRACKS||[];
 const p=state.businessLearning||{};
 const order=(tracks.find(x=>x.id===p.track)||tracks[0])?.order||lessons.map(x=>x.id);
 const done=Array.isArray(p.done)?p.done:[];
 return order.map(id=>lessons.find(x=>x.id===id)).find(x=>x&&!done.includes(x.id))||lessons[0];
}
function resourceForLesson(lesson){
 const id=lesson?.id;
 if(['marketing','sales'].includes(id))return byKey.marketing;
 if(['portfolio','automation'].includes(id))return byKey.code;
 return byKey.startup;
}
function tasksForToday(){
 const p=record(),minutes=p.duration,lesson=learningNext(),businessResource=resourceForLesson(lesson);
 const durations=minutes===15?[5,7,3,0]:minutes===60?[12,30,8,10]:[8,15,5,2];
 const spanishLessons=Array.isArray(state.spanishDone)?state.spanishDone:[];
 const spanishIndex=Number.isInteger(state.spanishIndex)?state.spanishIndex:0;
 const spanishComplete=spanishLessons.includes(spanishIndex);
 const day=parseInt(p.key.split('-').join(''),10);
 const wellnessPrompts=['Stretch or take a short screen break','Take a few minutes for yourself','Go for a short walk or move gently','Write down one thing you are grateful for','Check in with your energy and mood','Take a short, peaceful break'];
 const visionPrompts=['Look at your travel vision board and pick one small next step','Write down one destination you dream of exploring','Reflect on what working remotely could make possible','Add one thought to your future-life goals'];
 const tasks=[
 {id:'spanish',icon:'🇪🇸',title:spanishComplete?'Review a Spanish lesson':'Practice Spanish words & sentences',detail:'Listen to all five words and the full phrase. Say at least one sentence aloud.',minutes:durations[0],action:'spanish',actionLabel:'Open Spanish',link:byKey.spanish,secondary:byKey.spanishdict},
 {id:'business',icon:'💻',title:lesson?'Learn: '+lesson.title:'Explore an online business skill',detail:lesson?.why||'Discover what makes a business worth building.',minutes:durations[1],action:'business',actionLabel:'Start lesson',link:businessResource,lessonId:lesson?.id||''},
 {id:'wellness',icon:'🌱',title:wellnessPrompts[day%wellnessPrompts.length],detail:'A little personal care counts too; no need to be productive every minute.',minutes:durations[2],action:'growth',actionLabel:'Daily check-in'},
 {id:'future',icon:'🌎',title:visionPrompts[day%visionPrompts.length],detail:'Reconnect with why you are learning and growing.',minutes:durations[3],action:'vision',actionLabel:'View my dreams'}
 ];
 return tasks.filter(x=>x.minutes>0)
}
function linkHTML(link,label){
 if(!link)return '';
 return '<a class="dc-external" target="_blank" rel="noopener noreferrer" href="'+safe(link.url)+'">↗ '+safe(label||link.name)+'</a>';
}
function rowHTML(t,checked){
 const done=checked.includes(t.id);
 return '<div class="dc-task'+(done?' is-done':'')+'">'+
 '<label class="dc-check"><input type="checkbox" onchange="mncCheckTask(\''+t.id+'\',this.checked)" '+(done?'checked':'')+' aria-label="Complete '+safe(t.title)+'"/><span class="dc-mark" aria-hidden="true">'+(done?'✓':'')+'</span></label>'+
 '<div class="dc-task-text"><div class="dc-task-header"><strong>'+safe(t.icon)+' '+safe(t.title)+'</strong><span class="dc-minutes">'+t.minutes+' min</span></div><p>'+safe(t.detail)+'</p><div class="dc-task-links">'+
 '<button type="button" class="dc-start" onclick="mncOpenTask(\''+t.action+'\',\''+safe(t.lessonId||'')+'\')">'+safe(t.actionLabel)+' →</button>'+
 (t.link?linkHTML(t.link, t.link.name):'')+(t.secondary?linkHTML(t.secondary,'Extra pronunciation'):'')+
 '</div></div></div>'
}
function resourceShelf(){
 return '<div class="dc-links"><div class="dc-links-title"><span class="eyebrow muted">YOUR LEARNING SHORTCUTS</span><p>Useful free resources — no searching required.</p></div><div class="dc-resources">'+
 learningLinks.map(link=>'<a target="_blank" rel="noopener noreferrer" href="'+safe(link.url)+'" class="dc-resource"><span class="dc-resource-icon">'+safe(link.icon)+'</span><span><strong>'+safe(link.name)+'</strong><small>'+safe(link.what)+'</small></span><span class="dc-go">↗</span></a>').join('')+
 '</div></div>'
}
function checklistHTML(){
 const p=record(),tasks=tasksForToday(),done=tasks.filter(t=>p.checked.includes(t.id)).length;
 const num=p.duration;
 return '<section class="dc-panel" id="mnc-daily-checklist" aria-label="Today checklist">'+
 '<div class="dc-head"><div><span class="eyebrow muted">YOUR DAILY PLAN ✨</span><h2>What can I do today?</h2><p>Everything is right here. A few small wins are enough.</p></div><span class="dc-total">'+done+' / '+tasks.length+' done</span></div>'+
 '<div class="dc-choice" role="group" aria-label="Choose daily learning time">'+[15,30,60].map(n=>'<button type="button" onclick="mncSetPlanTime('+n+')" class="'+(num===n?'selected':'')+'">'+(n===60?'Bonus 1 hour':n+' min')+'</button>').join('')+'</div>'+
 '<div class="dc-progress" role="progressbar" aria-valuemin="0" aria-valuemax="'+tasks.length+'" aria-valuenow="'+done+'"><span style="width:'+(100*done/tasks.length)+'%"></span></div>'+
 '<div class="dc-list">'+tasks.map(t=>rowHTML(t,p.checked)).join('')+'</div>'+
 (done===tasks.length?'<div class="dc-congrats">✨ You showed up for yourself today. Enjoy your free time!</div>':'<p class="dc-footer-note">No pressure to finish every box. Your completed steps are saved automatically.</p>')+
 resourceShelf()+'</section>'
}
window.mncCheckTask=function(id,on){
 if(!['spanish','business','wellness','future'].includes(id))return;
 const p=record(),a=p.checked;
 if(on&&!a.includes(id))a.push(id);
 if(!on){const i=a.indexOf(id);if(i>=0)a.splice(i,1)}
 save();drawPage();
};
window.mncSetPlanTime=function(n){
 if(![15,30,60].includes(n))return;
 record();state.dailyPlanMinutes=n;save();drawPage()
};
window.mncOpenTask=function(action,id){
 if(action==='business'){if(typeof window.businessSelect==='function'&&id){window.businessSelect(id)}else showPage('learn');return}
 if(action==='spanish')return showPage('spanish');
 if(action==='growth')return showPage('growth');
 if(action==='vision')return showPage('vision')
};
function placeChecklist(){
 if(currentPage!=='home')return;
 const parent=document.getElementById('page-home'),hero=parent?.querySelector('.hero');
 if(!hero)return;
 const quote=parent.querySelector('.positive-quote');
 if(quote){
  quote.querySelector('.mnc-photo-banner')?.remove();
  quote.classList.remove('mnc-has-photo');
  quote.classList.add('dc-top-quote');
  hero.insertAdjacentElement('afterend',quote)
 }
 const el=document.createElement('div');el.innerHTML=checklistHTML();
 const node=el.firstElementChild;
 if(quote)quote.insertAdjacentElement('afterend',node);else hero.insertAdjacentElement('afterend',node);
 const gallery=parent.querySelector('.positive-moodboard');
 if(gallery){
  const title=gallery.querySelector('.positive-heading h2');
  if(title)title.textContent='More daily travel inspiration 🌎';
 }
}
const before=window.drawPage;
window.drawPage=function(){before();placeChecklist()};
window.drawPage();
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&currentPage==='home')window.drawPage()});
})();