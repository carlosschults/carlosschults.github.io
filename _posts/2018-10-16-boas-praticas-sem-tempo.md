---
title: "Boas Práticas De Programação Para Os Apressados"
ref: best-practices-short-time
lang: pt
layout: post
author: Carlos Schults
description: No post de hoje eu falo de algumas boas práticas de programação que podem aumentar a qualidade da sua aplicação em pouco tempo.
permalink: /pt/boas-praticas-sem-tempo/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1539703469/coding-best-practices-1038x437_ugnhab.jpg
tags:
- csharp
- boas-praticas
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1539703469/coding-best-practices-1038x437_ugnhab.jpg)
Photo by Ales Nesetril on Unsplash


*NOTA: Este post foi originalmente escrito para o blog da the SubMain.  Você pode [ler o artigo original no site deles, em inglês](https://blog.submain.com/coding-best-practices-short-time/). Quando estiver por lá, baixe e experimente o CodeIt.Right.*

Um dos tópicos em desenvolvimento de software que me interessa muito são boas práticas de codificação. Eu estou sempre pesquisando e buscando maneiras de aperfeiçoar meu trabalho e entregar valor de forma rápida e consistente.

Pode ser meio espinhoso definir o que "[é realmente uma boa prática"](https://www.daedtech.com/what-is-a-best-practice-in-software-development/). Há pessoas que inclusive sugerem [aposentar o termo!](https://dzone.com/articles/death-best-practices) Mas um ponto em que praticamente todos concordam é: descobrir e implementar estratégias - não importa o nome que você coloca nelas - para melhorar o resultado do seu trabalho é algo que qualquer programadora ou programador que faz jus a esse nome deveria fazer continuamente. 

Claro, não existe almoço grátis. A adoção de uma boa prática leva tempo, o que você provavelmente não tem muito sobrando para começo de conversa. Isso sem mencionar a gerência, nem sempre muito animados a tentarem coisas novas.

Então, o que fazer se a sua equipe de desenvolvimento está sofrendo com a baixa qualidade de uma base de código, mas não tem tempo para implementar as boas práticas que remediariam a situação?

A resposta que eu ofereço é o que eu vou chamar de "pacote emergencial de boas práticas": uma pequena lista de boas práticas de programação que você pode adotar em relativamente pouco tempo para levar sua equipe e sua aplicação do completo caos para um estado mais gerenciável.

Sim, eu sei que há tantos conselhos sobre boas práticas por aí que é até difícil não se sentir sobrecarregado. Por causa disso, eu restringi a minha lista de boas práticas a itens que atendam aos seguintes critérios:

- As boas práticas precisam ser fundamentais, no sentido de que elas são blocos básicos a partir dos quais você pode implementar práticas mais sofisticadas depois.
- Você pode adotá-las em relativamente pouco tempo. (Eu diria que uma semana é praticável.)
- O seu custo é zero ou perto disso.

As práticas a seguir atendem os critérios listados. E sem mais enrolação, aqui está: meu pacote emergencial de boas práticas de codificação, com itens listados na ordem que eles deveriam ser adotados, começando pelo mais crítico.

## Sistema de Controle de Versão

Eu trabalhei uma vez em uma empresa de desenvolvimento de software na qual nenhum sistema de controle de versão era usado. Os arquivos de código fonte ficavam em uma pasta compartilhada que qualquer desenvolvedor podia acessar. Qual era o processo usado para poder editar um arquivo? Você provavelmente adivinhou: nós criávamos uma cópia do arquivo e adicionávamos "_OLD" ao final do nome. 

Isso aconteceu há oito ou nove anos, o que significa que as coisas devem ter melhorado, certo? Bom, provavelmente melhoraram, um pouco, mas não totalmente. Ainda tem [empresas por aí que não usam controle de versão](https://twitter.com/_m_b_j_/status/938785388268806146).

### Como proceder?

De agora em diante, eu vou assumir que você concorda que versionamento é uma boa prática fundamental. Caso esse não seja o caso, há muitos recursos pela web afora explicando [o que um versionador é](https://www.git-tower.com/learn/git/ebook/en/desktop-gui/basics/what-is-version-control#start) e [porque você deveria usar um.](https://www.atlassian.com/git/tutorials/what-is-version-control#benefits-of-version-control)

Com isso resolvido, é hora de sermos mais específicos. Qual ferramenta usar? Como proceder com a sua adoção?

[Git](https://git-scm.com/) é uma escolha sólida. E apesar de ter uma curva de aprendizado mais acentuada para[quem já está mais acostumado com sistemas de controle de versão centralizados, como Subversion ou TFVC](https://carlosschults.net/en/git-basics-for-tfs-users), Git é o padrão *de facto* da indústria. Então, sem sombra de dúvidas, você deve aprender git. Não fazê-lo pode prejudicar a sua carreira no futuro.

Mas é possível que o Git não seja a melhor escolha para o seu time **agora**. Lembre-se, você não tem muito tempo. Nós precisamos que a sua equipe adote as boas práticas o mais rápido possível.

Como nós podemos fazer isso? Suponha que você tenha experiência com [Subversion](https://subversion.apache.org/), pois esse era o versionador usado na empresa que você trabalhou anteriormente. Sua experiência com Git, porém, é nenhuma. Se esse é o caso, eu diria que Subversion é a melhor escolha para você. Ter que aprender um novo sistema e ensiná-lo para seus colegas ao mesmo tempo que o coloca em vigor na empresa seria demais: você iria apenas se sobrecarregar.

## Revisão de Código

Eu não vou mentir: eu sou um grande fã de revisão de código. E [eu não estou sozinho nisso.](https://www.codinghorror.com/blog/archives/000495.html). Eu já testemunhei em primeira mão como um bom processo de revisão de código pode reduzir o número de problemas em uma aplicação, tornar o código mais consistente e, mais importante ainda, espalhar conhecimento por todo o time de desenvolvimento.

E aqui vai uma ótima vantagem dessa prática: revisão de código é algo relativamente fácil de ser implementado. Comece da maneira mais simples possível, e então faça adaptações na sua abordagem conforme as necessidades aparecerem.

### Minha Definição de Revisão de Código

Falar de revisão de código pode ser complicado. As pessoas às vezes tem ideias totalmente diferentes sobre o que a expressão significa. Então eu acho que uma clarificação se faz necessária.

Eu **não** sou a favor de um processo de revisão de código altamente burocrático e estressante, no qual o seu código é esmiuçado, em público, durante horas. Eu não acredito que envergonhar as pessoas em público é uma forma eficaz de aumentar a qualidade de um projeto. Ao contrário, [o tipo de revisão de código que eu defendo](https://carlosschults.net/pt/revisao-codigo-vs-programacao-em-par/) é um processo simples, geralmente iniciado ao submeter um pull request ou usando sua IDE favorita.

### Como Proceder

Agora que nós estamos sintonizados em relação ao significado de "revisão de código", a próxima pergunta é: "como implementar isso na prática?" Da maneira mais simples possível que funcione. 

Por exemplo, se a sua empresa desenvolve em .NET e usa TFS/TFVC, você pode começar [instalando uma política de check-in](https://marketplace.visualstudio.com/items?itemName=ColinD.ColinsALMCheckinPoliciesVS2017) que exige uma revisão de código para cada check-in. Se a sua equipe usa GitHub, vocês podem usar [pull requests](https://help.github.com/articles/about-pull-requests/). Apenas comece a realizar revisões de código. Então, com o tempo, vá fazendo os ajustes e adaptações necessários.

Estas são algumas das questões que podem surgir ao refinar o seu processo:

-   **Qual é o objetivo da revisão de código?** Estamos procurando por bugs? Tentando melhorar a legibilidade?Checando se o código adere ao padrão de codificação da empresa?
-   **Como separamos "sugestões" de "impedimentos"?** É OK recusar a alteração de alguém por causa de uma indentação ruim ou um nome de variável ligeiramente equivocado?
-   **O que fazer se revisor e revisado não conseguem chegar a um consenso?** Trazer um mediador para dar a palavra final? E quem seria essa pessoa? 

A resposta para todas as perguntas acima podem ser encontradas na **automação**. Uma boa parte do desconforto das revisões de códigos pode ser eliminada quando você emprega um [analisador de código](https://blog.submain.com/different-styles-code-analyzer/) para lidar com as partes automatizáveis do processo.

Por exemplo, [SubMain possui um produto chamado CodeIt.Right](https://submain.com/codeit.right/features) que oferece feedback em tempo real de dentro do Visual Studio, lhe alertando de possíveis problemas de codificação, inclusive corrigindo problemas quando possível.

Ao abraçar a automação, você deixa as pessoas da equipe livres para se preocuparem com questões de mais alto nível durante as revisões, como claridade do código ou decisões arquiteturais.

## Builds Automatizados

Talvez você esteja pensando que eu me equivoquei nessa seção. Afinal de contas, sequer faz sentido falar de builds automatizados sem mencionar testes automatizados?

Eu vou argumentar que sim, faz sentido, por uma razão muito simples: builds automatizados eliminam o famoso problema de "[na minha máquina funciona](https://blog.codinghorror.com/the-works-on-my-machine-certification-program/)". 

Ter um local central onde os builds são feitos joga luz em vários tipos de problemas, de mal gerenciamento de dependências a falta de disciplina em testes.

### Como Proceder

Meu conselho aqui é o mesmo que na seção anterior: faça a coisa mais simples possível que funcione.

Se sua equipe já usa TFS, aprenda como [criar uma definição de build](https://docs.microsoft.com/en-us/vsts/build-release/actions/ci-cd-part-1). Se os seus projetos estão no GitHub, dê uma olhada no [Travis CI.](https://travis-ci.org/)

Com o tempo, você vai melhorando a sua estratégia. Lembra dos analisadores de código que eu mencionei anteriormente? É possível integrá-los no seu processo de build. [Testes unitários](https://carlosschults.net/pt/testes-unitarios-iniciantes-parte1) e outros tipos de testes automatizados também são uma valiosa adição.

E por falar nisso...

## Ausências Notáveis

Você talvez tenha se surpreendido por minha lista de boas práticas não incluir testes unitários, mesmo eu sendo um defensor da importância de testes automatizados para a qualidade de uma aplicação. Qual é a razão disso?

Infelizmente, adicionar testes unitários a uma aplicação legada é muito difícil, ao ponto de existir até [um livro famoso](https://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052/ref=sr_1_1?ie=UTF8&qid=1515443597&sr=8-1&keywords=working+effectively+with+legacy+code) que foca apenas nisso. Não é uma tarefa fácil de se fazer em pouco tempo.

Também é possível que muitos de vocês esperavam que eu falasse sobre código limpo ou os princípios [SOLID](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)). Eu encorajo vocês a lerem e pesquisarem sobre esses tópicos, mas eu não acredito que eles encaixam no propósito do post de hoje. Como o próprio nome deixa claro, eles são *princípios*. Pense neles como diretrizes filosóficas. Úteis? Claro. Mas não tão fáceis de decompor em conselhos pequenos, simples e acionáveis.

## Implemente Essas Práticas Para Ontem!

É possível que vários de vocês tenha achado essas práticas extremamente básicas e não dignas de um post. "Quem é que não usa controle de versão em 2018???"

Bom, não é tão difícil assim encontrar evidência (anedótica, mas ainda assim) que [as coisas ainda não são tão perfeitas](https://softwareengineering.stackexchange.com/questions/65931/are-there-serious-companies-that-dont-use-version-control-and-continuous-integr). 

Acreditar que mesmo práticas tão fundamentais como versionamento de código ou testes automatizados são aplicadas universalmente é mais ingenuidade do que talvez queremos admitir.

Para o restante de vocês, eu espero que essa lista seja útil.

Você já deve ter ouvido o ditado. "Quando estiver em um buraco, para de cavar." E é exatamente esse o tipo de ajuda que eu quis oferecer com esse post: correções rápidas e fáceis, para que você e as demais pessoas em seu tipo possam recuperar o suficiente de sanidade para poderem focar e recuperar o controle de sua aplicação, garantido sua saúde a longo prazo.