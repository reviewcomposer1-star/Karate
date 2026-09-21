window.KarateFavorites = {
    STORAGE_KEY: 'karate_favorites_v2',
    getFavorites() {
        try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || []; } catch { return []; }
    },
    isFavorite(id) { return this.getFavorites().includes(id); },
    toggle(id) {
        const favorites = this.getFavorites();
        const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
        try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(next)); } catch {}
        return next.includes(id);
    }
};
