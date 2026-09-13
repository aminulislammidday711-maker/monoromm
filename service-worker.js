const CACHE='monorom-static-v3';
const ASSETS=['./','./login.html','./index.html','./daily-routine.html','./family-doctor.html','./emergency.html','./brain-exercises.html','./ball_sort/ball_sort_puzzle.html','./gentle_snake/gentle_snake.html','./void_breach/void_breach.html','./Seven_sister/seven_sisters_seek.html','./monorom-core.js','./api-config.js','./logo.png','./background.png','./banner.png','./header.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  const fresh= u.pathname.endsWith('.html') || u.pathname.endsWith('/') || u.pathname.endsWith('api-config.js') || u.pathname.endsWith('service-worker.js');
  if(fresh){
    e.respondWith(fetch(e.request).then(r=>{const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r;}).catch(()=>caches.match(e.request)));
  }else{
    e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r;})));
  }
});
