import Console from '@/utils/Console'
import environment from '@/utils/environment'

if (environment.production && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(result => {
      Console.log('ServiceWorker', 'successfully replaced to a no-op SW', result)
    })
    .catch(() => {})
}
