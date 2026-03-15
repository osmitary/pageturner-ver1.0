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
