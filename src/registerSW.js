import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New update available. Reload?')) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log('App is ready to work offline.');
  },
});

