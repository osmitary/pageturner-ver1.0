// -----------------------------
// PDF.js Worker
// -----------------------------

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";


// -----------------------------
// HTML取得
// -----------------------------

const status = document.getElementById("status");
const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");
const video = document.getElementById("video");


// -----------------------------
// PDF設定
// -----------------------------

let pdfDoc = null;
let pageNum = 1;

const url = "pdf/score.pdf";

status.innerText = "Loading PDF...";


// -----------------------------
// PDF読み込み
// -----------------------------

pdfjsLib.getDocument(url).promise.then(function(pdf){

pdfDoc = pdf;

status.innerText =
"PDF loaded (" + pdf.numPages + " pages)";

renderPage(pageNum);

}).catch(function(error){

status.innerText =
"PDF error: " + error.message;

});


// -----------------------------
// ページ描画
// -----------------------------

function renderPage(num){

pdfDoc.getPage(num).then(function(page){

let viewport = page.getViewport({scale:1.5});

canvas.width = viewport.width;
canvas.height = viewport.height;

page.render({
canvasContext: ctx,
viewport: viewport
});

});

}


// -----------------------------
// ページ送り
// -----------------------------

function nextPage(){

if(pageNum >= pdfDoc.numPages){

status.innerText = "LAST PAGE";

return;

}

pageNum++;

renderPage(pageNum);

}

function prevPage(){

if(pageNum <= 1){

status.innerText = "FIRST PAGE";

return;

}

pageNum--;

renderPage(pageNum);

}


// -----------------------------
// キーボードテスト
// -----------------------------

document.addEventListener("keydown",function(e){

if(e.key === "ArrowRight") nextPage();
if(e.key === "ArrowLeft") prevPage();

});


// -----------------------------
// カメラ起動
// -----------------------------

navigator.mediaDevices.getUserMedia({

video:true

}).then(function(stream){

video.srcObject = stream;

status.innerText = "Camera started";

}).catch(function(err){

status.innerText =
"Camera error: " + err.message;

});


// -----------------------------
// 顔検出
// -----------------------------

let lastTurn = 0;

function onResults(results){

if(!results.multiFaceLandmarks){

status.innerText = "Face not detected";

return;

}

const landmarks = results.multiFaceLandmarks[0];

const nose = landmarks[1];

// -----------------------------
// 左右反転補正
// -----------------------------

const rawX = nose.x;
const x = 1 - rawX;


// -----------------------------
// デバッグ表示
// -----------------------------

status.innerText =
"Face X: " + x.toFixed(2) +
" Page:" + pageNum;


// -----------------------------
// 誤作動防止
// -----------------------------

const now = Date.now();

if(now - lastTurn < 1200) return;


// -----------------------------
// 左を見る → 次ページ
// -----------------------------

if(x < 0.35){

status.innerText =
"LEFT DETECTED → NEXT PAGE";

nextPage();

lastTurn = now;

}


// -----------------------------
// 右を見る → 前ページ
// -----------------------------

if(x > 0.65){

status.innerText =
"RIGHT DETECTED → PREV PAGE";

prevPage();

lastTurn = now;

}

}


// -----------------------------
// MediaPipe設定
// -----------------------------

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


// -----------------------------
// カメラ処理
// -----------------------------

const camera = new Camera(video,{

onFrame: async ()=>{

await faceMesh.send({image: video});

},

width:640,
height:480

});

camera.start();


// -----------------------------
// Service Worker
// -----------------------------

if("serviceWorker" in navigator){

navigator.serviceWorker.register("service-worker.js");

}
