---
title: "Value Objects: Uma Técnica Para Código Auto-Documentado E Menos Erros"
ref: value-objects-tool
lang: pt
layout: post
author: Carlos Schults
description: If you employ value objects in your code, you can make it easier to read and maintain. Learn about this technique in today's post.
permalink: /pt/value-objects-ferramenta/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1540385528/value-object-tool/value-object-tool-1038x437.jpg
tags:
- csharp
- boas-praticas
- ddd
- orientacao-a-objetos
- modelagem-de-software
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1540385528/value-object-tool/value-object-tool-1038x437.jpg)


*NOTA: Eu escrevi este post originalmente para o blog da NDepend. Você pode [conferir o artigo original, em inglês, no site deles](https://blog.ndepend.com/value-objects-tool-self-documented-code-fewer-errors/). *

Você já ouviu falar de *value objects*? Eu imagino que sim. Apesar de não se falar tanto a respeito deles como eu gostaria, eles ainda são mencionados o bastante para que muitos desenvolvedores tenham no mínimo alguma familiaridade com o termo.

Porém, "alguma familiaridade" não é bom o bastante. Então é isso que vamos consertar com esse post. Hoje vamos aprender o que *value objects* são e como você, por meio do C#, pode usar todo o poder deles para tornar seu código mais claro, auto-documentável e menos propenso a erros.

## O que são Value Objects?

*Value objects* são um dos blocos fundamentais do DDD (Domain Driven Design, ou Projeto Guiado por Domínio, em tradução livre), conforme proposto por Eric Evans em seu livro [Domain-Driven Design: Tackling Complexity in the Heart of Software.](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215)

Da maneira mais simples possível, um value object é um objeto que representa um valor. E sim, eu estou ciente de que isso soa óbvio e tedioso quando dito dessa forma. Então, por que tanto barulho por causa desse conceito?

## Algumas Propriedades

Eu acho que é mais fácil de entender value objects se eu parar de tentar explicar o que eles são e, ao invés disso, falar sobre as suas características.

### Value Objects Não Têm Identidade

Eu acho que é justo dizer que a principal característica dos value objects é que eles não possuem *identidade*. Mas o que isso realmente quer dizer na prática?

Digamos que você vá até o caixa eletrônico mais próximo e deposite uma nota de 50 reais em sua conta. Então você dirige umas duas horas até outra cidade, entra em uma agência bancária, e saca 50 reais.

Pergunta: faz alguma diferença para você o fato de que a nota que você tem em mãos não é a mesma que você depositou antes? É claro que não! Quando se trata de dinheiro o que as pessoas geralmente se importam é com seu valor, não com o veículo daquele valor.

Em outras palavras, nós não damos a mínima para a *identidade* daquela cédula em particular. A única coisa com a qual nós nos importamos é o seu valor.

Não é coincidência o fato de que dinheiro é um exemplo clássico de value object na literatura.

### Value Objects São Imutáveis

Você consegue mudar o número cinco? Não. Não há nada que você (ou qualquer outra pessoa) possa fazer para mudar o valor do número 5. Se você adicionar 1, ele não muda. Você tem agora 6, que é um *outro* número.

É possível alterar uma data? Não, também não dá para fazer isso. Se você inicia com "2018-01-09" e adiciona um dia, você chega em "2018-01-10." O valor original não é alterado de forma alguma. Na verdade, a imutabilidade de um value object é uma consequência direta do ponto anterior; como um value object não possui identidade, podemos dizer que o value object *é* o seu valor. Portanto, nem sequer faz sentido falar sobre mudá-lo.

A implicação disso no desenvolvimento é que value objects são intrinsecamente mais seguros e mais fáceis de serem compreendidos. Não tem perigo de mudar por acidente aquilo que você não pode mudar de jeito nenhum.

### Value Objects Têm Igualdade Estrutural
Imagine que você pudesse magicamente transportar pessoas para qualquer lugar que você quisesse e, por alguma razão bizarra, você tenha decidido trocar dois homens chamados "João da Silva" durante a noite. Como você acha que as suas respectivas famílias reagiriam ao encontrar um estranho em casa na manhã seguinte?

Obviamente, pessoas não são intercambiáveis, mesmo que compartilhem uma ou mais características. Mesmo se nossos dois "Joães" (Joões?) tivessem não apenas o mesmo nome, mas também a mesma altura, peso, cor de pele e cabelo, eles ainda seriam duas pessoas completamente diferentes. Mesmo gêmeos idênticos (ou clones, caso você esteja numa onda meio Black Mirror) continuam sendo pessoas completamente diferentes, apesar de serem tão iguais um ao outro quanto é possível ser.

Por outro lado, as pessoas mudam constantemente durante a vida, mas continuam sendo as mesmas pessoas. Pelo menos (enquanto a gente não resolver filosofar com "[um homem não entra no mesmo rio duas vezes](https://www.brainyquote.com/quotes/heraclitus_107157)" e coisas do tipo).

Você talvez esteja se perguntando se eu divaguei demais aqui, mas é tudo de propósito. Tudo isso serve apenas para ilustrar a diferença crucial entre entidades e value objects. Com as entidades, nós nos importamos com a  sua identidade, não com o valor de seus atributos. Com value objects, é exatamente o oposto.

A implicação disso, em termos de programação, é que value objects tipicamente apresentam igualidade estrutural. Faz sentido compará-los pelos seus valores, não suas referências ou identidades. Então, quando for implementar um value object, sempre faça *override* dos métodos `Equals` e `GetHashCode`.

## O que Você Ganha Com Isso?
A essa altura você já deve ter uma boa ideia do que value objects são. O que ainda não está claro é: por que você deveria usá-los? Para responder isso, vamos dar uma olhada na linha de código a seguir:

{% highlight c# %}
    double  distance  =  4.5;
{% endhighlight %}

Tem algo errado com a linha acima? Bom, eu poderia dar uma de *[Ben Kenobi](https://starwars.wikia.com/wiki/Wookieepedia:Quote_of_the_Day/Archive/Obi-Wan_Kenobi) *e dizer que está errada "de um certo ponto de vista." Mas eu não vou. Ao invés disso, vou dizer que está definitivamente, sem sombra de dúvidas, errada. Não importa que compila corretamente. Também não importa que funciona um pouco (ou até na maioria) do tempo.

O problema aqui é o *code smell* conhecido como "obsessão primitiva", isto é, a modelagem de conceitos de domínio usando tipos primitivos. As próximas seções vão explicar melhor porque isso é um problema tão sério e como o uso de *value objects* podem ajudar.

### Value Objects Proporcionam Contexto

Por que [obsessão primitiva é algo ruim](https://blog.ndepend.com/easy-miss-code-smells/)? Há várias razões, mas um dos principais problemas com a linha de código que você viu na seção anterior é que há uma informação extremamente importante faltando. Como você pode ver, o código atribui o valor 4.5 à variável. Mas 4.5 o que? Metros? Quilômetros? Milhas? Parsecs? Em outras palavras, falta uma **unidade de medida**.

Isso pode ser uma receita para o desastre. Tudo o que você precisa é alguém recuperar um valor do banco de dados ou de um arquivo, pensando que representa metros mas na verdade são quilômetros. Quando a pessoa resolve usar o valor em um cálculo, adicionando quilômetros com metros...silêncio. Você agora tem um programa que, no lugar de falhar rápido como deveria, se comporta de maneira errada silenciosamente enquanto corrompe dados e gera resultados inconsistentes. Ainda bem que você usa [testes unitários](https://carlosschults.net/pt/testes-unitarios-csharp-intro-tdd/)...certo?

Tudo bem, nada impede você de colocar essa informação no próprio nome da variável:

{% highlight c# %}
	double  distanceInKilometers  =  4.5;
{% endhighlight %}

Certo, isso é um pouco melhor do que a versão anterior, mas ainda é uma solução muito frágil. A qualquer momento o valor pode ser atribuído a outra variável ou passado como argumento para uma função, e aí a unidade de medida é perdida.

Usando value objects, você pode eliminar esse problema facilmente. Você teria apenas que escolher uma unidade para ser a representação interna do tipo - para distância, faz sentido usar o metro, por ser uma unidade do Sistema Internacional de Medidas. E aí você pode implementar diversos métodos estáticos para fabricar valores para cada unidade necessária:

{% highlight c# %}
	var  distance  =  Distance.FromMeters(4000);
	var  distance2  =  Distance.FromKilometers(4);
	Assert.AreEqual(distance,  distance2);
{% endhighlight %}

Você poderia ainda sobrecarregar o operador "+" (ou criar um método `Plus`). Dessa forma seria possível somar duas distâncias que se originaram de diferentes unidades de medida já que a representação interna é a mesma.

### Value Objects Apresentam Segurança de Tipo

Digamos que você tem um método com a seguinte assinatura:

{% highlight c# %}
	double  PerformSomeImportantCalculation(double  distance,  double  temperature);
{% endhighlight %}

O que aconteceria se você cometesse um erro e invertesse os valores ao chamar o método? O programa iria silenciosamente se comportar erro, e você nem ficaria sabendo. Com sorte, a sua empresa teria um bom processo de garantia de qualidade que poderia pegar esse erro antes de chegar no ambiente de produção. Mas ficar dependendo de sorte não é lá uma grande estratégia, concorda?

Pois acontece que esse é o tipo de problema que value objects são ótimos em evitar. Você teria apenas que usar tipos customizados para cada conceito em vez de tipos primitivos:

{% highlight c# %}
	double  PerformSomeImportantCalculation(Distance distance,  Temperature temperature);
{% endhighlight %}

Dessa forma, se torna impossível passar os parâmetros na ordem errada: o compilador simplesmente não deixa!

### Value Objects Evitam Duplicação de Lógica de Domínio

Quando você usa tipos primitivos para modelar conceitos de domínio, a tendência é você ter um monte de código relacionado a esses conceitos espalhados por toda a aplicação. Imagine que você está criando um programa que tem o conceito de uma placa de carro, e você está usando `strings` para representá-las. É claro que nem todas as strings válidas são placas válidas. Então o seu código acaba entupido de validações de placas de carro por todo lugar.

Isso seria evitado criando uma classe chamada `LicensePlate` e fazendo todas as validações necessárias em seu construtor. Dessa forma você consolidaria todo o código de validação em apenas um lugar; se esse código precisar mudar no futuro, você tem que mudar em apenas um lugar.

## Value Objects e Tipos de Valor Não São Sinônimos

Essa seção é necessária para clarificar um erro comum, que é confundir  value objects com o conceito de value types (tipos de valor) que existe no C#. É assim: na linguagem C# nós temos [duas categorias de tipos: tipos de referência e tipos de valor.](https://carlosschults.net/pt/tipos-valor-referencia-em-csharp/)

Sim, não há nada que impeça você de usar structs (tipos de valor) para implementar value objects - exemplos na Base Class Library (BCL) seriam o tipo `DateTime` ou os tipos numéricos primitivos. Mas você também pode usar classes tranquilamente.

Por outro lado, structs não podem ser considerados value objects automaticamente. Por exemplo, embora manter structs imutáveis seja uma prática recomendada, eles não são imutáveis por padrão.

Resumidamente, "tipo de valor" é um detalhe de implementação em C#/.NET e "value object" é um padrão de projeto. Mantenha isso em mente e consulte [as diretrizes de design da Microsoft](https://docs.microsoft.com/pt-br/dotnet/standard/design-guidelines/choosing-between-class-and-struct) e tudo vai ficar bem.

## Value Objects Valem a Pena!

O uso de value objects é uma técnica com um custo relativamente baixo que pode aumentar bastante a manutenibilidade e claridade do seu código. Colocando value objects em prática, você pode tornar seu código mais fácil de ser compreendido, criando interfaces que são auto-documentáveis, difíceis de serem usadas da maneira errada, e intrinsecamente *type-safe*.
