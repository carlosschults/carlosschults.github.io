---
title: Funcionalidades do C# 7 que vale a pena conhecer - Parte 1
ref: csharp7
lang: pt
layout: post
author: Carlos Schults
permalink: /pt/funcionalidades-csharp-7/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1489452722/charp7-features-cover_ciekql.jpg
tags:
- csharp
- iniciantes
- funcionalidades-da-linguagem
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1489452722/charp7-features-cover_ciekql.jpg)

C# 7 está finalmente entre nós. Hora de conhecer algumas de suas features.
<!--more-->

No meu [último post](https://carlosschults.net/pt/funcionalidades-csharp-6/) eu escrevi sobre algumas das funcionalidades mais interessantes (para mim, pelo menos) do C# 6. Visual Studio 2017 e C# 7 foram oficialmente lançados no dia seguinte, então eu acredito que agora é o momento perfeito para batermos um papo sobre a nova versão da linguagem.

Eu acho que é justo dizer que, em sua sétima versão, o C# continua a tendência iniciada na versão anterior. Ao invés de adicionar novas capacidades radicalmente novas na linguagem, o time de design escolheu incluir funcionalidades que podem tornar seu código mais limpo e simples.

Nesta versão, eles expandiram certas funcionalidades que tiveram sua estreia na versão 6. Parece até que o C# 6 foi um tipo de ensaio para algumas das features; agora que os projetistas da linguagem sabem que elas foram bem recebidas, eles podem levá-las para seu próximo nível.

Então, sem mais delongas, vamos começar.

## Separadores de dígitos e literais binários

Dê uma olhada no código a seguir:

<script src="https://gist.github.com/carlosschults/00e899d0f7611e3ca3b54f109f58619b.js"></script>

Para que servem os underscores? **Legibilidade**, essa é a resposta.

Números compridos podem ficar bem difíceis de serem lidos. Para lidar com esse problema, C# 7 permite que você use o `_` como separador de dígito.

Os separadores não fazem nenhuma diferença no valor do número. Você pode colocá-los em qualquer lugar no número, e em qualquer quantidade.

E caso você esteja se perguntando, você não está restrito a usar os separadores com números inteiros apenas; eles também funcionam com os outros tipos numéricos.

A nova versão do C# também introduz literais binários, como visto na terceira linha do exemplo anterior. Se você precisar escrever um valor binário, basta colocar `0b` no começo do número, e é isso!

## Variáveis 'Out'

Em versões anteriores do C#, trabalhar com variáveis *out* era um pouco inconveniente. Você tinha que separar a declaração da variável e seu uso em dois passos.

Agora, é possível já declarar a variável na lista de argumentos:

<script src="https://gist.github.com/carlosschults/fbd60b4e31a09c1e0a4f19b431b10320.js"></script>

Algumas coisas importantes para se ter em mente:

- Apesar de eu ter explicitamente escrito o nome do tipo na declaração, isso não é sempre necessário. Eu poderia ter usado `var` e funcionaria do mesmo jeito.
- Você talvez tenha pensado que a variável iria sair de escopo depois do bloco do `if`. Este não é o caso. A variável continua sendo acessada normalmente até que saia do seu escopo normal.

<script src="https://gist.github.com/carlosschults/a23411376a6610e0e9081674faf1b0a5.js"></script>

## (Mais) Membros "Expression-bodied"

No começo deste post, eu disso que C# 7 expande algumas features do seu antecessor, lembra? Bom, este é um destes casos.

No post anterior, nós vimos que [o C# 6 nos trouxe membros "Expression-bodied"](https://carlosschults.net/pt/funcionalidades-csharp-6/#mtodos-e-propriedades-expression-bodied), que é uma maneira mais legal e mais curta de declarar membros de classe, usando a sintaxe das expressões lambda. 

Porém, você só podia utilizar essa funcionalidade com **métodos, propriedades somente leitura e indexadores**.

C# 7 muda o jogo. Agora também é permitido ter construtores, destrutores e propriedades de escrita que usam essa feature.

<script src="https://gist.github.com/carlosschults/50512925b89eb8ee590190793846a724.js"></script>

## Expressões "throw"

Esta é bem simples. Considere o código a seguir:

<script src="https://gist.github.com/carlosschults/8f89e4fff3cf3e6302bc8325d4df5617.js"></script>

Foram 9 linhas de código para apenas uma atribuição. E a maioria dessas linhas nem estão fazendo a atribuição em si; elas são apenas uma cláusula de guarda. Claro, elas são importantes, mas tendem a poluir o seu código. E se tivesse um outro jeito?

Agora tem.

Nas versões anteriores, `throw` era uma declaração. Agora, é uma **expressão**, o que nos permite disparar exceções em lugares como a segunda parte do operador "Null Coalescing" e em expressões condicionais.

Usando a *throw expression*, o exemplo acima fica simples assim:

<script src="https://gist.github.com/carlosschults/a10cfa584d08fda2d3497075926d073d.js"></script>

Claro, não há nada nos impedindo de transformar o construtor em um "membro com corpo de expressão":

<script src="https://gist.github.com/carlosschults/02548a3f2d735468518e6c00eea385a8.js"></script>

## Conclusão

Neste post, nós vimos algumas das novas features da sétima versão do C#. Isto foi apenas a primeira parte. Mais partes virão, nas quais eu planejo abordar todas (ou, ao menos, a maioria) das novas funcionalidades.

Como eu disse antes, C# 7 meio que continua o caminho iniciado no 6. O time de projetistas não saiu incluindo umas features novas e loucas apenas por colocar; em vez disso, eles cuidadosamente selecionaram aquelas que mais nos ajudariam a melhorar a qualidade do nosso código.

Tendo dito isso, eu realmente considero essa versão um pouco menos...tímida - por falta de palavra melhor - que a anterior. Algumas das funcionalidades que não mencionei hoje mostram que a linguagem está sendo levada à novas e interessantes direções, e eu penso que temos uma viagem bastante interessante à nossa frente.

Obrigado por ter lido até aqui, e fique ligado(a) para a parte 2!
