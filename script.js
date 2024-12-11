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
    push_fornecedor(fornecedor) {
        this.fornecedores.push(fornecedor);
    }

    push_resina(resina) {
        this.resinas.push(resina);
    }
    push_pigmento(pigmento) {
        this.pigmentos.push(pigmento);
    }
    push_molde(molde) {
        this.moldes.push(molde);
    }
    push_extra(extra) {
        this.extras.push(extra);
    }
    push_funcionario(funcionario) {
        this.funcionarios.push(funcionario);
    }
    push_peca(peca) {
        this.pecas.push(peca);
    }
    push_venda(venda) {
        this.vendas.push(venda);
    }
    
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
        show(typeof (t)); show(t);
        t = JSON.parse(t);
        show(typeof (t)); show(t);
        t = Object.assign(new Tudo, t);
        show(typeof (t)); show(t);
    }

    return t;
}

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
    var t = load_tudo();
    var forn = new Fornecedor("fornecedor");
    t.push_fornecedor(forn);
    show(forn)
    show(JSON.stringify(forn));
    show(JSON.parse(localStorage.getItem("tudo")));
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
    save_tudo(t);
    show(JSON.stringify(venda.peca));
    show(venda.lucro());
    show(venda.margem_de_lucro());
    show("Carregou");
}