const CACHE="score-turner-v1"

const FILES=[

"/",
"/index.html",
"/css/style.css",
"/js/app.js",
"/js/pdfViewer.js",
"/js/faceController.js",
"/scores/sample.pdf"

const CACHE_NAME = "score-turner-v1";

const urlsToCache = [
"./",
"index.html",
"css/style.css",
"js/script.js",
"pdf/score.pdf"
];

self.addEventListener("install",event=>{

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache=>{
return cache.addAll(urlsToCache);
})

);

});

self.addEventListener("fetch",event=>{

event.respondWith(

caches.match(event.request)
.then(response=>{
return response || fetch(event.request);
})

);

});