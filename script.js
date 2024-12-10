function show(msg) {
    console.log(msg);
}
function loadPage() {
    show("Carregando");
    var app = document.createElement('div');
    app.id = "App";
    app.setAttribute('style', 'background:#ffdddd');
    app.appendChild(document.createTextNode('hi'));
    document.body.append(app);
    show("Carregou");
}