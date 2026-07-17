---
title: "Revisão de Código vs Programação em Par: Qual a sua equipe deve escolher?"
ref: cr-vs-pp
lang: pt
layout: post
author: Carlos Schults
description: Revisão de código e programação em par são iguais? Vamos descobrir no post de hoje.
permalink: /pt/revisao-codigo-vs-programacao-em-par/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1516470435/code-review-vs-pair-programming1038x437_w99q2t.jpg
tags:
- programacao-em-par
- boas-praticas
- revisao-de-codigo
- metodologias-ageis
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1516470435/code-review-vs-pair-programming1038x437_w99q2t.jpg)

*NOTA: Eu escrevi este post originalmente para o blog da SubMain. Você pode [conferir o artigo original no site deles, em inglês](https://blog.submain.com/code-review-vs-pair-programming-2/). Enquanto estiver por lá, dê uma conferida no CodeIt.Right, uma ferramenta que pode lhe ajudar com automação de revisões de código.*

Algumas semanas atrás, eu estava olhando o Twitter quando vi isso:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Pair Programming &gt; Code Review</p>&mdash; Rafael Ponte (@rponte) <a href="https://twitter.com/rponte/status/932390250848178176?ref_src=twsrc%5Etfw">November 19, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

O que se seguiu foi uma breve discussão entre o autor e eu. Ele apresentou bons argumentos, mas eu continuei não convencido de que programação em par (*pair programming*) era um vencedor tão óbvio.

Como eu já havia implementado práticas de revisão de código (*code review*) com sucesso e também pareado até certo ponto, eu não tinha dificuldades em ver como as duas práticas podem ser valiosas. Mas será que uma deles é claramente *melhor* que a outra? Revisão de código e programação em par são intercambiáveis, ou há cenários em que um ou outro claramente se destaca?

É o que vou responder hoje. Vamos lá.

## O que quero dizer por "Revisão de Código"

Imagine a seguinte cena: você é um(a) jovem programador(a) em seu primeiro trabalho com desenvolvimento de software. Após terminar sua primeira tarefa, você é convocado(a) a uma sala de reunião; lá você encontra o desenvolvedor líder e três desenvolvedores seniores. Um monitor enorme está ligado exibindo seu código. Hora da revisão!

Durante duas horas e meia sofridas, seu código é julgado sem só enquanto você sua profusamente. Desde suas decisões de projeto até as mais triviais preferências estilísticas, nada escapa da enxurrada de críticas.

É essa a cena exibida na sua mente quando você vê as palavras "revisão de código"?

Boa notícias pra você, então. Este *não* é o tipo de revisão de código sobre o qual estou falando. Ao invés, pense em um processo bem leve e informal. Você submete seu código para revisão criando um pull request ou mesmo usando alguma funcionalidade incorporada na sua IDE.

### A parte boa

Após tocar brevemente no "o que" e no "como" de uma revisão de código, hora de abordarmos o "por que". Por que o seu time deve adotar a prática? Quais são os benefícios?

A primeira razão, não surpreendentemente, é **detectar bugs**. Eu aposto que você é familiar com aquela velha pérola de sabedoria que diz que [quanto mais tarde um defeito é encontrado, maior é o custo para sua resolução][2]. Sendo assim, por que não usar um processo relativamente barato que pode encontrar [até 60% dos defeitos][2]?

Outra razão para a sua empresa adotar revisões de código: melhorar a **legibilidade do código**. Tentar ler e entender um trecho novo de código frequentemente leva à descoberta de problemas como:

- Nomes ruins.
- Indentação errada.
- Ocorrências de [programação cargo cult](https://en.wikipedia.org/wiki/Cargo_cult_programming).
- Código não idiomático.

O revisor também pode encontrar *corner cases* que passaram despercebidos ou ajudar na avaliação de performance do código escrito.

E chegamos à última razão. Uma revisão de código bem feita pode **espalhar conhecimento pelo time.** Isso destrói ilhas de conhecimento na equipe, melhorando a qualidade final do produto.

### A parte ruim

Enquanto alguns dizem que a revisão de código é a [prática mais importante que você deve adotar][3] para aperfeiçoar seu código, [tal entusiasmo não é universal][4]. Assim, não poderíamos deixar de falar também das potenciais desvantagens da prática. 

A queixa mais comum sobre revisão de código tem a ver com **tempo**. Quando você envia algum código para revisão, você obviamente precisa esperar até que a revisão seja finalizada.

O que fazer durante a espera? Idealmente, sua equipe deveria quebrar o trabalho disponível em unidades pequenas e discretas, que possam ser resolvidas de maneira mais ou menos independente. Nem sempre isso é prático, porém. E falando nisso, **a própria troca constante de tarefas pode ser prejudicial para seu foco e produtividade**.

Digamos que o Bruno gastou *x* horas implementando uma funcionalidade. Então a Ana revisa o trabalho dele e diz que a implementação está completamente errada, e ele precisa refazer tudo. **Aquelas *x* horas de desenvolvimento acabaram de ir para o lixo**.

Finalmente, às vezes as pessoas desperdiçam quantidades ridículas de tempo **discutindo sobre detalhes estéticos inúteis**, como a posição das chaves, ou se devem ou não incluir um underscore no nome de um campo privado. Infelizmente, debates idiotas assim às vezes escalam para níveis que tornam o local de trabalho tóxico.

## Programação em Par: Mais que uma super revisão de código

Programação em par é uma técnica na qual duas pessoas colaboram no código juntas, na mesma estação de trabalho.

Elas periodicamente revezam em dois papéis. O *piloto* escreve o código, pensando em voz alta para explicar suas decisões e o que está pensando. O *navegador* observa o piloto, dando feedback e opiniões em tempo real.

Seria a programação em par nada mais que "*code review on steroids*", [como coloca Jeff Atwood][5]?

Talvez não. Um dos princípios básicos das metologias ágeis é que o desenvolvimento de software se beneficia de ciclos de feedback curtos. Levando isso em consideração, trazer a revisão de código para o mais cedo possível no processo faria bastante sentido, por estar em harmonia com os princípios ágeis.

### A parte boa

Não deveria ser surpresa que a programação em par compartilha vários dos benefícios da revisão de código, como detecção de bugs, melhoras na legibilidade do código e propagação de conhecimento pela equipe.

Mas a programação em par também pode oferecer benefícios exclusivos, tais como:

- **Mais foco**. A presença de um colega ao lado pode exercer uma certa pressão, lhe mantendo motivado na tarefa a ser realizada.
- **Ciclos de feedback mais curtos.**. Já que seu par está revisando seu código o tempo todo, existe um risco muito menor de desperdiçar tempo graças a feedback tardio.
- **Aumento no uso de outras boas práticas da Engenharia de Software**. Como sugerido por um estudo realizado na Universidade Estadual da Carolina do Norte, [equipes usando programação em par tendem a usar mais práticas de desenvolvimento como testes unitários, integração contínua e a criação de padrões de código](https://collaboration.csc.ncsu.edu/laurie/Papers/ESE%20WilliamsPairProgramming_V2.pdf).

### A parte ruim

Assim como no caso da revisão de código, programação em par está longe de ser uma prática universalmente aceita. Enquanto muitas pessoas amam a prática, [outras não têm histórias tão felizes para contar][6]

Vamos começar com uma reclamação comum: programação em par **pode ser extremamente cansativa**. Na verdade, não é incomum ourvir que [parear é mais eficaz quando usado por blocos de tempo curtos — de 1 hora a 2 horas e meia.][7]

Evidentemente, um número ímpar de integrantes na equipe não combina muito bem com programação em par. Mas um número flutuante de pessoal disponível é inevitável.

O próximo item na nossa lista de problemas é o fato de que programação em par não é muito compatível com trabalho remoto. Você pode ter uma ideia melhor do problema após ouvir o que Daniel Kaplan, que escreveu "[What It's Like to Pair for a Year][8]," tem a dizer sobre programação em par:

> These scheduling interruptions happen, but on a typical day we avoid them by having the pairs show up at the same time (for breakfast and standup), go to lunch at the same time, and leave at the same time. This maximizes the time the pairs are pairing.

Em tradução livre, com grifo meu:

> Tais interrupções ocorrem, mas em um dia típico nós conseguimos evitá-las **fazendo com que os pares cheguem na mesma hora (para café da manhã e reunião em pé), vão almoçar no mesmo horário, e vão para casa no mesmo horário**. Isso maximiza o tempo que os pares passam programando juntos.

Então, programação em par **requer sincronismo**, o que pode torná-la uma opção inviável para equipes remotas (ou mesmo equipes que trabalham no mesmo local mas tem horários extremamente flexíveis).

Tem gente que argumenta que trabalhar em pares pode **prejudicar a criatividade e impedir experimentações.** Durante uma sessão em par, pode ser considerado rude desperdiçar o tempo de seu par tentando uma abordagem experimental que pode talvez não dar em nada. Então, a decisão mais segura possível tende a prevalecer sempre, mesmo que não seja a melhor possível.

Finalmente, a programação em par não fornece um dos benefícios chave da revisão de código posterior: ter uma pessoa com zero contexto analisando o código produzido. As duas pessoas do par **compartilham contexto desde o início da sessão**, o que não deve ser subestimado. As pessoas têm uma tendência a [superestimar o valor de suas contribuições e criar laços emocionais com o que elas criam][9]; por isso é tão importante conseguir uma outra pessoa que, livre desses laços, será capaz de oferecer um julgamento mais claro.

## Revisão de Código vs Programação em Par: O Veredito?
Eu cheguei à conclusão de que, embora revisão de código e programação em par *pareçam* equivalentes, na verdade não são. Existe uma intersecção ali, mas cada prática também apresenta benefícios e desafios únicos.

Não tem como fugir do fato de que programação em par, apesar de seus benefícios, requer um número par de pessoas, trabalhando ao mesmo tempo. Se seu time consiste de pessoas vivendo em diversos fusos horários diferentes (ou mesmo uma equipe local mas com horário flexível), é fácil decidir: revisão de código na cabeça.

Se a sua equipe não se encaixa na descrição acima, então eu digo: **faça uma tentativa com programação em par**. Contanto que você se esforce para acomodar e ter empatia com [diferentes tipos de personalidades][10] e não torne obrigatório, programação em par pode ser benéfica para sua equipe.

Finalmente, não há nada lhe impedindo de usar *ambas* práticas. Você pode adotar programação em par como o *Modus Operandi* padrão e deixar e revisão de código para preencher os vácuos onde o pareamento não funciona tão bem.

## De um jeito ou de outro, abrace a automação
Imagine que você escreve para uma publicação, como uma revista. Após finalizar um rascunho, ele precisa ser submetido para revisão. Será que faz sentido para a editora gastar todo seu tempo procurando por erros de ortografia? É claro que não! Nós temos ferramentas para checar tais erros de forma automática, liberando a editora para procurar por problemas em um nível mais alto, como vocabulário mal escolhido, falta de coesão, tom inapropriado, e todas aquelas coisas sobre as quais a sua professora de português não dava sossego.

Com software não é diferente. Ao usar [uma ferramenta de revisão de códigos automatizados][11], você pode eliminar muitas das discussões inúteis que acontecem frequentemente em revisões de código ou sessões de programação em par. Não vai ter mais briga sobre convenções estéticas e de nomenclatura, posição de chaves e outras trivialidades inúteis.

You can also employ a static analysis tool to warn you about potential bugs and opportunities for refactoring. That way, the reviewer/navigator is free to focus on the high-level stuff that requires human creativity, intelligence, and empathy.

Você também pode usar uma ferramenta de análise estática para lhe alertar sobre potenciais bugs e oportunidades para refatoração. Assim, o revisor/navegador fica livre para focar em preocupações de mais alto nível que necessitam da criatividade, inteligência e empatia humanas.

## Confiança e respeito
Quando estava pesquisando para escrever esse post, um tema aparecia bastante: pessoas afirmando que revisão de código surge devido à falta de confiança em nossos desenvolvedores ou que programação em par os infantiliza.

Eu não poderia discordar mais.

É exatamente por respeitarmos nossos colegas e clientes que devemos empregar técnicas e ferramentas à nossa disposição para melhorar a qualidade do trabalho que produzimos.

Não é falta de confiança. É reconhecer que programar é difícil e às vezes, só um cérebro pode não dar conta do recado.

[2]: https://www.cs.umd.edu/projects/SoftEng/ESEG/papers/82.78.pdf
[3]: https://blog.codinghorror.com/code-reviews-just-do-it/
[4]: https://blog.nelhage.com/2010/06/i-hate-code-review/
[5]: https://blog.codinghorror.com/pair-programming-vs-code-reviews/
[6]: https://web.archive.org/web/20110101145142/https://tersesystems.com/2010/12/29/where-pair-programming-fails-for-me
[7]: https://softwareengineering.stackexchange.com/a/9518
[8]: https://builttoadapt.io/what-its-like-to-pair-for-a-year-86d048494324
[9]: https://en.wikipedia.org/wiki/IKEA_effect
[10]: https://www.amazon.com/Quiet-Power-Introverts-World-Talking/dp/0307352153/ref=asap_bc?ie=UTF8
[11]: https://submain.com/products/codeit.right.aspx
