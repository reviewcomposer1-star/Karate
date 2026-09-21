window.KarateInstall = {
    deferredPrompt: null,
    init() {
        const installBtn = document.getElementById('install-btn');
        if (!installBtn) return;

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        if (isStandalone) {
            installBtn.classList.add('hidden');
            return;
        }

        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            this.deferredPrompt = event;
            installBtn.classList.remove('hidden');
            installBtn.querySelector('span').textContent = 'Install App';
        });

        installBtn.addEventListener('click', async () => {
            if (!this.deferredPrompt) {
                if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
                    window.dispatchEvent(new CustomEvent('karate:install-help', { detail: 'ios' }));
                }
                return;
            }
            this.deferredPrompt.prompt();
            await this.deferredPrompt.userChoice;
            this.deferredPrompt = null;
            installBtn.classList.add('hidden');
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            installBtn.classList.add('hidden');
        });
    }
};
