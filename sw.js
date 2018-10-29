const versionName = 'v1';

// Install service worker
self.addEventListener('install', function(e) {
});

//  Activate service worker
self.addEventListener('activate', function(e)  {
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(versionNames => {
      return Promise.all(
        versionNames.map(cache => {
          if (cache !== versionName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

//  Fetching files for offline view 
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        //  copy/clone of response
        const resClone = res.clone();
        // Open cahce
        caches.open(versionName).then(cache => {
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
  );
});
