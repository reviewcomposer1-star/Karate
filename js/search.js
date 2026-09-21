window.KarateSearch = {
    init() {
        const toggleBtn = document.getElementById('search-toggle-btn');
        const closeBtn = document.getElementById('search-close-btn');
        const modal = document.getElementById('search-modal');
        const input = document.getElementById('search-input');
        const resultsContainer = document.getElementById('search-results');
        if (!toggleBtn || !closeBtn || !modal || !input || !resultsContainer) return;

        const close = () => {
            modal.classList.add('hidden');
            input.value = '';
            resultsContainer.innerHTML = '<div class="search-empty-prompt">Search kicks, punches, blocks or stances…</div>';
        };

        toggleBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            requestAnimationFrame(() => input.focus());
        });
        closeBtn.addEventListener('click', close);
        modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });

        input.addEventListener('input', (event) => {
            const query = event.target.value.trim().toLowerCase();
            if (!query) {
                resultsContainer.innerHTML = '<div class="search-empty-prompt">Search kicks, punches, blocks or stances…</div>';
                return;
            }
            const terms = query.split(/\s+/).filter(Boolean);
            const matches = window.KarateData.allTechniques.filter((technique) => {
                const haystack = [
                    technique.japaneseName,
                    technique.englishName,
                    technique.category,
                    technique.pronunciation,
                    technique.description,
                    ...(technique.aliases || [])
                ].join(' ').toLowerCase();
                return terms.every(term => haystack.includes(term));
            });

            if (!matches.length) {
                resultsContainer.innerHTML = '<div class="search-empty-prompt"><strong>No techniques found.</strong><br>Try a Japanese or English name.</div>';
                return;
            }

            resultsContainer.innerHTML = matches.map(t => `
                <button class="tech-item search-result" type="button" onclick="window.KarateSearch.selectResult('${t.id}')">
                    <img src="${t.media}" class="tech-thumb" alt="${t.englishName}" loading="lazy">
                    <span class="tech-meta"><strong>${t.japaneseName}</strong><small>${t.englishName} · ${t.category.toUpperCase()}</small></span>
                    <span class="result-arrow" aria-hidden="true">›</span>
                </button>
            `).join('');
        });
    },
    selectResult(id) {
        document.getElementById('search-modal')?.classList.add('hidden');
        document.getElementById('search-input').value = '';
        window.location.hash = `#technique/${encodeURIComponent(id)}`;
    }
};
