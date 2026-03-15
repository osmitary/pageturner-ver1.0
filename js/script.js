// -----------------------------
// PDF.js Worker設定
// -----------------------------

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";


// -----------------------------
// HTML要素取得
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

status.innerText = "loading PDF...";


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
"PDF load error: " + error.message;

console.error(error);

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

status.innerText =
"Page " + num + " / " + pdfDoc.numPages;

});

}


// -----------------------------
// ページ送り
// -----------------------------

function nextPage(){

if(pageNum >= pdfDoc.numPages) return;

pageNum++;

status.innerText = "NEXT PAGE";

renderPage(pageNum);

}

function prevPage(){

if(pageNum <= 1) return;

pageNum--;

status.innerText = "PREVIOUS PAGE";

renderPage(pageNum);

}


// -----------------------------
// キーボード操作（テスト用）
// -----------------------------

document.addEventListener("keydown",function(e){

if(e.key === "ArrowRight") nextPage();
if(e.key === "ArrowLeft") prevPage();

});


// -----------------------------
// カメラ起動
// -----------------------------

status.innerText = "starting camera...";

navigator.mediaDevices.getUserMedia({

video:true

}).then(function(stream){

video.srcObject = stream;

status.innerText = "camera started";

}).catch(function(err){

status.innerText =
"camera error: " + err.message;

});


// -----------------------------
// 顔検出
// -----------------------------

let lastTurn = 0;

function onResults(results){

// 顔検出なし

if(!results.multiFaceLandmarks){

status.innerText = "face not detected";

return;

}

// 顔ランドマーク取得

const landmarks = results.multiFaceLandmarks[0];

// 鼻の位置

const nose = landmarks[1];

const x = nose.x;

// デバッグ表示

status.innerText =
"face position: " + x.toFixed(2);


// 誤作動防止タイマー

const now = Date.now();

if(now - lastTurn < 1500) return;


// 右向き（前ページ）

if(x > 0.65){

if(pageNum > 1){

status.innerText = "RIGHT → PREVIOUS PAGE";

prevPage();

}else{

status.innerText = "FIRST PAGE";

}

lastTurn = now;

}

// 左向き（次ページ）

if(x < 0.35){

if(pageNum < pdfDoc.numPages){

status.innerText = "LEFT → NEXT PAGE";

nextPage();

}else{

status.innerText = "LAST PAGE";

}

lastTurn = now;

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
