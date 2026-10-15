(function(){
'use strict';
/* Spanish vocabulary mastery. Uses existing state/save(), lesson content and device TTS. */
let answerVisible=false;
const reviewDays=[3,7,14,30,60];
function wordId(lessonIndex,wordIndex){
 const item=spanish[lessonIndex]?.words[wordIndex];
 return item?item[0].trim().normalize('NFC').toLocaleLowerCase('es'):'';
}
function progress(){
 if(!state.spanishVocabulary||typeof state.spanishVocabulary!=='object'||Array.isArray(state.spanishVocabulary))state.spanishVocabulary={};
 return state.spanishVocabulary;
}
function learned(lessonIndex,wordIndex){return !!progress()[wordId(lessonIndex,wordIndex)]}
function vocabularySize(){return new Set(spanish.flatMap(l=>l.words.map(w=>w[0].trim().normalize('NFC').toLocaleLowerCase('es')))).size}
function unknownIndices(lessonIndex){return spanish[lessonIndex]?.words.map((w,i)=>i).filter(i=>!learned(lessonIndex,i))||[]}
function addDays(iso,days){
 let d=new Date(iso+'T12:00:00Z');
 if(Number.isNaN(d.getTime()))d=new Date();
 d.setUTCDate(d.getUTCDate()+days);
 return d.toISOString().slice(0,10);
}
function reviewList(){
 const records=progress(),list=[],seen=new Set();
 spanish.forEach((lesson,li)=>lesson.words.forEach((word,wi)=>{
  const key=wordId(li,wi),record=records[key];
  if(!record||seen.has(key)||!record.nextReview||record.nextReview>dayKey())return;
  seen.add(key);list.push({key,li,wi,word,record})
 }));
 return list.sort((a,b)=>a.record.nextReview.localeCompare(b.record.nextReview)||a.key.localeCompare(b.key))
}
function currentLesson(){return Math.max(0,Math.min(spanish.length-1,Number(state.spanishIndex)||0))}
function positionToUnknown(){
 const li=currentLesson(),possible=unknownIndices(li);
 if(!possible.length)return;
 const old=Number(state.spanishQuiz?.flashIndex)||0;
 if(!possible.includes(old)){
  state.spanishQuiz.flashIndex=possible[0];
  flashFlip=false;
 }
}
function nextIndex(direction){
 const li=currentLesson(),pool=unknownIndices(li);
 if(!pool.length){toast('All words in this lesson are marked learned!');return}
 const current=Number(state.spanishQuiz?.flashIndex)||0,idx=pool.indexOf(current);
 const at=idx<0?0:(idx+direction+pool.length)%pool.length;
 state.spanishQuiz.flashIndex=pool[at];flashFlip=false;save();drawPage()
}
window.nextFlash=()=>nextIndex(1);
window.prevFlash=()=>nextIndex(-1);
window.mncSetSpanishLearned=function(li,wi,isLearned){
 if(!spanish[li]?.words[wi])return;
 let store=progress(),key=wordId(li,wi);
 if(isLearned){
  store[key]={learnedAt:dayKey(),nextReview:addDays(dayKey(),3),stage:0,reviewCount:0}
 }else delete store[key];
 answerVisible=false;
 positionToUnknown();save();drawPage();
 toast(isLearned?'Added to learned words! Review in a few days. ✓':'Moved back into new words')
};
window.mncNextSpanishLesson=function(){
 const here=currentLesson();
 for(let step=1;step<=spanish.length;step++){
  const i=(here+step)%spanish.length;
  if(unknownIndices(i).length){state.spanishIndex=i;state.spanishQuiz.flashIndex=unknownIndices(i)[0];flashFlip=false;save();drawPage();return}
 }
 toast('All course words are marked learned! Try a refresher instead. 🎉')
};
window.mncPlayFresh=function(li){
 const fresh=unknownIndices(li);
 if(!fresh.length){toast('All words learned! Try a refresher.');return}
 playSpanishTexts(fresh.map(i=>spanish[li].words[i][0]))
};
window.mncRevealReview=function(){answerVisible=true;drawPage()};
window.mncFinishReview=function(key,remembered){
 const item=reviewList().find(x=>x.key===key);
 if(!item)return;
 const r=progress()[key];
 if(remembered){
  r.stage=Math.min((r.stage||0)+1,reviewDays.length-1);
  r.nextReview=addDays(dayKey(),reviewDays[r.stage])
 }else r.nextReview=addDays(dayKey(),1);
 r.reviewCount=(r.reviewCount||0)+1;
 r.lastReview=dayKey();answerVisible=false;save();drawPage();
 toast(remembered?'Great! We’ll revisit this word later. ✨':'No problem — we’ll practise it again tomorrow.')
};
window.mncHearReview=function(li,wi){speakSpanishWord(li,wi)};
function reviewBlock(){
 const due=reviewList(),item=due[0];
 let html='<section class="sv-review"><div class="sv-review-heading"><div><span class="eyebrow muted">QUICK REFRESHER</span><h3>Words worth revisiting 🔁</h3><p>Words you learned return after a few days, then less often as you remember them.</p></div><span class="sv-due">'+due.length+' due</span></div>';
 if(item){
  html+='<div class="sv-review-card"><span class="eyebrow muted">CAN YOU REMEMBER THIS?</span><strong>'+esc(item.word[0])+'</strong>'+
  '<button class="sv-hear" onclick="mncHearReview('+item.li+','+item.wi+')">🔊 Listen</button>'+
  (answerVisible?'<p class="sv-answer">Translation: <strong>'+esc(item.word[1])+'</strong></p><div class="sv-review-actions">'+
   '<button class="sv-review-no" onclick="mncFinishReview(\''+item.key+'\',false)">Practice again tomorrow</button>'+
   '<button class="sv-review-yes" onclick="mncFinishReview(\''+item.key+'\',true)">✓ I remembered</button></div>':
   '<button class="sv-review-reveal" onclick="mncRevealReview()">Show translation →</button>')+'</div>'
 }else html+='<div class="sv-all-clear">✨ No words due for review today. Keep learning new ones!</div>';
 return html+'</section>'
}
function addProgressAndMastery(parent){
 const li=currentLesson(),fresh=unknownIndices(li),l=spanish[li],total=vocabularySize();
 const learnedCount=Object.keys(progress()).filter(k=>spanish.some(x=>x.words.some(w=>w[0].trim().normalize('NFC').toLocaleLowerCase('es')===k))).length;
 const metrics=parent.querySelectorAll('.card.metric');
 if(metrics[1]){
  let heading=metrics[1].querySelector('.eyebrow'),num=metrics[1].querySelector('.num'),hint=metrics[1].querySelector('small');
  if(heading)heading.textContent='Words learned';
  if(num)num.textContent=learnedCount+' / '+total;
  if(hint)hint.textContent='Checked off and saved';
 }
 const card=parent.querySelector('.flashcard');
 if(card){
  const nav=card.nextElementSibling;
  if(fresh.length){
   const current=Number(state.spanishQuiz.flashIndex)||0,selected=fresh.includes(current)?current:fresh[0];
   const div=document.createElement('div');
   div.className='sv-mark-current';
   div.innerHTML='<span>Learning <strong>'+fresh.length+'</strong> new '+(fresh.length===1?'word':'words')+' in this lesson</span>'+
     '<button onclick="mncSetSpanishLearned('+li+','+selected+',true)">✓ I know this word</button>';
   if(nav)nav.insertAdjacentElement('afterend',div);else card.insertAdjacentElement('afterend',div);
   if(nav){const small=nav.querySelector('.small');if(small)small.textContent=(fresh.indexOf(selected)+1)+' / '+fresh.length+' new'}
  }else{
   card.style.display='none';
   if(nav)nav.style.display='none';
   const cleared=document.createElement('div');cleared.className='sv-cleared';
   cleared.innerHTML='<strong>🎉 All five words marked learned!</strong><p>They won’t keep showing as new flashcards. You’ll see them again only in occasional reviews.</p><button class="btn sage" onclick="mncNextSpanishLesson()">Find new words →</button>';
   if(nav)nav.insertAdjacentElement('afterend',cleared);else card.insertAdjacentElement('afterend',cleared);
   const quizCard=[...parent.querySelectorAll('.card')].find(c=>c.querySelector('.eyebrow')?.textContent.trim()==='CHECK YOUR MEMORY');
   if(quizCard)quizCard.style.display='none'
  }
 }
 const pronounce=[...parent.querySelectorAll('.card')].find(c=>c.textContent.includes('Listen to every word'));
 if(pronounce){
  let rows=[...pronounce.querySelectorAll('.spanish-word-row')];
  const container=pronounce.querySelector('.spanish-word-list');
  const mastered=[];
  rows.forEach((row,wi)=>{
   const known=learned(li,wi),buttons=row.querySelectorAll('button'),existing=buttons[0];
   const button=document.createElement('button');
   button.type='button';button.className=known?'sv-unlearn':'sv-learn';
   button.textContent=known?'↩ Learn again':'✓ Learned';
   button.onclick=()=>window.mncSetSpanishLearned(li,wi,!known);
   if(existing)existing.insertAdjacentElement('afterend',button);
   else row.appendChild(button);
   row.classList.add('sv-vocabulary-row');
   if(known){mastered.push(row);row.remove()}
  });
  if(mastered.length){
   const details=document.createElement('details');details.className='sv-mastered';
   const summary=document.createElement('summary');
   summary.textContent='✓ '+mastered.length+' learned '+(mastered.length===1?'word':'words')+' (tap to view)';
   details.append(summary,...mastered);
   container.insertAdjacentElement('afterend',details)
  }
  if(!fresh.length){
   const p=document.createElement('p');p.className='sv-all-clear';p.textContent='All the words in this lesson are learned. Pick another lesson or try a refresher!';
   container.appendChild(p)
  }
  const all=pronounce.querySelector('.spanish-audio-actions button');
  if(all){
   all.textContent='▶ Listen to '+fresh.length+' new '+(fresh.length===1?'word':'words');
   all.setAttribute('onclick','mncPlayFresh('+li+')');
   all.disabled=fresh.length===0
  }
  const desc=[...pronounce.querySelectorAll('.small,.muted')].find(x=>x.textContent.includes('Replay it as often'));
  if(desc)desc.textContent='Check off words once you know them. Learned words are tucked away below and return for occasional refreshers.'
 }
 const bubble=[...parent.querySelectorAll('.capsule')].find(x=>x.textContent.includes('new words'));
 if(bubble)bubble.textContent=fresh.length+' new left';
 const intro=parent.querySelector('.intro');if(intro){
  const bar=document.createElement('div');bar.className='sv-progress';
  const pct=Math.round(learnedCount/Math.max(1,total)*100);
  bar.innerHTML='<div class="sv-progress-top"><strong>📚 Your Spanish word collection</strong><span>'+pct+'% learned</span></div>'+
   '<div class="sv-track"><span style="width:'+pct+'%"></span></div><small>Words stay checked off unless you choose “Learn again.”</small>';
  intro.insertAdjacentElement('afterend',bar);
  bar.insertAdjacentHTML('afterend',reviewBlock())
 }
}
const originalDraw=window.drawPage;
window.drawPage=function(){
 if(currentPage==='spanish')positionToUnknown();
 originalDraw();
 if(currentPage==='spanish'){
  const page=document.getElementById('page-spanish');
  if(page)addProgressAndMastery(page)
 }
 if(currentPage==='home'){
  const metrics=document.querySelectorAll('#page-home .card.metric');
  if(metrics[1]){
   const unique=vocabularySize(),known=Object.keys(progress()).length;
   const label=metrics[1].querySelector('.eyebrow'),value=metrics[1].querySelector('.num'),small=metrics[1].querySelector('small');
   if(label)label.textContent='Spanish words learned';
   if(value)value.textContent=known+' / '+unique;
   if(small)small.textContent=reviewList().length?reviewList().length+' refreshers waiting':'Keep adding new words';
  }
 }
};
window.drawPage();
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&currentPage==='spanish')window.drawPage()});
})();