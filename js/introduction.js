window.KarateIntroductionUI = {
    icon(name, size=18) {
        const paths = {
            arrow:'<polyline points="15 18 9 12 15 6"/>',
            speaker:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>'
        };
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name]||''}</svg>`;
    },
    esc(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));},
    speak(text){window.KarateAudio.speak(text);},
    home(){
        const e=this.esc;
        return `<section class="page-section intro-home"><div class="page-heading"><span class="eyebrow">空手 · BEGIN HERE</span><h1>Introduction</h1><p>A compact orientation to the language, history, culture and ideas behind your training.</p></div><div class="intro-grid">${window.KarateIntroduction.sections.map(s=>`<a href="#introduction/${s.id}" class="intro-card"><span class="intro-number">${s.number}</span><span class="intro-kanji">${e(s.kanji)}</span><div><h2>${e(s.title)}</h2><p>${e(s.subtitle)}</p></div><span class="card-arrow">↗</span></a>`).join('')}</div></section>`;
    },
    section(id){
        const s=window.KarateIntroduction.sections.find(x=>x.id===id),e=this.esc;
        if(!s)return '<div class="empty-state"><strong>Introduction section not found.</strong></div>';
        let body='';
        if(id==='what-is-karate') body=`<div class="intro-lead">${e(s.intro)}</div><div class="intro-pillars">${s.pillars.map((x,i)=>`<article class="intro-info-card"><span class="section-index">0${i+1}</span><h2>${e(x[0])}</h2><p>${e(x[1])}</p></article>`).join('')}</div>`;
        if(id==='history') body=`<div class="intro-lead">${e(s.intro)}</div><div class="intro-timeline">${s.timeline.map((x,i)=>`<article><span class="timeline-dot">${String(i+1).padStart(2,'0')}</span><div><h2>${e(x[0])}</h2><p>${e(x[1])}</p></div></article>`).join('')}</div><div class="intro-note">${e(s.note)}</div>`;
        if(id==='styles') body=`<div class="intro-lead">${e(s.intro)}</div><div class="style-grid">${s.styles.map(x=>`<article class="style-card"><span>${e(x[0])}</span><h2>${e(x[1])}</h2><p>${e(x[2])}</p></article>`).join('')}</div>`;
        if(id==='commands') body=`<div class="intro-lead">Tap the speaker to hear each term. Browser speech voices vary by device.</div><div class="command-list">${s.commands.map(x=>`<div class="command-row"><div><strong>${e(x[0])}</strong><small>${e(x[1])}</small></div><button class="sound-btn mini" type="button" onclick="window.KarateIntroductionUI.speak('${e(x[2]).replace(/'/g,"\\'")}')" aria-label="Hear ${e(x[0])}">${this.icon('speaker',16)}</button></div>`).join('')}</div><div class="detail-section intro-count-section"><span class="section-index">02</span><h2>Counting · 1—10</h2><div class="intro-counting-grid">${s.counting.map(x=>`<button class="intro-count-card" type="button" onclick="window.KarateIntroductionUI.speak('${e(x[1]).replace(/'/g,"\\'")}')"><span>${e(x[0])}</span><strong>${e(x[1])}</strong><small>${e(x[2])}</small><i>${this.icon('speaker',14)}</i></button>`).join('')}</div></div>`;
        if(id==='rules') body=`<div class="rule-list">${s.rules.map((x,i)=>`<article class="intro-info-card"><span class="section-index">0${i+1}</span><h2>${e(x[0])}</h2><p>${e(x[1])}</p></article>`).join('')}</div>`;
        if(id==='secrets') body=`<div class="intro-lead">${e(s.intro)}</div><div class="mechanics-grid">${s.mechanics.map((x,i)=>`<article class="mechanic-card"><span>${String(i+1).padStart(2,'0')}</span><h2>${e(x[0])}</h2><p>${e(x[1])}</p></article>`).join('')}</div>`;
        if(id==='belts') body=`<div class="belt-list">${s.belts.map((x,i)=>`<article class="belt-row"><span class="belt-index">0${i+1}</span><div class="belt-swatch belt-${x[0].toLowerCase().replace(/ /g,'-')}"></div><div><strong>${e(x[0])}</strong><small>${e(x[1])}</small><p>${e(x[2])}</p></div></article>`).join('')}</div><div class="detail-section"><span class="section-index">08</span><h2>Why progression gets harder</h2><div class="difficulty-list">${s.difficulty.map((x,i)=>`<div><span>${i+1}</span><p>${e(x)}</p></div>`).join('')}</div></div><div class="intro-note">${e(s.note)}</div>`;
        return `<section class="page-section intro-detail"><a class="intro-back-link" href="#introduction">← All introduction topics</a><div class="page-heading"><span class="eyebrow">${e(s.kanji)} · ${e(s.number)}</span><h1>${e(s.title)}</h1><p>${e(s.subtitle)}</p></div>${body}</section>`;
    }
};