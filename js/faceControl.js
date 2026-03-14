export default class FaceControl{

constructor(video,onRight,onLeft){

this.video = video
this.onRight = onRight
this.onLeft = onLeft

this.lastX = null
this.cooldown = false

}

start(){

navigator.mediaDevices
.getUserMedia({video:true})
.then(stream=>{

this.video.srcObject = stream

})

this.initDetection()

}

initDetection(){

const detector =
 new FaceDetection({

locateFile:file=>
`https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`

})

detector.onResults(results=>{

if(results.detections.length==0) return

let x =
results.detections[0].boundingBox.xCenter

if(this.lastX!=null){

let move = x - this.lastX

if(Math.abs(move) > 0.12
 && !this.cooldown){

this.cooldown = true

if(move>0){

this.onRight()

}else{

this.onLeft()

}

setTimeout(()=>{
this.cooldown=false
},1000)

}

}

this.lastX = x

})

const camera =
 new Camera(this.video,{

onFrame:async()=>{

await detector.send({
image:this.video
})

},

width:640,
height:480

})

camera.start()

}

}