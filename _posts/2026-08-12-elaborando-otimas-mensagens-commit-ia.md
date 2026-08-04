---
title: "Elaborando Ótimas Mensagens de Commit na Era da IA"
ref: great-commit-messages-ai-era
lang: pt
layout: post
author: Carlos Schults
description: "Usar LLMs não garante automaticamente boas mensagens de commit. Aprenda como conseguir isso neste guia."
permalink: /pt/great-commit-messages-ai-era
tags:
- tutorial
- git
- ai
- llm
- claude
- version-control-system
- best-practices
---

Um tempo atrás, expliquei que [as suas mensagens de commit são uma porcaria e o que fazer a respeito](/pt/your-commit-messages-suck). Naquele post, falei rapidinho sobre IA, afirmando que não acho que o uso de LLMs (_Large Language Models_, ou Grandes Modelos de Linguagem) mude fundamentalmente nenhum dos pontos que levantei no post.

Mas o tema das mensagens de commit geradas por LLM é relevante o suficiente para merecer um post próprio, especialmente agora que cada vez mais pessoas estão usando agentes para gerar código.

É sobre isso que este post trata. Vou basicamente compartilhar minhas experiências sobre o que funciona e o que não funciona na hora de criar boas mensagens de commit.

## Por Que LLMs Não São Automaticamente Boas em Criar Boas Mensagens de Commit
Quando se trata de escrever mensagens de commit, há uma área em que as IAs são muito boas: olhar para um diff e gerar um resumo.

Em outras palavras, elas se destacam em descrever o que você fez em detalhes... o que, se você leu meu outro post, sabe que é exatamente o que não é pra você fazer!

O que os LLMs não fazem bem é entender o contexto. Eles conseguem olhar para um diff e dizer algo como "Ok, o usuário desabilitou a cláusula OUTPUT do SQL Server na configuração do EF Core" e então escrever uma mensagem de commit detalhada descrevendo essas mudanças. O que é inútil, porque o diff do commit já mostra as mudanças.

O que o LLM _não consegue_ fazer é descobrir que eu fiz a mudança porque tínhamos introduzido triggers em algumas tabelas e o EF Core começou a falhar porque a cláusula OUTPUT conflita com triggers, então tivemos que desabilitá-la.

Existe toda uma história por trás de uma mudança, e a AI não vai conseguir adivinhar essa história se ninguém contar pra ela.

## A IA Não Lê Sua Mente
Vejo que muitas pessoas ficam frustradas com código gerado por IA, e é um padrão comum. As pessoas fazem um pedido vago pra caramba, depois recebem algo em troca, e então ficam frustradas porque não era o que tinham em mente. Bom, se você tem algo específico em mente que a IA deveria levar em conta, garanta que isso saia da sua cabeça e chegue até a IA!

Repitam comigo: **a IA não lê mentes.**

Além disso, a IA é incrivelmente confiante. Ela sempre vai te dar *alguma coisa* de volta. O que pode ser o que você quer, mais ou menos, mas também pode não ser, já que ela será tendenciosa em relação às abordagens que o LLM mais viu em seus dados de treinamento.

Por exemplo, se você pedir uma mensagem de commit para um diff, sem instruções adicionais, é bem provável que ela cuspa algo usando [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), simplesmente porque muita gente usa esse padrão. Pessoalmente, não gosto desse padrão e não quero usá-lo, mas é claro que o Claude não sabe disso sobre mim a menos que eu diga.

## O Que Fazer Então?
No outro post, compartilhei o prompt que eu estava usando com o Claude na época:

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

Eu não estava totalmente satisfeito com os resultados que estava obtendo com esse prompt, então continuei iterando sobre ele. Uma coisa que adicionei em algum momento foi que o Claude deveria me perguntar sobre o contexto quando não tivesse certeza. Isso funcionou, mas de forma um tanto inconsistente.

Então, não me lembro exatamente quando, outra coisa aconteceu. Mas antes de entrar nisso, preciso fazer uma pequena digressão e explicar por que não uso Conventional Commits.

## Conventional Commits Não É um Bom Padrão
Não gosto nem uso Conventional Commits. No passado, eu usava, mas comecei a mudar de ideia depois de um tempo.

Por um bom tempo, não conseguia articular direito por que não gostava desse padrão, até ler [este post](https://sumnerevans.com/posts/software-engineering/stop-using-conventional-commits/) de Sumner Evans.

A essência do motivo pelo qual Evans não gosta do Conventional Commits é que ele foca nas coisas erradas, tornando o tipo do commit ("feat", "fix", etc.) a informação mais importante, em vez do escopo. Ou seja, quais áreas ou partes do sistema o commit modifica.

O Conventional Commits costuma ser combinado com ferramentas que geram changelogs automaticamente e incrementam números de versão com base nas mensagens. Evans argumenta, e eu concordo, que isso é uma ideia fundamentalmente ruim.

Há mais motivos pelos quais esse padrão tão difundido não é tão bom quanto parece, mas vá ler o post do Evans para saber mais.

A pergunta então se torna: o que usar no lugar?

## Chegam os Scoped Commits
Em seu post, depois de construir um argumento convincente contra o Conventional Commits, Evans oferece [uma alternativa diferente](https://sumnerevans.com/posts/software-engineering/stop-using-conventional-commits/#a-better-way). Baseado nos padrões usados por projetos open-source de sucesso, como Git, o kernel do Linux, Go, entre outros, ele propõe um novo padrão que chamou de [Scoped Commits](https://scopedcommits.com/).

O básico desse padrão é incrivelmente simples. Você para de usar o tipo da mudança como prefixo da sua mensagem e passa a usar um escopo, que se relaciona à área, subsistema ou parte da sua aplicação que o commit afeta.

Este é um exemplo:

```
auth: Add SSO login controller

The login page previously relied on a legacy form-based flow that
was being decommissioned. Introduced a new controller and service
layer to handle SSO natively, preserving existing session logic
while decoupling it from the legacy system.

Closes: AB998
```

## Chega a Skill do Claude
Foi mais ou menos nessa época que comecei a experimentar com skills do Claude, porque estava cansado de repetir as mesmas instruções sempre. Decidi tentar encapsular todas essas preferências em uma skill que eu pudesse usar. Depois de bastante tentativa e erro e reescritas, cheguei a algo que acho útil.

As partes mais importantes da skill, para mim, são as seguintes:

```markdown
- Read the full diff carefully before writing anything
- If the scope isn't clear from the diff, ask one focused question
- **If the diff shows *what* changed but not *why*** — the underlying
  problem, bug, or motivation isn't inferable from the code itself — ask
  one focused question about the reason for the change before writing the
  body. A body written without knowing the "why" tends to just restate the
  diff in prose, which isn't useful. It's fine to write the summary line
  in the meantime, but hold off on the body until you know the reason, or
  proceed with summary-only (ticket in parentheses) if the user doesn't
  have more context to give.
```

Elas me ajudam a garantir que o Claude receba o contexto certo para a mudança. Caso contrário, ele vai apenas fornecer uma lista detalhada de mudanças, que não é o que estou buscando.

Se tiver interesse, veja a skill completa [aqui](https://github.com/carlosschults/claude-config/blob/main/skills/commit-message/SKILL.md).

## Meu Veredito?
Estou razoavelmente satisfeito com os resultados que consigo com a skill até agora. Não é perfeita, porém.

Um problema que tenho com frequência é que o Claude às vezes "esquece" de usar a skill. Ele simplesmente segue em frente e escreve qualquer coisa como mensagem de commit, e aí eu tenho que dar uma bronca nele. Na maioria das vezes, ele usa a skill, então isso não chega a ser um grande problema.

Outro problema é que às vezes ele não respeita a regra do 50/72 para o comprimento máximo das linhas. As linhas no corpo da mensagem costumam chegar a 75 ou 76 caracteres. Às vezes, são necessárias duas ou três tentativas até ele acertar. Chega um ponto que eu desisto é conserto manualmente.

Por falar nisso, costumo alterar e editar a mensagem de commit gerada eu mesmo. Às vezes, falta uma parte crítica de contexto, ou o Claude entendeu algo errado, e é simplesmente mais fácil e rápido consertar por conta própria do que ficar insistindo com o [clanker](https://en.wikipedia.org/wiki/Clanker) até ele fazer certo.

Então, qual é o veredito? No geral, estou satisfeito, mas certamente há espaço para melhorias.

## O Que Você Deveria Fazer?
Você pode fazer o que quiser, claro, mas se está buscando conselhos sobre como obter as melhores mensagens de commit possíveis do seu LLM de preferência, aqui vai: **garanta que você dê contexto a ele.**

Você não precisa usar scoped commits, embora eu recomende experimentar. Você não precisa usar minha skill `commit-message`, nem nenhuma skill, se não quiser.

Apenas garanta que, seja qual for o fluxo de trabalho que você use para gerar mensagens de commit, exista uma etapa em que você forneça o contexto, o "porquê" por trás da sua mudança. Essa é a informação mais importante que uma mensagem de commit deve conter, e seu pequeno robô assistente não vai conseguir isso sozinho. Ele precisa da sua ajuda.