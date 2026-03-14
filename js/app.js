import PDFViewer from "./pdfViewer.js"
import FaceControl from "./faceControl.js"
import Library from "./library.js"

const canvas =
document.getElementById("pdfCanvas")

const viewer =
 new PDFViewer(canvas)

const library =
 new Library(
 document.getElementById("scoreSelect")
)

library.init(file=>{

viewer.load(file)

})

viewer.load("scores/score1.pdf")

document
.getElementById("nextBtn")
.onclick = ()=>viewer.next()

document
.getElementById("prevBtn")
.onclick = ()=>viewer.prev()

const face =
 new FaceControl(

document.getElementById("camera"),

()=>viewer.next(),
()=>viewer.prev()

)

face.start()
if ("serviceWorker" in navigator){

 navigator.serviceWorker
 .register("/service-worker.js")
 .then(()=>{

 console.log("Service Worker Registered")

 })

}