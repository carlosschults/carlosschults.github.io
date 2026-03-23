---
title: "Suas Mensagens de Commit São Um Lixo. Vou Te Ajudar a Melhorar"
ref: your-commit-messages-suck
lang: pt
layout: post
author: Carlos Schults
description: "Seu eu do futuro odeia suas mensagens de commit. Vamos mudar isso!"
permalink: /pt/suas-mensagens-de-commit-sao-um-lixo
tags:
- tutorial
- git
- rant
---

Suas mensagens de commit são um lixo. Na melhor das hipóteses, elas são inúteis. Mas geralmente, elas são piores do que nada.
Eu não digo isso pra ser babaca. Na verdade, é o contrário. Eu quero te ajudar.

Se você sabe que você é exceção pra isso, você pode parar de ler. É sério, fecha a aba e vai pro YouTube. Pronto, te dei alguns minutos de volta, de nada.

Se você ainda tá aqui, então você sabe que tem um problema. Como eu dizia, suas mensagens de commit não servem pra nada.
Não fique ofendido. Isso não é culpa só sua. É bem provável que ninguém nunca te ensinou como escrever boas mensagens de commit, ou nem o porquê disso ser importante. E escrever é realmente muito difícil.

A boa notícia é que agora você finalmente tem alguém pra te ajudar. Nesse post, eu vou explicar tudo que você precisa saber sobre mensagens de commit horríveis, e o que fazer pra escrever as que não são horríveis.

## Suas Mensagens de Commit São um Lixo Porque...

Por que a maioria das mensagens de commit é tão ruim? Na minha experiência, os motivos se resumem ao que vou falar agora. Vale lembrar que não tem nada de científico ou baseado em dados aqui. É tudo baseado na minha experiência pessoal.

### ...Você Só Liga pra Código

Se você é como a maioria dos devs, você só — ou quase só — liga pra codar. É onde a diversão mora, e tudo o mais você vê como perda de tempo.
Eu sei também que você provavelmente está sob muita pressão pra performar, pra entregar o máximo de valor o mais rápido possível. Então o que você mais quer é terminar o que está fazendo, mergar o PR e então pegar outro ticket do Jira/Azure/Linear pra começar a implementar.

O que acaba acontecendo é que tudo que não é código é tratado como detalhe secundário e não recebe a devida atenção. Isso inclui testes, documentação, preparar uma revisão da feature implementada pra retrospectiva semanal e, claro, escrever mensagens de commit e descrições de PR.

### ...Às Vezes Você Não Entende o Que Está Fazendo

Boas mensagens de commit — e boa documentação em geral — devem focar no *porquê* das coisas. Qual é a motivação por trás das suas mudanças? Qual é o problema que você está tentando resolver, por que vale a pena resolvê-lo, de que forma isso ajuda seu time e sua empresa?

Pode parecer loucura que um programador comece a trabalhar numa tarefa que não entende completamente. Mas eu já fiz isso, e aposto que você também. E claro, como você vai explicar o porquê de uma mudança se nem você mesmo entende direito?

### ...Escrever é Difícil

Como Phil Karlton disse uma vez, [só existem duas coisas difíceis em ciência da computação](https://martinfowler.com/bliki/TwoHardThings.html), e dar nome às coisas é uma delas.

Se você parar pra pensar, "dar nome às coisas" é uma forma de escrever. Um subconjunto da escrita, digamos assim. Então sim, escrever mensagens de commit é difícil porque escrever, em geral, é difícil.

### ...Ninguém Te Ensinou

Acho que a formação de desenvolvedores frequentemente falha em ensinar muita coisa importante que você realmente vai precisar como engenheiro de software. Tratamento de erros de verdade é um exemplo.

Tudo bem, eles vão te ensinar a mecânica de como um try-catch-finally funciona, mas raramente vão te ensinar quando capturar uma exceção, quando não capturar, quando lançar uma exceção, quando logar ou não, e assim por diante.

E escrever mensagens de commit é uma dessas coisas.

### ...O GitHub Te Ensinou Maus Hábitos

Vamos deixar uma coisa clara: eu uso o GitHub todo dia e gosto muito. O GitHub é o [aplicativo matador/killer app](https://pt.wikipedia.org/wiki/Aplicativo_matador) do Git, e o Git não teria tido o mesmo nível de adoção sem ele.

Dito isso, acredito que a popularidade do GitHub e dos pull requests fez as pessoas se importarem mais com os PRs do que com os commits individuais. E faz sentido: pull requests suportam discussões que ficam como artefatos históricos do projeto, suportam anexos, texto rico e tudo mais.

Então faz sentido que algumas pessoas não se esforcem muito pra escrever boas mensagens de commit, argumentando que podem escrever descrições ricas no PR.

Claro que o que acaba acontecendo frequentemente é que elas não escrevem as descrições de PR também!

### ...A Flag `-m` do Git Te Viciou

Acho que a maioria dos programadores nem sabe que mensagens de commit podem ter um corpo com várias linhas. E a culpada aqui é a forma como a maioria das pessoas ensina o comando `commit`:

```bash
git commit -m "Alguma mensagem"
```

Sem nem mencionar que a flag `-m` é só uma conveniência pra quando você tem uma mensagem de uma linha, o que deveria ser a exceção, não a regra.

### ...Você Não Tem Higiene de Commits

Escrever mensagens de commit que não são lixo faz parte de algo mais amplo que algumas pessoas chamam de "higiene de controle de versão."

É exatamente o que parece: não seja porco na hora de escrever código.

Às vezes você tem dificuldade pra escrever uma mensagem de commit porque trabalha de forma bagunçada. Se suas mudanças são uma salada de correções de bug, refatorações, código morto e ideias de implementação pela metade, claro que você vai ter problema pra escrever uma mensagem descritiva e útil.

Isso costuma ser causado por falta de domínio do Git. Se você não domina ferramentas como stash, reset, rebase interativo e outras, é mais provável que você transforme seu trabalho num caos.

## Taxonomia das Mensagens de Commit Ruins

Descobri que mensagens de commit ruins se encaixam em algumas categorias. Vou cobrir algumas delas agora.

### A Mensagem de Uma Linha Quase Inútil

Essa é a mensagem de uma linha que dá uma explicação superficial do que foi mudado. Eu chamo de "quase" inútil porque pelo menos o resumo é preciso.

Mas aí ela falha em dar qualquer contexto adicional. Fico com perguntas como:
- Qual foi o problema que originou essa mudança?
- Por que o autor considerou essa a melhor forma de resolver o problema?
- Existe algum issue ou ticket associado a esse trabalho?

Alguns exemplos, com meus comentários:

```
Added new index to table # que índice? que tabela? com qual propósito?
Enable EF Core execution strategy # o que é essa tal "strategy"? por que você teve que habilitar?
Added Required attribute to model # qual model? isso não é uma breaking change que vai afetar os usuários atuais?
```

### A Mensagem de Uma Linha Inútil

A mensagem de uma linha inútil é... bem, como a quase inútil, mas completamente inútil.

Os exemplos não precisam de mais comentários:

```
changes
ui
not working
more changes
```

Quer dizer, no momento em que você escreve "changes" como mensagem de commit, você poderia simplesmente escrever "batata". Ou contar uma piada. Seria igualmente inútil, mas pelo menos poderia ter graça.

### Só a Referência do Sistema de Tickets

É quando as pessoas colocam apenas o id de um issue/ticket/card do sistema de gerenciamento, e nada mais. Alguns exemplos:

```bash
JIRA-42
AZ-2234
#125
```

Acho que essa categoria consegue ser ao mesmo tempo mais útil e mais irritante do que as anteriores. Sim, é mais útil, já que posso sempre ir ao sistema de tickets, procurar o issue, e aprender mais sobre o trabalho. Claro, nada garante que o commit vai conter apenas mudanças relacionadas ao issue em questão, mas isso é conversa pra outro momento.

É mais irritante também porque obriga o leitor a parar e ir a outro lugar pra entender o contexto daquela mudança. Não sei você, mas eu prefiro aprender o motivo por trás de um commit pelo próprio commit, como ~~Deus~~Linus quis.

Além do incômodo, existe um risco maior aqui: a possibilidade de que, um dia, sua empresa migre do sistema de tickets atual e você fique sem aquelas descrições. Todas as empresas em que trabalhei como desenvolvedor fizeram pelo menos uma migração dessas, e tenho certeza que você já passou por pelo menos uma também.

### A Mensagem de Uma Linha Enganosa

Às vezes você tem uma mensagem que parece inofensiva, como `Add PrintHtmlOutput() method`. Aí você vai ver as mudanças e elas também incluem uma breaking change em um endpoint ou alteram a forma como a aplicação interage com o banco de dados.

## Você Vai Escrever Boas Mensagens de Commit Quando...

Agora você entende por que escreve mensagens ruins, e *como* elas são ruins. Pronto pra aprender a melhorar?

### ...Escrever Suas Mensagens Em Inglês
Um dos posts mais visitados desse blog discute se [devemos escrever código em português ou inglês](/pt/programar-portugues-ou-ingles/). Eu considero que fiz bons argumentos, mostrando os prós e constras de ambos os lados e deixando meu posicionamento bem claro.

Ainda assim, alguns leitores me acusaram de ficar em cima do muro.

Dessa vez, então, vou falar sem sombra de dúvida: **ESCREVA SUAS MENSAGENS DE COMMIT EM INGLÊS.** É simplesmente o padrão do mercado, e o quanto antes você se acostumar com isso, melhor.

E é por isso, inclusive, que os exemplos de mensagem de commit deste post estão todos em inglês. Eu escrevi o post originalmente em inglês e agora estou traduzindo para português, mas deixei as mensagens em inglês de propósito mesmo, por causa desse ponto.


### ...Parar de Escrever Mensagens de Uma Linha

Mensagens de uma linha são ótimas quando o escopo da mudança é pequeno. Se o seu commit só corrige um typo, então `Fix typo` é uma mensagem de commit válida. Mas na maioria das vezes os commits contêm muito mais mudanças, e nesses casos escrever uma mensagem de uma linha é uma oportunidade perdida de criar uma documentação duradoura.

Então, por favor, pare de usar a flag `-m` na hora de commitar. Escreva um corpo adequado com mais detalhes na maioria das suas mensagens.

### ...Começar pelo "O Quê", Expandir com o "Por Quê" e o "Como"

Agora você sabe que deve escrever um resumo e um corpo na maioria das suas mensagens de commit. O que colocar em cada um?

Simples: comece com o resumo, descrevendo *o que* você fez. Seja descritivo, mas conciso.

No corpo, descreva qual é o problema que você está tentando resolver, ou o motivo que motivou a mudança. Em seguida, explique como você resolveu, mas de forma macro. Não entre em muito detalhe, porque lembre-se que seu leitor sempre pode ver o diff.

Se necessário, adicione mais informações, como:
- trade-offs envolvidos na sua decisão
- alternativas que você considerou mas decidiu não usar
- links de referência para termos que possam ser desconhecidos (por exemplo, um link para um artigo da Wikipedia, ou para o [Catálogo de Refatorações](https://refactoring.com/catalog/) do Martin Fowler)
- links de referência para a solução que você aplicou (por exemplo, um link para uma resposta no Stack Overflow)

### ...Seguir a Regra do 50/72

A regra do 50/72 é o mais próximo que temos de um padrão quando se trata de mensagens de commit. Foi [proposta pela primeira vez por Tim Pope](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) e funciona assim:

- Comece com um resumo, com a primeira letra maiúscula, com no máximo 50 caracteres
- Adicione uma linha em branco
- Em seguida, adicione um corpo, quebrando as linhas em no máximo 72 caracteres

Esses limites podem parecer arbitrários, mas existem razões históricas pra eles terem sido escolhidos. Pra resumir, eles funcionam bem com muitas ferramentas diferentes que trabalham com mensagens de commit.

Outro ponto importante: você deve escrever o resumo no modo imperativo. Ou seja, "Implement password hashing" em vez de "Implemented password hashing", por exemplo. A princípio isso pode parecer estranho, mas é o padrão que o próprio Git usa. Se não acreditar, use `git revert` pra reverter um commit e vai ver que a mensagem gerada está no modo imperativo:

```bash
Revert "Add line of text"

This reverts commit 5ab08c5d3ee7bfdb334406d418d96f76d08962fe.
```

Viu? "Revert" em vez de "Reverted."

Adicionalmente, e de forma opcional, você pode adicionar um trailer ao commit. Trailers são metadados que você pode adicionar no final da mensagem de commit, seguindo a sintaxe `Nome: valor`. Eles servem pra adicionar metadados úteis, como quem aprovou uma mudança, quem co-autorou algo com você, e também pra associar seu commit a um issue ou ticket.

Por exemplo, se você usa GitHub Issues, você pode adicionar um trailer assim:

`Closes: #456`

E ele vai automaticamente associar o commit ao issue e fechá-lo. Existem outras palavras-chave que você pode usar, como `Fixes`, `Resolves`, `Resolved`, e assim por diante. Você pode aprender mais sobre como fechar issues do GitHub automaticamente [aqui](https://docs.github.com/pt/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue).

### ...Adotar Commits Atômicos

A ideia dos commits atômicos é simples: um commit deve conter apenas mudanças logicamente relacionadas. É o oposto da falta de higiene de controle de versão que mencionei antes.

Digamos que você está trabalhando numa feature. Aí seu chefe te pede pra parar e corrigir um bug. Você vai lá e corrige o bug, e agora tem aquelas mudanças misturadas com as do início da sua implementação de feature.

Não commita tudo junto! Commita apenas as mudanças do bug fix como uma unidade coesa, com uma mensagem descritiva e de qualidade. Aí você volta pra sua feature e commita aquilo.

Fazer isso exige que você domine as ferramentas do Git. Você precisa saber como fazer stage das mudanças e commitar apenas aquelas em vez de tudo. Precisa saber usar o stash. Com frequência, vai precisar saber como commitar coisas e depois editar esse histórico.

Essas habilidades valem a pena ter. Vai atrás delas!

### ...Commitar Sempre, Polir Depois

Você não precisa esperar estar "pronto" pra commitar. Pelo contrário, você deve commitar o tempo todo. Trabalhe em incrementos pequenos e commite ao longo do caminho.

Assim, se cometer erros e precisar descartar algum trabalho, você vai reverter apenas alguns minutos de trabalho em vez de horas. Você também tem esses checkpoints pra voltar caso a luz caia ou algo do tipo.

Por exemplo, quem pratica TDD (desenvolvimento orientado a testes) frequentemente commita toda vez que chega na fase verde. Ou seja, toda vez que os testes passam.

Também é uma boa ideia manter todos os seus commits limpos. Com isso quero dizer que todos os seus commits, quando aplicados, devem deixar o projeto em um estado onde ele builda com sucesso e todos os testes passam. Isso facilita para você ou outra pessoa usar o [git bisect no futuro pra encontrar onde um bug foi introduzido](/pt/git-bisect-intro/).

Mas se você seguir essa dica, pode acabar com muitos commits pequeninhos que não têm boas mensagens, ou que não representam um conjunto coeso de mudanças. Como resolver isso?

A resposta é: [você edita seu histórico pra deixá-lo bonito](/pt/git-historico-bonito/). Editar o histórico é mal visto — e com razão — quando é uma branch da qual outras pessoas já dependem. Mas se você está trabalhando na sua própria branch isolada e ninguém depende das suas mudanças, você pode fazer o que quiser até aquele ponto. Então commite cedo e com frequência, e depois use amend e rebase até ter um histórico que faça sentido e tenha ótimas mensagens de commit.

## Exemplos de Boas Mensagens de Commit

Finalmente chegou a hora de mostrar alguns exemplos de mensagens de commit valiosas que incorporam tudo que cobrimos até aqui.

Por exemplo, em vez de:

```bash
Added Required attribute to model
```

Escreva:

```bash
Make PhoneNumber required on /reservations endpoint

The /reservations endpoint originally didn't require a phone number.
The reservations were being accepted but, as data flowed to downstream
systems, the lack of phone number was causing some processes to crash.

We are now adding the [Required] attribute to the PhoneNumber property
on the ReservationRequestModel. This is a breaking change, so that's
why, as part of this changes, we are versioning the endpoint as 2.0

Fixes: AB#456
```

Veja como fica:
- A mensagem começa com um resumo que descreve o que foi feito
- O corpo começa com uma descrição do problema, depois explica como a mudança atual o resolve
- Por fim, temos um trailer para associar e fechar um ticket no board

Para o segundo exemplo, vamos fazer algo um pouco mais elaborado. Em vez de `Enable EF Core execution strategy`, você pode usar:

```bash
Enable EF Core execution strategy for Azure SQL

After migrating to Azure SQL, save operations started failing
intermittently in production with transient connection errors.
Azure SQL occasionally drops connections during scaling events
and failovers, and Entity Framework does not retry failed
operations by default.

Enabled the built-in SQL Server execution strategy in EF Core,
which automatically retries failed operations using exponential
backoff when a transient error is detected.

An execution strategy is a configurable EF Core component that
intercepts database operations and decides whether to retry
them on failure. The SQL Server provider ships with a strategy
that knows which error codes Azure SQL considers transient.

[1]: https://learn.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency

Closes: #89
```

Todas as mensagens precisam ter esse nível de profundidade? Claro que não. Por exemplo, `Fix typo` é uma ótima mensagem de commit, se tudo que você está fazendo naquele commit é corrigir um typo. O mesmo vale para `Remove commented-out code`, `Remove blank lines`, e assim por diante.
O tamanho da sua mensagem de commit precisa ser diretamente proporcional ao tamanho e escopo da sua mudança.

## A IA Muda Tudo. Ou...Será Que Não?

Eu sei o que você ficou se perguntando durante todo esse tempo. "Mas...mas...mas...e o ChatGPT?"

Minha opinião sincera é que a IA muda pouco, ou nada, do que discutimos até aqui.

Pra começar, com IA ou sem IA, os fundamentos continuam os mesmos:
- Boas mensagens de commit ainda devem focar mais no porquê do que no quê e no como.
- A regra do 50/72 ainda é uma boa diretriz a seguir.
- Usar o modo imperativo nos resumos continua sendo o padrão para muitas ferramentas, incluindo o próprio Git e o GitHub.
- Boas mensagens de commit ainda têm imenso valor para leitores futuros, que podem incluir a própria IA.

*Mas a IA é ótima pra escrever mensagens de commit. Por que eu deveria me preocupar?*

Quando se trata de mensagens de commit, a IA é de fato ótima em uma coisa. E essa coisa é resumir um conjunto de mudanças e escrever, de forma muito bem escrita, gramaticalmente correta, com tom profissional... uma listagem detalhada de todas as mudanças.

Que é exatamente o que você não deveria estar fazendo! Onde a IA falha é exatamente na parte mais importante, que a esta altura você já deve estar cansado de ler: o porquê.

Não estou dizendo que você não deve usar IA pra te ajudar a criar mensagens de commit. Claro que pode. Eu uso bastante. Este é um exemplo de prompt que uso frequentemente com o Claude, com algumas variações:

```
Write a concise, well-crafted commit message for the diff I'm going to give you.
Make it more high-level, focusing on the why rather than listing all changes in great detail.
Follow these rules:
- Summary
	- Brief description of what was done
	- 50 chars at the most
	- Use imperative mood
	- Do not use conventional commits
- Body
	- Brief description of the "how", but focus more on the reason for the changes
	- Use prose rather than bullet points.
	- Use past tense
	- Lines no longer than 72 chars
```

Depois eu rodo `git diff | clip` e colo o resultado junto com esse prompt.

O que eu recebo de volta é sempre uma mensagem muito bem escrita, muito mais detalhada sobre descrever as mudanças do que eu gostaria, e que perde completamente o ponto do porquê estamos fazendo as mudanças. O que não surpreende nada, porque como diabos ela saberia se eu não contei?

O que faço então é explicar os motivos da mudança. E pedir pra tentar de novo, mais alto nível e incluindo a explicação. Às vezes a segunda versão já está boa o suficiente, mas geralmente preciso de pelo menos três até ficar satisfeito.

Entendeu o padrão? Isso é uma colaboração entre a IA e eu. Estamos trabalhando juntos pra criar uma mensagem. Não estou terceirizando 100% pra IA.

Quando uso o Claude Code, essas regras do prompt acima ficam no arquivo `Claude.md` do projeto. Nesse cenário, ele tende a ir muito melhor em entender o "porquê", porque tudo começou com um prompt em que eu expliquei o motivo por trás da mudança, e então fizemos uma sessão de planejamento antes de começar a implementar.

Mas mesmo assim, a IA frequentemente ainda precisa de muita orientação até conseguir escrever uma mensagem de commit que realmente foque nos motivos por trás da mudança e que dê informações no nível certo de abstração. Por conta própria, a IA produz mensagens bem escritas que são essencialmente um diff em prosa.

## Conclusão

A essa altura, você provavelmente percebeu que este é um post bem opinionado. Algumas das coisas cobertas aqui estão muito perto de ser um padrão, como a regra do 50/72 e a ideia de escrever resumos no modo imperativo.

Porém, algumas coisas que discuti são preferências pessoais. Por exemplo, eu normalmente não uso [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Os motivos pra isso estão além do escopo deste post, mas existem. São motivos bastante pessoais, então não vou te julgar se você gosta de usar Conventional Commits.

A principal lição que quero que você leve deste post é: coloque trabalho nas suas mensagens de commit. Não escreva qualquer coisa; elabore suas mensagens. Trabalhe nelas, aperfeiçoe-as, até não conseguir mais melhorar.

Sim, é difícil. Pode ser frustrante. Pode parecer uma perda de tempo ficar 10, 15 ou até 20 minutos elaborando uma mensagem que o seu LLM favorito teria gerado em segundos.

Mas eu garanto: anos depois, quando você estiver investigando um incidente crítico em produção e se deparar com ótimas mensagens de commit que oferecem insights valiosos sobre o porquê de algumas mudanças terem sido feitas... você vai ficar feliz por ter feito isso.

Obrigado por ler.