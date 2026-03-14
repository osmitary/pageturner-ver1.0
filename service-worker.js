const CACHE_NAME = "score-app-v1"

const FILES_TO_CACHE = [

"/",
"/index.html",
"/css/style.css",

"/js/app.js",
"/js/pdfViewer.js",
"/js/faceControl.js",
"/js/library.js",

"/scores/score1.pdf"

]


/* インストール */

self.addEventListener("install",event=>{

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache=>cache.addAll(FILES_TO_CACHE))

)

})


/* fetch処理 */

self.addEventListener("fetch",event=>{

event.respondWith(

caches.match(event.request)
.then(response=>{

return response || fetch(event.request)

})

)

})