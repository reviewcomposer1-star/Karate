window.KarateInstall = {
    deferredPrompt: null,
    gate: null,

    isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    },

    isIOS() {
        return /iphone|ipad|ipod/i.test(navigator.userAgent);
    },

    createGate() {
        if (this.gate || this.isStandalone()) return;

        const gate = document.createElement('div');
        gate.id = 'install-gate';
        gate.className = 'install-gate hidden';
        gate.innerHTML = `
            <div class="install-gate-card" role="dialog" aria-modal="true" aria-labelledby="install-gate-title">
                <div class="install-gate-mark">空手</div>
                <span class="eyebrow">YOUR DOJO, ALWAYS WITH YOU</span>
                <h2 id="install-gate-title">Install KARATE?</h2>
                <p>Get the full dojo experience on your phone, with offline access to your karate techniques.</p>
                <div class="install-gate-actions">
                    <button id="install-gate-primary" class="install-gate-primary" type="button">Install &amp; Enter</button>
                    <button id="install-gate-later" class="install-gate-later" type="button">Continue in Browser</button>
                </div>
                <small class="install-gate-note">No account. No subscription. Works offline.</small>
            </div>`;
        document.body.appendChild(gate);
        this.gate = gate;

        gate.querySelector('#install-gate-later').addEventListener('click', () => this.closeGate());
        gate.querySelector('#install-gate-primary').addEventListener('click', () => this.installFromGate());
    },

    showGate() {
        if (this.isStandalone()) return;
        if (localStorage.getItem('karate_install_gate_seen_v1') === '1') return;
        this.createGate();
        this.gate?.classList.remove('hidden');
    },

    closeGate() {
        try { localStorage.setItem('karate_install_gate_seen_v1', '1'); } catch {}
        this.gate?.classList.add('hidden');
        window.location.hash = '#home';
    },

    async installFromGate() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const result = await this.deferredPrompt.userChoice;
            this.deferredPrompt = null;
            if (result?.outcome === 'accepted') {
                try { localStorage.setItem('karate_install_gate_seen_v1', '1'); } catch {}
                this.gate?.classList.add('hidden');
                window.location.hash = '#home';
            }
            return;
        }

        if (this.isIOS()) {
            alert('On iPhone/iPad: tap the Share button in Safari, choose “Add to Home Screen”, then tap Add.');
            return;
        }

        alert('Your browser is not showing the install option yet. Use the browser menu and choose “Install app” or “Add to Home screen”.');
    },

    init() {
        const installBtn = document.getElementById('install-btn');
        if (this.isStandalone()) {
            installBtn?.classList.add('hidden');
            return;
        }

        this.createGate();

        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            this.deferredPrompt = event;
            if (installBtn) {
                installBtn.classList.remove('hidden');
                installBtn.querySelector('span').textContent = 'Install App';
            }
        });

        installBtn?.addEventListener('click', () => this.installFromGate());

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            installBtn?.classList.add('hidden');
            this.gate?.classList.add('hidden');
            try { localStorage.setItem('karate_install_gate_seen_v1', '1'); } catch {}
        });

        // Let the splash finish first, then ask once on the first browser visit.
        setTimeout(() => this.showGate(), 1200);
    }
};
