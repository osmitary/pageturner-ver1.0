// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const status = document.getElementById("status");
const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");

let pdfDoc = null;
let pageNum = 1;

const url = "pdf/score.pdf";

pdfjsLib.getDocument(url).promise.then(function(pdf){

pdfDoc = pdf;
renderPage(pageNum);

}).catch(function(error){

status.innerText = "PDF load error";
console.error(error);

});


function renderPage(num){

pdfDoc.getPage(num).then(function(page){

let viewport = page.getViewport({scale:1.5});

canvas.width = viewport.width;
canvas.height = viewport.height;

page.render({
canvasContext: ctx,
viewport: viewport
});

status.innerText =
"Page " + num + " / " + pdfDoc.numPages;

});

}


function nextPage(){

if(pageNum >= pdfDoc.numPages) return;

pageNum++;
renderPage(pageNum);

}

function prevPage(){

if(pageNum <= 1) return;

pageNum--;
renderPage(pageNum);

}

////////////////////////////////////////////////////
// 顔検出
////////////////////////////////////////////////////

const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({
video:true
}).then(function(stream){

video.srcObject = stream;

});

let lastTurn = 0;

function onResults(results){

if(!results.multiFaceLandmarks) return;

const landmarks = results.multiFaceLandmarks[0];

const nose = landmarks[1]; // 鼻

const x = nose.x;

const now = Date.now();

if(now - lastTurn < 1500) return;

if(x > 0.65){

nextPage();
lastTurn = now;

}

if(x < 0.35){

prevPage();
lastTurn = now;

}

}

const faceMesh = new FaceMesh({

locateFile: (file)=>{
return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}

});

faceMesh.setOptions({

maxNumFaces:1,
refineLandmarks:true,
minDetectionConfidence:0.5,
minTrackingConfidence:0.5

});

faceMesh.onResults(onResults);

const camera = new Camera(video,{
onFrame: async ()=>{
await faceMesh.send({image: video});
},
width:640,
height:480
});

camera.start();