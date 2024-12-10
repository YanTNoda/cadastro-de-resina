class Fornecedor{
    constructor(nome){
        this.nome = nome;
    }
}
class Insumo{
    constructor(fornecedor,nome,preco){
        this.fornecedor = fornecedor;
        this.nome = nome;
        this.preco = preco;
    }
}
class InsumoComPeso extends Insumo{
    constructor(fornecedor,nome,preco,peso){
        super(fornecedor,nome,preco);
        this.peso = peso;
    }
    preco_por_grama(){
        return this.preco/this.peso;
    }
}
class Resina extends InsumoComPeso{}
class Pigmento extends InsumoComPeso{}
class Extra extends Insumo{}
class Molde extends Insumo{
    constructor(fornecedor,nome,preco,cavidades,usos){
        super(fornecedor,nome,preco);
        this.cavidades=cavidades;
        this.usos=usos;
    }
    custo_por_peca(){
        return this.preco/(this.cavidades*this.usos);
    }
}
class Funcionario{
    constructor(nome,preco){
        this.nome=nome;
        this.preco=preco;
    }
}
class Peca{
    constructor(resina,pigmento,molde,extras,funcionario,peso,tempo,paralelo){
        this.resina = resina;
        this.pigmento = pigmento;
        this.molde = molde;
        this.extras = extras;
        this.funcionario = funcionario;
        this.peso = peso;
        this.tempo = tempo;
        this.paralelo = paralelo;
    }
    mao_de_obra(){
        return this.tempo * this.funcionario.preco / this.paralelo;
    }
    custo_material(){
        var r = this.resina.preco_por_grama() * 0.97 * this.peso;
        var p = this.pigmento.preco_por_grama() * 0.03 * this.peso;
        var e = 0;
        for(var extra_e_qtde in this.extras){
            e += extra_e_qtde[0].preco * extra_e_qtde[1];
        }
        return r+p+e+this.molde.custo_por_peca;
    }
}
class Tudo{
    constructor(fornecedores,resinas,pigmentos,extras,funcionarios,moldes,pecas,vendas){
        this.fornecedores = fornecedores;
        this.resinas=resinas;
        this.pigmentos = pigmentos;
        this.extras = extras;
        this.funcionarios = funcionarios;
        this.moldes = moldes;
        this.pecas = pecas;
        this.vendas = vendas;
    }
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
    localStorage.setItem("fulldata",JSON.stringify({"0":['1',[4,3,1,'b']]}));
    var d = localStorage.getItem("fulldata");
    show(d);
    show(JSON.parse(d));
    var t = new Tudo([],[],[],[],[],[],[],[]);
    localStorage.setItem("tudo",JSON.stringify(t));
    show(JSON.parse(localStorage.getItem("tudo")));
    show("Carregou");
}