window.toggleFav = function (id, button) {
    const active = window.KarateFavorites.toggle(id);
    if (button) {
        button.classList.toggle('active', active);
        const icon = button.querySelector('svg');
        if (icon) icon.setAttribute('fill', active ? 'currentColor' : 'none');
    }
    if (window.location.hash === '#favorites') window.KarateRouter.handleRoute();
};

window.switchTab = function (event, tabId) {
    const button = event.currentTarget;
    const header = button.closest('.tabs-header');
    const wrapper = header?.parentElement;
    header?.querySelectorAll('.tab-btn').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    wrapper?.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabId)?.classList.add('active');
};

document.addEventListener('DOMContentLoaded', () => {
    window.KarateSearch.init();
    window.KarateInstall.init();
    window.KarateRouter.init();

    document.getElementById('back-btn')?.addEventListener('click', () => {
        if (window.history.length > 1) window.history.back();
        else window.location.hash = '#home';
    });

    window.addEventListener('karate:install-help', () => {
        alert('On iPhone/iPad: open the browser Share menu, choose “Add to Home Screen”, then tap Add.');
    });
});
