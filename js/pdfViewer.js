body{
margin:0;
background:black;
color:white;
font-family:sans-serif;
overflow:hidden;
}

header{
position:fixed;
top:0;
left:0;
right:0;
height:50px;

display:flex;
align-items:center;
gap:10px;

background:rgba(0,0,0,0.7);

padding:5px 10px;

z-index:10;
}

button{
font-size:18px;
padding:5px 10px;
background:#222;
color:white;
border:1px solid #444;
border-radius:6px;
}

canvas{
display:block;

margin-top:50px;

width:100vw;
height:auto;
}

#camera{

position:fixed;

right:10px;
bottom:10px;

width:120px;

border-radius:10px;

opacity:0.6;

}

#status{

position:fixed;

left:10px;
bottom:10px;

font-size:14px;

}