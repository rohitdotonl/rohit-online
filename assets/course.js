/* The Product Design Course — shared behaviour for every guide.
   Everything is progressive: pages read fine without this script. */
(function(){
  var COURSE=[
    {f:'01-foundations.html',t:'Foundations',d:'What product design is, how designers think, and the process a solo creator can actually run.'},
    {f:'02-mind.html',t:'The Human Mind',d:'Perception, attention, memory, motivation, and the laws of UX that follow from them.'},
    {f:'03-problems.html',t:'Problems Worth Solving',d:'Jobs to be done, research without a team, scoping, positioning, onboarding and activation.'},
    {f:'04-interaction.html',t:'Structure & Interaction',d:'Information architecture, navigation, flows, states, forms, errors, undo and input.'},
    {f:'05-visual.html',t:'Visual Design',d:'Hierarchy, layout, grids, spacing, colour, icons, depth and density.'},
    {f:'06-typography.html',t:'Typography',d:'Typefaces, scales, measure, rhythm and every detail of text on screens.'},
    {f:'07-reading-writing.html',t:'Reading & Writing',d:'Designing calm tools for long-form reading and focused writing.'},
    {f:'08-motion.html',t:'Motion & Feel',d:'Animation, physics, timing, perceived speed, haptics and sound.'},
    {f:'09-words.html',t:'Words',d:'UX writing and content design: labels, errors, empty states, voice.'},
    {f:'10-accessibility.html',t:'Accessible & Inclusive',d:'Design for every body, every device, every language.'},
    {f:'11-data.html',t:'Information & Data',d:'Tufte, Victor and the craft of showing numbers, tables and dashboards.'},
    {f:'12-systems.html',t:'Systems & Platforms',d:'Design systems for one, tokens, components, and platform conventions.'},
    {f:'13-ai.html',t:'Designing with AI',d:'How to design products with AI features people trust and control.'},
    {f:'14-brand-launch.html',t:'Identity & Launch',d:'Names, icons, landing pages, pricing pages and the story of your product.'},
    {f:'15-testing.html',t:'Testing & Iteration',d:'Usability tests alone, heuristic reviews, self-critique, analytics and learning loops.'},
    {f:'16-ethics-calm.html',t:'Honest & Calm',d:'Dark patterns, attention, privacy, calm technology and longevity.'},
    {f:'17-practice.html',t:'The Solo Practice',d:'Workflow, taste, deliberate practice, a six-month plan and the capstone.'},
    {f:'18-breakdowns-objects.html',t:'Breakdowns: Objects',d:'Braun, MUJI, Kindle and other physical products, translated into software lessons.'},
    {f:'19-breakdowns-software.html',t:'Breakdowns: Software',d:'iA Writer, Things, Linear, Stripe, Raycast, Halide and more, decision by decision.'},
    {f:'20-breakdowns-reading.html',t:'Breakdowns: Reading',d:'Kindle, Kobo, Apple Books, Instapaper, Readwise Reader and other reader-first products.'},
    {f:'21-reference.html',t:'Reference Library',d:'Designers, glossary, master checklists, common mistakes and the reading list.'}
  ];
  window.PDC_COURSE=COURSE;
  var root=document.documentElement;
  function lsGet(k,d){try{var v=localStorage.getItem(k);return v===null?d:v;}catch(e){return d;}}
  function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
  var guideKey=(document.body&&document.body.dataset.guide)||(location.pathname.split('/').pop()||'index.html').replace('.html','');
  var page=guideKey+'.html';

  /* Theme */
  function setTheme(t){
    if(t==='auto'){root.removeAttribute('data-theme');}else{root.setAttribute('data-theme',t);}
    document.querySelectorAll('[data-theme-set]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.themeSet===t));});
    lsSet('pdc-theme',t);
  }

  /* Build rail + mobile nav from parts and chapters */
  function buildNav(){
    var rail=document.querySelector('nav.rail');
    var mob=document.querySelector('details.mobile-nav');
    var items=[];
    document.querySelectorAll('main .part, main .chapter, main [data-toc]').forEach(function(el){
      if(!el.id) return;
      if(el.classList.contains('part')){
        var h=el.querySelector('h2'); items.push({group:true,id:el.id,text:(el.dataset.toc||(h?h.textContent:'')).trim()});
      } else {
        var n=el.querySelector('.ch-head .num'); var h2=el.querySelector('h2');
        items.push({id:el.id,num:n?n.textContent.trim():'',text:(el.dataset.toc||(h2?h2.textContent:el.id)).trim()});
      }
    });
    var title=document.querySelector('.opening h1');
    var cur=COURSE.findIndex(function(c){return c.f===page;});
    if(rail){
      var h='<div class="brand"><span class="dot"></span>'+(cur>=0?('Guide '+(cur+1)+' · '+COURSE[cur].t):(document.title||''))+'</div>';
      if(guideKey!=='index') h+='<a class="home" href="index.html">← Course hub</a>';
      if(guideKey!=='index') h+='<div class="prog" aria-hidden="true"><i></i></div><div class="progtxt" data-progtxt></div>';
      var open=false;
      items.forEach(function(it){
        if(it.group){ if(open) h+='</ol>'; h+='<h4><a href="#'+it.id+'" style="text-decoration:none;color:inherit">'+esc(it.text)+'</a></h4><ol>'; open=true; }
        else { if(!open){h+='<ol>';open=true;} h+='<li'+(it.num?'':' class="plain"')+'><a href="#'+it.id+'" data-nav="'+it.id+'">'+(it.num?'<span class="n">'+esc(it.num)+'</span>':'')+'<span>'+esc(it.text)+'<span class="tick" data-tick="'+it.id+'"></span></span></a></li>'; }
      });
      if(open) h+='</ol>';
      h+='<div class="theme" role="group" aria-label="Theme"><button type="button" data-theme-set="auto">Auto</button><button type="button" data-theme-set="light">Light</button><button type="button" data-theme-set="dark">Dark</button></div>';
      rail.innerHTML=h;
    }
    if(mob){
      var m='<summary><span class="dot"></span>Contents <span class="cur" data-mobcur></span></summary><ol><li><a href="index.html">← Course hub</a></li>';
      items.forEach(function(it){ m+='<li><a href="#'+it.id+'"'+(it.group?' style="font-weight:600;color:var(--ink)"':'')+'>'+(it.num?it.num+' · ':'')+esc(it.text)+'</a></li>'; });
      m+='</ol>'; mob.innerHTML=m;
      mob.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mob.open=false;});});
    }
    /* active section */
    var links={}; document.querySelectorAll('[data-nav]').forEach(function(a){links[a.dataset.nav]=a;});
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){
        Object.keys(links).forEach(function(k){links[k].classList.toggle('active',k===e.target.id);});
        var mc=document.querySelector('[data-mobcur]'); var h2=e.target.querySelector('h2'); if(mc&&h2) mc.textContent=h2.textContent;
      }});},{rootMargin:'-20% 0px -70% 0px'});
      document.querySelectorAll('main .chapter[id]').forEach(function(c){io.observe(c);});
    }
    /* course bar + guide nav */
    if(cur>=0){
      var op=document.querySelector('.opening');
      if(op && !op.querySelector('.coursebar')){
        var cb=document.createElement('div'); cb.className='coursebar';
        cb.innerHTML='<a href="index.html">The Product Design Course</a><span class="sep">/</span><span>Guide '+(cur+1)+' of '+COURSE.length+'</span>';
        op.insertBefore(cb,op.firstChild);
      }
      var main=document.querySelector('main');
      if(main && !document.querySelector('.guide-nav')){
        var gn=document.createElement('nav'); gn.className='guide-nav'; gn.setAttribute('aria-label','Guides');
        var p=COURSE[cur-1], n=COURSE[cur+1];
        gn.innerHTML=(p?'<a href="'+p.f+'"><small>← Previous guide</small>'+esc(p.t)+'</a>':'<a href="index.html"><small>← Back to</small>Course hub</a>')+
                     (n?'<a class="next" href="'+n.f+'"><small>Next guide →</small>'+esc(n.t)+'</a>':'<a class="next" href="index.html"><small>Back to →</small>Course hub</a>');
        var foot=main.querySelector('footer'); if(foot) main.insertBefore(gn,foot); else main.appendChild(gn);
      }
    }
  }
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

  /* Chapter completion */
  function doneKey(){return 'pdc-done-'+guideKey;}
  function getDone(){try{return JSON.parse(lsGet(doneKey(),'{}'))||{};}catch(e){return {};}}
  function refreshProgress(){
    var done=getDone(); var chs=document.querySelectorAll('main .chapter[id]'); var c=0;
    chs.forEach(function(ch){ var d=!!done[ch.id]; if(d)c++;
      var b=ch.querySelector('.done-btn'); if(b){b.setAttribute('aria-pressed',String(d)); b.textContent=d?'✓ Completed':'Mark chapter complete';}
      var t=document.querySelector('[data-tick="'+ch.id+'"]'); if(t)t.textContent=d?' ✓':'';
    });
    var bar=document.querySelector('.rail .prog i'); if(bar) bar.style.width=(chs.length?Math.round(100*c/chs.length):0)+'%';
    var tx=document.querySelector('[data-progtxt]'); if(tx) tx.textContent=c+' of '+chs.length+' chapters complete';
    lsSet('pdc-summary-'+guideKey, JSON.stringify({done:c,total:chs.length}));
  }
  function addDoneButtons(){
    if(guideKey==='index') return;
    document.querySelectorAll('main .chapter[id]').forEach(function(ch){
      if(ch.querySelector('.done-row')) return;
      var r=document.createElement('div'); r.className='done-row';
      r.innerHTML='<button type="button" class="done-btn" aria-pressed="false">Mark chapter complete</button><span>Saved in this browser.</span>';
      ch.appendChild(r);
      r.querySelector('button').addEventListener('click',function(){var d=getDone(); d[ch.id]=!d[ch.id]; lsSet(doneKey(),JSON.stringify(d)); refreshProgress();});
    });
    refreshProgress();
  }

  /* Without / With demos (also any [data-demo] with .seg buttons) */
  function demos(){
    document.querySelectorAll('[data-demo]').forEach(function(d){
      var btns=d.querySelectorAll('.seg button');
      btns.forEach(function(b){b.addEventListener('click',function(){
        var s=b.dataset.show;
        btns.forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});
        d.querySelectorAll('[data-pane]').forEach(function(p){p.hidden=p.dataset.pane!==s;});
        d.querySelectorAll('[data-cap]').forEach(function(p){p.hidden=p.dataset.cap!==s;});
        d.dispatchEvent(new CustomEvent('demo:change',{detail:s}));
      });});
    });
  }

  /* Quizzes: <div class="quiz" data-answer="b"> ... <button data-opt="a"> ... <div class="explain" hidden> */
  function quizzes(){
    document.querySelectorAll('.quiz').forEach(function(q){
      var ans=q.dataset.answer; var ex=q.querySelector('.explain');
      q.querySelectorAll('[data-opt]').forEach(function(b){ b.type='button'; b.addEventListener('click',function(){
        q.querySelectorAll('[data-opt]').forEach(function(x){x.classList.remove('right','wrong');});
        var ok=b.dataset.opt===ans; b.classList.add(ok?'right':'wrong');
        if(!ok){var r=q.querySelector('[data-opt="'+ans+'"]'); if(r) r.classList.add('right');}
        if(ex){ex.hidden=false; var lead=ex.querySelector('.verdict'); if(!lead){lead=document.createElement('b');lead.className='verdict';ex.insertBefore(lead,ex.firstChild);} lead.textContent=ok?'Right. ':'Not quite. ';}
      });});
    });
  }

  /* Persistent checklists: <div class="cklist" data-key="unique"> <label><input type=checkbox><span>..</span></label> */
  function checklists(){
    document.querySelectorAll('.cklist').forEach(function(c,ix){
      var key='pdc-ck-'+guideKey+'-'+(c.dataset.key||ix);
      var boxes=c.querySelectorAll('input[type=checkbox]');
      var st={}; try{st=JSON.parse(lsGet(key,'{}'))||{};}catch(e){}
      var count=c.querySelector('.ck-count');
      function upd(){var n=0;boxes.forEach(function(b){if(b.checked)n++;}); if(count) count.textContent=n+' / '+boxes.length;}
      boxes.forEach(function(b,i){ b.checked=!!st[i]; b.addEventListener('change',function(){st[i]=b.checked; lsSet(key,JSON.stringify(st)); upd();}); });
      var rs=c.querySelector('[data-reset]'); if(rs) rs.addEventListener('click',function(){boxes.forEach(function(b){b.checked=false;}); st={}; lsSet(key,'{}'); upd();});
      upd();
    });
  }

  /* Tabs: <div class="tabs"><div role="tablist"><button role="tab" data-tab="x"> ... <div role="tabpanel" data-panel="x"> */
  function tabs(){
    document.querySelectorAll('.tabs').forEach(function(t){
      var bs=t.querySelectorAll('[role=tab]');
      function show(k){bs.forEach(function(b){b.setAttribute('aria-selected',String(b.dataset.tab===k));}); t.querySelectorAll('[role=tabpanel]').forEach(function(p){p.hidden=p.dataset.panel!==k;});}
      bs.forEach(function(b){b.type='button';b.addEventListener('click',function(){show(b.dataset.tab);});});
      if(bs[0]) show((t.querySelector('[role=tab][aria-selected=true]')||bs[0]).dataset.tab);
    });
  }

  function init(){
    buildNav();
    setTheme(lsGet('pdc-theme','auto'));
    document.querySelectorAll('[data-theme-set]').forEach(function(b){b.addEventListener('click',function(){setTheme(b.dataset.themeSet);});});
    demos(); quizzes(); checklists(); tabs(); addDoneButtons();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
