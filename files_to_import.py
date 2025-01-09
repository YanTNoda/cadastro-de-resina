import json
import os
from itertools import chain
from typing import Dict, List, Set, Tuple, Union

from icecream import ic
from pydantic import AliasChoices, BaseModel, Field, PositiveInt, field_validator


class Fornecedor(BaseModel):
    nome: str = Field(validation_alias=AliasChoices("nome", "fornecedor"))


class Insumo(BaseModel):
    fornecedor: Fornecedor
    nome: str = Field(validation_alias=AliasChoices("nome", "name"))
    preco: float

    @field_validator("fornecedor", mode="before")
    @classmethod
    def fornecedor(cls, value) -> Fornecedor:
        if isinstance(value, Fornecedor):
            return value
        return Fornecedor(nome=str(value))


class InsumoComPeso(BaseModel):
    fornecedor: Fornecedor
    nome: str = Field(validation_alias=AliasChoices("nome", "name"))
    preco: float
    peso: float

    @field_validator("fornecedor", mode="before")
    @classmethod
    def fornecedor(cls, value) -> Fornecedor:
        if isinstance(value, Fornecedor):
            return value
        return Fornecedor(nome=str(value))


class Resina(BaseModel):
    fornecedor: Fornecedor
    nome: str = Field(validation_alias=AliasChoices("nome", "name"))
    preco: float
    peso: float

    @field_validator("fornecedor", mode="before")
    @classmethod
    def fornecedor(cls, value) -> Fornecedor:
        if isinstance(value, Fornecedor):
            return value
        return Fornecedor(nome=str(value))


class Pigmento(BaseModel):
    fornecedor: Fornecedor
    nome: str = Field(validation_alias=AliasChoices("nome", "name"))
    preco: float
    peso: float

    @field_validator("fornecedor", mode="before")
    @classmethod
    def fornecedor(cls, value) -> Fornecedor:
        if isinstance(value, Fornecedor):
            return value
        return Fornecedor(nome=str(value))


def preco_por_grama(item: Union[Resina, Pigmento]) -> float:
    return float(item.preco) / float(item.peso)


class Extra(BaseModel):
    fornecedor: Fornecedor
    nome: str = Field(validation_alias=AliasChoices("nome", "name"))
    preco: float

    @field_validator("fornecedor", mode="before")
    @classmethod
    def fornecedor(cls, value) -> Fornecedor:
        if isinstance(value, Fornecedor):
            return value
        return Fornecedor(nome=str(value))


class Molde(BaseModel):
    fornecedor: Fornecedor
    nome: str = Field(validation_alias=AliasChoices("nome", "name"))
    preco: float
    cavidades: PositiveInt = Field(validation_alias=AliasChoices("cavidades", "pecas"))
    usos: PositiveInt = Field(validation_alias=AliasChoices("usos", "max_usos"))

    @field_validator("fornecedor", mode="before")
    @classmethod
    def fornecedor(cls, value) -> Fornecedor:
        if isinstance(value, Fornecedor):
            return value
        return Fornecedor(nome=str(value))

    def preco_por_uso(self) -> float:
        return self.preco / (self.usos * self.cavidades)


class Funcionario(BaseModel):
    nome: str = Field(validation_alias=AliasChoices("nome", "name"))
    preco: float


class Peca(BaseModel):
    nome: str = Field(validation_alias=AliasChoices("nome", "descricao"))
    resina: Resina
    pigmento: Pigmento
    molde: Molde
    extras: List[Tuple[Extra, int]] = []
    funcionario: Funcionario
    peso: float
    tempo: float = Field(validation_alias=AliasChoices("tempo", "horas"))
    paralelo: PositiveInt = Field(
        validation_alias=AliasChoices("paralelo", "paralelos")
    )

    @field_validator("extras", mode="before")
    @classmethod
    def any_to_extras(cls, value) -> List[Tuple[Extra, int]]:
        if isinstance(value, List):
            if len(value) == 0:
                return []
            if isinstance(value[0], Tuple):
                if isinstance(value[0][0], Extra) and isinstance(value[0][1], int):
                    return value
            tmp_dict = {}
            hash_dict: Dict[int, Extra] = {}
            count = 0
            for v in value:
                extra = Extra(**v)
                index = 0
                for h, a in hash_dict.items():
                    if extra == a:
                        index = h
                        break
                else:
                    hash_dict[count] = extra
                    count += 1

                tmp_dict[index] = tmp_dict.get(index, 0) + 1
            return [(hash_dict[chave], valor) for chave, valor in tmp_dict.items()]
        ic(value, type(value))
        raise ValueError(value, "Indefinido")

    def preco(self) -> float:
        soma: float = 0
        soma += self.peso * 0.97 * preco_por_grama(self.resina)
        soma += self.peso * 0.03 * preco_por_grama(self.pigmento)
        soma += self.molde.preco_por_uso()
        for tup in self.extras:
            soma += tup[0].preco * tup[1]
        soma += self.funcionario.preco * (self.tempo / self.paralelo)
        return soma


class Venda(BaseModel):
    peca: Peca
    valor_venda: float = Field(validation_alias=AliasChoices("valor_venda", "preco"))


class Tudo(BaseModel):
    fornecedores: List[Fornecedor] = []
    resinas: List[Resina] = []
    pigmentos: List[Pigmento] = []
    extras: List[Extra] = []
    funcionarios: List[Funcionario] = []
    moldes: List[Molde] = []
    pecas: List[Peca] = []
    vendas: List[Venda] = []


def ler_vendas(arquivo: str = "vendas.json") -> List[Venda]:
    try:
        with open(arquivo) as f:
            vendas_raw = json.load(f)
    except:
        return []
    for v in vendas_raw:
        if "preco" not in v:
            peca = Peca(**v["peca"])
            v["preco"] = float(v["margem"]) * peca.preco()
    return [Venda(**v) for v in vendas_raw]


def ler_pecas(arquivo: str = "pecas.json") -> List[Peca]:
    try:
        with open(arquivo) as f:
            pecas_raw = json.load(f)
    except:
        return []
    return [Peca(**p) for p in pecas_raw]


def ler_funcionarios(arquivo: str = "funcionarios.json") -> List[Funcionario]:
    try:
        with open(arquivo) as f:
            f_raw = json.load(f)
    except:
        return []
    return [Funcionario(**fr) for fr in f_raw]


def ler_extras(arquivo: str = "extras.json") -> List[Extra]:
    try:
        with open(arquivo) as f:
            e_raw = json.load(f)
    except:
        return []
    return [Extra(**e) for e in e_raw]


def ler_moldes(arquivo: str = "moldes.json") -> List[Molde]:
    try:
        with open(arquivo) as f:
            molde_raw = json.load(f)
    except:
        return []
    return [Molde(**m) for m in molde_raw]


def ler_pigmentos(arquivo: str = "pigmentos.json") -> List[Pigmento]:
    try:
        with open(arquivo) as f:
            pig_raw = json.load(f)
    except:
        return []
    return [Pigmento(**p) for p in pig_raw]


def ler_resinas(arquivo: str = "resinas.json") -> List[Resina]:
    try:
        with open(arquivo) as f:
            resin_raw = json.load(f)
    except:
        return []
    return [Resina(**r) for r in resin_raw]


def redux(l: List) -> List:
    out: Dict = {}
    for i in l:
        try:
            out[i.nome] = i
        except:
            out[i.peca.nome] = i
    return list(out.values())


if __name__ == "__main__":
    ic()
    vendas: List[Venda] = ler_vendas()
    pecas: List[Peca] = ler_pecas()
    funcionarios: List[Funcionario] = ler_funcionarios()
    extras: List[Extra] = ler_extras()
    moldes: List[Extra] = ler_moldes()
    pigmentos: List[Pigmento] = ler_pigmentos()
    resinas: List[Resina] = ler_resinas()
    fornecedores: List[Fornecedor] = []
    for v in vendas:
        pecas.append(v.peca)
    for p in pecas:
        funcionarios.append(p.funcionario)
        moldes.append(p.molde)
        pigmentos.append(p.pigmento)
        resinas.append(p.resina)
        for e in p.extras:
            extras.append(e[0])
    for item in chain(extras, moldes, pigmentos, resinas):
        fornecedores.append(item.fornecedor)
    ic(
        len(fornecedores),
        len(resinas),
        len(pigmentos),
        len(moldes),
        len(extras),
        len(funcionarios),
        len(pecas),
        len(vendas),
    )
    t = Tudo(
        fornecedores=redux(fornecedores),
        resinas=redux(resinas),
        pigmentos=redux(pigmentos),
        extras=redux(extras),
        funcionarios=redux(funcionarios),
        moldes=redux(moldes),
        pecas=redux(pecas),
        vendas=redux(vendas),
    )
    ic(t)
    outputfile: str = "precificacao.json"
    while os.path.exists(outputfile):
        outputfile = "_" + outputfile
    with open(outputfile, "w") as f:
        json.dump(t.model_dump(), f)
    ic()
