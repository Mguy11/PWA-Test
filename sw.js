importScripts("./localforage.js")

const staticCacheName = 'staticCache-v1';
// const dynamicCacheName = 'dynamicCache-v1';
const cacheAssets = [
  './',
  './styles.css',
  './app.js',
  './fallback.json',
  './images/not-working.png',
  './localforage.js',
  'index.html',
  'test.html'
];

self.addEventListener('install', async e => {
  const cache = await caches.open(staticCacheName);
  cache.addAll(cacheAssets);
});

self.addEventListener('activate', e => {
  let cacheWhiteList = ['staticCache-v1']

  e.waitUntil(
    caches.keys().then (cacheNames => {
      return Promise.all(
        cacheNames.map (cacheName => {
          if(cacheWhiteList.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  console.log(url)
  console.log(url.pathname)

  if(url.origin === location.origin) {
    console.log("chacheFirst-test")
    e.respondWith(cacheFirst(req));
  } else if (url.pathname == "/api/projects/tags/") {
    console.log("miep")
    e.respondWith(networkOnly(req))
  } else {
    console.log("networkFirst")
    e.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req)
  return cachedResponse || fetch(req)
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    const json = await res.json();
    const array = json.projects;

    //store data in IndexedDB using Localforage
    array.forEach((project) => {
      console.log("kek")
      localforage.setItem(project._id, project)
    });
    return fetch(req)

  } catch (error) {
    localforage.keys().then(function(keys) {
      keys.forEach(async project => {
        const returnedData = await localforage.getItem(project)
        //console.log(returnedData)
        console.log("lmao")
        return returnedData;
      })
    }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err);
    });
  }
}

async function networkOnly(req) {
  try {
    const res = await fetch(req)
    return res
  } catch (error) {
    return error
  }
}