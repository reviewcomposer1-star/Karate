if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
            const activateWaiting = () => registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
            activateWaiting();
            registration.addEventListener('updatefound', () => {
                const worker = registration.installing;
                if (!worker) return;
                worker.addEventListener('statechange', () => {
                    if (worker.state === 'installed' && navigator.serviceWorker.controller) activateWaiting();
                });
            });
            window.addEventListener('online', () => registration.update().catch(() => {}));
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!window.__karateRefreshing) {
                    window.__karateRefreshing = true;
                    window.location.reload();
                }
            });
        } catch (error) {
            console.warn('Service Worker registration failed:', error);
        }
    });
}
