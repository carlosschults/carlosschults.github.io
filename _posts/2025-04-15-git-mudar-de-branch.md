---
title: "Git Switch Branch: Tudo o Que Você Precisa Saber"
ref: git-switch-branch
lang: pt
layout: post
author: Carlos Schults
description: "Aprenda como mudar de branch no Git de forma fácil e segura, incluindo como branches funcionam, como criá-las e como fazer checkout de branches remotas."
permalink: /pt/git-switch-branch
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1673926044/git-beautiful-history/git-beautiful-history-cover.png
tags:
- git
- tutorial
---

![]({{ page.img }})

{% capture content %}
Escrevi este post originalmente para a Cloudbees. Você pode ler o [original, em inglês, no site deles](https://www.cloudbees.com/blog/git-switch-branch-everything-to-know).

{% endcapture %}
{% include callout.html type="info" title="NOTA"  content=content %}

Repositórios no [Git](/tag_ptbr/git/) funcionam de uma maneira fundamentalmente diferente da maioria das outras ferramentas. Um dos exemplos mais marcantes dessas diferenças é o branching. Na maioria das outras ferramentas de controle de versão, criar um branch é uma cerimônia elaborada. Eles fazem um grande alarde sobre isso, e os desenvolvedores acabam desistindo, preferindo fluxos de trabalho que não dependem de muitos branches.

No Git, o oposto é frequentemente verdadeiro: criar branches é tão barato que a maioria das pessoas faz isso muito. As pessoas frequentemente ficam confusas ao tentar gerenciar seus branches. Este post tenta esclarecer parte dessa confusão, oferecendo um guia sobre como fazer o git switch branch de maneira fácil e segura. Antes de chegarmos lá, no entanto, começamos com alguns fundamentos, explicando o que realmente são branches no Git, como funcionam e como você as cria.

Antes de concluir, compartilhamos uma dica bônus, abordando como fazer checkout de branches remotas. Vamos começar!

## Como Funcionam os Branches no Git?

Como funcionam os branches no Git? A primeira coisa que você precisa saber é que um repositório no Git é composto por **objetos** e **referências**. Os principais tipos de objetos em um repositório Git são commits. Referências apontam para outras referências ou para objetos. Os principais tipos de referências são—você adivinhou—branches.

Objetos no Git são imutáveis. Você não pode alterar um commit de forma alguma ou mover sua posição no histórico. Existem comandos que parecem mudar as coisas, mas na verdade eles criam novos commits. Referências, por outro lado, mudam bastante. Por exemplo, quando você cria um novo commit, a referência do branch atual é atualizada para apontar para ele.

Quando você cria um novo branch, tudo o que acontece é que uma nova referência é criada apontando para um commit. É por isso que criar branches no Git é tão barato e rápido. Falando nisso...

## Como Crio um Novo Branch?

Nós já temos um post completo explicando como [você pode criar um branch no Git](/pt/git-criar-branch/), cobrindo as quatro principais maneiras de fazer isso.

Aqui, vamos apenas cobrir a maneira mais fácil de criar um branch no Git, que é simplesmente usar o comando branch a partir do branch atual. Vejamos um exemplo:

```bash
mkdir git-switch-demo
cd git-switch-demo
git init
touch file1.txt
git add .
git commit -m "Create first file"
touch file2.txt
git add .
git commit -m "Create second file"
touch file3.txt
git add .
git commit -m "Create third file"
```

No exemplo acima, criamos um novo repositório e adicionamos três commits a ele, criando um novo arquivo por commit. Aqui está uma representação visual do estado atual do nosso repositório:

![](/img/git-switch-branch/img1.webp)

Para criar um novo branch a partir do ponto atual, só precisamos executar:

```bash
git branch example
```

Criamos um branch, mas ainda não mudamos para ele. É assim que nosso repositório se parece agora:

![](/img/git-switch-branch/img2.webp)

E se adicionássemos um novo commit enquanto ainda estamos no branch master? Isso afetaria o branch example? A resposta é não. Execute os seguintes comandos:

```bash
echo "Another file" > file4.txt
git add .
git commit -m "Create fourth file"
```

Na próxima seção, mostraremos como você pode fazer git switch branch e, em seguida, poderá ver por si mesmo como esse novo branch não contém o quarto commit. Por enquanto, dê uma olhada na representação visual do estado atual do nosso repositório:

![](/img/git-switch-branch/img3.webp)

## Como Você Muda de Branch?

Durante a maior parte da história do Git, o comando checkout era usado para isso. Embora você ainda possa usá-lo, a versão 2.23 do Git adicionou o comando switch (bem como o comando restore) em uma tentativa de ter comandos mais específicos para algumas das muitas tarefas para as quais o comando checkout é usado.

### Como Uso o Git Checkout?

A maneira mais antiga e mais conhecida de mudar de branch no Git é usando o comando `checkout`. Seguindo nosso exemplo, se quiséssemos mudar para o branch "example", só teríamos que executar:

```bash
git checkout example
```

Após executar o comando, você deverá ver uma mensagem dizendo que mudou com sucesso para o branch example:

![](/img/git-switch-branch/img4.webp)

Agora você está no novo branch, isso significa que pode adicionar quantos commits quiser, sabendo que o branch master não será afetado. O comando checkout, seguido por um nome de branch, atualiza a árvore de trabalho e o índice, e atualiza a referência HEAD, apontando-a para o branch que você acabou de fazer checkout. E se você tivesse alterações não commitadas no momento da mudança? Essas seriam mantidas para permitir que você as commitasse no novo branch.

O Git permite que você use o comando checkout de diferentes maneiras. Por exemplo, um cenário incrivelmente comum é criar um branch e imediatamente mudar para ele. Na verdade, eu diria que criar um branch e _não_ mudar para ele na hora é a exceção, e não a regra. Então, o Git nos oferece um atalho. Em vez de criar um branch e depois fazer checkout dele, você pode fazer isso em uma única etapa usando o comando checkout com o parâmetro `-b`.

Então, fazer isso:

```bash
git checkout -b new
```

é equivalente a isso:

```bash
git branch new
git checkout new
```

Checkout não funciona apenas com branches, no entanto. Você também pode fazer checkout de commits diretamente. Por que você gostaria de fazer isso?

Bem, dar uma olhada em como o projeto estava há algum tempo atrás é frequentemente útil, particularmente para fins de teste. Mas há mais. Fazer checkout de um commit coloca seu repositório em um estado chamado ["detached HEAD"](/pt/git-detached-head) que permite criar alterações experimentais, adicionando commits que você pode então escolher manter ou descartar.

### O Que é Git Switch?

Durante a maior parte da vida do Git, o comando `checkout` era o único que você usaria para mudar de branch. O problema é que esse comando também faz outras coisas, [o que pode levar à confusão, especialmente entre novos usuários](https://redfin.engineering/two-commits-that-wrecked-the-user-experience-of-git-f0075b77eab1).

A versão 2.23.0 do Git resolve isso adicionando dois novos comandos: `switch` e `restore`. O comando restore não é relevante para nós hoje. O comando switch, por outro lado, é uma nova maneira de mudar para branches.

A [página do manual para o comando](https://git-scm.com/docs/git-switch/pt_BR) lista todas as suas muitas opções. Em sua forma mais básica, você o usa da mesma maneira que o `git checkout`, apenas trocando o nome do comando:

```bash
git switch example
```

Se você quiser voltar ao branch anterior, pode usar um atalho em vez do nome completo:

```bash
git switch -
```

E se você quiser criar um novo branch e imediatamente mudar para ele? Com checkout, poderíamos usar este atalho:

```bash
git checkout -b <nome-do-branch>
```

O novo comando também oferece um atalho, mas neste caso, usamos a letra "c":

```bash
git switch -c <nome-do-branch>
```

Vale a pena usar o novo comando? Bem, eu provavelmente continuarei usando o `git checkout`, desde que eles não o mudem, principalmente por causa da memória muscular. Mas ao ensinar Git para iniciantes? Então eu definitivamente usarei o comando `switch`. Ele tem um nome que está mais relacionado à tarefa que executa e, portanto, é mais memorável.

### Como Faço para Mudar para um Branch Remoto?

Antes de concluir, compartilhamos uma dica final: como mudar para branches remotas?

Para este exemplo, vamos usar um projeto de código aberto chamado [Noda Time,](https://github.com/nodatime/nodatime) que é uma API alternativa de data e hora para .NET. Comece clonando o repositório:

```bash
git clone https://github.com/nodatime/nodatime.git
```

Se tudo funcionou bem, você deve ter uma pasta "nodatime" agora. Entre na pasta e execute o seguinte comando:

```bash
git branch -a
```

O comando `branch` lista os branches em seu repositório. A opção "-a" significa que você quer ver todos os branches, não apenas os locais. O resultado deve ser parecido com isto:

![](/img/git-switch-branch/img5.webp)

Como você pode ver, temos apenas um branch local, que é o branch master. Você pode ver, em vermelho, todos os branches remotos. Então, digamos que você queira fazer checkout do branch chamado "slow-test". Como você faria isso?

Bem, tecnicamente falando, o Git não permite que você trabalhe nos branches de outras pessoas. E é isso que são os branches remotos. O que você realmente faz é criar uma "cópia" local do branch de outra pessoa para trabalhar. Então, vamos ver como fazer isso.

Quando você cria um branch, pode passar um commit ou nome de branch como parâmetro. Então, para criar um branch local a partir do branch remoto "slow-test", eu só teria que fazer:

```bash
git branch slow-test origin/slow-test
```

No exemplo, estou usando "slow-test" como o nome para o meu branch local, mas eu poderia realmente ter usado qualquer outro nome válido.

Alternativamente, eu poderia ter usado o comando `checkout` com a opção -b ou o comando `switch` com a opção -c. Então, as duas linhas a seguir são equivalentes à linha acima:

```bash
git checkout -b slow-test origin/slow-test
git switch -c slow-test origin/slow-test
```

Finalmente, há uma maneira ainda mais fácil. Eu poderia ter simplesmente usado:

```bash
git checkout slow-test
```

e o resultado teria sido o mesmo. Isso funciona porque quando você tenta fazer checkout de um branch e o Git não encontra um branch com esse nome, ele tenta corresponder a um branch remoto de um de seus remotes. Se ele conseguir corresponder com sucesso, as coisas simplesmente funcionam.

## Branches do Git: Use com Moderação

Neste post, mostramos como mudar de branch no Git. Mas fomos além disso: explicamos o que são branches e como funcionam. Esperamos que, a esta altura, você esteja mais confortável criando e usando branches no Git.

Antes de irmos, uma ressalva final: só porque você pode fazer algo, não significa que deva. Às vezes, as pessoas ficam tão entusiasmadas com a facilidade de criar branches no Git que acabam usando [fluxos de trabalho que dependem de vários branches de longa duração](https://rollout.io/blog/pitfalls-feature-branching/), o que torna seu processo de desenvolvimento muito complexo e propenso a erros, além de atrasar a integração.

Obrigado por ler e até a próxima!