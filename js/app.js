import PDFViewer from "./pdfViewer.js"
import FaceController from "./faceController.js"

const canvas =
document.getElementById("pdfCanvas")

const viewer =
new PDFViewer(canvas)

viewer.load("scores/sample.pdf")

document
.getElementById("nextBtn")
.onclick = ()=>viewer.next()

document
.getElementById("prevBtn")
.onclick = ()=>viewer.prev()

document
.getElementById("scoreSelect")
.onchange = e=>{

viewer.load(e.target.value)

}

const face =
new FaceController(

document.getElementById("camera"),

()=>viewer.next(),
()=>viewer.prev()

)

face.start()

if("serviceWorker" in navigator){

navigator.serviceWorker
.register("/service-worker.js")

}