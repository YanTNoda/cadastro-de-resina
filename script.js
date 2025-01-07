let APP;
let TUDO;
let EVENTS = ['touchend'];
let EXTRAS_LIST = [];
let VALOR_VENDA = -1;

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
    preco_por_grama_proto() {
        return this.preco / this.peso;
    }
}
class Resina extends InsumoComPeso {
    constructor(fornecedor, nome, preco, peso) {
        super(fornecedor, nome, preco, peso);
    }
    preco_por_grama() {
        return this.preco_por_grama_proto();
    }
}
class Pigmento extends InsumoComPeso {
    constructor(fornecedor, nome, preco, peso) {
        super(fornecedor, nome, preco, peso);
    }
    preco_por_grama() {
        return this.preco_por_grama_proto();
    }
}
class Extra extends Insumo {
    constructor(fornecedor, nome, preco) {
        super(fornecedor, nome, preco);
    }
}
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
    constructor(nome, resina, pigmento, molde, extras, funcionario, peso, tempo, paralelo) {
        this.nome = nome
        this.resina = Object.assign(new Resina, resina);
        this.pigmento = Object.assign(new Pigmento, pigmento);
        this.molde = Object.assign(new Molde, molde);
        this.extras = extras;
        this.funcionario = Object.assign(new Funcionario, funcionario);
        this.peso = peso;
        this.tempo = tempo;
        this.paralelo = paralelo;
    }
    mao_de_obra() {
        return this.tempo * this.funcionario.preco / this.paralelo;
    }
    custo_material() {
        var r = this.resina;
        r = Object.assign(new Resina, r);
        r = r.preco_por_grama() * 0.97 * this.peso;
        var p = this.pigmento;
        p = Object.assign(new Pigmento, p);
        p = p.preco_por_grama() * 0.03 * this.peso;
        var e = 0;
        for (var i in this.extras) {
            e += this.extras[i][0].preco * this.extras[i][1];
        }
        var m = this.molde;
        m = Object.assign(new Molde, m);
        m = m.custo_por_peca();
        return r + p + e + m;
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
        var peca = this.peca;
        peca = Object.assign(new Peca, peca);
        return this.valor_venda - peca.custo_total();
    }
    margem_de_lucro() {
        return this.lucro() / this.valor_venda;
    }


}

class Tudo {
    constructor(fornecedores, resinas, pigmentos, extras, funcionarios, moldes, pecas, vendas) {
        show("Carregando Tudo");
        this.fornecedores = fornecedores;
        this.pigmentos = resinas;
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

    remover_fornecedores_duplicados() {
        let correto = new Set();
        console.log("\n\n\n", correto, this.fornecedores);
        for (var f in this.fornecedores) {
            var presente = false;
            var forn = Object.assign(new Fornecedor, this.fornecedores[f]);
            console.log(f, forn, presente, correto);
            for (const existente of correto) {
                console.log(forn, existente);
                if (forn.nome === existente.nome) {
                    presente = true;
                    break;
                }
                console.log(typeof (existente), existente, typeof (forn), forn);
            }
            if (!presente) {
                correto.add(forn);
            }
        }
        console.log(correto);
        this.fornecedores = [...correto];
    }
    remover_resinas_duplicadas() {
        let correto = new Set();
        console.log("\n\n\n", correto, this.resinas);
        for (var r in this.resinas) {
            var presente = false;
            var resina = Object.assign(new Resina, this.resinas[r]);
            console.log(r, resina, presente, correto);
            for (const existente of correto) {
                console.log(resina, existente);
                if (resina.fornecedor.nome == existente.fornecedor.nome &&
                    resina.nome == existente.nome &&
                    resina.preco == existente.preco &&
                    resina.peso == existente.peso) {
                    presente = true;
                    break;
                }
                console.log(typeof (existente), existente, typeof (resina), resina);
            }
            if (!presente) {
                correto.add(resina);
            }
        }
        console.log(correto);
        this.resinas = [...correto];
    }
    remover_pigmentos_duplicados() {
        let correto = new Set();
        console.log("\n\n\n", correto, this.pigmentos);
        for (var p in this.pigmentos) {
            var presente = false;
            var pigmento = Object.assign(new Pigmento, this.pigmentos[p]);
            console.log(p, pigmento, presente, correto);
            for (const existente of correto) {
                console.log(pigmento, existente);
                if (pigmento.fornecedor.nome == existente.fornecedor.nome &&
                    pigmento.nome == existente.nome &&
                    pigmento.preco == existente.preco &&
                    pigmento.peso == existente.peso) {
                    presente = true;
                    break;
                }
                console.log(typeof (existente), existente, typeof (pigmento), pigmento);
            }
            if (!presente) {
                correto.add(pigmento);
            }
        }
        console.log(correto);
        this.pigmentos = [...correto];
    }
    remover_moldes_duplicados() {
        let correto = new Set();
        console.log("\n\n\n", correto, this.moldes);
        for (var p in this.moldes) {
            var presente = false;
            var molde = Object.assign(new Molde, this.moldes[p]);
            console.log(p, molde, presente, correto);
            for (const existente of correto) {
                console.log(molde, existente);
                if (molde.fornecedor.nome == existente.fornecedor.nome &&
                    molde.nome == existente.nome &&
                    molde.preco == existente.preco &&
                    molde.usos == existente.usos &&
                    molde.cavidades == existente.cavidades
                ) {
                    presente = true;
                    break;
                }
                console.log(typeof (existente), existente, typeof (molde), molde);
            }
            if (!presente) {
                correto.add(molde);
            }
        }
        console.log(correto);
        this.moldes = [...correto];
    }
    remover_extras_duplicados() {
        let correto = new Set();
        console.log("\n\n\n", correto, this.extras);
        for (var e in this.extras) {
            var presente = false;
            var extra = Object.assign(new Extra, this.extras[e]);
            console.log(e, extra, presente, correto);
            for (const existente of correto) {
                console.log(extra, existente);
                if (extra.fornecedor.nome == existente.fornecedor.nome &&
                    extra.nome == existente.nome &&
                    extra.preco == existente.preco
                ) {
                    presente = true;
                    break;
                }
                console.log(typeof (existente), existente, typeof (extra), extra);
            }
            if (!presente) {
                correto.add(extra);
            }
        }
        console.log(correto);
        this.extras = [...correto];
    }
    remover_funcionarios_duplicados() {
        let correto = new Set();
        console.log("\n\n\n", correto, this.funcionarios);
        for (var f in this.funcionarios) {
            var presente = false;
            var funcionario = Object.assign(new Extra, this.funcionarios[f]);
            console.log(f, funcionario, presente, correto);
            for (const existente of correto) {
                console.log(funcionario, existente);
                if (funcionario.nome == existente.nome &&
                    funcionario.preco == existente.preco
                ) {
                    presente = true;
                    break;
                }
                console.log(typeof (existente), existente, typeof (funcionario), funcionario);
            }
            if (!presente) {
                correto.add(funcionario);
            }
        }
        console.log(correto);
        this.funcionarios = [...correto];
    }
    remover_pecas_duplicadas() {
        let correto = new Set();
        console.log("\n\n\n", correto, this.moldes);
        for (var p in this.pecas) {
            var presente = false;
            var peca = Object.assign(new Peca, this.pecas[p]);
            console.log(p, peca, presente, correto);
            for (const existente of correto) {
                console.log(peca, existente);
                if (peca.nome != existente.nome) continue;
                if (peca.resina.nome != existente.resina.nome) continue;
                if (peca.pigmento.nome != existente.pigmento.nome) continue;
                if (peca.molde.nome != existente.molde.nome) continue;
                if (peca.extras.length != existente.extras.length) continue;
                if (peca.funcionario.nome != existente.funcionario.nome) continue;
                if (peca.peso != existente.peso) continue;
                if (peca.tempo != existente.tempo) continue;
                if (peca.paralelo != existente.paralelo) continue;                
                presente = true;
                console.log(typeof (existente), existente, typeof (peca), peca);
                break;
            }
            if (!presente) {
                correto.add(peca);
            }
        }
        console.log(correto);
        this.pecas = [...correto];
    }
    remover_vendas_duplicadas() {
        let correto = new Set();
        console.log("\n\n\n", correto, this.vendas);
        for (var v in this.vendas) {
            var presente = false;
            var venda = Object.assign(new Venda, this.vendas[v]);
            console.log(v, venda, presente, correto);
            for (const existente of correto) {
                console.log(venda, existente);
                if (venda.peca.nome == existente.peca.nome &&
                    venda.valor_venda == existente.valor_venda
                ) {
                    presente = true;
                    break;
                }
                console.log(typeof (existente), existente, typeof (venda), venda);
            }
            if (!presente) {
                correto.add(venda);
            }
        }
        console.log(correto);
        this.vendas = [...correto];
    }
    
    remover_duplicados() {
        this.remover_fornecedores_duplicados();
        this.remover_resinas_duplicadas();
        this.remover_pigmentos_duplicados();
        this.remover_moldes_duplicados();
        this.remover_extras_duplicados();
        this.remover_funcionarios_duplicados();
        this.remover_pecas_duplicadas();
        this.remover_vendas_duplicadas();        
    }



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
            console.log(typeof (t), t);
            t = JSON.parse(t);
            console.log(typeof (t), t);
            t = Object.assign(new Tudo, t);
            console.log(typeof (t), t);
        } catch (e) {
            show("Erro ao carregar dados antigos,gerando novo");
            console.error(e);
            t = new Tudo([], [], [], [], [], [], [], []);
            save_tudo(t);
        }
    }
    show("Carregou Tudo:" + JSON.stringify(t));
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
    var peca = new Peca("PecaX", res, pig, mol, [[ex1, 2], [ex2, 1]], funcionario, 100, 2, 4);
    t.push_peca(peca);
    var venda = new Venda(peca, 90);
    t.push_venda(venda);

}

let rgxPattern = /(.+?)(\d+)/g;
function delete_item(ev) {
    ev.stopImmediatePropagation();
    console.log(ev, ev.target);
    var value = ev.target.value;
    if (value === null) return;
    console.log(value);
    var groups = rgxPattern.exec(value);
    if (groups === null) return;
    console.log(groups);
    if (groups.length !== 3) return;
    for (var g in groups) {
        console.log(g, groups[g]);
    }
    var index = parseInt(groups[2]);
    switch (groups[1]) {
        case 'fornecedor':
            if (confirm("Apagar o fornecedor " + TUDO.fornecedores[index].nome + "?")) {
                TUDO.remove_fornecedor(index);
            }
            break;
        case 'resina':
            if (confirm("Apagar a resina " + TUDO.resinas[index].nome + "?")) {
                TUDO.remove_resina(index);
            }
            break;
        case 'pigmento':
            if (confirm("Apagar o pigmento " + TUDO.pigmentos[index].nome + "?")) {
                TUDO.remove_pigmento(index);
            }
            break;
        case 'molde':
            if (confirm("Apagar o molde " + TUDO.moldes[index].nome + "?")) {
                TUDO.remove_molde(index);
            }
            break;
        case 'extra':
            if (confirm("Apagar o item extra " + TUDO.extras[index].nome + "?")) {
                TUDO.remove_extra(index);
            }
            break;
        case 'funcionario':
            if (confirm("Apagar o funcionario " + TUDO.funcionarios[index].nome + "?")) {
                TUDO.remove_funcionario(index);
            }
            break;
        case 'peca':
            if (confirm("Apagar a peca " + TUDO.pecas[index].nome + "?")) {
                TUDO.remove_peca(index);
            }
            break;
        case 'venda':
            var venda = TUDO.vendas[index];
            venda = Object.assign(new Venda, venda);
            if (confirm("Apagar a venda " + venda.peca.nome + "(R$" + venda.valor_venda.toFixed(2) + ") ?")) {
                TUDO.remove_venda(index);
            }
            break;
        default:
            alert("Desconhecido:" + groups[1]);
            return;
    }
    save_tudo(TUDO);
    updateApp();
}


function exportar_tudo(ev) {
    ev.stopImmediatePropagation();
    console.log(ev);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(TUDO));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "precificacao.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
function adicionar(tudo) {
    console.log("Adicionando");
    if (typeof (tudo) != typeof (TUDO)) return;
    for (var forn in tudo.fornecedores) TUDO.push_fornecedor(tudo.fornecedores[forn]);
    for (var res in tudo.resinas) TUDO.push_resina(tudo.resinas[res]);
    for (var pig in tudo.pigmentos) TUDO.push_pigmento(tudo.pigmentos[pig]);
    for (var mol in tudo.moldes) TUDO.push_molde(tudo.moldes[mol]);
    for (var xtra in tudo.extras) TUDO.push_extra(tudo.extras[xtra]);
    for (var func in tudo.funcionarios) TUDO.push_funcionario(tudo.funcionarios[func]);
    for (var peca in tudo.pecas) TUDO.push_peca(tudo.pecas[peca]);
    for (var venda in tudo.vendas) TUDO.push_venda(tudo.vendas[venda]);
    console.log("Adicionado");
    save_tudo(TUDO);
    updateApp();
}
function input_change(ev) {
    ev.stopImmediatePropagation();
    console.log(ev, ev.target);
    var files = ev.target.files;
    if (files === null) return;
    console.log("File>");
    console.log(files);

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        console.log("FileReader:Load", event.target.result);
        var json = reader.result;
        if (json === null) return;
        console.log(json);
        try {
            json = JSON.parse(json);
            json = Object.assign(new Tudo, json);
        } catch (e) {
            return;
        }
        console.log("Importou o arquivo", json);
        for (; ;) {
            if (confirm("Deseja adicionar dados aos já existentes?")) {
                adicionar(json);
                break;
            }
            if (confirm("Deseja substituir todos os dados?")) {
                TUDO = json;
                save_tudo(TUDO);
                updateApp();
                break;
            }
            if (confirm("Cancelar a importação de dados?")) {
                break;
            }
        }
    });
    reader.readAsText(files[0]);
}


function importar_tudo(ev) {
    ev.stopImmediatePropagation();
    console.log(ev);
    var fileInput = document.createElement('input');
    fileInput.className = 'file-input';
    fileInput.type = 'file';
    fileInput.id = 'import';
    fileInput.addEventListener('change', input_change);
    APP.appendChild(fileInput);
    fileInput.click();
    App.removeChild(fileInput);

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

        cell = document.createElement('td');
        var btn = document.createElement("button");
        btn.textContent = "X";
        btn.value = "fornecedor" + f;
        btn.className = 'delete';
        addEventListeners(btn, delete_item);
        cell.appendChild(btn);
        row.appendChild(cell);
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

function selectFornecedor(id, com_todos) {
    var select = document.getElementById(id);
    if (select !== null) {
        select.remove();
    }
    select = document.createElement('select');
    select.id = id;
    if (com_todos) {
        var todos = document.createElement("option");
        todos.value = '*';
        todos.text = "Todos";
        select.appendChild(todos);
    }
    for (var i in TUDO.fornecedores) {
        var f = TUDO.fornecedores[i];
        var opt = document.createElement('option');
        opt.value = i;
        opt.text = f.nome;
        select.appendChild(opt);
    }
    return select;
}
function selectResina(id, fornecedor_nome) {
    var select = document.getElementById(id);
    if (select === null || select === undefined) return;
    select.childNodes.forEach(child => select.removeChild(child));
    show(fornecedor_nome);
    for (var i in TUDO.resinas) {
        var r = TUDO.resinas[i];
        show(r.fornecedor.nome);
        if (fornecedor_nome !== null //
            && r.fornecedor.nome != fornecedor_nome) {
            continue;
        }
        var opt = document.createElement('option');
        opt.value = i;
        opt.text = r.nome;
        select.appendChild(opt);
    }
    if (select.childNodes.length == 0) {
        select.setAttribute('disabled', 'false');
    } else {
        select.removeAttribute('disabled');
    }
}
function selectPigmento(id, fornecedor_nome) {
    var select = document.getElementById(id);
    if (select === null || select === undefined) return;
    select.childNodes.forEach(child => select.removeChild(child));
    show(fornecedor_nome);
    for (var i in TUDO.pigmentos) {
        var p = TUDO.pigmentos[i];
        show(p.fornecedor.nome);
        if (fornecedor_nome !== null //
            && p.fornecedor.nome != fornecedor_nome) {
            continue;
        }
        var opt = document.createElement('option');
        opt.value = i;
        opt.text = p.nome;
        select.appendChild(opt);
    }
    if (select.childNodes.length == 0) {
        select.setAttribute('disabled', 'false');
    } else {
        select.removeAttribute('disabled');
    }
}
function selectMolde(id, fornecedor_nome) {
    var select = document.getElementById(id);
    if (select === null || select === undefined) return;
    select.childNodes.forEach(child => select.removeChild(child));
    show(fornecedor_nome);
    for (var i in TUDO.moldes) {
        var m = TUDO.moldes[i];
        show(m.fornecedor.nome);
        if (fornecedor_nome !== null //
            && m.fornecedor.nome != fornecedor_nome) {
            continue;
        }
        var opt = document.createElement('option');
        opt.value = i;
        opt.text = m.nome;
        select.appendChild(opt);
    }
    if (select.childNodes.length == 0) {
        select.setAttribute('disabled', 'false');
    } else {
        select.removeAttribute('disabled');
    }
}
function selectExtra(id, fornecedor_nome) {
    var select = document.getElementById(id);
    if (select === null || select === undefined) return;
    select.childNodes.forEach(child => select.removeChild(child));
    show(fornecedor_nome);
    for (var i in TUDO.extras) {
        var x = TUDO.extras[i];
        show(x.fornecedor.nome);
        if (fornecedor_nome !== null //
            && x.fornecedor.nome != fornecedor_nome) {
            continue;
        }
        var opt = document.createElement('option');
        opt.value = i;
        opt.text = x.nome;
        select.appendChild(opt);
    }
    if (select.childNodes.length == 0) {
        select.setAttribute('disabled', 'false');
    } else {
        select.removeAttribute('disabled');
    }
}

function selectFuncionarios(id) {
    var select = document.getElementById(id);
    if (select === null || select === undefined) return;
    select.childNodes.forEach(child => select.removeChild(child));
    show("Funcionarios :" + TUDO.funcionarios);
    for (var i in TUDO.funcionarios) {
        var f = TUDO.funcionarios[i];
        show(f.nome);
        var opt = document.createElement('option');
        opt.value = i;
        opt.text = f.nome;
        select.appendChild(opt);
    }
    if (select.childNodes.length == 0) {
        select.setAttribute('disabled', 'false');
    } else {
        select.removeAttribute('disabled');
    }
}
function selectPecas(id) {
    var select = document.getElementById(id);
    if (select === null || select === undefined) {
        console.log("Não encontrou [" + id + "]");
        return 0;
    }
    select.childNodes.forEach(child => select.removeChild(child));
    show("Pecas :" + TUDO.pecas);
    var out = 0;
    for (var i in TUDO.pecas) {
        var p = TUDO.pecas[i];
        show(p.nome);
        var opt = document.createElement('option');
        opt.value = i;
        opt.text = p.nome;
        select.appendChild(opt);
        out++;
    }
    if (select.childNodes.length == 0) {
        select.setAttribute('disabled', 'false');
    } else {
        select.removeAttribute('disabled');
        select.value = 0;
    }
    return out;
}
function addResina(ev) {
    ev.stopImmediatePropagation();
    ev.preventDefault();
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
    var forn = selectFornecedor('resina-fornecedor', false);
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
        cell.appendChild(document.createTextNode(res.preco.toFixed(2)));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(res.peso.toFixed(2)));
        cell = document.createElement('td');

        var btn = document.createElement("button");
        btn.textContent = "X";
        btn.value = "resina" + f;
        btn.className = 'delete';
        addEventListeners(btn, delete_item);
        cell.appendChild(btn);
        row.appendChild(cell);
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
    var forn = selectFornecedor('pigmento-fornecedor', false);
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
    addEventListeners(btn, addPigmento);
    div.appendChild(btn);
}
function loadPigmentos() {
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
        cell.appendChild(document.createTextNode(pig.preco.toFixed(2)));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(pig.peso.toFixed(2)));
        cell = document.createElement('td');

        var btn = document.createElement("button");
        btn.textContent = "X";
        btn.value = "pigmento" + f;
        btn.className = 'delete';
        addEventListeners(btn, delete_item);
        cell.appendChild(btn);
        row.appendChild(cell);
        tbody.appendChild(row);
    }
    let headers = ['Fornecedor', 'Nome', 'Preço(R$)', 'Peso(gramas)', "Remover"];
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
    save_tudo(TUDO);
    updateApp();
}
function formMolde(parent) {
    var div = document.createElement("div");
    parent.appendChild(div);
    div.className = 'form';
    var forn = selectFornecedor('molde-fornecedor', false);
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
        cell.appendChild(document.createTextNode(mol.preco.toFixed(2)));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(mol.cavidades));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(mol.usos));
        cell = document.createElement('td');

        var btn = document.createElement("button");
        btn.textContent = "X";
        btn.value = "molde" + f;
        btn.className = 'delete';
        addEventListeners(btn, delete_item);
        cell.appendChild(btn);
        row.appendChild(cell);



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

}
function addExtra(ev) {
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
    save_tudo(TUDO);
    updateApp();
}
function formExtra(parent) {
    var div = document.createElement("div");
    parent.appendChild(div);
    div.className = 'form';
    var forn = selectFornecedor('extra-fornecedor', false);
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
        var ex = Object.assign(new Extra, TUDO.extras[f]);
        var cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(ex.fornecedor.nome));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(ex.nome));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(ex.preco.toFixed(2)));
        cell = document.createElement('td');

        var btn = document.createElement("button");
        btn.textContent = "X";
        btn.value = "extra" + f;
        btn.className = 'delete';
        addEventListeners(btn, delete_item);
        cell.appendChild(btn);
        row.appendChild(cell);

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
function addFuncionario(ev) {
    ev.stopImmediatePropagation();
    console.log(ev);
    console.log(typeof (ev));
    var field_nome = document.getElementById('funcionario-nome');
    if (field_nome === null) return;
    var field_preco = document.getElementById('funcionario-preco');
    if (field_preco === null) return;

    var nome = field_nome.value;
    var preco = field_preco.value;

    if (nome.length <= 3) {
        alert("Nome de funcionario muito curto");
        return;
    }
    try {
        if (!checkNum(preco)) {
            throw new TypeError("");
        }
        preco = parseFloat(preco);
    } catch (e) {
        alert("Custo preenchido incorretamente");
        return;
    }

    var funcionario = new Funcionario(nome, preco);
    TUDO.push_funcionario(funcionario);
    save_tudo(TUDO);
    updateApp();
}
function formFuncionarios(parent) {
    var div = document.createElement("div");
    parent.appendChild(div);
    div.className = 'form';
    var nome = document.createElement("input");
    var preco = document.createElement("input");
    nome.id = 'funcionario-nome';
    nome.setAttribute('type', 'text');
    preco.id = 'funcionario-preco';
    preco.setAttribute("type", 'number');


    var heading = document.createElement("h2");
    heading.innerText = "Cadastro de funcionário";
    div.appendChild(heading);
    div.appendChild(document.createTextNode("Nome:"));
    div.appendChild(nome);
    div.appendChild(document.createTextNode("Custo(R$/hora):"));
    div.appendChild(preco);
    var btn = document.createElement("button");
    btn.innerText = "Adicionar Funcionário";
    btn.setAttribute("type", 'button');
    addEventListeners(btn, addFuncionario);
    div.appendChild(btn);
}
function loadFuncionarios() {
    var div = document.createElement('div');
    div.id = "funcionarios";
    div.className = "panel";
    var heading = document.createElement("h1");
    heading.innerText = 'Funcionários';
    div.appendChild(heading);
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var theadrow = document.createElement('tr');
    var tbody = document.createElement("tbody");
    for (var f in TUDO.funcionarios) {
        var row = document.createElement('tr');
        var func = TUDO.funcionarios[f];
        var cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(func.nome));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(func.preco.toFixed(2)));
        cell = document.createElement('td');

        var btn = document.createElement("button");
        btn.textContent = "X";
        btn.value = "funcionario" + f;
        btn.className = 'delete';
        addEventListeners(btn, delete_item);
        cell.appendChild(btn);
        row.appendChild(cell);

        tbody.appendChild(row);
    }
    let headers = ['Nome', 'Preço(R$/hora)'];
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
    formFuncionarios(div);
    APP.appendChild(div);

}
function addPeca(ev) {
    ev.stopImmediatePropagation();
    console.log(ev);
    console.log(typeof (ev));
    var field_nome = document.getElementById('peca-nome');
    if (field_nome === null) return;
    var field_peso = document.getElementById('peca-peso');
    if (field_peso === null) return;
    var field_tempo = document.getElementById('peca-tempo');
    if (field_tempo === null) return;
    var field_paralelo = document.getElementById('peca-paralelo');
    if (field_paralelo === null) return;

    var field_resina = document.getElementById('peca-resina');
    if (field_resina === null) return;
    var field_pigmento = document.getElementById('peca-pigmento');
    if (field_pigmento === null) return;
    var field_molde = document.getElementById('peca-molde');
    if (field_molde === null) return;
    var field_funcionario = document.getElementById('peca-funcionario');
    if (field_funcionario === null) return;

    var nome = field_nome.value;
    var peso = field_peso.value;
    var tempo = field_tempo.value;
    var paralelo = field_paralelo.value;
    var resina = field_resina.value;
    var pigmento = field_pigmento.value;
    var molde = field_molde.value;
    var funcionario = field_funcionario.value;


    if (nome.length <= 3) {
        alert("Nome de peça muito curto");
        return;
    }
    try {
        if (!checkNum(peso)) { throw new TypeError(""); }
        peso = parseFloat(peso);
    } catch (e) {
        alert("Peso preenchido incorretamente");
        return;
    }
    try {
        if (!checkNum(tempo)) { throw new TypeError(""); }
        tempo = parseFloat(tempo);
    } catch (e) {
        alert("Tempo preenchido incorretamente");
        return;
    }
    try {
        if (!checkNum(paralelo)) { throw new TypeError(""); }
        paralelo = parseInt(paralelo);
    } catch (e) {
        alert("QuantidadeParalelo preenchido incorretamente");
        return;
    }
    var r, p, m, f;
    r = TUDO.resinas[parseInt(resina)];
    p = TUDO.pigmentos[parseInt(pigmento)];
    m = TUDO.moldes[parseInt(molde)];
    f = TUDO.funcionarios[parseInt(funcionario)];
    console.log(nome, peso, tempo, paralelo, r, p, m, f, EXTRAS_LIST);
    var peca = new Peca(nome, r, p, m, EXTRAS_LIST, f, peso, tempo, paralelo);
    TUDO.push_peca(peca);
    EXTRAS_LIST = [];
    save_tudo(TUDO);
    updateApp();

}
function updateFornecedoresResina(ev) {
    ev.preventDefault();
    var fornecedor = document.getElementById('peca-fornecedor-resina');
    var nome = null;
    if (fornecedor.value != "*") nome = TUDO.fornecedores[parseInt(fornecedor.value)].nome
    selectResina('peca-resina', nome);
}
function updateFornecedoresPigmento(ev) {
    ev.preventDefault();
    var fornecedor = document.getElementById('peca-fornecedor-pigmento');

    var nome = null;
    if (fornecedor.value != "*") nome = TUDO.fornecedores[parseInt(fornecedor.value)].nome
    selectPigmento('peca-pigmento', nome);
}
function updateFornecedoresMolde(ev) {
    ev.preventDefault();
    var fornecedor = document.getElementById('peca-fornecedor-molde');
    var nome = null;
    if (fornecedor.value != "*") nome = TUDO.fornecedores[parseInt(fornecedor.value)].nome
    selectMolde('peca-molde', nome);
}
function updateFornecedoresExtra(ev) {
    ev.preventDefault();
    var fornecedor = document.getElementById('peca-fornecedor-extra');
    var nome = null;
    if (fornecedor.value != "*") nome = TUDO.fornecedores[parseInt(fornecedor.value)].nome
    selectExtra('peca-extra', nome);
}
function addPecaExtra(ev) {
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
    show(ev);
    var select = document.getElementById('peca-extra');
    if (select === null) return;
    var extra_selecionado = TUDO.extras[parseInt(select.value)];
    var qtde = window.prompt("Quantos desse item?");
    if (qtde === null) return;
    show(extra_selecionado);
    show(qtde);
    if (!checkNum(qtde)) return;
    qtde = parseInt(qtde);
    EXTRAS_LIST.push([Object.assign(new Extra, extra_selecionado), qtde]);
    loadTmpExtras('peca-extra-table');

}
function loadTmpExtras(id) {
    var table = document.getElementById(id);
    if (table === null) return;
    while (table.firstChild) { table.removeChild(table.lastChild); }
    if (EXTRAS_LIST.length == 0) {
        table.style.display = 'none';
        return
    }
    table.style.display = 'block';

    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);
    var tr = document.createElement('tr');
    let headers = ['Nome', "Valor unitário", 'Quantidade'];
    for (var h in headers) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(headers[h]));
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    for (var i in EXTRAS_LIST) {
        var par = EXTRAS_LIST[i];
        var tbodytr = document.createElement('tr');
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(par[0].nome));
        tbodytr.appendChild(td);
        td = document.createElement('td');
        td.appendChild(document.createTextNode(par[0].preco.toFixed(2)));
        tbodytr.appendChild(td);
        td = document.createElement('td');
        td.appendChild(document.createTextNode(par[1]));
        tbodytr.appendChild(td);
        tbody.appendChild(tbodytr);
    }


}
function formPecas(parent) {
    var div = document.createElement("div");
    parent.appendChild(div);
    div.className = 'form';

    var heading = document.createElement("h2");
    heading.innerText = "Cadastro de peça";
    div.appendChild(heading);


    //NOME
    var nome = document.createElement("input");
    nome.id = 'peca-nome';
    nome.setAttribute('type', 'text');
    nome.addEventListener('change', updateFormPecas);
    div.appendChild(document.createTextNode("Nome:"));
    div.appendChild(nome);

    //PESO
    var peso = document.createElement("input");
    peso.id = 'peca-peso';
    peso.setAttribute('type', 'number');
    div.appendChild(document.createTextNode("Peso(gramas):"));
    div.appendChild(peso);

    //TEMPO
    var tempo = document.createElement('input');
    tempo.id = 'peca-tempo';
    tempo.setAttribute('type', 'number');
    div.appendChild(document.createTextNode("Tempo(horas):"));
    div.appendChild(tempo);

    //PARALELO
    var paralelo = document.createElement('input');
    paralelo.id = 'peca-paralelo';
    paralelo.setAttribute('type', 'number');
    div.appendChild(document.createTextNode("Quantidade de peças feitas ao mesmo tempo:"));
    div.appendChild(paralelo);



    //RESINA
    var r_div = document.createElement('div');

    r_div.appendChild(document.createTextNode("Fornecedor da Resina:"));
    var f_resina = selectFornecedor('peca-fornecedor-resina', true);
    var resina = document.createElement('select');
    resina.id = 'peca-resina';

    f_resina.addEventListener('change', updateFornecedoresResina);
    r_div.appendChild(f_resina);
    r_div.appendChild(document.createTextNode("Resina:"));
    r_div.appendChild(resina);
    div.appendChild(r_div);

    //PIGMENTO
    var p_div = document.createElement('div');

    p_div.appendChild(document.createTextNode("Fornecedor do Pigmento:"));
    var f_pigmento = selectFornecedor('peca-fornecedor-pigmento', true);
    var pigmento = document.createElement('select');
    pigmento.id = 'peca-pigmento';
    f_pigmento.addEventListener('change', updateFornecedoresPigmento);
    p_div.appendChild(f_pigmento);
    p_div.appendChild(document.createTextNode("Pigmento:"));
    p_div.appendChild(pigmento);
    div.appendChild(p_div);


    //MOLDE
    var m_div = document.createElement('div');

    m_div.appendChild(document.createTextNode("Fornecedor do Molde:"));
    var f_molde = selectFornecedor('peca-fornecedor-molde', true);
    var molde = document.createElement('select');
    molde.id = 'peca-molde';
    f_molde.addEventListener('change', updateFornecedoresMolde);
    m_div.appendChild(f_molde);
    m_div.appendChild(document.createTextNode("Molde:"));
    m_div.appendChild(molde);
    div.appendChild(m_div);

    //Extras
    var e_div = document.createElement('div');
    var f_extra = selectFornecedor('peca-fornecedor-extra', true);
    var extra = document.createElement('select');
    var extras = document.createElement('table');
    var btn_extras = document.createElement('button');
    extras.id = 'peca-extra-table';

    btn_extras.id = 'peca-extra-add';
    btn_extras.innerText = "Adicionar item à peça";
    addEventListeners(btn_extras, addPecaExtra);
    extra.id = 'peca-extra';
    f_extra.addEventListener('change', updateFornecedoresExtra);
    e_div.appendChild(extras);
    e_div.appendChild(document.createTextNode("Fornecedor do item extra:"));
    e_div.appendChild(f_extra);
    e_div.appendChild(document.createTextNode("Item extra:"));
    e_div.appendChild(extra);
    e_div.appendChild(btn_extras);
    div.appendChild(e_div);

    //funcionario
    var f_div = document.createElement('div');
    f_div.appendChild(document.createTextNode("Funcionario:"));
    var funcionario = document.createElement('select');
    funcionario.id = 'peca-funcionario';
    f_div.appendChild(funcionario);
    div.appendChild(f_div);


    var btn = document.createElement("button");
    btn.innerText = "Adicionar Peca";
    btn.setAttribute("type", 'button');
    addEventListeners(btn, addPeca);
    div.appendChild(btn);
    updateFormPecas();
    div.addEventListener('load', updateFormPecas);

}
function updateFormPecas() {
    selectResina('peca-resina', null);
    selectPigmento('peca-pigmento', null);
    selectMolde('peca-molde', null);
    selectExtra('peca-extra', null);
    selectFuncionarios('peca-funcionario');
}

function loadPecas() {
    var div = document.createElement('div');
    div.id = "pecas";
    div.className = "panel";
    var heading = document.createElement("h1");
    heading.innerText = 'Peças';
    div.appendChild(heading);
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var theadrow = document.createElement('tr');
    var tbody = document.createElement("tbody");
    for (var f in TUDO.pecas) {
        var row = document.createElement('tr');
        var peca = Object.assign(new Peca, TUDO.pecas[f]);
        var cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(peca.nome));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(peca.molde.nome));

        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(peca.custo_material().toFixed(2)));

        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(peca.mao_de_obra().toFixed(2)));

        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(peca.custo_total().toFixed(2)));
        cell = document.createElement('td');

        var btn = document.createElement("button");
        btn.textContent = "X";
        btn.value = "peca" + f;
        btn.className = 'delete';
        addEventListeners(btn, delete_item);
        cell.appendChild(btn);
        row.appendChild(cell);



        tbody.appendChild(row);
    }
    let headers = ['Nome', "Molde", "Custo Material", "Mão de obra", 'Custo Bruto(R$)'];
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
    formPecas(div);
    APP.appendChild(div);

}
function addVenda(ev) {
    ev.stopImmediatePropagation();
    ev.preventDefault();
    console.log(ev);
    console.log("addVenda");
    console.log(typeof (ev));
    var field_peca = document.getElementById('venda-peca');
    if (field_peca === null) return;
    if (field_peca.value === null || field_peca.value === "") return;


    var peca = TUDO.pecas[parseInt(field_peca.value)];
    peca = Object.assign(new Peca, peca);

    try {
        if (!checkNum(VALOR_VENDA)) {
            throw new TypeError("");
        }
        VALOR_VENDA = parseFloat(VALOR_VENDA);
    } catch (e) {
        alert("Valor de venda preenchido incorretamente");
        return;
    }
    if (VALOR_VENDA < 0) return;
    var venda = new Venda(peca, VALOR_VENDA);
    console.log("Nova Venda : " + venda);
    VALOR_VENDA = -1;
    TUDO.push_venda(venda);
    save_tudo(TUDO);
    updateApp();
}
function atualizarPrecoVenda(ev) {
    ev.stopImmediatePropagation();
    var field = document.getElementById('venda-slider');
    if (field === null) return;
    if (!checkNum(field.value)) return;
    var lucro = document.getElementById('venda-lucro');
    if (lucro === null) return;
    var peca = document.getElementById('venda-peca');
    if (peca === null) return;
    var selecionada = peca.value;
    if (selecionada === null || selecionada === "") {
        updateFormVendas();
        //selectPecas('venda-peca');
        return;
    }
    console.log(ev, selecionada, field.value);
    peca = TUDO.pecas[parseInt(selecionada)];
    peca = Object.assign(new Peca, peca);
    var valor = peca.custo_total() * parseFloat(field.value);
    lucro.innerText = "R$" + valor.toFixed(2);
    VALOR_VENDA = valor;
    console.log("VALOR_VENDA:" + VALOR_VENDA);
}
function formVendas(parent) {
    var div = document.createElement("div");
    parent.appendChild(div);
    div.className = 'form';
    var peca = document.createElement('select');
    peca.id = "venda-peca";


    var preco = document.createElement("input");
    preco.id = 'venda-slider';
    preco.setAttribute("type", 'range');
    preco.setAttribute("min", '1');
    preco.setAttribute("max", '5');
    preco.setAttribute('value', '2');
    preco.setAttribute("step", '0.005');

    var heading = document.createElement("h2");
    heading.innerText = "Cadastro de Venda";
    div.appendChild(heading);
    div.appendChild(document.createTextNode("Peça:"));
    div.appendChild(peca);
    div.appendChild(document.createTextNode("Lucro planejado:"));
    div.appendChild(preco);
    var valor_de_venda = document.createElement('p');
    valor_de_venda.innerText = "R$?";
    valor_de_venda.id = 'venda-lucro';
    div.appendChild(document.createTextNode("Preço final:"));
    div.appendChild(valor_de_venda)
    var btn = document.createElement("button");
    btn.innerText = "Adicionar Venda";
    btn.setAttribute("type", 'button');
    addEventListeners(btn, addVenda);
    preco.addEventListener('change', atualizarPrecoVenda);
    div.appendChild(btn);
}
function updateFormVendas() {
    var pecas = selectPecas("venda-peca");
    console.log("Peças : " + pecas);

}

function loadVendas() {
    var div = document.createElement('div');
    div.id = "vendas";
    div.className = "panel";
    var heading = document.createElement("h1");
    heading.innerText = 'Vendas';
    div.appendChild(heading);
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var theadrow = document.createElement('tr');
    var tbody = document.createElement("tbody");
    for (var v in TUDO.vendas) {
        var row = document.createElement('tr');
        var venda = TUDO.vendas[v];
        venda = Object.assign(new Venda, venda);
        var cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(venda.peca.nome));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(venda.valor_venda.toFixed(2)));
        cell = document.createElement('td');
        row.appendChild(cell);
        cell.appendChild(document.createTextNode((100 * venda.margem_de_lucro()).toFixed(2)));
        cell = document.createElement('td');

        var btn = document.createElement("button");
        btn.textContent = "X";
        btn.value = "venda" + v;
        btn.className = 'delete';
        addEventListeners(btn, delete_item);
        cell.appendChild(btn);
        row.appendChild(cell);

        tbody.appendChild(row);

    }
    let headers = ['Nome', 'Preço Venda', 'Margem de Lucro(%)'];
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
    formVendas(div);
    APP.appendChild(div);

}

function loadFooter() {
    var div = document.createElement('div');
    div.id = "footer";
    div.className = "footer";
    var importar = document.createElement("button");
    var exportar = document.createElement("button");

    importar.innerText = 'Importar';
    exportar.innerText = "Exportar";

    addEventListeners(importar, importar_tudo);
    addEventListeners(exportar, exportar_tudo);

    div.appendChild(importar);
    div.appendChild(exportar);
    APP.appendChild(div);
}
function clearApp() {
    let divs = ['fornecedores', 'resinas', 'pigmentos', 'moldes', 'extras', 'funcionarios', 'pecas', 'vendas', 'footer'];
    for (var i in divs) {
        var div = document.getElementById(divs[i]);
        if (div !== null) {
            div.remove();
        }
    }
}
function updateApp() {
    clearApp();
    TUDO.remover_duplicados();
    for (; ;) {
        loadFornecedores();
        if (TUDO.fornecedores.length == 0) break;
        loadResinas();
        loadPigmentos();
        loadMoldes();
        loadExtras();
        loadFuncionarios();
        if (TUDO.resinas.length == 0 ||//
            TUDO.pigmentos.length == 0 ||//
            TUDO.moldes.length == 0 ||//
            TUDO.funcionarios.length == 0) break;
        loadPecas();
        if (TUDO.pecas.length == 0) break;
        loadVendas();
        break;
    }
    loadFooter();
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