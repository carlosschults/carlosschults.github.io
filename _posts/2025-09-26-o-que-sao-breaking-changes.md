---
title: "O Que São Breaking Changes?"
ref: what-are-breaking-changes
lang: pt
layout: post
author: Carlos Schults
img: /img/what-are-breaking-changes/cover.jpg
description: "Aprenda o conceito de breaking changes em software: o que são, por que importam e o que fazer sobre elas"
permalink: /pt/o-que-sao-breaking-changes
tags:
- de_a_a_z
- breaking_changes
---

![]({{ page.img }})
Foto por <a href="https://unsplash.com/@denisolvr?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Denis Oliveira</a> no <a href="https://unsplash.com/photos/grayscale-photography-of-speedboat-yplNhhXxBtM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>      

Estou começando uma série de artigos onde vou definir alguns conceitos ou termos que são comuns no desenvolvimento de software, e estou começando com **Breaking Changes**. Afinal, por que começar com A como uma pessoa normal?

Beleza, mas... por que escrever uma série assim?

Principalmente porque quero criar os recursos que gostaria de ter tido quando estava começando.

Naquela época, me deixava louco quando as pessoas falavam de coisas como se eu já soubesse o que elas significavam.

Olha, eu sou um desenvolvedor ~~velho~~ experiente, o que significa que na minha época eu não tinha um amiguinho de IA pra simplesmente perguntar essas coisas. Sim, o Google já existia, também não sou tão ~~velho~~ experiente assim né, porra.

O problema é que muitas vezes as explicações que você encontrava no Google não eram lá essas coisas. Frequentemente o Stack Overflow ajudava, mas nem sempre. Hoje em dia, claro, você pode perguntar pro seu LLM favorito pra explicar as coisas pra você, se você não se importar com o tom genérico, desprovido de qualquer voz humana autêntica ou anedotas.

Então, estou escrevendo esses artigos pra ajudar os iniciantes por aí a entender um pouco melhor alguns conceitos chave do desenvolvimento de software, um de cada vez, de forma simples e interessante, espero. Tudo cortesia do seu amigo aqui.
Vamos começar?

## O que é um breaking change?
"Breaking change" significa qualquer mudança que você faz no seu software que pode fazer o código dos seus usuários quebrar, depois que eles fizerem o upgrade. Breaking changes só fazem sentido quando você pensa em software que você cria e de alguma forma distribui para usuários terceiros.

![Uma tira de quadrinhos sobre breaking changes](https://imgs.xkcd.com/comics/workflow.png "Sempre tem um XKCD relevante")

Pense em coisas como:

- APIs
- bibliotecas/pacotes
- frameworks
- ferramentas CLI

Vamos ver um exemplo. Enquanto desenvolvia uma aplicação pra sua empresa, você extraiu algumas funcionalidades comuns como uma biblioteca e decidiu publicar isso como um pacote open-source hospedado no [https://www.nuget.org](https://www.nuget.org).

Depois de um tempo, você publica uma nova versão onde muda o nome de um dos métodos mais importantes e usados dentro do pacote. Os usuários fazem upgrade pra sua versão mais nova e agora o código deles não compila mais, porque ainda se refere ao método usando o nome original. **Isso é um breaking change!**

{% capture content %}

Importante: pra algo ser um breaking change, não é necessário que 100% dos usuários quebrem quando fazem upgrade. No nosso exemplo, é possível que nem todos os usuários estivessem realmente usando aquele método específico no código deles, o que significa que o código deles não teria quebrado. Mas a mudança ainda é um breaking change, porque o potencial de quebrar está lá.

{% endcapture %}
{% include callout.html type="info" title="NOTA"  content=content %}

## Exemplos de Breaking Changes

Na prática, que tipos de mudanças são breaking changes?

Eu diria que a mais comum, ou pelo menos o que a maioria das pessoas pensaria como breaking change, seria excluir ou renomear coisas.

Se você renomeia um endpoint de API, uma classe pública ou método do seu pacote, ou um comando do seu CLI, código que usa essas coisas não vai mais funcionar. E, pra todos os efeitos práticos, renomear é a mesma coisa que excluir, porque aquela versão antiga não existe mais.

!["John Travolta confuso procurando algo"](/img/travolta.gif)

*Cadê o método que estava aqui?*

Existem outros tipos de breaking changes, então vamos revisar alguns deles.

### Novos Parâmetros Obrigatórios

Se você adiciona novos parâmetros a um método, e eles são obrigatórios, então todo código existente que chama o método vai falhar na compilação. A solução aqui seria adicionar novos parâmetros como opcionais, ou até criar um novo método.

### Parâmetros opcionais removidos ou tornados obrigatórios

Essa é uma continuação lógica da anterior. Se você remove um parâmetro opcional, código que chama aquele método passando o parâmetro vai quebrar. Por outro lado, se você torna um parâmetro opcional obrigatório, acontece o oposto: agora todos os lugares que não passam o parâmetro vão quebrar.

### Novos Membros Adicionados a Uma Interface

Aqui estou falando especificamente de linguagens estaticamente tipadas que têm o conceito de interface onde você define comportamentos que classes cliente precisam implementar.

Adicionar um novo membro a uma interface é um breaking change porque agora todas as classes que a implementam não teriam implementado o novo membro.

Recentemente, o time do C# resolveu esse problema de uma forma que gerou alguma controvérsia: adicionando a possibilidade de [implementar métodos nas próprias interfaces!](https://devblogs.microsoft.com/dotnet/default-implementations-in-interfaces/)

### Mudou o Tipo de um Parâmetro de Método

Se você muda o tipo de um parâmetro de, digamos, `string` para `int`, você está garantindo que muito código cliente vai quebrar.

### Mudou o tipo de retorno de um método ou função

Novamente, dependendo dos tipos antigo e novo, isso pode nem quebrar, mas ainda é um breaking change em geral.

### Mudou a ordem dos parâmetros

Esse é interessante porque pode quebrar de uma forma diferente dos outros. Para a maioria dos exemplos que eu tenho dado até agora, "quebrar" significa que o código que consome seu código vai falhar na compilação.

Com este, você pode fazer de uma forma que o código ainda compile, mas falhe em funcionar corretamente.

Por exemplo, veja esse código:

```csharp
public async Task<IReadOnlyList<Product>> GetProductsByCategory(int categoryId, int companyId)
{
// implementação
}
```

Se você invertesse a ordem entre `categoryId` e `companyId`, o código ainda compilaria mas não funcionaria corretamente. Ainda seria um breaking change, mas um que falha de forma mais sutil.

Claro que se os dois parâmetros são de tipos diferentes, então falharia no sentido de falhar na compilação. E é por isso que muita gente argumenta que você não deveria usar primitivos pra coisas como ids, mas criar seus próprios [tiny types](https://carlosschults.net/pt-br/genai-tiny-types) pra isso.

### Comportamento de tratamento de erro modificado (lançando exceções diferentes)

Se o seu método costumava lançar um certo tipo de exceção e agora lança uma diferente, isso é um breaking change, porque código que foi escrito pra capturar aquela primeira exceção específica não vai funcionar pra nova, a menos que ela herde da primeira.

### Tornou métodos ou propriedades públicas privadas

Na prática, do pontos de vista do cliente, isso é o mesmo que excluir algo, então é um breaking change óbvio.

### Adicionou requisitos de autenticação onde não existiam

Até agora, todos os exemplos foram pra bibliotecas ou pacotes. Agora vamos ver alguns exemplos pra APIs web. O primeiro tem a ver com autenticação: se um endpoint não requeria autenticação mas agora requer, isso é um breaking change, porque código existente que costumava chamar isso agora vai receber um erro [401 Unauthorized](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401).

### Adicionou novas propriedades obrigatórias a um payload

Isso é similar a adicionar novas propriedades obrigatórias a um método público, certo? Se seu endpoint agora espera um payload diferente do que esperava antes, código existente vai quebrar, provavelmente recebendo um erro [400 Bad Request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/400).

### Renomear ou deletar um endpoint

Esse é auto-explicativo.

## O que fazer sobre breaking changes?

Isso deveria ser óbvio agora, mas vamos deixar claro: breaking changes são Uma Coisa Ruim™. Tente ao máximo evitá-las.

Se você distribui qualquer código ou software publicamente e existem pessoas que dependem dele, você não vai querer ficar quebrando os workflows delas frequentemente, ou elas vão ficar bravas com você, e com razão.

Às vezes não tem jeito. Você simplesmente precisa fazer um breaking change, seja removendo um método ou classe que se tornou obsoleta, ou mudando a assinatura de uma função.

Quando você tem que fazer algo assim, algumas coisas são aconselhadas.

### Depreciação Gradual

Adicionar um breaking change é algo que você não deveria levar de forma leviana porque pode dramaticamente interromper o workflow dos seus usuários. Além disso, não faça isso de repente, do nada, e de uma vez.

Antes de remover classes/métodos/etc obsoletos, primeiro anuncie publicamente que você está fazendo isso, várias versões antes. Então, você marca aquele artefato como deprecated de alguma forma, mas ainda não remove. Por exemplo, em C# você pode usar o atributo [Obsolete](https://learn.microsoft.com/en-us/dotnet/api/system.obsoleteattribute?view=net-9.0).

Então, depois de algumas versões, você finalmente faz seu breaking change.

### Adicione Instruções às Suas Release Notes

Se você está publicando software publicamente pra uso de terceiros, você provavelmente tem algum tipo de release notes onde comunica quais foram as mudanças nesta nova versão. Aproveite isso.

Quando for hora de realmente publicar uma versão com breaking change, use suas release notes pra descrever, em detalhes, qual é a mudança e como vai afetar seus usuários.

Geralmente, quando um breaking change consiste em aposentar um método/classe/endpoint, vem acompanhado de uma nova forma de fazer a mesma coisa. Afinal, você não estaria aposentando a forma antiga só porque sim.

Nesses casos, também use suas release notes pra explicar em detalhes como os usuários podem adaptar seu código pra migrar da forma antiga pra nova de fazer a tarefa.

### Use Semantic Versioning

Finalmente, use [Semantic Versioning](https://semver.org/) e use o número da versão pra comunicar que isso é um breaking change, lançando uma versão major.

Semantic Versioning (ou SemVer pra abreviar) é um padrão de versionamento onde você usa um número de versão neste formato: major.minor.patch.

Quando sua nova versão só contém correções de bugs, e elas não adicionam breaking changes, você incrementa o componente patch.

Por exemplo:

```
2.0.0 -> 2.0.1
```

Se a versão contém nova funcionalidade que não quebra compatibilidade, então você incrementa o componente minor e zera o componente patch:

```
2.0.1 -> 2.1.0
```

Agora vem a parte mais importante. Quando sua versão contém breaking changes, seja por nova funcionalidade, correções de bugs, ou ambos, você incrementa o número major e zera os outros dois:

```
2.1.0 -> 3.0.0
```

Dessa forma, você comunica claramente aos seus usuários a presença ou ausência de breaking changes na sua release mais recente.

## Conclusão

Neste post, expliquei o conceito de breaking change, por que geralmente é ruim, e o que fazer sobre isso. Resumo rápido:

* Breaking changes são mudanças que quebram o código dos seus usuários, no contexto de software que é distribuído para usuários terceiros.
* Evite adicionar breaking changes ao seu software, porque prejudicam a experiência dos seus clientes.
* Às vezes você não pode evitar adicionar um breaking change. Nesses casos, use depreciação gradual, comunique claramente o que mudou e como se adaptar, e use semantic versioning.

Acho que é isso. Obrigado por ler, espero que tenha sido útil e nos vemos novamente no próximo episódio desta série, onde provavelmente vou voltar pra letra A, porque sou esquisito assim mesmo.
