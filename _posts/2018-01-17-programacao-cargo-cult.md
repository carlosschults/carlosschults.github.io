---
title: "Programação Cargo Cult É A Arte de Programar Por Coincidência"
ref: cargo
lang: pt
layout: post
author: Carlos Schults
description: Já ouviu falar de programação cargo cult? No post de hoje eu vou mostrar o que é isso e porque você deveria se preocupar.
permalink: /pt/cargo-cult-programming/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1516152067/cargo-cult-programming-1037x438_spoxet.jpg
tags:
- csharp
- boas-praticas
- programacao-cargo-cult
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1516152067/cargo-cult-programming-1037x438_spoxet.jpg)

*NOTA: Eu escrevi este post originalmente para o blog da NDepend. Você pode [clicar aqui para ler o artigo original no site deles, em inglês](https://blog.ndepend.com/cargo-cult-programming/). Enquanto estiver por lá, baixe e experimente o NDepend.*

Eu ouvi falar em programação cargo cult a primeira vez há alguns anos. Eu me lembro de ter pensado na época: "Que nome estranho para um conceito relacionado com programação".

Se você compartilha do estranhamento do meu "eu" do passado, o post de hoje é para você.

Primeiramente, você verá o que programação cargo cult é e por que você deve se importar. Então, vamos dar uma olhada em alguns exemplos práticos, usando a linguagem C#. Finalmente, nós encerraremos com conselhos sobre o que você pode fazer para não cair nessa armadilha.

## Programação Cargo Cult: Fazendo as coisas porque sim.

Segundo a versão em inglês da [Wikipedia](https://en.wikipedia.org/wiki/Cargo_cult_programming)

> Cargo cult programming is a style of computer programming characterized by the ritual inclusion of code or program structures that serve no real purpose.

Em tradução livre

> Programação *cargo cult* é um estilo de programação de computadores caracterizado pela inclusão ritualística de código ou estruturas de programação que não servem nenhum propósito real.

Em outras palavras, é quando um(a) desenvolvedor(a) escreve código sem entender realmente o que aquele código faz. Talvez uma abordagem por tentativa e erro tenha sido usada - copia o código de um lugar, cola em outro, e vai mexendo e testando até que funciona, mais ou menos. Quando chega nesse ponto a pessoa geralmente para de mexer no código, por medo de fazer parar de funcionar. No processo, talvez sobrem resquícios de código que não servem realmente para nada.

Ou talvez a pessoa tenha tentado usar uma técnica aprendida com um colega, mas falhou em compreender que os conceitos são diferentes e que a tal técnica é inútil na situação atual.

Por fim, também é possível que o problema seja simplesmente educação insuficiente: talvez o desenvolvedor tenha um entendimento pobre a respeito de como as ferramentas usadas funcionam.

## Por que a programação *cargo cult* é um problema?
Como Eric Lippert diz, [programadores cargo cult sofrem para fazer alterações significativas em um programa](https://blogs.msdn.microsoft.com/ericlippert/2004/03/01/syntax-semantics-micronesian-cults-and-novice-programmers/) e acabam usando uma abordagem de tentativa e erro já que eles não entendem o funcionamento interno do código que estão prestes a alterar.

Isso não é tão diferente do que os [programadores pragmáticos chamam de "programação por coincidência"](https://pragprog.com/the-pragmatic-programmer/extracts/coincidence):

> Fred doesn’t know why the code is failing because he didn’t know why it worked in the first place. It seemed to work, given the limited “testing” that Fred did, but that was just a coincidence.

Em tradução livre:

> Fred não sabe porque o código está falhando porque ele não sabe porque ele funcionou da primeira vez. Parecia estar funcionando, com o "teste" limitado que Fred fez, mas era apenas uma coincidência.

A frase acima resume tudo para mim: se você não sabe como ou por que seu código funciona, você também não vai entender o que aconteceu quando ele parar de funcionar.

## Origem do termo
Embora práticas que são consideradas "culto à carga" (*cargo cult*) atualmente [tenham sido registradas tão cedo quanto o final do século XIX](https://en.wikipedia.org/wiki/Cargo_cult#First_occurrences), o termo em si data de 1945, quando foi usado pela primeira vez para descrever práticas que surgiram durante e depois da Segunda Guerra Mundial entre habitantes da Melanésia.

Os nativos começaram a imitar o comportamento dos soldados, vestindo-se como controladores de voo e balançando gravetos, na esperança de que isso faria com que aviões carregados de suprimentos descessem dos céus.

Desde então, o termo culto à carga tem sido usado em uma variedade de contextos para significar **imitar forma sem conteúdo** - copiar perfeitamente os elementos superficiais mas ao mesmo tempo falhando em entender de maneira mais profunda o significado e funcionamento do que se está tentando emular.

## Falar é fácil; me mostre o código!
Chega da aula de História por hoje. Hora de ver código! Eu vou mostrar cinco exemplos de programação cargo cult usando a linguagem C#. Vamos lá.

### Checar um tipo de valor não-nulável for *Null*
O primeiro item é algo que me incomoda já que eu vejo isso bastante em código de produção. É algo assim:


{% highlight c# %}
	public Product Find(int id)
	{
   	   if (id != null) // essa verificação é inútil
	   {
	       Console.WriteLine("Esta linha sempre será executada.");
	   }
	
	   return new Product();
	}
{% endhighlight %}

Aqui nós temos o caso de um(a) desenvolvedor(a) que provavelmente não entende a [diferença entre tipos de valor e referência](https://carlosschults.net/pt/tipos-valor-referencia-em-csharp/). Seria completamente perdoável, no caso de um profissional iniciante, se não fosse pelo fato de que o compilador te avisa disso.

Você pode achar isso um exagero da minha parte. Afinal de contas, o código vai rodar perfeitamente mesmo assim. Na verdade, a verificação não será nem ao mesma incluída no IL resultante, como você pode ver nesse print de uma ferramenta de descompilação:

![Uma imagem mostrando um trecho de código que não contem a checagem de nulo.](https://res.cloudinary.com/dz5ppacuo/image/upload/v1515684957/just-decompile1_qk69k2.png)

Você pode ver no trecho de código acima que o compilador otimizou o código, removendo a checagem por nulo.

Tem problemas muito piores, claro. Sim, a aplicação não vai *quebrar* por causa disso. Então, qual é o ponto?

Bom, pra começo de conversa, eu me preocuparia com uma empresa de desenvolvimento cujo único critério de qualidade é "roda sem quebrar". Mas o problema de verdade aqui é que esse tipo de código demonstra uma falta de entendimento sobre características fundamentais da linguagem e da plataforma que podem lhe causar problemas no futuro.

### Uso Desnecessário de `ToList()` em consultas do LINQ to Object
Assim como o problema anterior, o item atual é algo que eu rotineiramente vejo em código de produção. Considere o código abaixo:

{% highlight c# %}
	var result = users.ToList()
	.Where(x => x.PremiumUser)
	.ToList()
	.Select(x => new { Name = x.Name, Birth = x.DateOfBirth })
	.ToList();
{% endhighlight %}

O problema que temos aqui é que as chamadas ao método `ToList()` são totalmente desnecessárias (exceto talvez a última, caso você realmente precisasse que o resultado fosse um lista e não apenas um `IEnumerable`).

Em minha experiência, isso acontece quando quem escreveu o código não entende bem a natureza do LINQ; eles erroneamente acham que os métodos do LINQ pertencem ao tipo concreto `List<T>` ao invés de serem métodos de extensão que podem ser usados com qualquer implementação de `IEnumerable<T>`.

Ao chamar `ToList()` diversas vezes dessa forma, o desenvolvedor na verdade cria diversas listas novas, o que pode prejudicar o desempenho da aplicação.

O código acima pode ser reescrito da seguinte forma:

{% highlight c# %}
	var result = users.Where(x => x.PremiumUser).Select(x => new { Name = x.Name, Birth = x.DateOfBirth });
{% endhighlight %}

### Conversões Desnecessárias
Considere a linha seguinte:

{% highlight c# %}
	DateTime creationDate = DateTime.Parse(row["creation_date"].ToString());
{% endhighlight %}

Aqui temos não apenas uma mas duas conversões desnecessárias. Primeiro, criamos uma nova string e então a "parseamos" para `DateTime` quando um simples *cast* seria suficiente:

{% highlight c# %}
	DateTime creationDate = (DateTime)row["creation_date"];
{% endhighlight %}

Esse exemplo assume que o tipo no banco de dados é um tipo específico para lidar com datas (como `date` ou `datetime` no SQL Server). É claro que se você estivesse usando um tipo inadequado (como `varchar`) então isso já seria um outro problema.

### `Try-Catch` em todo lugar
Também conhecido como síndrome Pokémon ("Gotta catch'em all!"), o *anti-pattern* aqui é adicionar um bloco `try-catch` em cada linha em que exista a remota possibilidade de uma exceção ser disparada.

Pontos bônus se o código estiver tentando capturar `System.Exception` ao invés de uma exceção mais específica, acabando com a distinção entre erros esperados e não esperados.

Mais pontos se o bloco do `catch` não conter código nenhum!

A dica geral aqui é: jamais capture uma exceção a não ser que você tenha uma razão muito específica para fazê-lo. Do contrário, deixe que a exceção suba até que o gerenciador de exceções geral no nível mais alto lide com ela.

Se esse conselho parece vago ("Como vou saber se eu tenho uma boa razão para capturar a exceção?"), é porque de fato é. Explorar esse tema mais a fundo iria além do escopo desse post, , mas [ler o excelente artigo do Eric Lippert chamado "Vexing Exceptions"](https://blogs.msdn.microsoft.com/ericlippert/2008/09/10/vexing-exceptions/) vai aumentar e muito o seu entendimento sobre exceções.

### Usar `StringBuilder` Demais
Você já deve ter visto o filme: depois de ler em algum lugar que concatenar strings usando `+` é ineficiente, nosso intrépido desenvolvedor resolve tomar pra si a tarefa hercúlea de mudar cada concatenação de string no projeto para o uso de `StringBuilder`.

A justificativa para isso, claro, é que `System.String` é imutável. Então, cada vez que você "muda" a string, você na verdade está criando uma instância nova na memória, o que pode prejudicar o desempenho da aplicação.

Mas adivinha só. O compilador é bem esperto. Digamos que você tenha a seguinte linha:

{% highlight c# %}
	string a = "Hello " + "World";
{% endhighlight %}

Isso vai ser no fim das contas traduzido para:

{% highlight c# %}
	string a = "Hello World";
{% endhighlight %}

A regra geral é: tudo bem usar concatenação simples se você sabe o número de strings a anexar em tempo de compilação. Do contrário, [o uso de `StringBuilder` provavelmente faz mais sentido](https://stackoverflow.com/a/21644889).

Lógico, alguns cenários não são tão claros assim. O único conselho que faz sentido dar aqui é: faça seu dever de casa. Quando estiver com dúvida, pesquise e faça *benchmark* sem dó.

Eu termino com mais uma dica sensata do Eric Lippert:

> Unnecessary code changes are expensive and dangerous; **don’t make performance-based changes unless you’ve identified a performance problem.**

## Existe Solução?
Eu diria que é justo supor que pessoas com menos experiência são mais propensas a cometer erros devido à programação cargo cult. Mas desenvolvedor nenhum está realmente a salvo, independentemente de seu nível de conhecimento ou experiência.

Nós somos apenas humanos no fim das contas. Cansaço, prazos, vieses cognitivos e (para ser realmente honesto) a preguiça eventual pode transformar até o melhor de nós em um programador cargo cult.

Infelizmente, não há uma maneira 100% garantida de impedir isso de acontecer. Mesmo assim, aqui vão algumas medidas que você pode tomar para, ao menos, diminuir as chances.

Vamos ver algumas delas.

### Use Revisão de Código/Programação em Par
A primeira medida que você pode tomar para evitar o cargo cult é simplesmente ter uma segunda pessoa olhando seu código. Os benefícios de ter uma outra pessoa revisando cada linha de código antes que ela chegue em produção não podem ser subestimados. E embora [revisão de código e programação em par não são exatamente equivalentes](https://blog.submain.com/code-review-vs-pair-programming-2/), ambas as práticas podem lhe trazer esse benefício.

### Sempre Teste Suas Hipóteses
Escreva [testes de unidade](https://carlosschults.net/pt/testes-unitarios-iniciantes-parte1) (e outros tipos de testes também). Monitore sua aplicação em produção. Se algo não está tendo um bom desempenho, faça *benchmarks* exaustivos. Não faça só suposições. Testar as suas hipóteses pode trazer *insights* valiosos e salvar a sua pele naqueles momentos em que a sua intuição não for certeira.

### Leia Código de Outras Pessoas
Ler código escrito por outras pessoas é uma ótima maneira de aprender. É uma ferramenta perfeita para comparar suas ideias e suposições contra o que outros desenvolvedores estão fazendo, expondo você a novos conceitos que podem lhe forçar a ganhar um entendimento maior dos problemas que está tentando resolver.

Na era do [GitHub](https://github.com/), não tem muita desculpa para não fazer isso.

### Aprenda Com Suas Ferramentas
Existe um número enorme de ferramentas que podem ajudar [sua equipe com a qualidade do seu código](https://www.ndepend.com/). Aqui vai a dica principal: você não deve só usar essas ferramentas. Você deve também aprender com elas. Se você usa NDepend, [leia sobre suas regras](https://www.ndepend.com/default-rules/webframe.html). Tente entender a justificativa por trás de cada uma delas. Quais são os princípios e boas práticas que guiaram seus autores durante a criação delas?

A mesma dica vale para outros tipos de ferramentas, e até para os warnings que o compilador lhe mostra.

## Ciência da Computação, Não *Superstição* da Computação
Embora ninguém seja imune à programação cargo cult, nós devemos nos esforçar para superá-la. Há sabedoria na nossa área à nossa disposição, acumulada lentamente ao longo de mais de 7 década. Vamos usá-la. Vamos entender melhor nossas ferramentas e nossa profissão e escrever software de qualidade.
