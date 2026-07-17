---
title: "Funcionalidades do C# 8.0: Um Vislumbre do Futuro"
ref: csharp8
lang: pt
layout: post
author: Carlos Schults
permalink: /pt/funcionalidades-csharp8/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1513817072/csharp8-1037x438_skogpz.jpg
tags:
- csharp
- funcionalidades-da-linguagem
- iniciantes
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1513817072/csharp8-1037x438_skogpz.jpg)

C# 8.0 está chegando e vai trazer algumas funcionalidades muito interessantes. Vamos dar uma olhada no que o futuro reserva.
<!--more-->

*NOTA: Eu escrevi este post originalmente para o blog da NDepend. Você pode [clicar aqui para ler o artigo original no site deles, em inglês](https://blog.ndepend.com/c-8-0-features-glimpse-future/). Enquanto estiver por lá, baixe e experimente o NDepend.*

Faz quase 20 anos desde que a Microsoft lançou a primeira versão da linguagem C#. De suas origens - quando muitos injustamente a consideravam uma mera cópia do Java - até agora, C# teve uma evolução notável.

Hoje em dia, o C# frequentemente aparece em listas das linguagens [mais usadas](https://insights.stackoverflow.com/survey/2017#technology-programming-languages) e [mais amadas](https://insights.stackoverflow.com/survey/2017#most-loved-dreaded-and-wanted). Você pode usá-lo para desenvolver aplicações para PC, dispositivos móveis e Web; você pode escrever código que será executado em todos os principais sistemas operacionais. Ou você pode entrar na onda da Internet das Coisas e escrever código para tornar sua casa inteligente. Nós vivemos em tempos interessantes para ser um desenvolvedor C#.

Se o presente já é animador, e o futuro? Será que é possível termos um vislumbre do que o futuro reserva para a linguagem?

É claro que sim. A Microsoft tem desenvolvido o C# de maneira transparante já faz um bom tempo. Você pode [acessar o repositório do GitHub](https://github.com/dotnet/csharplang) para ler (e participar, por que não?) nas discussões.

Hoje, nó abordaremos três propostas de funcionalidades para o C# 8.0: **extension everything**, **implementações default em interfaces,** e **tipos de referência nuláveis**.

## Extension Everything

*Extension everything* - em tradução livre seria algo como "extensão em tudo" - é provavelmente a menos controversa das três propostas e também, de certa forma, a menos desenvolvida. Então eu achei que ela daria um bom ponto de partida.

Você provavelmente conhece métodos de extensão, introduzidos no C# 3.0, em 2017. [Embora seja possível abusá-los](https://www.daedtech.com/why-i-dont-like-c-extension-methods/), não há como negar que métodos de extensão, quando usados sabiamente, podem ser uma incrível adição ao kit de ferramentas do desenvolvedor C# - isso sem mencionar que eles são essenciais para o LINQ.

Porém, em algum momento você deve ter se perguntado: por que apenas *métodos* de extensão? E você não estaria só. Propriedades de extensão, por exemplo, tem sido um desejo dos desenvolvedores C# por muito tempo, como mostra [esta questão de 2009 no Stack Overflow](https://stackoverflow.com/questions/619033/does-c-sharp-have-extension-properties) ou este [tópico em um fórum de 2007(!)](https://channel9.msdn.com/forums/Coffeehouse/257556-C-Extension-Properties/).

Mas agora parece que a espera está finalmente chegando ao fim. Segundo Mads Torgersen, o *program manager* do time de design do C#, [um estagiário da Microsoft propôs uma nova sintaxe para métodos de extensão que também possibilitará "outras coisas de extensão"](https://channel9.msdn.com/Blogs/Seth-Juarez/A-Preview-of-C-8-with-Mads-Torgersen).

### Vamos ver o código

Se eu fosse você estaria ansioso para ver algum código Logo abaixo temos um exemplo de um método de extensão, utilizando a sintaxe atual:

<script src="https://gist.github.com/carlosschults/d6ec153b7274ac699634d5dadb2e9644.js"></script>

Nada surpreendente aqui, certo? Na sintaxe original, um método de extensão é apenas um método estático em uma classe estática, com a palavra-chave *this* antes do primeiro parâmetro.

O problema é que esta sintaxe apenas funciona para métodos (e como poderia ser de outra forma, já que falar de "primeiro parâmetro" de uma propriedade nem sequer faz sentido).

É aqui que *extension everything* entra. A proposta apresenta é uma nova declaração de tipo chamada de "extension":

<script src="https://gist.github.com/carlosschults/5c1afca9c8fbc6837257cc5d289df2e9.js"></script>

O código acima é um exemplo; na data em que escrevo este post, o time do C# ainda não havia chegado à uma sintaxe definitiva.

Enfim, o exemplo mostra a criação de uma classe de extensão para o tipo `int`. Então nós declaramos uma propriedade do jeito que estamos acostumados, e é isso.

Agora o código chamador pode usar a propriedade normalmente:

<script src="https://gist.github.com/carlosschults/d401d37e182647b253fa721425eec828.js"></script>

Essa nova funcionalidade deverá suportar métodos, propriedades, operadores e membros estáticos, pelo menos no início; suporte a eventos e construtores pode ser adicionado posteriormente.

Você não será capaz de criar estado adicional para a instância original, i.e. criar um campo privado na classe de extensão. De acordo com Torgersen, isso iria requerer uma complexidade indesejada para rastrear o valor desse novo estado.

### Status atual

Você pode [acompanhar o desenvolvimento da feature na sua issue no GitHub.](https://github.com/dotnet/csharplang/issues/192)

## Implementação default em interfaces.

Eu admito que fiquei surpreso - e não muito feliz - quando ouvi sobre essa feature pela primeira vez, [em uma palestra Mads Torgersen ministrou em maio, na conferência Build 2017.](https://channel9.msdn.com/Events/Build/2017/B8104)

"E *record types*?"eu pensei. “E objetos imutáveis? O que nós vamos realmente ganhar são implementações em *interfaces*?”

Você provavelmente pode adivinhar o que essa funcionalidade é pelo seu nome: nós seremos capazes de adicionar implementações de métodos nas interfaces. Por exemplo:

<script src="https://gist.github.com/carlosschults/efde91de1a54a1bc4f44c1a7a748d70c.js"></script>

Em C# 8.0, o código acima seria perfeitamente legal. Uma classe implementando a interface não precisaria disponibilizar uma implementação para o método. Se alguma implementação da interface decidir, em algum momento, que a implementação padrão não atende mais suas necessidades, então ela pode fazer sua própria implementação.

Além de métodos, também será permitido adicionar implementações em indexadores, propriedades e assessores de eventos. Membros estáticos como métodos, propriedades e indexadores também serão permitidos.

Estado de instância não será permitido nas interfaces, no entanto. Você será capaz de usar campos estáticos mas não campos de instância. Como consequência disso, propriedades automáticas também não serão permitidas, já que elas declaram um campo privado implicitamente.

### Casos de uso

Conforme declarado na [proposta da feature](https://github.com/dotnet/csharplang/blob/master/proposals/default-interface-methods.md), o principal caso de uso para implementações padrão nas interfaces é possibilitar que uma interface possa evoluir de maneira segura. Você vai poder adicionar novos membros à interface, contato que você forneça uma implementação padrão, clientes existentes não serão forçados à implementá-los.

Atualmente, você poderia solucionar isso com um método de extensão, mas essa abordagem tem limites: e se você depois decidisse fornecer uma versão especializada do método para uma das implementações? Boa sorte.

É aí que as implementações padrão brilham.

Outra proposta de valor importação dessa feature tem relação com os sistemas Android e iOs. Já que tanto Java e Swift oferecem implementações padrão em interfaces, pode ser complicado *envelopar* APIs do Android e iOs que fazem uso desta funcionalidade. Com a oitava versão do C#, será possível adaptar tais APIs de maneira mais fiel.

### As interfaces vão virar classes abstratas?

Mais ou menos, mas não realmente. Como você sabe, não há herança múltipla em linguagens coo C# e Java, o que significa que não é possível herdar de mais de uma classe. Por outro lado, uma classe é (e continuará sendo) capaz de implementar várias interfaces.

### Status atual

Essa funcionalidade está sendo prototipada. [Você pode seguir seu desenvolvimento na issue no GitHub.](https://github.com/dotnet/csharplang/blob/master/proposals/default-interface-methods.md)

## Tipos de Referência Nuláveis

"O quê?", você talvez esteja pensando. "Não seria 'tipos de referência **não**-nuláveis'?” O nome dessa funcionalidade pode realmente confundir um pouco. Vou voltar a isso mais tarde, mas antes, vamos explicar a razão de uma feature como essa ser sequer considerada.

Eu aposto que você conhece a frase "o erro de um bilhão de dólares". Na remota possibilidade de que você não conheça, ela ser refere à referência nula, e foi [criada por ninguém mais ninguém menos que Sir Tony Hoare, o próprio criador da referência nula.](https://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions) 

### Mas por que `null` é tão ruim?

Existem várias possíveis respostas para essa pergunta mas o maior problema é, claro, o risco da famosa *null-reference exception* (também conhecida como *null-pointer exception* na Java-lândia). Já que tudo ("tudo" no contexto do C# significa tipos os [tipos de referência](https://carlosschults.net/pt/tipos-valor-referencia-em-csharp/)) pode ser nulo, você sempre corre o risco de receber uma exceção quando tenta acessar algum membro de um objeto.

Um dos piores problemas que temos aqui é que a própria linguagem não oferece uma sintaxe que permita ao autor do código expressar sua intenção. Não tem como você dizer: "Este parâmetro nunca vai ser `null`" ou "Essa propriedade talvez seja `null` às vezes, e isso é OK".

É comum que linguagens funcionais solucionem isso oferendo um tipo que representa o conceito de um valor potencialmente ausente, geralmente chamado de `Maybe` ou `Option`.

O time de design do C# decidiu contra uma abordagem desse tipo pois, de segundo eles, seria o mesmo que adicionar um novo tipo de `null` à linguagem, o que poderia tornar as coisas ainda mais complexas.

Vamos retomar a questão do nome. Você talvez esteja pensando que eu entendi ao contrário. Faz sentido falar sobre tipos de valor nuláveis, já que os tipos de valor são não-nuláveis por padrão. Mas no caso dos tipos de referência, não deveria, certo? Afinal de coisas, eles sempre foram nuláveis desde o início.

O pulo do gato é o seguinte: o time de design do C# - em uma decisão com uma boa dose de controvérsia - pretende tornar não-nulabilidade o novo padrão para os tipos de referência. Interpretando assim, a "nova" coisa seriam os tipos nuláveis.

Para manter a linguagem consistente, a proposta é que seja usada a mesma sintaxe que já existe para tipos de valor nuláveis - em outras palavras, o ponto de interrogação.

### Chega de falar. Vamos ver código!

Eu imagino que usar uma classe "Pessoa" como exemplo é o equivalente de tocar "Stairway to Heaven" numa loja de instrumentos musicais: originalidade zero. Mas usar um exemplo mais elaborado seria uma distração desnecessária, então me dá um desconto desta vez.

Imagine que nós temos uma classe `Person` com uma propriedade `Age` do tipo `int`. Então, nós escrevemos o método a seguir:

<script src="https://gist.github.com/carlosschults/9b09f0572e737569e6f97315e5028411.js"></script>

Apesar do código acima compilar normalmente, ele é frágil já que `p` pode ser `null`. Você provavelmente faria bem em adicionar um if para tratar essa possibilidade, mas ninguém vai lhe obrigar a fazer isso. Você está complemente livre para deixar o código da forma como está.

C# 8 promete mudar isso ao tornar tipos de referência não-nuláveis por padrão. No mesmo exemplo, tentar acessar a propriedade `Age` seria seguro, já que `p` não poderia ser `null`.

Caso queira que `p` seja nulável, aí você teria que adicionar um ponto de interrogação, como eu já mencionei antes:

<script src="https://gist.github.com/carlosschults/8554d8863882955b554b486797b83726.js"></script>

Agora que `p` pode ser `null`, tentar acessar `Age` não é mais seguro: você receberá um *warning* ao tentar fazer isso. Quer se livrar do aviso?

Apenas faça o que você (na melhor das hipóteses)já faz hoje e cheque por nulo::

<script src="https://gist.github.com/carlosschults/edc992560bf6c005c6be821103e160a3.js"></script>

Assim, uma análise de fluxo será realizada; caso a linha da atribuição seja alcançada, o compilador vai saber que `p` não pode ser nulo e vai te deixar em paz.

Outra possibilidade:

<script src="https://gist.github.com/carlosschults/518c1b35560cafe17fca829aa2aef27b.js"></script>

Em resumo, você tem várias opções. Assim que você conseguir convencer o compilador que seu código não tem risco de disparar uma *null reference exception*, o aviso vai embora.

### Impedindo atribuição de nulável para não-nulável

A nova versão do C# também vai impedir atribuição de uma variável nulável para uma não-nulável, então o código a seguir também vai resultar em um aviso:

<script src="https://gist.github.com/carlosschults/98f91bc50c924a8bd47897b874a7be89.js"></script>

Essa funcionalidade virá acompanhada de um novo operador chamado de *null-ignoring operator*. Você vai usá-lo para dizer ao compilador: "Eu sei o que estou fazendo". Haverá situações nas quais uma variável não pode ser nula de forma alguma, mas o compilador não vai ser capaz de inferir isso.

Um exemplo desses seria o uso do método `string.IsNullOrEmpty()`:

<script src="https://gist.github.com/carlosschults/7f0f2f7470f810d228f1d68559b1d6b7.js"></script>

O código acima vai gerar um *warning*, apesar de não ser possível que `bar` seja nula. É aí que esse operador vai ser útil:

<script src="https://gist.github.com/carlosschults/008709a0b9ff6a72abc8fc4882a467d3.js"></script>

É importante lembrar que quando usar esse operador, você basicamente está dizendo ao compilador: "Confie em mim! Eu sei o que eu estou fazendo." Então, é bom você realmente saber o que está fazendo!

### E retro-compatibilidade?

Eu sei o que você deve estar pensando agora. "Isso parece legal e tal, mas não vai dar problema com um monte de código existente?"

Bom, é claro que vai. E é por isso que essa será uma alteração **opt-in**, ativada a nível de cada projeto.

### Status atual

Esta já está com o protótipo pronto. Caso se interesse, [você pode baixar, instalar, e testar um preview agora mesmo.](https://github.com/dotnet/csharplang/wiki/Nullable-Reference-Types-Preview)

Assim como as outras funcionalidades, você pode se [antenar com o que está acontecendo por meio da issue no GitHub.](https://github.com/dotnet/csharplang/blob/master/proposals/nullable-reference-types.md)

## C# tem um futuro. E vai ser incrível.

Agora você sabe um pouco mais sobre três das funcionalidades que nós provavelmente ganharemos com a próxima versão da linguagem C#.

Como você pode ver, desenvolver a linguagem é um trabalho duro. Ela precisa permanecer compatível com as milhões (bilhões) de linhas de código escritas com ela nos últimos 17 anos. Ao mesmo tempo, para continuar sendo relevante, ela precisa suprir as necessidades de desenvolvedores que estão encarando desafiados que eram inimagináveis anos atrás. E o C# precisa fazer tudo isso sem perder sua essência: ser uma linguagem orientada a objeto, fácil e acessível. 
