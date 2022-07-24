const cacheName = 'purity-todo-2.4'
const contentToCache = [
  './',
  './index.html',
  './reset.css',
  './index.js',
  './app.js',

  './assets/images/todo-icon-48.png',
  './assets/images/todo-icon-192.png',
  './assets/images/todo-icon-512.png',
  './assets/images/preloader.gif',
  './assets/images/icon-pack/idea.svg',
  './assets/images/icon-pack/forbidden.svg',
]

self.addEventListener('install', e => {
  console.log('[Service Worker] Install')
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName)
      console.log('[Service Worker] Caching app shell')
      await cache.addAll(contentToCache)
    })()
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request)
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`)
      if (r) {
        return r
      }
      const response = await fetch(e.request)
      if (e.request.url.endsWith('.js')) {
        const cache = await caches.open(cacheName)
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`)
        cache.put(e.request, response.clone())
      }
      return response
    })()
  )
})

self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activate')
  e.waitUntil(
    caches.keys().then(keyList => {
      Promise.all(
        keyList.map(key => {
          if (key === cacheName) {
            return
          }
          caches.delete(key)
        })
      )
    })
  )
})
