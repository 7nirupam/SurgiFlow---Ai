// Service Worker Registration for PWA support

export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
            });

            console.log('✅ Service Worker registered:', registration.scope);

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 New version available! Please refresh.');
                            // You can show a toast notification here
                        }
                    });
                }
            });

            return registration;
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    } else {
        console.warn('⚠️ Service Workers not supported in this browser');
    }
};

// Request notification permission
export const requestNotificationPermission = async () => {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('📬 Notification permission:', permission);
        return permission === 'granted';
    }
    return false;
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async (registration: ServiceWorkerRegistration) => {
    try {
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
            console.warn('⚠️ VAPID key not configured');
            return null;
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidKey,
        });

        console.log('✅ Push subscription:', subscription);
        return subscription;
    } catch (error) {
        console.error('❌ Push subscription failed:', error);
        return null;
    }
};

// Check if app is installed (PWA)
export const isAppInstalled = () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
};

// Show install prompt
export const showInstallPrompt = () => {
    let deferredPrompt: any;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        console.log('💾 Install prompt available');
    });

    return {
        prompt: async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to install prompt: ${outcome}`);
                deferredPrompt = null;
                return outcome === 'accepted';
            }
            return false;
        },
    };
};
