let APP;
let TUDO;
let EVENTS = ['pointerup', 'touchend'];

function addEventListeners(element, f) {
    for (var i in EVENTS) {
        element.addEventListener(EVENTS[i], f);
    }
}

class Fornecedor {
    constructor(nome) {
        this.nome = nome;
    }
}
class Insumo {
    constructor(fornecedor, nome, preco) {
        this.fornecedor = fornecedor;
        this.nome = nome;
        this.preco = preco;
    }
}
class InsumoComPeso extends Insumo {
    constructor(fornecedor, nome, preco, peso) {
        super(fornecedor, nome, preco);
        this.peso = peso;
    }
    preco_por_grama() {
        return this.preco / this.peso;
    }
}
class Resina extends InsumoComPeso { }
class Pigmento extends InsumoComPeso { }
class Extra extends Insumo { }
class Molde extends Insumo {
    constructor(fornecedor, nome, preco, cavidades, usos) {
        super(fornecedor, nome, preco);
        this.cavidades = cavidades;
        this.usos = usos;
    }
    custo_por_peca() {
        return this.preco / (this.cavidades * this.usos);
    }
}
class Funcionario {
    constructor(nome, preco) {
        this.nome = nome;
        this.preco = preco;
    }
}
class Peca {
    constructor(resina, pigmento, molde, extras, funcionario, peso, tempo, paralelo) {
        this.resina = resina;
        this.pigmento = pigmento;
        this.molde = molde;
        this.extras = extras;
        this.funcionario = funcionario;
        this.peso = peso;
        this.tempo = tempo;
        this.paralelo = paralelo;
    }
    mao_de_obra() {
        return this.tempo * this.funcionario.preco / this.paralelo;
    }
    custo_material() {
        var r = this.resina.preco_por_grama() * 0.97 * this.peso;
        var p = this.pigmento.preco_por_grama() * 0.03 * this.peso;
        var e = 0;
        for (var i in this.extras) {
            e += this.extras[i][0].preco * this.extras[i][1];
        }
        return r + p + e + this.molde.custo_por_peca();
    }
    custo_total() {
        return this.mao_de_obra() + this.custo_material();
    }
}

class Venda {
    constructor(peca, valor_venda) {
        this.peca = peca;
        this.valor_venda = valor_venda;
    }
    lucro() {
        return this.valor_venda - this.peca.custo_total();
    }
    margem_de_lucro() {
        return this.lucro() / this.valor_venda;
    }


}
class Tudo {
    constructor(fornecedores, resinas, pigmentos, extras, funcionarios, moldes, pecas, vendas) {
        this.fornecedores = fornecedores;
        this.resinas = resinas;
        this.pigmentos = pigmentos;
        this.extras = extras;
        this.funcionarios = funcionarios;
        this.moldes = moldes;
        this.pecas = pecas;
        this.vendas = vendas;
    }
    push_fornecedor(fornecedor) { this.fornecedores.push(fornecedor); }
    push_resina(resina) { this.resinas.push(resina); }
    push_pigmento(pigmento) { this.pigmentos.push(pigmento); }
    push_molde(molde) { this.moldes.push(molde); }
    push_extra(extra) { this.extras.push(extra); }
    push_funcionario(funcionario) { this.funcionarios.push(funcionario); }
    push_peca(peca) { this.pecas.push(peca); }
    push_venda(venda) { this.vendas.push(venda); }

    remove_fornecedor(index) { this.fornecedores.splice(index, 1); }
    remove_resina(index) { this.resinas.splice(index, 1); }
    remove_pigmento(index) { this.pigmentos.splice(index, 1); }
    remove_molde(index) { this.moldes.splice(index, 1); }
    remove_extra(index) { this.extras.splice(index, 1); }
    remove_funcionario(index) { this.funcionarios.splice(index, 1); }
    remove_peca(index) { this.pecas.splice(index, 1); }
    remove_venda(index) { this.vendas.splice(index, 1); }



}
/**
 * 
 * @param  num Verifica se é um numero válido
 * @returns True se válido e False caso contrário
 */
function checkNum(num) {
    try {
        if (num === undefined || num === null) {
            return false
        }
        if (typeof (num) == typeof ("") && num.length < 1) {
            return false;
        }
        var x = parseFloat(num);
        if (typeof (x) !== typeof (0.5)) {
            return false;
        }
        if (x !== null && x !== NaN) {
            console.log("Check =>");
            console.log(num);
            console.log(x);
            console.log("len", num.length, x.length);
            console.log("type", typeof (num), typeof (x));
            return true;
        }
    } catch (e) {
        show(e);
    }
    return false;
}

function save_tudo(tudo) {
    localStorage.setItem('fulldata', JSON.stringify(tudo));
}
function load_tudo() {
    let t = localStorage.getItem('fulldata');
    if (t === null) {
        show("Gerando novo registro");
        t = new Tudo([], [], [], [], [], [], [], []);
        save_tudo(t);
    }
    else {
        show("Carregado registro");
        try {

            show(typeof (t)); show(t);
            t = JSON.parse(t);
            show(typeof (t)); show(t);
            t = Object.assign(new Tudo, t);
            show(typeof (t)); show(t);
        } catch (e) {
            show("Erro ao carregar dados antigos,gerando novo");
            t = new Tudo([], [], [], [], [], [], [], []);
            save_tudo(t);
        }
    }

    return t;
}

function show(msg) {
    console.log(msg);
}
function push_default_vals(t) {
    var forn = new Fornecedor("fornecedor generico");
    t.push_fornecedor(forn);
    var res = new Resina(forn, 'ultrauv', 240, 1000);
    t.push_resina(res);
    var pig = new Pigmento(forn, 'white galaxy', 40, 20);
    t.push_pigmento(pig);
    var mol = new Molde(forn, 'borboleta', 30, 8, 10);
    t.push_molde(mol);
    var ex1 = new Extra(forn, 'pitão', 15);
    var ex2 = new Extra(forn, 'kit envio s', 8);
    t.push_extra(ex1);
    t.push_extra(ex2);
    var funcionario = new Funcionario('Estagio', 6.5);
    t.push_funcionario(funcionario);
    var peca = new Peca(res, pig, mol, [[ex1, 2], [ex2, 1]], funcionario, 100, 2, 4);
    t.push_peca(peca);
    var venda = new Venda(peca, 90);
    t.push_venda(venda);

}
function addFornecedor(ev) {
    ev.stopImmediatePropagation();
    console.log(ev);
    console.log(typeof (ev));
    var field = document.getElementById('fornecedor-nome');
    if (field === null) return;
    var nome = field.value;
    if (nome.length <= 3) {
        alert("Nome de fornecedor muito curto");
        return;
    }
    TUDO.push_fornecedor(new Fornecedor(nome));
    save_tudo(TUDO);
    updateApp();
}
function formFornecedor(parent) {
    var div = document.createElement("div");
    parent.appendChild(div);
    var heading = document.createElement("h2");
    heading.innerText = "Cadastro de Fornecedor";
    div.appendChild(heading);
    div.appendChild(document.createTextNode("Nome:"));
    var nome = document.createElement("input");
    nome.id = 'fornecedor-nome';
    nome.setAttribute('type', 'text');
    nome.ariaLabel = "Nome";
    div.appendChild(nome);
    var btn = document.createElement("button");
    btn.innerText = "Adicionar Fornecedor";
    btn.setAttribute("type", 'button');
    addEventListeners(btn, addFornecedor);
    div.appendChild(btn);
}

function loadFornecedores() {
    var antigo = document.getElementById('fornecedores');
    if (antigo !== null) {
        antigo.remove();
    }
    var div = document.createElement('div');
    div.id = "fornecedores";
    div.className = "panel";
    var heading = document.createElement("h1");
    heading.innerText = 'Fornecedores';
    div.appendChild(heading);
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var theadrow = document.createElement('tr');
    var th = document.createElement('th');
    var tbody = document.createElement("tbody");
    for (var f in TUDO.fornecedores) {
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(TUDO.fornecedores[f].nome));
        tbody.appendChild(row);
    }
    div.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);
    thead.appendChild(theadrow);
    theadrow.appendChild(th);
    th.appendChild(document.createTextNode("Nome"));
    formFornecedor(div);
    APP.appendChild(div);
}

function selectFornecedor(id) {
    var select = document.getElementById(id);
    if (select !== null) {
        select.remove();
    }
    select = document.createElement('select');
    select.id = id;
    for (var i in TUDO.fornecedores) {
        var f = TUDO.fornecedores[i];
        var opt = document.createElement('option');
        opt.value = i;
        opt.text = f.nome;
        select.appendChild(opt);
    }
    return select;
}
function addResina(ev) {
    ev.stopImmediatePropagation();
    console.log(ev);
    console.log(typeof (ev));
    var field_forn = document.getElementById('resina-fornecedor');
    if (field_forn === null) return;
    var field_nome = document.getElementById('resina-nome');
    if (field_nome === null) return;
    var field_preco = document.getElementById('resina-preco');
    if (field_preco === null) return;
    var field_peso = document.getElementById('resina-peso');
    if (field_peso === null) return;
    var forn = field_forn.value;
    var nome = field_nome.value;
    var preco = field_preco.value;
    var peso = field_peso.value;

    if (nome.length <= 3) {
        alert("Nome de resina muito curto");
        return;
    }
    try {
        if (!checkNum(preco)) {
            throw new TypeError("");
        }
        preco = parseFloat(preco);
    } catch (e) {
        alert("Preço preenchido incorretamente");
        return;
    }
    try {
        if (!checkNum(peso)) {
            throw new TypeError("");
        }
        peso = parseInt(peso);
    } catch (e) {
        alert("Peso preenchido incorretamente");
        return;
    }
    var resina = new Resina(TUDO.fornecedores[parseInt(forn)], nome, preco, peso);
    TUDO.push_resina(resina);
    save_tudo(TUDO);
    updateApp();
}
function formResina(parent) {
    var div = document.createElement("div");
    parent.appendChild(div);
    div.className = 'form';
    var forn = selectFornecedor('resina-fornecedor');
    var nome = document.createElement("input");

    var preco = document.createElement("input");
    var peso = document.createElement("input");
    nome.id = 'resina-nome';
    nome.setAttribute('type', 'text');
    preco.id = 'resina-preco';
    preco.setAttribute("type", 'number');
    peso.id = 'resina-peso';
    peso.setAttribute("type", 'number');
    var heading = document.createElement("h2");
    heading.innerText = "Cadastro de resina";
    div.appendChild(heading);
    div.appendChild(document.createTextNode("Fornecedor:"));
    div.appendChild(forn);
    div.appendChild(document.createTextNode("Nome da resina:"));
    div.appendChild(nome);
    div.appendChild(document.createTextNode("Preço:"));
    div.appendChild(preco);
    div.appendChild(document.createTextNode("Peso em gramas:"));
    div.appendChild(peso);
    var btn = document.createElement("button");
    btn.innerText = "Adicionar Resina";
    btn.setAttribute("type", 'button');
    addEventListeners(btn, addResina);
    div.appendChild(btn);
}
function loadResinas() {
    var antigo = document.getElementById('resinas');
    if (antigo !== null) {
        antigo.remove();
    }
    var div = document.createElement('div');
    div.className = "panel";
    div.id = "resinas";
    var heading = document.createElement("h1");
    heading.innerText = 'Resinas';
    div.appendChild(heading);
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var theadrow = document.createElement('tr');
    var tbody = document.createElement("tbody");
    for (var f in TUDO.resinas) {
        var row = document.createElement('tr');
        var res = TUDO.resinas[f];
        var cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(res.fornecedor.nome));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(res.nome));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(res.preco));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(res.peso));
        cell = document.createElement('td');

        tbody.appendChild(row);
    }
    let headers = ['Fornecedor', 'Nome', 'Preço(R$)', 'Peso(gramas)'];
    for (var i in headers) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(headers[i]));
        theadrow.appendChild(th);
    }
    div.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);
    thead.appendChild(theadrow);
    theadrow.appendChild(th);
    formResina(div);
    APP.appendChild(div);

}
function addPigmento(ev) {
    ev.stopImmediatePropagation();
    console.log(ev);
    console.log(typeof (ev));
    var field_forn = document.getElementById('pigmento-fornecedor');
    if (field_forn === null) return;
    var field_nome = document.getElementById('pigmento-nome');
    if (field_nome === null) return;
    var field_preco = document.getElementById('pigmento-preco');
    if (field_preco === null) return;
    var field_peso = document.getElementById('pigmento-peso');
    if (field_peso === null) return;
    var forn = field_forn.value;
    var nome = field_nome.value;
    var preco = field_preco.value;
    var peso = field_peso.value;

    if (nome.length <= 3) {
        alert("Nome de pigmento muito curto");
        return;
    }
    try {
        if (!checkNum(preco)) {
            throw new TypeError("");
        }
        preco = parseFloat(preco);
    } catch (e) {
        alert("Preço preenchido incorretamente");
        return;
    }
    try {
        if (!checkNum(peso)) {
            throw new TypeError("");
        }
        peso = parseInt(peso);
    } catch (e) {
        alert("Peso preenchido incorretamente");
        return;
    }
    var pigmento = new Pigmento(TUDO.fornecedores[parseInt(forn)], nome, preco, peso);
    TUDO.push_pigmento(pigmento);
    save_tudo(TUDO);
    updateApp();
}
function formPigmento(parent) {
    var div = document.createElement("div");
    parent.appendChild(div);
    div.className = 'form';
    var forn = selectFornecedor('pigmento-fornecedor');
    var nome = document.createElement("input");

    var preco = document.createElement("input");
    var peso = document.createElement("input");
    nome.id = 'pigmento-nome';
    nome.setAttribute('type', 'text');
    preco.id = 'pigmento-preco';
    preco.setAttribute("type", 'number');
    peso.id = 'pigmento-peso';
    peso.setAttribute("type", 'number');

    var heading = document.createElement("h2");
    heading.innerText = "Cadastro de pigmento";
    div.appendChild(heading);
    div.appendChild(document.createTextNode("Fornecedor:"));
    div.appendChild(forn);
    div.appendChild(document.createTextNode("Nome do Pigmento:"));
    div.appendChild(nome);
    div.appendChild(document.createTextNode("Preço:"));
    div.appendChild(preco);
    div.appendChild(document.createTextNode("Peso em gramas:"));
    div.appendChild(peso);
    var btn = document.createElement("button");
    btn.innerText = "Adicionar Pigmento";
    btn.setAttribute("type", 'button');
    addEventListener(btn, addPigmento);
    div.appendChild(btn);
}
function loadPigmentos() {
    var antigo = document.getElementById('pigmentos');
    if (antigo !== null) {
        antigo.remove();
    }
    var div = document.createElement('div');
    div.id = "pigmentos";
    div.className = "panel";
    var heading = document.createElement("h1");
    heading.innerText = 'Pigmentos';
    div.appendChild(heading);
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var theadrow = document.createElement('tr');
    var tbody = document.createElement("tbody");
    for (var f in TUDO.pigmentos) {
        var row = document.createElement('tr');
        var pig = TUDO.pigmentos[f];
        var cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(pig.fornecedor.nome));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(pig.nome));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(pig.preco));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(pig.peso));
        cell = document.createElement('td');

        tbody.appendChild(row);
    }
    let headers = ['Fornecedor', 'Nome', 'Preço(R$)', 'Peso(gramas)'];
    for (var i in headers) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(headers[i]));
        theadrow.appendChild(th);
    }
    div.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);
    thead.appendChild(theadrow);
    theadrow.appendChild(th);
    formPigmento(div);
    APP.appendChild(div);

}
function addMolde(ev) {
    ev.stopImmediatePropagation();
    console.log(ev);
    console.log(typeof (ev));
    var field_forn = document.getElementById('molde-fornecedor');
    if (field_forn === null) return;
    var field_nome = document.getElementById('molde-nome');
    if (field_nome === null) return;
    var field_preco = document.getElementById('molde-preco');
    if (field_preco === null) return;
    var field_cavidades = document.getElementById('molde-cavidades');
    if (field_cavidades === null) return;
    var field_usos = document.getElementById('molde-usos');
    if (field_usos === null) return;
    var forn = field_forn.value;
    var nome = field_nome.value;
    var preco = field_preco.value;
    var cavidades = field_cavidades.value;
    var usos = field_usos.value;

    if (nome.length <= 3) {
        alert("Nome de molde muito curto");
        return;
    }
    try {
        if (!checkNum(preco)) {
            throw new TypeError("");
        }
        preco = parseFloat(preco);
    } catch (e) {
        alert("Preço preenchido incorretamente");
        return;
    }
    try {
        if (!checkNum(cavidades)) {
            throw new TypeError("");
        }
        cavidades = parseInt(cavidades);
    } catch (e) {
        alert("Peso preenchido incorretamente");
        return;
    }
    try {
        if (!checkNum(usos)) {
            throw new TypeError("");
        }
        usos = parseInt(usos);
    } catch (e) {
        alert("Peso preenchido incorretamente");
        return;
    }
    var molde = new Molde(TUDO.fornecedores[parseInt(forn)], nome, preco, cavidades, usos);
    TUDO.push_molde(molde);
    updateApp();
}
function formMolde(parent) {
    var div = document.createElement("div");
    parent.appendChild(div);
    div.className = 'form';
    var forn = selectFornecedor('molde-fornecedor');
    var nome = document.createElement("input");
    var preco = document.createElement("input");
    var cavidades = document.createElement("input");
    var usos = document.createElement("input");
    nome.id = 'molde-nome';
    nome.setAttribute('type', 'text');
    preco.id = 'molde-preco';
    preco.setAttribute("type", 'number');
    cavidades.id = 'molde-cavidades';
    cavidades.setAttribute("type", 'number');
    usos.id = 'molde-usos';
    usos.setAttribute("type", 'number');

    var heading = document.createElement("h2");
    heading.innerText = "Cadastro de molde";
    div.appendChild(heading);
    div.appendChild(document.createTextNode("Fornecedor:"));
    div.appendChild(forn);
    div.appendChild(document.createTextNode("Nome do Molde:"));
    div.appendChild(nome);
    div.appendChild(document.createTextNode("Preço:"));
    div.appendChild(preco);
    div.appendChild(document.createTextNode("Cavidades:"));
    div.appendChild(cavidades);
    div.appendChild(document.createTextNode("Usos:"));
    div.appendChild(usos);
    var btn = document.createElement("button");
    btn.innerText = "Adicionar Molde";
    btn.setAttribute("type", 'button');
    addEventListeners(btn, addMolde);
    div.appendChild(btn);
}
function loadMoldes() {
    var antigo = document.getElementById('moldes');
    if (antigo !== null) {
        antigo.remove();
    }
    var div = document.createElement('div');
    div.id = "moldes";
    div.className = "panel";
    var heading = document.createElement("h1");
    heading.innerText = 'Moldes';
    div.appendChild(heading);
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var theadrow = document.createElement('tr');
    var tbody = document.createElement("tbody");
    for (var f in TUDO.moldes) {
        var row = document.createElement('tr');
        var mol = TUDO.moldes[f];
        var cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(mol.fornecedor.nome));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(mol.nome));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(mol.preco));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(mol.cavidades));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(mol.usos));
        tbody.appendChild(row);
    }
    let headers = ['Fornecedor', 'Nome', 'Preço(R$)', 'Cavidades', 'Usos'];
    for (var i in headers) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(headers[i]));
        theadrow.appendChild(th);
    }
    div.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);
    thead.appendChild(theadrow);
    theadrow.appendChild(th);
    formMolde(div);
    APP.appendChild(div);

} function addExtra(ev) {
    ev.stopImmediatePropagation();
    console.log(ev);
    console.log(typeof (ev));
    var field_forn = document.getElementById('extra-fornecedor');
    if (field_forn === null) return;
    var field_nome = document.getElementById('extra-nome');
    if (field_nome === null) return;
    var field_preco = document.getElementById('extra-preco');
    if (field_preco === null) return;

    var forn = field_forn.value;
    var nome = field_nome.value;
    var preco = field_preco.value;

    if (nome.length <= 3) {
        alert("Nome de item extra muito curto");
        return;
    }
    try {
        if (!checkNum(preco)) {
            throw new TypeError("");
        }
        preco = parseFloat(preco);
    } catch (e) {
        alert("Preço preenchido incorretamente");
        return;
    }

    var extra = new Extra(TUDO.fornecedores[parseInt(forn)], nome, preco);
    TUDO.push_extra(extra);
    updateApp();
}
function formExtra(parent) {
    var div = document.createElement("div");
    parent.appendChild(div);
    div.className = 'form';
    var forn = selectFornecedor('extra-fornecedor');
    var nome = document.createElement("input");
    var preco = document.createElement("input");
    nome.id = 'extra-nome';
    nome.setAttribute('type', 'text');
    preco.id = 'extra-preco';
    preco.setAttribute("type", 'number');


    var heading = document.createElement("h2");
    heading.innerText = "Cadastro de extra";
    div.appendChild(heading);
    div.appendChild(document.createTextNode("Fornecedor:"));
    div.appendChild(forn);
    div.appendChild(document.createTextNode("Nome do item:"));
    div.appendChild(nome);
    div.appendChild(document.createTextNode("Preço:"));
    div.appendChild(preco);    
    var btn = document.createElement("button");
    btn.innerText = "Adicionar Extra";
    btn.setAttribute("type", 'button');
    addEventListeners(btn, addExtra);
    div.appendChild(btn);
}
function loadExtras() {
    var antigo = document.getElementById('extras');
    if (antigo !== null) {
        antigo.remove();
    }
    var div = document.createElement('div');
    div.id = "extras";
    div.className = "panel";
    var heading = document.createElement("h1");
    heading.innerText = 'Extras';
    div.appendChild(heading);
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var theadrow = document.createElement('tr');
    var tbody = document.createElement("tbody");
    for (var f in TUDO.extras) {
        var row = document.createElement('tr');
        var ex = TUDO.extras[f];
        var cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(ex.fornecedor.nome));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(ex.nome));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(ex.preco));
        tbody.appendChild(row);
    }
    let headers = ['Fornecedor', 'Nome', 'Preço(R$)'];
    for (var i in headers) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(headers[i]));
        theadrow.appendChild(th);
    }
    div.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);
    thead.appendChild(theadrow);
    theadrow.appendChild(th);
    formExtra(div);
    APP.appendChild(div);

}

function updateApp() {
    loadFornecedores();
    if (TUDO.fornecedores.length == 0) return;
    loadResinas();
    loadPigmentos();
    loadMoldes();
    loadExtras();
}
function loadPage() {
    show("Carregando");
    APP = document.createElement('div');
    APP.id = "App";
    document.body.append(APP);
    TUDO = load_tudo();
    save_tudo(TUDO);
    updateApp();
    show("Carregou");
}