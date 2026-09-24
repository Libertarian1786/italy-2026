// Offline support for the trip site.
var C='italy-v1',TILES='italy-tiles-v1',MAXT=600;
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(c){return c.addAll(['./','index.html','manifest.json','icon-192.png']).catch(function(){});}));});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
function trim(){caches.open(TILES).then(function(c){c.keys().then(function(k){if(k.length>MAXT)k.slice(0,k.length-MAXT).forEach(function(r){c.delete(r);});});});}
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(C).then(function(c){c.put('index.html',cp);});return res;}).catch(function(){return caches.match('index.html');}));return;}
  var tile=/tile\.openstreetmap\.org$/.test(u.hostname),store=tile?TILES:C;
  e.respondWith(caches.open(store).then(function(c){return c.match(r).then(function(hit){
    var net=fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque')){c.put(r,res.clone());if(tile)trim();}return res;}).catch(function(){return hit;});
    return hit||net;});}));
});
