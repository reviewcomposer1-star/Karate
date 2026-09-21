const icon = (name, size=20) => {
    const paths = {
        heart:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
        arrow:'<polyline points="15 18 9 12 15 6"/>',
        play:'<polygon points="8 5 19 12 8 19 8 5"/>',
        speaker:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>'
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ''}</svg>`;
};

const esc = (value='') => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));

window.KarateRouter = {
    init() {
        window.addEventListener('hashchange', () => this.handleRoute());

        // app.js calls Router.init() after DOMContentLoaded has already fired.
        // Registering another DOMContentLoaded listener here would therefore
        // never run, leaving the splash/entry screen permanently visible.
        setTimeout(() => document.getElementById('splash-screen')?.classList.add('fade-out'), 650);
        setTimeout(() => document.getElementById('splash-screen')?.remove(), 1150);
        this.handleRoute();
    },
    handleRoute() {
        const hash = window.location.hash || '#home';
        const view = document.getElementById('router-view');
        const back = document.getElementById('back-btn');
        if (!view) return;

        document.querySelectorAll('.nav-item').forEach(item => {
            const route = item.dataset.route;
            item.classList.toggle('active', hash === `#${route}` || (route === 'basics' && hash.startsWith('#category/')));
        });

        let html;
        if (hash === '#home' || hash === '') { back?.classList.add('hidden'); html = this.renderHome(); }
        else if (hash === '#basics') { back?.classList.add('hidden'); html = this.renderBasics(); }
        else if (hash.startsWith('#category/')) { back?.classList.remove('hidden'); html = this.renderCategoryList(decodeURIComponent(hash.split('/')[1])); }
        else if (hash.startsWith('#technique/')) { back?.classList.remove('hidden'); html = this.renderTechniqueDetail(decodeURIComponent(hash.split('/')[1])); }
        else if (hash === '#kata') { back?.classList.add('hidden'); html = this.renderKata(); }
        else if (hash === '#kumite') { back?.classList.add('hidden'); html = this.renderKumite(); }
        else if (hash === '#favorites') { back?.classList.add('hidden'); html = this.renderFavorites(); }
        else { window.location.hash = '#home'; return; }

        view.classList.remove('route-enter');
        void view.offsetWidth;
        view.classList.add('route-enter');
        view.innerHTML = html;
        window.scrollTo(0, 0);
    },
    renderHome() {
        return `<section class="home-screen">
            <div class="home-hero">
                <span class="eyebrow">KEN RYU DU · BEGINNER COMPANION</span>
                <h1>Enter the <em>dojo.</em></h1>
                <p>Learn the language, movement and foundations of karate — offline, at your own pace.</p>
                <div class="hero-mark" aria-hidden="true"><span>空手</span></div>
            </div>
            <div class="home-section-head"><span>01</span><h2>Start here</h2></div>
            <div class="primary-grid">
                <a href="#basics" class="primary-card basics-card"><span class="card-index">01</span><span class="card-kanji">基本</span><div><h3>Basics</h3><p>Techniques & foundations</p></div><span class="card-arrow">↗</span></a>
                <a href="#kata" class="primary-card kata-card"><span class="card-index">02</span><span class="card-kanji">型</span><div><h3>Kata</h3><p>Forms & terminology</p></div><span class="card-arrow">↗</span></a>
                <a href="#kumite" class="primary-card kumite-card"><span class="card-index">03</span><span class="card-kanji">組手</span><div><h3>Kumite</h3><p>Sparring fundamentals</p></div><span class="card-arrow">↗</span></a>
            </div>
            <div class="home-note"><span class="note-dot"></span><span>Offline first · No account · No AI required</span></div>
        </section>`;
    },
    renderBasics() {
        const cats = Object.values(window.KarateData.categories);
        return `<section class="page-section"><div class="page-heading"><span class="eyebrow">基本 · FOUNDATIONS</span><h1>Basics</h1><p>Four core movement families. Tap a category to enter.</p></div><div class="category-grid">${cats.map((c,i)=>`<a href="#category/${c.id}" class="category-card category-${c.id}"><span class="category-number">0${i+1}</span><span class="category-kanji">${c.kanji}</span><div><h2>${c.name}</h2><p>${c.subtitle}</p></div><span class="card-arrow">↗</span></a>`).join('')}</div></section>`;
    },
    renderCategoryList(catId) {
        const cat = window.KarateData.categories[catId];
        if (!cat) return '<div class="empty-state"><strong>Category not found.</strong></div>';
        const techs = window.KarateData.allTechniques.filter(t => t.category === catId);
        return `<section class="page-section"><div class="page-heading compact"><span class="eyebrow">${cat.kanji} · ${esc(cat.subtitle)}</span><h1>${esc(cat.name)}</h1><p>${techs.length} reference techniques</p></div><div class="tech-list">${techs.map(t=>this.renderTechniqueRow(t)).join('')}</div></section>`;
    },
    renderTechniqueRow(t) {
        const fav = window.KarateFavorites.isFavorite(t.id);
        return `<div class="tech-item" onclick="window.location.hash='#technique/${encodeURIComponent(t.id)}'"><div class="thumb-wrap"><img src="${esc(t.media)}" class="tech-thumb" alt="${esc(t.englishName)}" loading="lazy"><span class="media-badge">${t.mediaType === 'gif' ? 'GIF' : 'IMG'}</span></div><div class="tech-meta"><strong>${esc(t.japaneseName)}</strong><small>${esc(t.englishName)}</small></div><button class="fav-toggle-btn ${fav?'active':''}" type="button" onclick="event.stopPropagation();window.toggleFav('${t.id}',this)" aria-label="${fav?'Remove from':'Add to'} favorites">${icon('heart',20)}</button></div>`;
    },
    renderTechniqueDetail(techId) {
        const t = window.KarateData.getTechnique(techId);
        if (!t) return '<div class="empty-state"><strong>Technique not found.</strong><p>The link may be outdated.</p></div>';
        const fav = window.KarateFavorites.isFavorite(t.id);
        const variants = t.mediaVariants || [];
        return `<section class="detail-view"><div class="detail-kicker"><span>${esc(window.KarateData.categories[t.category]?.name || t.category)}</span><span>·</span><span>${esc(t.englishName)}</span></div><div class="tech-title-row"><div><h1>${esc(t.japaneseName)}</h1><p>${esc(t.pronunciation)}</p></div><button class="fav-toggle-btn detail-fav ${fav?'active':''}" type="button" onclick="window.toggleFav('${t.id}',this)" aria-label="${fav?'Remove from':'Add to'} favorites">${icon('heart',23)}</button></div>
            <div class="hero-media-container"><img src="${esc(t.media)}" class="hero-media" alt="${esc(t.japaneseName)} demonstration" onerror="this.parentElement.innerHTML='<div class=\'media-error\'>Demonstration unavailable</div>'"></div>
            <div class="media-caption"><span>${t.mediaType === 'gif' ? 'Animated demonstration' : 'Reference image'}</span>${variants.length ? `<span>${variants.length+1} media views</span>`:''}</div>
            ${variants.length ? `<div class="media-variants">${variants.map((v,i)=>`<button type="button" onclick="this.closest('.detail-view').querySelector('.hero-media').src='${esc(v.src)}';this.closest('.media-variants').querySelectorAll('button').forEach(b=>b.classList.remove('active'));this.classList.add('active')" class="variant-btn ${i===0?'':' '}" aria-label="Show alternate media ${i+1}">View ${i+2}</button>`).join('')}</div>`:''}
            <div class="pronunciation-card"><div><span class="eyebrow">SENSEI</span><strong>Hear pronunciation</strong><small>${esc(t.pronunciation)}</small></div><button class="sound-btn" type="button" onclick="window.KarateAudio.speak('${esc(t.japaneseName).replace(/'/g,"\\'")}')" aria-label="Hear pronunciation">${icon('speaker',20)}</button></div>
            <div class="detail-section"><span class="section-index">01</span><h2>How to perform</h2><p>${esc(t.description)}</p></div>
            <div class="detail-section"><span class="section-index">02</span><h2>Tips</h2><ul>${t.tips.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
            <div class="detail-section"><span class="section-index">03</span><h2>Common mistakes</h2><ul>${t.commonMistakes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
            <div class="style-note">Mechanics can differ between karate styles. Use your sensei’s instruction when the details differ from this general reference.</div>
        </section>`;
    },
    renderKata() {
        const kata=window.KarateKata;
        return `<section class="page-section"><div class="page-heading"><span class="eyebrow">型 · FORMS</span><h1>Kata</h1><p>A beginner’s introduction to forms, terminology and counting.</p></div><div class="detail-section"><span class="section-index">01</span><h2>${esc(kata.introduction.title)}</h2>${kata.introduction.content.map(p=>`<p>${esc(p)}</p>`).join('')}</div><div class="detail-section"><span class="section-index">02</span><h2>Terminology</h2><div class="term-list">${kata.terminology.map(term=>`<div class="term-row"><div><strong>${esc(term.term)}</strong><small>${esc(term.meaning)}</small></div><button class="sound-btn mini" type="button" onclick="window.KarateAudio.speak('${esc(term.term).replace(/'/g,"\\'")}')">${icon('speaker',16)}</button></div>`).join('')}</div></div><div class="detail-section"><span class="section-index">03</span><h2>Counting · 1—10</h2><div class="counting-grid">${kata.counting.map(c=>`<button class="count-card" type="button" onclick="window.KarateAudio.speak('${c.jp}')"><span>${c.num}</span><strong>${c.jp}</strong><small>${c.pronunciation}</small></button>`).join('')}</div></div></section>`;
    },
    renderKumite() {
        const k=window.KarateKumite;
        return `<section class="page-section"><div class="page-heading"><span class="eyebrow">組手 · SPARRING</span><h1>Kumite</h1><p>General beginner overview — competition rules vary.</p></div><div class="tabs-header"><button class="tab-btn active" type="button" onclick="window.switchTab(event,'rules-tab')">Rules</button><button class="tab-btn" type="button" onclick="window.switchTab(event,'points-tab')">Points</button><button class="tab-btn" type="button" onclick="window.switchTab(event,'drills-tab')">Drills</button></div><div id="rules-tab" class="tab-content active"><p class="muted-intro">${esc(k.overview)}</p>${k.rules.map((r,i)=>`<div class="detail-section"><span class="section-index">0${i+1}</span><h2>${esc(r.title)}</h2><p>${esc(r.desc)}</p></div>`).join('')}</div><div id="points-tab" class="tab-content">${k.scoring.map((s,i)=>`<div class="detail-section"><span class="section-index">0${i+1}</span><h2>${esc(s.name)}</h2><p>${esc(s.desc)}</p></div>`).join('')}</div><div id="drills-tab" class="tab-content"><div class="empty-state"><div class="empty-icon">◎</div><strong>Drills coming soon.</strong><p>V1 keeps this section intentionally empty.</p></div></div></section>`;
    },
    renderFavorites() {
        const ids=window.KarateFavorites.getFavorites();
        const techs=window.KarateData.allTechniques.filter(t=>ids.includes(t.id));
        return `<section class="page-section"><div class="page-heading"><span class="eyebrow">SAVED · YOUR DOJO</span><h1>Favorites</h1><p>${techs.length ? `${techs.length} saved technique${techs.length===1?'':'s'}` : 'Keep the techniques you want close.'}</p></div>${techs.length ? `<div class="tech-list">${techs.map(t=>this.renderTechniqueRow(t)).join('')}</div>` : `<div class="empty-state"><div class="empty-icon">♡</div><strong>Your dojo is empty.</strong><p>Tap the heart on any technique to save it here.</p><a href="#basics" class="text-link">Explore basics →</a></div>`}</section>`;
    }
};
