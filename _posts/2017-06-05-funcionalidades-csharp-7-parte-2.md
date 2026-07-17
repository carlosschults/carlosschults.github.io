---
title: Funcionalidades do C# 7 que vale a pena conhecer - Parte 2
ref: csharp7pt2
lang: pt
layout: post
author: Carlos Schults
permalink: /pt/funcionalidades-csharp-7-parte-2
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1489452722/charp7-features-cover_ciekql.jpg
tags:
- csharp
- iniciantes
- funcionalidades-da-linguagem
---


![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1489452722/charp7-features-cover_ciekql.jpg)

Neste artigo, vamos continuar a ver algumas das features mais interessantes do C# 7.
<!--more-->

Na [primeira parte da série](https://carlosschults.net/pt/funcionalidades-csharp-7/), nós falamos sobre algumas das novas features do C#, a saber: melhorias em literais, variáveis de saída, mais membros "*expression-bodied*" e throw expressions.

Hoje nós veremos: **Tuplas** e **Funções locais**. Mas antes de continuarmos, quero deixar meu agradecimento ao amigo Gunter Italiano Ribeiro, que gentilmente revisou este artigo.

## Tuplas

Alguma vez você já teve a necessidade de escrever um método que retornasse mais de um valor? Provavelmente sim. Nas versões anteriores do C#, havia algumas opções disponíveis. Você poderia usar um parâmetro de saída (*out*), ou talvez criar um tipo específico, mas cada uma dessas opções tem seus próprios problemas. Parâmetros de saída podem complicar um pouco o design; criar um tipo para cada uma dessas situações pode ocasionar um *overhead* desnecessário, se tudo que você quer é só uma maneira de retornar dois valores, principalmente em um contexto privado.

No C# 7.0 você tem uma nova opção, utilizando **tuple types** e **tuple literals**. Com esta funcionalidade você pode facilmente declarar um método que retorna mais de um valor. Vamos ver um exemplo:

<script src="https://gist.github.com/carlosschults/37689aeb84ed4fdff067eab72690a035.js"></script>

Você é provavelmente familiar com o padrão `TryXXX`, usado por exemplo no tipo `System.Int32`. Estes tipos de métodos geralmente utilizam um parâmetro de saída (*out*) para retornar o valor resultante (ou o valor default do tipo, no caso da operação de *parsing* não for bem sucedida.

O exemplo acima contém um método `TryParse` na classe `ZipCode`. Observe a assinatura do método. 

Quando você escreve mais de um tipo desta forma na declaração do método, você está usando um *tuple type*.  Não se preocupe, você vai se acostumar.

Logo no início do método, nós passamos o texto recebido para um método privado que realizada a validação propriamente dita e retorna um valor lógico.

Depois da validação, nós retornamos um *tuple literal*, que consiste em uma nova instância da classe `ZipCode` e o flag indicando se a operação de *parsing* foi bem sucedida.

Legal, mas e o outro lado? Como o chamador da função lida com este tipo de retorno? Vamos ver:

<script src="https://gist.github.com/carlosschults/81b46fd01a187d866a41c0a74c8fc430.js"></script>

Se você colocar o cursor sobre o nome da variável, você verá seu tipo descrito, não surpreendentemente, como `(ZipCode, bool)`.

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1495494940/csharp7-part2-fig1_pnmlx5.png)

Você pode acessar cada elemento da tupla utilizando `zipParsingResult.Item1`, `zipParsingResult.Item2`, e assim por diante.

<script src="https://gist.github.com/carlosschults/f4a1cf2fea5808474fb126888c436f55.js"></script>

Entretanto, você não é obrigado a usar os nomes padrão dos elementos. Você pode usar nomes mais descritivos:

<script src="https://gist.github.com/carlosschults/eb3d649160d4a72a8d94b8ae79eefa2c.js"></script>

O código que chama o método torna-se mais legível:

<script src="https://gist.github.com/carlosschults/5f5c85d832af66094a68c4a59bdb23d7.js"></script>

Há ainda outra maneira de acessar os elementos de uma tupla. Utilizando uma funcionalidade chamada **Desconstrução**, você pode facilmente quebrar os componentes de uma tupla em variáveis.

Você pode declarar as variáveis usando seus tipos

<script src="https://gist.github.com/carlosschults/cccbc00f7b154bb897c332e4f8ed614c.js"></script>

É claro que inferência de tipo também funciona aqui, e neste caso você tem duas opções: usar a palavra-chave `var` para cada variável, ou usá-la uma vez só para todas as variáveis, colocando-a fora dos parênteses.

<script src="https://gist.github.com/carlosschults/225e608c7b844df46084b6a7af5b6ac2.js"></script>

Você não precisa realmente declarar as variáveis no momento da desconstrução, porém. É perfeitamente válido desconstruir uma tupla em variáveis já declaradas.

### Algumas notas

Tuplas são [*Tipos de Valor*](https://carlosschults.net/pt/tipos-valor-referencia-em-csharp/). A igualdade nas tuplas é implementada da maneira que você provavelmente esperaria: duas tuplas são iguais se seus valores são iguais e elas retornam o mesmo `HashCode`. O nome dos elementos não é relevante.

<script src="https://gist.github.com/carlosschults/4da3e29f9346a45aab9b5d9a583c6ac1.js"></script>

A atribuição também funciona da maneira que você provavelmente espera. Contato que elas sejam atribuíveis, duas tuplas podem ser atribuídas uma a outra facilmente. Assim como no caso anterior, nomes dos elementos não importam.

<script src="https://gist.github.com/carlosschults/7a8c710d4c22d31736d8dd714115e0c8.js"></script>

Atualmente, para que esta funcionalidade funcione, você precisa instalar um pacote do nuget chamado "System.ValueTuple". No Visual Studio, vá para **Ferramentas** > **Gerenciador de pacotes do NuGet** > **Console do Gerenciador de Pacotes**. 

A janela do Console do Gerenciador de Pacotes será exibida. Digite (ou copie e cole) `Install-Package System.ValueTuple` e pressione `ENTER`.

### Mas e o tipo `System.Tuple`?

Você talvez esteja se perguntando: qual a razão de tanto barulho sobre tuplas, já que o .Net Framework tem o tipo de referência `System.Tuple` desde a versão 4.0? Por que não continuamos com o tipo mais antigo?

Bem, [esta resposta no Stack Overflow explica muito bem (em inglês)](https://stackoverflow.com/questions/41084411/whats-the-difference-between-system-valuetuple-and-system-tuple), então eu vou tentar resumir aqui.

Primeiramente, conforme já mencionado, o tipo mais antigo é um tipo de referência, e o novo tipo é um tipo de valor, com todas as implicações usuais que isso traz.

Mas as diferenças realmente importantes têm a ver com conveniência e legibilidade. Ao usar `System.Tuple` não há desconstrução; você só pode acessar os elementos usando os nomes padrão (Item1, Item2, etc), o que pode prejudicar a leitura e interpretação do código.

## Funções Locais

Resumidamente, uma função local é exatamente o que o nome sugere: uma função que pode ser declarada dentro de outra.

<script src="https://gist.github.com/carlosschults/0aebfaf7d900d3b47a2d142a676dbb01.js"></script>

Como você notou, a função interna consegue acessar os valores disponíveis para a função mais externa.

É claro que o exemplo acima é deliberadamente simples; em produção, você provavelmente escreveria o código em `Log()` dentro do próprio método exterior.

Você também poderia utilizar um `delegate`:

<script src="https://gist.github.com/carlosschults/045204806458c6563cd3a8b20a63133f.js"></script>

Pelo visto, tudo que podemos fazer com funções locais já é possível de ser feito com métodos privados ou `delegates`. Será que precisamos mesmo desta feature?

Giovani Bassi nos mostra algumas razões para utilizar funções locais:

>
- Sintaxe consistente com a já utilizada em métodos;
- Não há necessidade de criar um delegate, ou referenciar Func, Action, ou algo parecido;
- Lambdas e delegates causam alocações extras, funções locais não;
- Ref e out são permitidos;
- Tipos genéricos são permitidos;
- É possível referenciar funções ainda não declaradas.

É claro que você poderia simplesmente usar um método privado. Mas a função local tem essa característica interessante de não ser acessível em nenhum outro lugar na classe, de maneira que não pode ser chamada acidentalmente.

Mads Torgersen nos mostra uma situação para a qual funções locais são a solução perfeita:

> As an example, methods implemented as iterators commonly need a non-iterator wrapper method for eagerly checking the arguments at the time of the call. (The iterator itself doesn’t start running until MoveNext is called). Local functions are perfect for this scenario:

Em tradução livre:

> Como exemplo, é comum que métodos implementados como iteradores necessitem de um *wraper* sem iterador para checar os argumentos imediatamente na hora da chamada. (O iterador em si não começa a rodar até que `MoveNext` seja chamado). Funções locais são perfeitas para este cenário:

<script src="https://gist.github.com/carlosschults/34b77038c058f261f615e739c7f9ea2a.js"></script>


Você poderia transformar a função `Iterator()` acima em um método privado, mas seria: 1) redundante e pouco elegante, pois iria requerer repetir a mesma assinatura e argumentos da função externa; e 2) menos seguro, pois outra parte do código poderia chamar o método sem fazer a validação.

## Conclusão

Falamos hoje sobre **Tuplas** e **Funções Locais**, duas novas features do C# que, à primeira vista, podem até parecer "inofensivas", mas que têm potencial para mudar o código que escrevemos de maneiras interessantes.

Com relação às funções locais, admito que, a princípio, não gostei. Ou melhor dizendo: não fui capaz de ver utilidade. Depois de pesquisar um pouco mais, entendi que funções locais têm sim seus casos de uso.

Com as tuplas a história é diferente. Acredito que quase todo desenvolvedor C# com alguma experiência já desejou poder retornar mais de um valor de um método e se frustrou com as opções disponíveis. Agora com as tuplas finalmente temos uma solução elegante, fácil de usar e que melhora a legibilidade do código.

Nem tudo são flores, infelizmente. Alguns desenvolvedores já expressaram preocupações com essas features. Por exemplo, as funções locais podem incentivar a proliferação de métodos gigantescos.

As tuplas, por sua vez, podem ser exageradamente utilizadas em situações que requerem *objetos*, tornando o código mais procedural.

Minha opinião com relação à isso é simples: toda e qualquer feature pode ser abusada. Cada a nós, profissionais, e às nossas equipe, exercermos o senso crítico na hora de utilizar essas (e outras) funcionalidades. Aliás, conforme mencionei no [meu artigo sobre métodos privados](https://carlosschults.net/pt/metodos-privados-code-smell/), revisão de código e/ou programação em par são de ótima ajuda em momentos como esse.

Obrigado pela leitura, e até a próxima. 

## Referências

- [https://blogs.msdn.microsoft.com/dotnet/2017/03/09/new-features-in-c-7-0/](https://blogs.msdn.microsoft.com/dotnet/2017/03/09/new-features-in-c-7-0/)
- [https://www.lambda3.com.br/2016/04/novidades-do-c-7-local-functions/](https://www.lambda3.com.br/2016/04/novidades-do-c-7-local-functions/)
