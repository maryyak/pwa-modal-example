let deferredPrompt;
const modal = document.getElementById('modal');
const closeButton = document.getElementById('closeBtn');
const installBtn = document.getElementById('installBtn');

closeButton.addEventListener('click', (e) => {
    modal.hidden = true;
})

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    modal.hidden = false;
    installBtn.onclick = () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Пользователь принял установку PWA');
            } else {
                console.log('Пользователь отказался от установки PWA');
            }
            deferredPrompt = null;
        });
    };
});

window.addEventListener('appinstalled', () => {
    console.log('PWA установлено');
    modal.hidden = true;
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}