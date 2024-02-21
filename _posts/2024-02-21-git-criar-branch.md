---
title: "Git Criar Branch: 4 Maneiras Diferentes"
ref: git-create-branch
lang: pt
layout: post
author: Carlos Schults
description: Neste post, você vai aprender as diferentes maneiras de se criar um branch no Git
permalink: /pt/git-criar-branch
canonical: https://www.cloudbees.com/blog/git-create-branch
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1673926044/git-beautiful-history/git-beautiful-history-cover.png
tags:
- git
- tutorial
---

![]({{ page.img }})

*NOTA: Eu escrevi este post originalmente para o blog da Cloudbees.  Você pode [conferir o artigo original, em inglês, no site deles]({{ page.canonical }}). Eu optei por deixar os exemplos de código em inglês.*

Se você trabalha escrevendo software, posso dizer com segurança que você conhece o Git. A ferramenta criada por Linus Torvalds tornou-se sinônimo de controle de versão. E, sem dúvida, um dos melhores recursos do Git é a forma como ele elimina a dificuldade de ramificar (branch) e mesclar (merge). Há várias maneiras de criar uma branch (branch) no Git. Neste artigo, vamos analisar algumas delas. Então, a gente finaliza com uma reflexão sobre o modelo de branching do Git, e a ideia de branching em geral.

## Criando Um Branch A Partir de Main

Você cria branches no Git, como era de se esperar, usando o comando `branch`. Como muitos outros comandos do Git, o `branch` é muito poderoso e flexível. Além de criar branches, ele também pode ser usado para listá-las e excluí-las, e você pode personalizar ainda mais o comando empregando uma ampla lista de parâmetros. Começaremos com a primeira maneira de criar uma branch. Digamos que você queira criar uma nova pasta chamada "my-app", entrar nela e iniciar um novo repositório Git. É exatamente assim que você faria isso:

```
mkdir my-app
cd my-app
git init
```

Agora você tem um repositório Git novo e vazio. Mas repositórios vazios são chatos. Então, que tal criar um novo arquivo markdown com "Hello World!" escrito nele?

```
echo Hello World! > file.md
```

Se você executar `git status`, verá uma mensagem dizendo que o arquivo não foi rastreado:

```
$ git status
On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)

    file.md

nothing added to commit but untracked files present (use "git add" to track)
```
[Arquivos não rastreados não têm graça nenhuma.](https://www.cloudbees.com/blog/git-remove-untracked-files) Então, bora rastreá-los:

```
git add file.md
```

E, finalmente, vamos criar nosso primeiro commit:

```
git commit -m "First commit"
```

Agora temos um repositório com uma branch, que tem exatamente um commit. Isso pode não parecer a coisa mais empolgante do mundo (porque realmente não é), mas certamente é menos entediante do que ter um repositório sem nenhum commit, certo? Agora, digamos que, por qualquer motivo, você precise alterar o conteúdo do arquivo.

Mas você não está muito a fim de fazer isso. E se algo der errado e você, de alguma forma, estragar o belo e puro conteúdo do seu arquivo? (Sim, eu sei que é apenas um arquivo com "Hello World!", mas use os maravilhosos poderes de sua imaginação e pense no arquivo como um proxy para um projeto muito mais complexo). A solução para esse dilema é, obviamente, criar uma nova branch:

```
git branch exp
```

Portanto, agora temos uma nova branch chamada "exp", para experimentação. Algumas pessoas que estão acostumadas a usar sistemas de controle de versão diferentes, especialmente os centralizados, poderiam dizer que as branches têm o mesmo "conteúdo". No entanto, isso não é totalmente exato quando se trata do Git. Pense nas branches como referências que apontam para um determinado commit.

## Criando uma branch a partir de um commit

Suponha que, por qualquer motivo, desistimos do nosso experimento sem adicionar um único commit à nova branch. Vamos voltar para `main` e excluir a branch `exp`:

```
git checkout main
git branch -d exp
```


Agora que voltamos a ter uma única branch, vamos adicionar alguns commits a ela, para simular o trabalho que está sendo feito:

```
echo a new line >> file.md
git commit -a -m "Add a new line"
echo yet another line >> file.md
git commit -a -m "Add yet another line"
echo one more line >> file.md
git commit -a -m "Add one more line"
echo this is the last line i promise >> file.md
git commit -a -m "Add one last line"
```

Imagine que, depois de fazer todo esse "trabalho", você descobre que, por qualquer motivo, precisa voltar no tempo para quando havia apenas duas linhas no arquivo e criar novas alterações a partir de então. Mas, ao mesmo tempo, você precisa preservar o progresso que já fez. Em outras palavras, você deseja criar uma branch a partir de um commit anterior. Como você faria isso? No Git, cada commit tem um identificador exclusivo. Portanto, você pode ver isso facilmente usando o comando `git log`. Para criar uma nova branch com base em um commit específico, basta passar seu hash como parâmetro para o comando `branch`:

```
git branch new-branch 7e4decb
```

Além disso, na maioria das vezes, você nem precisa do hash inteiro. Apenas os primeiros cinco ou seis caracteres são suficientes.

## Criar Uma Branch a Partir de Uma Tag

Se você tem um pouco mais de experiência com o Git, deve estar familiarizado com o conceito de [tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging). Você usa tags para indicar que um determinado commit é importante ou especial de alguma forma. Por exemplo, as tags são geralmente usadas para indicar as versões de um produto. Se você está trabalhando em seu aplicativo há algum tempo e acredita que é hora de lançar a versão 1.0, o que você normalmente faz é aumentar os números de versão sempre que necessário, commitando essas alterações e, em seguida, adicionando uma tag a esse ponto específico no tempo. Para criar uma tag, você normalmente executa algo como o seguinte:

```
git tag -a v1.0 -m "First major version"
```

O parâmetro "-a" indica que essa será uma tag do tipo _annotated_. Ao contrário de uma tag _lightweight_, essa é um objeto Git completo, contendo informações como o nome e o e-mail do committer, o registro de data e hora e uma mensagem. Agora você tem uma tag, uma indicação de que esse ponto específico da história é especial e tem um nome. 

Legal. Você pode continuar trabalhando, como de costume, criando e enviando alterações que farão parte da versão 1.1. Até que chega um relatório de bug. Alguns clientes que foram atualizados para a versão 1.0 do produto dizem que um recurso de importação não está funcionando como pretendido. 

Bem, teoricamente, você poderia corrigir o bug na branch `main` e fazer o deploy da correção. Mas, nesse caso, os clientes receberiam recursos que possivelmente não foram testados e estão incompletos. Isso não é bom. 

Então, o que você faz?

A resposta: Você cria uma nova branch a partir da tag que criou para indicar a versão principal. Você corrige o problema lá, faz o build e deploy. E, provavelmente, você deve mesclar (merge) a correção de volta à branch `main` depois, para que as próximas versões contenham a correção. Como você faria isso? Fácil:

```
git branch <NAME-OF-THE-BRANCH> <TAG>
```

Mais especificamente, usando nosso exemplo anterior:

```
git branch fix-bug-123 v1.0
```

Depois disso, você pode ir para sua nova branch como de costume. Ou melhor ainda, você pode fazer tudo em uma única etapa:

```
git checkout -b fix-bug-1234 v1.0
```

## Criando uma branch no estado "DETACHED HEAD"

Alguma vez você já desejou voltar no tempo? Com o Git, isso é possível... pelo menos no que diz respeito aos arquivos em nosso repositório. Você pode, a qualquer momento, dar _checkout_ em um commit se souber seu hash:

```
git checkout <SHA1>
```

Depois de executar isso, o Git mostrará uma mensagem meio esquisita:

```
You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by performing another checkout.
```

Em tradução livre:

```
Você está no estado 'detached HEAD'. Você pode dar uma olhada, fazer alterações experimentais
experimentais e fazer o commit delas, e você pode descartar quaisquer commits que fizer nesse
estado sem afetar nenhuma branch, executando outro checkout.
```

Quando você faz o _checkout_ de um commit, entra em um estado especial chamado, como você pode ver, "[detached HEAD](https://www.cloudbees.com/blog/git-detached-head)", ou "cabeça desanexada." Embora você possa fazer commit de alterações nesse estado, esses commits não pertencem a nenhuma branch e ficarão inacessíveis assim que você mudar de branch. Mas e se você quiser manter esses commits? A resposta, sem surpresa, é usar o comando `checkout` novamente para criar uma nova branch:

```
git checkout <sha1> #now you're in detached head state
# do some work and stage it
git commit -m "add some work while in detached head state"
git branch new-branch-to-keep-commits
git checkout new-branch-to-keep-commits
```

E, é claro, agora você já sabe que pode escrever as duas últimas linhas como um único comando:

```
git checkout -b new-branch-to-keep-commits
```

Muito fácil, certo?

## Só porque você pode... não significa que você deva

O modelo de branch do Git é um dos seus principais atrativos. Ele transforma em uma moleza o que em outros sistemas de controle de código-fonte é um processo lento e doloroso. Pode-se dizer que o Git democratizou com sucesso a ramificação. 

Mas há um sério perigo. Devido ao baixo custo de trabalhar com branches no Git, alguns desenvolvedores podem cair na armadilha de trabalhar com [branches de vida extremamente longa](https://rollout.io/blog/pitfalls-feature-branching/) ou empregar fluxos de trabalho ou modelos de branch que atrasam a integração.

Nós, como setor, já passamos por isso. Fizemos isso. Não funciona. Em vez disso, adote fluxos de trabalho que utilizem branches de vida extremamente curta. Você terá uma _sandbox_ segura para codificar sem medo de quebrar coisas ou desperdiçar o tempo de seus colegas de trabalho. Mas isso faz com que você se pergunte: "Como posso fazer deploy de código com recursos parcialmente concluídos?" Nesse caso, tem uma ótima alternativa: [as ferramentas de _feature flag_](https://rollout.io/blog/ultimate-feature-flag-guide/).

As branches do Git são uma ferramenta poderosa. Use-as com sabedoria e não abuse. E quando não forem suficientes, empregue entrega contínua/integração contínua juntamente com ferramentas de feature flag para que suas aplicações possam chegar ao próximo nível.
