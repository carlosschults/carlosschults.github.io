---
title: "Métodos privados são um 'Code Smell'?"
ref: privates
lang: pt
layout: post
author: Carlos Schults
permalink: /pt/metodos-privados-code-smell/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1485700794/capa-min_no1cci.jpg
tags:
- code-smell
- boas-praticas
- orientacao-a-objetos
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1485700794/capa-min_no1cci.jpg)

Algumas pessoas acham que métodos privados devem ser evitados. Será que elas estão certas?
<!--more-->

Há uns dois meses, [Marcos Douglas](https://twitter.com/mdbs99) publicou um post [sobre como o uso de regras e restrições pode melhorar seu código](https://objectpascalprogramming.com/posts/menos-e-mais/). Essa [premissa](https://medium.com/@cscalfani/why-programmers-need-limits-3d96e1a0a6db#.rptqu89ec) costuma aparecer [de novo](https://blog.ploeh.dk/2015/04/13/less-is-more-language-features/) e [de novo](https://robots.thoughtbot.com/sandi-metz-rules-for-developers) pela web, e eu concordo totalmente com ela. 

Marcos mostra várias orientações úteis, tais como o número ideal de argumentos em um método, o número ideal de métodos, em uma classe, e assim por diante. O artigo é muito bom, e eu recomendo a todos vocês que o [leiam ](https://gist.github.com/carlosschults/5f4ba7cfb2453977c8d11424b2926686), mas ele não é o foco do meu post hoje.

Hoje, o que eu realmente quero falar é de um assunto que surgiu na área de comentários do artigo do Marcos: que diversas pessoas consideram métodos privados como um [*Code Smell* (algo como "mau-cheiro de código")](https://www.pedromendes.com.br/2013/11/04/code-smells/).

Como eu nunca tinha ouvido ou lido nada nesse sentido antes, fiquei bastante surpreso e decidi pesquisar mais.

## Qual seria o problema de métodos privados?

Para começar, vamos tentar entender por qual razão métodos privados seriam um problema.

One common argument is that private methods violate the Single Responsibility Principle. The SRP states that each class should do only one thing. If you're tempted to create private methods, the argument follows, that's a sign that your class is doing too much.

Um argumento comum é que métodos privados violam o *Princípio da Responsabilidade Única* (ou SRP, do inglês *Single Responsibility Principle*).

> Private helper methods indicate classes are doing too many things. Moving private helper methods to different classes, including creating new classes if necessary, splits the original responsibilities across multiple classes leading to simpler, better designs.
>
> Kent R Spillner, em [Private Methods are a Code Smell](https://kent.spillner.org/blog/work/2009/11/12/private-methods-stink.html)

Em tradução livre:

> Métodos auxiliares privados indicam que as classes estão fazendo coisas demais. Mover métodos auxiliares privados para classes diferentes, incluindo criar novas classes se necessário, divide as responsabilidades originais em múltiplas classes, levando à projetos mais simples e melhores.

Aqui temos uma opinião bem parecida:

> Private methods are not inherently bad, but they are a sign that you might be missing out on an opportunity to make a useful abstraction. If you have a private method that calls another private method, then there is almost certainly an area of responsibility that remains unidentified.
>
> John McDowall, em [Break. It. Up! – Private Method Access Modifiers as Code Smells](https://blog.stormid.com/2015/03/method-access-modifiers-as-code-smells/)

Em tradução livre:

> Métodos privados não são inerentemente ruins, mas eles são um sinal de que você talvez esteja perdendo uma oportunidade de criar uma abstração útil. Se você tem um método privado que chama outro método privado, então é quase certeza que há uma outra área de responsabilidade que permanece não identificada.

Outro argumento é que métodos privados dificultam o uso de testes unitários:

> Make it public!
>
>[...]This is probably the simplest way to overcome the problem of untestability.[...] There’s a reason for that:  testability is a perfectly good reason to make something public.  And you should test most of your code.

> Jason M Baker, em [Enemies of Test Driven Development part I: encapsulation](https://jasonmbaker.wordpress.com/2009/01/08/enemies-of-test-driven-development-part-i-encapsulation/)

Em tradução livre:

> Torne [o método privado] público!

>[...]Essa é provavelmente a maneira mais simples de resolver o problema da não-testabilidade[...] Existe uma razão para isso: testabilidade é uma razão perfeitamente boa para tornar algo público. E você deveria testar a maior parte do seu código.

Finalmente, pessoas também argumentam que métodos privados desempenham um papel importante no problema de "bagunçar" o estado interno dos objetos, o que pode lhe causar grandes problemas.

>Functional programming teaches that state (in the form of member variables) is evil, because it makes your code more complex and harder to test.
>
> Ryan Ginstrom, em [Three reasons to avoid private class members](https://ginstrom.com/scribbles/2007/11/12/three-reasons-to-avoid-private-class-members/) 

Em tradução livre:

> Programação funcional ensina que estado (na forma de variáveis de instância) é maligno, porque ele torna seu código mais complexo e mais difícil de ser testado.

Eu acabei de mostrar alguns dos argumentos comuns contra a criação de métodos privados, então agora é hora de mostrar a opinião nesse assunto.

## Métodos privados *não* são necessariamente violações do SRP

O primeiro argumento apresentando afirma que métodos privados violam o Princípio da Responsabilidade Única.

> *Private helper methods indicate classes are doing too many things.*

Eu não penso que esse seja o caso. Pelo menos, não sempre. Isso depende do que exatamente o método privado faz.

Você provavelmente não deveria adicionar um método chamado `ValidarEnderecoDeEmail` à sua classe `Cliente`, sendo o método privado ou não. Afinal de contas, um cliente não é a única entidade que pode ter um endereço de e-mail. Ao invés disso, crie uma classe `Email` e coloque todas as validações pertinentes nela.

Por outro lado, digamos que você esteja criando um método `Ordenar` em uma estrutura de dados customizada. Nesse caso, faria todo o sentido manter o método `Ordenar` público, e ter alguns métodos privados auxiliares, como `CompararItens` e `Trocar`.

> *Moving private helper methods to different classes, including creating new classes if necessary, splits the original responsibilities across multiple classes leading to simpler, better designs.*

Meu principal problema com esse argumento não é que classes pequenas são geralmente melhores que as grandes, o que eu concordo.

Meu problema é que eu não concordo que criar novas classes e métodos públicos **apenas para evitar métodos privados** vai **automaticamente** gerar "designs mais simples e melhores". É claro que *pode* gerar; mas pode gerar projetos priores também. Cada situação é única.

## Eu não compro testabilidade como um fim em si mesmo

Eu gosto muito de testes unitários (e testes automatizados de uma maneira geral). Eu ajudei evangelizar testes unitários no meu trabalho, e atualmente eu supervisiono o time que está adicionando testes unitários e de integração em nosso *codebase*.

E uma das primeiras perguntas que as pessoas fazem quando estão aprendendo sobre testes unitários é: *Como eu faço para testar métodos privados?*

![](unicorn_dies.jpg)

Minha resposta geralmente é: **você não deveria precisar**. Na minha opinião, não é muito produtivo colocar um esforço excessivo em testar métodos privados: como eles são chamados pelos públicos, eles vão ser exercitados pela sua suíte de testes de qualquer forma.

O objetivo de um teste unitário deveria ser testar e documentar uma "unidade" (uma classe) por meio de usar sua API pública. O que nos leva ao próximo ponto.

# Sua API pública deve ser estável (ou "Encapsulamento importa")

API significa *Application Programming Interface*, ou Interface de Programação de Aplicações, em tradução livre. 
Esse termo pode significar várias coisas, mas no nosso contexto aqui, pense no conjunto das classes e métodos públicos que você expõe aos consumidores. 

A API age como um tipo de contrato entre você e os consumidores do seu código. É um acordo. Se você alterar o acordo, a outra parte não vai ficar muito feliz.

![](deal.jpg)

Sua API pública deveria ter o máximo de estabilidade possível. Isso é particularmente importante quando você está criando um *web service*, uma biblioteca, ou qualquer tipo de ferramenta na qual terceiros dependem.

A propósito, esses "terceiros" não necessariamente precisar estar distante geograficamente de você. É bem comum em empresas, médias para cima, que vários times dependam de código disponibilizado por outros. O que aconteceria se cada equipe fizesse alterações drásticas em suas APIs constantemente? Caos.

A partir do momento que você expõe um método publicamente, você tem a responsabilidade de mantê-lo funcionando e honrando seu contrato; do contrário, você corre o risco de causar quebra de retrocompatibilidade nos seus clientes!

Um bom uso de métodos privados pode ajudar a manter um encapsulamento correto no seu design.

Aqui temos mais uma citação de Kent R Spillner:

> Sometimes, private methods are created just to give pieces of functionality more descriptive names. Although descriptive names are desirable, creating private methods to provide descriptive names for things is still a smell. Moving these methods to collaborators and making them public creates opportunities for future reuse without reducing the clarity of the original code.

Em tradução livre:

> Às vezes, métodos privados são criados apenas para dar nomes mais descritivos a pequenos trechos de funcionalidade. Embora nomes descritivos são desejáveis, criar métodos privados para dar nomes descritivos a coisas ainda é um *smell*. Mover esses métodos para colaboradores e torná-los públicos cria oportunidades para reuso futuro sem reduzir a claridade do código original.

Esse é um dos pontos com os quais eu discordo mais veementemente. Eu frequentemente crio métodos privados pela exata razão que Kent critica aqui, ou seja, dar nomes descritivos a certos trechos de código, um hábito eu adquiri após ler o livro *Código Limpo*, de Robert C. Martin.

Kent defende que o jeito correto de lidar com isso seria mover esses métodos para novas classes e torná-los públicos.

Mas se eu fizer isso, eu adiciono um novo método à API público da minha aplicação! Agora eu tenho um método a mais para documentar, testar e manter, mesmo que jamais tenha intencionado que esse método fizesse parte da API.

Aqui temos uma definição para modificadores de acesso que na minha opinião acerta em cheio:

> public - this method is part of the published API and will not change within major versions of the class
> 
>[...]
>
> private - this method was refactored out of a well tested public or protected method for reasons of clarity or internal re-use. This method may absolutely change, even in patch releases, and should not be relied upon to even exist.

Em tradução livre:

> público - este método é parte da API publicada e não vai mudar dentro de versões principais da classe.

>[...]

> privado - este método foi criado na refatoração de um método público ou protegido bem testado, por razões de claridade ou reuso interno. Este método com certeza pode ser alterado, mesmo em releases de correção, e ninguém deveria depender da existência dele.

Eu concordo com essa definição. Portanto, em minha visão.

- Métodos privados não são necessariamente uma coisa ruim a ser evitada a todo custo.
- A prática de tornar métodos privados em públicos não leva automaticamente a um design melhor; ela pode também gerar uma API desnecessariamente inflada, encapsulamento enfraquecido, e maior trabalho para manutenção.
- Testabilidade é um objetivo nobre, mas precisa ser buscado de maneira pragmática. Métodos públicos bem testados e bem documentados deveriam ser suficientes, na maioria dos casos.

## Métodos privados podem ser bons ou ruins; aprenda a separ o joio do trigo

Tudo isso dito, eu também acho que existem casos nos quais métodos privados são usados de uma maneira errada. Toda ferramenta pode ser abusada. Existem alguns sinais para os quais você precisa ficar alerta:

Se um método privado está em um **nível de abstração diferente** que os públicos em uma classe, é um sinal de que ele pertence em outra classe. Leitura e escrita em arquivo está um nível de abstração bem mais baixo que o cálculo do pagamento mensal de um empregado, por exemplo.

Quando um método privado é tão complexo que você realmente queria poder testá-lo...é sinal de que ele provavelmente deveria ser público. (Antes que você corra para os comentários para apontar minha aparente contradição, eu não estou dizendo que **todos** os métodos privados deveriam virar públicos para serem testáveis...apenas aqueles que ultrapassam um determinado limiar de complexidade).

<blockquote class="twitter-tweet" data-lang="pt"><p lang="en" dir="ltr"><a href="https://twitter.com/pablogl">@pablogl</a> i only test public methods. if a private method is complex enough to need testing, it generally needs its own object.</p>&mdash; Kent Beck (@KentBeck) <a href="https://twitter.com/KentBeck/status/3579860805">27 de agosto de 2009</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

E quando um método privado contém código duplicado, do tipo, copiado e colado de outra classe? Livre-se da duplicação na hora!

Então, esse é o ponto: duas das três dicas que acabo de mostrar são meio subjetivas. Em algum ponto, você tem que fazer algumas escolhas. Quão complexo é complexo o suficiente para um método privado precisar de testes unitários? Como distinguir níveis de abstrações diferentes?

A melhor dica que eu posso oferecer é: **Duas cabeças pensam melhor que uma**. Sempre faça com que outra pessoa olhe e examine seu código antes de ser commitado. Programação em par e/ou revisão de código são ótimas técnicas, não apenas para melhorar o projeto e encontrar bugs, mas principalmente para espalhar conhecimento por uma equipe. Não só conhecimento técnico, mas conhecimento do domínio também, e isso pode fazer toda a diferença na hora de tomar as decisões difíceis.

## Conclusão

Embora métodos privados podem ser usados em maneiras ruins, eu penso que seria prematuro automaticamente rotulá-los como uma coisa ruim a ser evitada.

Me parece que algumas das pessoas que afirmam estar argumentando contra métodos privados **estão na verdade argumento contra problemas que são ortogonais a métodos privados**; você pode violar a SRP com ou sem métodos privados; você pode causar problemas com estado interno mutável com ou sem métodos privados, e assim por diante.

Desenvolver software é uma arte, cheia de *trade-offs* e incerteza. E ainda que "regras de ouro" possam ser úteis, elas não devem ser seguidas cegamente.

Este post ficou muito mais longo do que eu planejei. Agradeço caso tenha chegado até aqui. Até a próxima!

## Veja também

- [https://stackoverflow.com/questions/2620699/why-private-methods-in-the-object-oriented](https://stackoverflow.com/questions/2620699/why-private-methods-in-the-object-oriented)
- [https://kent.spillner.org/blog/work/2009/11/12/private-methods-stink.html](https://kent.spillner.org/blog/work/2009/11/12/private-methods-stink.html)
- [https://blog.stormid.com/2015/03/method-access-modifiers-as-code-smells/](https://blog.stormid.com/2015/03/method-access-modifiers-as-code-smells/)
- [https://jasonmbaker.wordpress.com/2009/01/08/enemies-of-test-driven-development-part-i-encapsulation/](https://jasonmbaker.wordpress.com/2009/01/08/enemies-of-test-driven-development-part-i-encapsulation/)
- [https://medium.com/i-m-h-o/private-methods-smelly-ish-435e93ff8c39#.cl06rkgct](https://medium.com/i-m-h-o/private-methods-smelly-ish-435e93ff8c39#.cl06rkgct)
- [https://ginstrom.com/scribbles/2007/11/12/three-reasons-to-avoid-private-class-members/](https://ginstrom.com/scribbles/2007/11/12/three-reasons-to-avoid-private-class-members/)
- [https://rc3.org/2010/01/26/the-argument-against-private-methods/](https://rc3.org/2010/01/26/the-argument-against-private-methods/)
- [https://naildrivin5.com/blog/2010/05/26/is-private-a-code-smell.html](https://naildrivin5.com/blog/2010/05/26/is-private-a-code-smell.html)
