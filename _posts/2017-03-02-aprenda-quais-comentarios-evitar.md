---
title: "Aprenda quais tipos de comentários devem ser evitados"
ref: bad-comments
lang: pt
layout: post
author: Carlos Schults
permalink: /pt/tipos-de-comentarios-a-evitar/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1488499558/comments-1038x437.jpg
tags:
- code-smell
- boas-praticas
- iniciantes
- comentarios
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1488499558/comments-1038x437.jpg)

Alerta de Spoiler: Você deveria evitar a maioria.
<!--more-->

"Comentar ou não comentar". Essa é uma questão que gera debates acalorados. Algumas pessoas dizem que comentários são indispensáveis. Outros defendem que comentários apenas mostram a incapacidade do desenvolvedor de se expressar claramente no código. Quem está certo?

Na época da faculdade, eu considerava comentários indispensáveis na hora de programar. Do contrário, como você poderia entender o que código deveria fazer?

Depois de me formar e encontrar um emprego, as coisas começaram a mudar. Eu comecei a ser exposto à *código real*. Eu estava lendo livros, artigos e blog posts escritos por pessoas influentes da área.

Todas essas experiências moldaram a minha visão atual.

## Os perigos da documentação ruim

Comentários são apenas outra forma de documentação. E não se engane: documentação é uma coisa boa - *quando feita corretamente e na quantidade certa*.

Infelizmente, é feita errada frequentemente!

Muitos tipos de documentação podem ser problemáticas. É muito comum que a documentação perca sincronia com o que está documentando, o que é bem pior que não ter documentação nenhuma para começar.

Esse é um dos problemas dos quais comentários sofrem, mas está longe de ser o único.

### Código comentado

Vamos começar com o problema mais óbvio de todos, que é código comentado. Alguns desenvolvedores, durante uma correção de bug por exemplo, decidem comentar o código que está errado, em vez de removê-lo.

**Não faça isso!**

Código comentado não traz benefício para ninguém. É apenas desperdício. Confie no seu sistema de controle de versão. Ele vai lembrar das alterações feitas caso seja necessário revertê-las no futuro.

### Comentários 'Changelog'

Esta categoria de comentários ruins é parecida com a anterior, no sentido de ser causada por uma falta de confiança no sistema de controle de versões.

O que eu quero dizer por comentários changelog? Comentários que servem apenas para listar as alterações feitas a um arquivo.

<script src="https://gist.github.com/carlosschults/3889e4d4b337c6adc94af354ec574d9a.js"></script>

Comentários desse tipo estão apenas fazendo o mesmo trabalho que seu controle de versão, mas de uma maneira desajeitada e propensa ao erro.

Não escreve comentários como esses. Use [git](https://git-scm.com/) e seja feliz.

### Comentários redundantes

Esse tipo de comentário ruim é muito fácil de detectar e corrigir. Considere o código a seguir:

<script src="https://gist.github.com/carlosschults/cc821bc3c00137e5fad68f1fe7d65490.js"></script>

Eu acho que todos podemos concordar que esses comentários são inúteis. O código é perfeitamente claro sem eles, portanto, devem ser removidos.

### Comentários delimitando fim de blocos

Você provavelmente já viu algum código assim antes:

<script src="https://gist.github.com/carlosschults/0c6e461ec278db804f52d64ade458bf4.js"></script>

Algumas pessoas escrevem comentários assim para não perderem o controle das chaves.

Se você precisa de comentários por essa razão, isso é indicativo de que seu método é muito longo e você tem muitos níveis de indentação.

Lembre-se do Princípio da Responsabilidade Única: cada método deve fazer apenas uma coisa. Divida o seu método em métodos menores e a necessidade desse tipo de comentários desaparece.

### Comentários que delimitam seções dentro de um método

Esse é parecido com o anterior. Se você tem diversas seções dentro de um método, cada uma delas com um comentário explicativo em cima, então você provavelmente está violando o Princípio da Responsabilidade Única.

Extraia cada trecho para seu próprio método, usando o texto do comentário como o nome do novo método, e então remova os comentários.

### Comentários desatualizados.

Um cenário comum:

- Bob escreve algumas linhas de código. Ele decide que o código não está claro o suficiente e adiciona alguns comentários para tornar a sua intenção mais clara.
- Passam-se algumas semanas. Alguém descobre um bug no código de Bob. Mas ele está de férias, então Alice é encarregada de corrigir o bug.
- Alice corrige o código em alguns minutos e comita suas alterações. Mas ela esquece de alterar os comentários para refletir as mudanças que ela fez no código.

O que nós temos agora? Comentários mentirosos!

**Documentação que espalha mentiras é pior que não ter documentação alguma.** É uma fonte de confusão para os desenvolvedores, e terreno fértil para bugs. Quando você ver um comentário desatualizado, não pense duas vezes: remova-o imediatamente, ou corrija-o. Mas na maioria das vezes você não deveria manter o comentário. Veja o próximo tópico para descobrir o porquê.

### Comentários criados devido à falta de expressividade no código

Considere o código a seguir:

<script src="https://gist.github.com/carlosschults/ec7db3ebadccded768f97933c88e704f.js"></script>


Talvez você não considere o comentário no trecho acima tão ruim. Tudo bem, não é péssimo. Mas pense na oportunidade perdida de extrair um método ou propriedade útil:

<script src="https://gist.github.com/carlosschults/b102a4f5c11ba7b1639410dcbb87830f.js"></script>

No novo código, nós extraímos o conceito de ser elegível para doar sangue para uma nova propriedade. As regras para elegibilidade para doação de sangue estão agora consolidadas em um único local; se elas mudarem algum dia, a quantidade de trabalho necessária para atualizá-las será mínima.

E nós ainda ganhamos o benefício adicional da legibilidade: a nova instrução `if` lê quase como linguagem natural.

## Conclusão

Como vimos, há diversos tipos de comentários ruins com os quais você deve ficar alerta. Eles geralmente são sinais de que há algo errado no seu código. Talvez seus métodos são muito longos.Talvez [você não escolheu bons nomes para suas variáveis](https://carlosschults.net/pt/como-escolher-bons-nomes/).
 
Toda vez que você sentir a necessidade de escrever um comentário, pare e tente pensar em maneiras de melhorar o seu código para tornar o comentário desnecessário.

Nem todos os comentários são ruins. Em um post futuro, vou falar sobre os tipos de comentários que são úteis.

Até mais!

## Ler mais (todos os links em inglês)

- [Apologies In Code, por Robert C. Martin](https://butunclebob.com/ArticleS.TimOttinger.ApologizeIncode)
- [Write comments that matter, por Sander Rossel](https://www.codeproject.com/tips/467657/write-comments-that-matter)
- [Please, don’t commit commented out code, por Kent C. Dodds](https://kentcdodds.com/blog/please-dont-commit-commented-out-code)

**PS:** Ainda não consegue ler em inglês? Meu novo curso, *Inglês Para Desenvolvedores*, pode ser a solução que você procura. [Acesse o site](https://ingles4devs.com), cadastre seu e-mail e fique por dentro das novidades!
