// --------------------
// PDF.js Worker
// --------------------

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const status = document.getElementById("status");
const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");
const video = document.getElementById("video");

let pdfDoc = null;
let pageNum = 1;

const url = "pdf/score.pdf";

status.innerText = "Loading PDF...";

// --------------------
// PDF読み込み
// --------------------

pdfjsLib.getDocument(url).promise.then(function(pdf){

pdfDoc = pdf;

status.innerText =
"PDF loaded : " + pdf.numPages + " pages";

renderPage(pageNum);

}).catch(function(error){

status.innerText =
"PDF load error : " + error.message;

});


// --------------------
// ページ描画
// --------------------

function renderPage(num){

pdfDoc.getPage(num).then(function(page){

const viewport = page.getViewport({scale:1.5});

canvas.height = viewport.height;
canvas.width = viewport.width;

page.render({

canvasContext:ctx,
viewport:viewport

});

});

}


// --------------------
// ページ送り
// --------------------

function nextPage(){

if(pageNum >= pdfDoc.numPages){

status.innerText = "Last Page";
return;

}

pageNum++;
renderPage(pageNum);

}

function prevPage(){

if(pageNum <= 1){

status.innerText = "First Page";
return;

}

pageNum--;
renderPage(pageNum);

}


// --------------------
// カメラ起動
// --------------------

navigator.mediaDevices.getUserMedia({

video:true

}).then(function(stream){

video.srcObject = stream;

status.innerText = "Camera started";

}).catch(function(err){

status.innerText =
"Camera error : " + err.message;

});


// --------------------
// 顔検出
// --------------------

let lastTurn = 0;

function onResults(results){

if(!results.multiFaceLandmarks){

status.innerText = "Face not detected";
return;

}

const landmarks = results.multiFaceLandmarks[0];

const nose = landmarks[1];

// カメラ左右反転補正
let x = 1 - nose.x;

// デバッグ表示
status.innerText =
"X:" + x.toFixed(2) +
" Page:" + pageNum;

let now = Date.now();

if(now - lastTurn < 1200) return;


// --------------------
// 左を見る → 前ページ
// --------------------

if(x < 0.35){

prevPage();

lastTurn = now;

}

// --------------------
// 右を見る → 次ページ
// --------------------

if(x > 0.65){

nextPage();

lastTurn = now;

}

// --------------------
// MediaPipe設定
// --------------------

const faceMesh = new FaceMesh({

locateFile:(file)=>{

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


// --------------------
// カメラ処理
// --------------------

const camera = new Camera(video,{

onFrame:async()=>{

await faceMesh.send({image:video});

},

width:640,
height:480

});

camera.start();
