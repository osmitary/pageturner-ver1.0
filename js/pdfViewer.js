export default class PDFViewer{

constructor(canvas){

this.canvas = canvas
this.ctx = canvas.getContext("2d")

this.page = 1
this.pdf = null

}

async load(url){

this.pdf =
 await pdfjsLib.getDocument(url).promise

this.page = 1

this.render()

}

async render(){

const p =
 await this.pdf.getPage(this.page)

const viewport =
 p.getViewport({scale:2})

this.canvas.height =
 viewport.height

this.canvas.width =
 viewport.width

await p.render({

canvasContext:this.ctx,
viewport:viewport

})

}

next(){

if(this.page < this.pdf.numPages){

this.page++

this.render()

}

}

prev(){

if(this.page > 1){

this.page--

this.render()

}

}

}