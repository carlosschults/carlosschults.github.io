---
title: Null É Ruim. Qual A Melhor Alternativa? Null.
ref: null-evil
lang: pt
layout: post
author: Carlos Schults
permalink: /pt/null-problematico
description: Muitas pessoas consideram null um erro nas linguagens de programação. Qual é a melhor alternativa?
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1593715153/null-evill-1068x437_ztikwf.jpg
tags:
- engenharia-de-software
- boas-praticas
- programacao
- csharp
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1593715153/null-evill-1068x437_ztikwf.jpg)
<span>Foto por <a href="https://unsplash.com/@benhershey?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Ben Hershey</a> on <a href="https://unsplash.com/s/photos/null?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

*Nota editorial: Eu escrevi originalmente este post para o blog da NDepend. Você pode [conferir o original aqui, em inglês, no site deles](https://blog.ndepend.com/null-evil/).*

"Null é maligno". Se você tem sido um desenvolvedor de software por qualquer período de tempo razoável, aposto que já se deparou com essa afirmação várias vezes.

Eu diria também que é muito provável que você concorde com o sentimento, ou seja, que a referência nula é uma característica sem a qual nossas linguagens de programação ficariam melhor. Até mesmo seu criador expressou seu pesar pela referência nula, [chamando-a de seu "erro de um bilhão de dólares"](https://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions)

Criticar null tende a ficar chato rapidamente, portanto, os autores não fazem só isso. Eles também oferecem alternativas. E embora eu acredite que muitas das alternativas apresentadas têm seus méritos, também acho que talvez tenhamos negligenciado a melhor solução para tudo isso.

Neste post, vamos examinar algumas das alternativas comuns para o retorno nulo antes de fazer o argumento de que a melhor alternativa é a própria nulidade. Vamos começar!

## Null é Tóxico...

Não vou me deter muito em toda essa coisa do "nulo é mal", já que muito já foi escrito sobre isso. Alguns exemplos (em inglês):

[Null Is Evil]("https://sidburn.github.io/blog/2016/03/20/null-is-evil">Null is Evil)
[Null has no type, but Maybe has]("http://blog.ploeh.dk/2015/11/13/null-has-no-type-but-maybe-has/">)

[Esta resposta de Stack Overflow](https://softwareengineering.stackexchange.com/questions/12777/are-null-references-really-a-bad-thing) também tem algumas informações valiosas.

## ...Mas útil. Quais são as Alternativas?

Agora, espero que estejamos na mesma página no que diz respeito ao status de nulo como um recurso de linguagem problemática. Mas tóxico ou não, o nulo serve a alguns propósitos. As pessoas o usam para representar um dado ausente, inválido ou desconhecido, ou mesmo para indicar que ocorreu um erro.

O que deveriam estar fazendo ao invés disso?

### Lançar uma Exceção

Em algumas situações em que as pessoas retornam null, a coisa razoável a fazer é lançar uma exceção. Pense desta maneira: se um método promete realizar algo e não o faz, ele deve lançar uma exceção. Em outras palavras: quando um método não cumpre seu contrato, então é razoável disparar uma exceção.

É claro que você deve reservar exceções para cenários que sejam verdadeiramente excepcionais. Se uma determinada situação acontece com freqüência, então uma exceção não é a melhor solução.

### Padrão de Objeto Null

Considere as seguintes linhas de código:

{% highlight csharp %}
var contract = repository.Find(42);
contract.Extend(12);
{% endhighlight %}

O que deveria acontecer se não houvesse um contrato com ID igual a 42? Se o método "Find" retornar null, então você vai ganhar uma desagradável `NullReferenceException`. Como eu disse anteriormente, a nulidade faz seu código mentir. Se fossemos realmente pedantes sobre isso, o método "Find" deveria ser renomeado para "FindOrReturnNull". Muito verboso, mas mais honesto.

De qualquer forma, o [padrão de objeto nulo](https://en.wikipedia.org/wiki/Null_object_pattern) é uma tentativa de resolver este problema. E como ele faz isso? Criando seu próprio tipo de nulo.

Para implementar o padrão, criamos uma nova classe (vamos chamá-la de "NullContract") que representa o caso quando um contrato está faltando. Fazemos esta nova classe cumprir o mesmo contrato que a classe original, mas não fazemos nada nos métodos. Assim, se imaginarmos que "Contrato" implementa `IContract`, nossa classe NullContract poderia ser algo parecido com isto:

{% highlight csharp %}
public class NullContract : IContract
{
	// construtor, propriedades, etc 
	
	public void Extend(int months)
	{
		// não faz nada aqui, propositalmente
	}
}
{% endhighlight %}

Ao empregar o padrão de objeto nulo você poderia - teoricamente, pelo menos - ter a certeza de que sempre receberá um objeto que cumpre o contrato que você espera que ele honre sem explodir na sua cara.

### Maybe/Option

Finalmente, temos uma alternativa muito interessante que muitas vezes é encontrada na [programação funcional](https://blog.ndepend.com/functional-programming-makes-code-not-oo/) linguagens. Esta alternativa é o uso de um tipo dedicado, destinado a representar o caso de uso de um valor potencialmente ausente. Por exemplo, [em F# isto é chamado de tipo de option](https://docs.microsoft.com/en-us/dotnet/fsharp/language-reference/options); Haskell a chama de [Maybe](https://hackage.haskell.org/package/base-4.11.0.0/docs/Data-Maybe.html). A partir da versão 8, Java introduziu a classe [Optional](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html).

Neste momento, o C# não oferece algo parecido com este tipo nativamente.

## Alternativas ao Null: Elas são boas?

Tendo apresentado as alternativas mais comumente usadas para nulo, é hora do veredicto final. Vamos começar com a opção "lançar exceção".

### Exceções

Se o chamador não fornecer os argumentos corretos para a função que está chamando, então poderíamos dizer que ele está quebrando o contrato da função. Lançar uma exceção é a coisa correta a fazer nesta situação.

O código a seguir é um bom exemplo do que **não*** deve ser feito:

{% highlight csharp %}
public Foo Bar(int a, string b)
{
    if (a > 0 && a <= 100)
    {
        if (!string.IsNullOrWhiteSpace(b))
        {
            // tá tudo certo: vamos fazer o que precisa ser feito e retornar
            // um novo objeto!
            return new Foo();
        }
    }
 
    // Tem coisa errada com os parâmetros recebidos. Já sei! Vamos retornar null!
    return null;
}
{% endhighlight %}

Eu vejo códigos como este o tempo todo em produção. Os ifs aninhados são horríveis. Eles deveriam pelo menos ter usado um "and" para encaixar tudo em apenas um "if". Mas o que realmente deveria acontecer é algo assim:

{% highlight csharp %}
public Foo Bar(int a, string b)
{
    if (a <= 0 || a > 100)
    {
        throw new ArgumentOutOfRangeException(
        nameof(a),
        "O valor deve estar no intervalo de 1 a 100, inclusive.");
    }
 
    if (string.IsNullOrWhiteSpace(b))
    {
        throw new ArgumentException(
             "O valor deve ser uma string válida.",
             nameof(b)
             );
    }
 
    // tá tudo certo: vamos fazer o que precisa ser feito e retornar
    // um novo objeto!
    return new Foo();
}
{% endhighlight %}

Além disso, [não capture exceções exógenas](https://blogs.msdn.microsoft.com/ericlippert/2008/09/10/vexing-exceptions/) que possam acontecer dentro de seu método e retorne nulo; em vez disso, deixe-as subir, pois este tipo de exceções representam problemas fora de seu controle. Problemas como uma falha na rede são problemas que você não poderia ter evitado de qualquer forma, em código.

### Padrão Null Object

Vamos considerar o padrão de objeto nulo, do qual certamente não sou um grande fã. Um problema com este padrão é que você só deve usá-lo quando o código de chamada não se importa com o resultado do que quer que ele esteja tentando realizar. Considere novamente nosso exemplo de contrato:

{% highlight csharp %}
var contract = repository.Find(42);contract.Extend(12);
{% endhighlight %}

Esta linha de código não é "consciente" (nem se importa) se a variável "Contrato" se refere a um contrato válido ou a uma instância da NullContract. Se for um contrato válido, ele será prorrogado por 12 meses. Se não for, então nada acontecerá. Às vezes, é exatamente isso que você quer, mas nem sempre. Neste exemplo, se um contrato com ID equivale a 42 realmente deveria existir, mas não... talvez lançar uma exceção funcionaria melhor.

Tudo o que eu disse até agora é que o padrão de objeto nulo não é bem adequado para cada cenário. Isto não é um problema tão ruim assim; você poderia dizer o mesmo sobre praticamente qualquer coisa.

Meu principal problema com o padrão de objeto nulo é que ele equivale a pouco mais do que criar um novo tipo de objeto nulo sem realmente resolver o problema. Veja, **utilizar o padrão não impede que você retorne nulo**. Se eu consumir algum método escrito por um terceiro que afirma usar o padrão, devo ser capaz de assumir que o que quer que seja que ele retorne é seguro. Mas eu não posso ter certeza. Eu tenho três opções:

- Confiar no autor do código;
- Inspecionar o código-fonte, se possível; ou
- Continuar a verificar a nulidade, o que derrota completamente o propósito de usar o padrão.

Pode-se argumentar que estes problemas não são relevantes no contexto de uma única equipe que trabalha com a mesma base de código. Os desenvolvedores poderiam concordar em usar o padrão corretamente. Mas se tudo equivale a confiança e convenção no final do dia, você poderia muito bem concordar em nunca retornar nulo e teria o mesmo resultado.

#### Maybe/Option

Por último, mas não menos importante, e quanto aos tipos Maybe/Option? Esta é uma alternativa ao mesmo tempo elegante e robusta, especialmente em linguagens como o F#, onde você é forçado, de certa forma, a lidar com ambos os casos usando *pattern matching.*

Mas a triste realidade é a seguinte: embora `Maybe/Option` sejam abordagens surpreendentes, elas não podem mudar o fato de que o nulo existe e continuará a existir. Você não pode realmente impedir as pessoas de usá-lo, nem pode removê-lo de todas as linhas de código que as pessoas têm escrito desde o início da história do C#.

Portanto, mesmo sendo grandes abordagens, elas ainda sofrem com o problema de serem mais um tipo de nulo para os desenvolvedores lidarem.

## A solução para Null: O próprio Null

Você conhece o velho ditado "Quando em um buraco, pare de cavar"? Para o melhor ou para o pior, existe o nulo. Tóxico ou não, é uma característica que as pessoas usam. Portanto, talvez a solução para tudo isso seja apenas consertar o nulo.

A linguagem [kotlin](https://kotlinlang.org/) acertou ao ter diferentes tipos de nulos e não nulos e adicionar todos os tipos de verificações para evitar que o desenvolvedor faça coisas que acabariam mal, como desreferenciar um tipo nulo sem verificá-lo ou atribuir um valor nulo a uma variável não nula.

O C# nos deu o primeiro passo na direção certa há muitos anos com [tipos de valor nulo](https://docs.microsoft.com/pt-br/dotnet/csharp/programming-guide/nullable-types/). Após uma longa espera, [tipos de referência finalmente obterão o mesmo benefício com C# 8.0](https://blog.ndepend.com/c-8-0-features-glimpse-future/).

A alternativa para o nulo é o próprio nulo... **quando feito corretamente**.