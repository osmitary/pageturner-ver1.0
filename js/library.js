export default class Library{

constructor(select){

this.select = select

this.scores = [

{title:"Score 1",
file:"scores/score1.pdf"},

{title:"Score 2",
file:"scores/score2.pdf"}

]

}

init(onChange){

this.scores.forEach(s=>{

let opt =
 document.createElement("option")

opt.textContent = s.title
opt.value = s.file

this.select.appendChild(opt)

})

this.select.addEventListener("change",e=>{

onChange(e.target.value)

})

}

}