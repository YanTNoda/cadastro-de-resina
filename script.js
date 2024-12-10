function show(msg){
console.log(msg);
}
const body = document.body;
var app = document.createElement('div');
app.setAttribute('background-color','red');
app.appendChild(document.createTextNode('hi'));
body.appendChild(app);
