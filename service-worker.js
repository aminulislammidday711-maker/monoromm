const CACHE='monorom-static-v4';
const ASSETS=["./Game logo/ball_sort_logo.jpg","./Game logo/grntle_snake_logo.jpg","./Game logo/seven_sister_logo.jpg","./Game logo/void_breach_logo.jpg","./Seven_sister/seven_sister_background.jpg","./Seven_sister/seven_sister_seek.jpg","./Seven_sister/seven_sisters_seek.html","./admin.html","./api-config.js","./assets/space_ambience.wav","./background.png","./ball_sort/background.jpg","./ball_sort/ball_sort_puzzle.html","./ball_sort/logo.png","./banner.png","./brain-exercises.html","./brain_exercise_logo_background.png","./brain_exercises_logo.png","./daily-routine.html","./daily_routine_logo.png","./daily_routine_logo_background.png","./emergency.html","./emergency_call_logo.png","./emergency_call_logo_background.png","./family-doctor.html","./family_doctor_logo.png","./family_doctor_logo_background.png","./gentle_snake/gentle_snake.html","./gentle_snake/gentle_snake.jpg","./header.png","./heading_background.png","./index.html","./login.html","./logo.png","./monorom-core.js","./monorom-language.js","./pahad_background.png","./service-worker.js","./void_breach/void_breach.html","./void_breach/void_breach.jpg"];
const THIRD_PARTY=[
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];
self.addEventListener('install',e=>e.waitUntil(
  caches.open(CACHE).then(async c=>{
    await c.addAll(ASSETS);
    // Best-effort cache of the only third-party runtime used by the games.
    await Promise.all(THIRD_PARTY.map(async url=>{try{const r=await fetch(url,{mode:'cors'});if(r.ok)await c.put(url,r);}catch(_e){}}));
    await self.skipWaiting();
  })
));
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  // Network-first for HTML/config so updates are picked up, cache-first for static files.
  const fresh=u.origin===location.origin && (
    u.pathname.endsWith('.html') || u.pathname.endsWith('api-config.js') || u.pathname.endsWith('service-worker.js')
  );
  if(fresh){
    e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;})
      .catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{
    const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;
  })));
});
