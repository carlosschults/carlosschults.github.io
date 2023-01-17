---
title: "Fazendo Seu Histórico Git Ficar Bonitão Com Amend e Rebase"
ref: git-beautiful-history
lang: pt
layout: post
author: Carlos Schults
description: Aprenda como reescrever seu histórico no Git usando rebase e amend
permalink: /pt/git-historico-bonito/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1673926044/git-beautiful-history/git-beautiful-history-cover.png
tags:
- git
---

![]({{ page.img }})

<span>Foto por <a href="https://unsplash.com/@yancymin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Yancy Min</a> no <a href="https://unsplash.com/photos/842ofHC6MaI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></span>

Você faz parte de uma equipe de software de pequeno a médio porte e morre de inveja do histórico de commits das pessoas que trabalham com você. Elas produzem histórias limpas e bem estruturadas com mensagens de commit bem escritas. A sua, em comparação, é um desastre, cheia de descrições como "corrigir erro de digitação", "adicionar arquivo esquecido" e assim por diante. Você queria entender como eles fazem isso.

A resposta é simples: _eles trapaceiam_. Seguinte: eles provavelmente cometem tantos erros quanto você, mas usam as features do Git para escondê-los. Eles então apresentam uma história mais limpa e bonita para o mundo.

Algumas ferramentas de controle de versão tratam o histórico do projeto como se fosse esta coisa super sagrada. Git não é assim. Ele lhe dá o poder de reescrever a história como você quiser. Tanto poder que você pode até se dar mal se não tiver cuidado.

Neste post, eu lhe mostrarei como usar `amend` e rebase interativo para fazer sua história de commits no Git ficar bonitona antes de publicá-la. Não vai ter muita teoria; eu o acompanharei através de alguns cenários comuns, mostrando como eu iria resolvê-los.

Antes de terminar, vou ensiná-lo a não atirar no seu pé com estes comandos. Como explicarei, `amend` e rebases são ações destrutivas, e tem situações em que você não deve executá-las.

## Requisitos 
Para acompanhar este posto, presumo que você:

- Sinta-se à vontade para trabalhar com a linha de comando
- ter Git instalado em sua máquina
- conhecer ao menos os comandos básicos de Git

Ao escrever este post, estou no Windows, usando a versão Git **2.38.1.windows.1*** e digitando meus comandos no Git Bash. Se você estiver no Linux ou OSX, acho que tudo funcionará da mesma forma, mas eu não testei.

## Definindo o código VS como seu editor de texto predefinido
Apenas um último detalhe antes da gente começar pra valer. Alguns dos comandos que você verá ao longo deste post exigirão que você edite e salve um arquivo de texto. Eles fazem isso abrindo seu editor de texto padrão conforme configurado em seu arquivo de configuração Git e esperando até que você edite, salve e feche o arquivo.

Se você estiver no Windows como eu, usando o Git Bash, seu editor padrão será o Vim. Vim é um editor de texto de linha de comando, e algumas pessoas o acham intimidante. Embora aprender Vim exija algum trabalho, não é tão difícil de começar, e eu recomendaria que você investisse algum tempo para aprender pelo menos os comandos mais básicos - especialmente como sair!

Entretanto, Git permite que você escolha outros editores de texto como seu padrão. Se você tiver o [Visual Studio Code](https://code.visualstudio.com/) instalado e quiser usá-lo, execute o seguinte comando:

`git config --global core.editor "code --wait"`

## Reescrevendo História: N Cenários comuns
Vou mostrar alguns cenários comuns nos quais você poderá se encontrar, nos quais a reescrita da história o salvará.

### Minha Mensagem de Commit Tem Um Erro
Você está correndo para consertar este bug de alta prioridade. Depois de horas de depuração exaustiva, você encontra o código ofensivo, conserta-o e faz o commit da mudança.

Só então você vê que fez um erro de digitação. Como consertar isso?

Vamos começar criando um repositório para que você possa praticar:

`git init`

Agora, vamos adicionar um novo arquivo e commitar:

`touch file.txt && git add file.txt && git commit -m "fix async request in getUsers() functino"`

Execute `git log--oneline` para ver sua mensagem de commit. Você verá algo como isto:

![](/img/git-beautiful-history/img1.png)

Preste atenção no identificador do commit, e talvez até mesmo anote-o em algum lugar; será importante mais tarde. (O seu será diferente do meu).

De qualquer forma, sua mensagem tem um erro. Como você a corrige?

Basta executar o comando `git commit --amend`, exatamente assim. O Git abrirá seu editor de texto e esperará que você edite a mensagem do commit:

```
fix async request in getUsers() functino

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Tue Jan 10 19:14:17 2023 -0300
#
# On branch master
#
# Initial commit
#
# Changes to be committed:
#   new file:   file.txt
#
````

A primeira linha é a mensagem de commit propriamente dita. As linhas que começam com o "#" são comentários e serão ignoradas. Basta corrigir o erro, salvar e fechar o arquivo de texto, e você terá uma nova mensagem de commit. Execute o `git log --oneline` novamente para vê-lo:

![](/img/git-beautiful-history/img2.png)

Você notará que a identificação (SHA-1) do commit é agora diferente do que era antes - e também diferente daquela da imagem acima. Voltarei a este assunto mais tarde.

Por enquanto, você alterou com sucesso sua mensagem de commit. Parabéns!

### Esqueci de incluir um arquivo
Às vezes você tem vários arquivos alterados e quer commitar alguns, mas não todos. Na sua pressa, você deixa um ou mais arquivos para trás. Como consertar isso?

`amend` ao resgate novamente.

Para simular esta situação, vamos criar um novo arquivo e também adicionar uma nova linha ao existente:

```bash
touch file2.txt
echo 'New line' >> file.txt
```

Um erro comum aqui é fazer o commit com a opção `-a`, pensando que ela incluirá ambos os arquivos:

`git commit -am "atualizar arquivo e adicionar arquivo2"`

Execute o comando acima. Em seguida, execute o comando `git status`. Este é o resultado que você vai obter:

```
On branch master

Untracked files:

  (use "git add <file>..." to include in what will be committed)

        file2.txt

nothing added to commit but untracked files present (use "git add" to track)
```
Consertar a situação é fácil. Primeiro, você rastreia ou encena o arquivo esquecido:

"git add file2.txt".

Em seguida, utilizar novamente o `git commit -amend`. Seu editor irá abrir, mas neste caso, não há nada de errado com a mensagem. Basta fechar o editor e pronto: agora você tem um commit emendado que inclui o arquivo anteriormente esquecido.

Mas se você se parece comigo, provavelmente se sentiu meio trouxa tendo aberto seu editor de texto sem nenhuma razão.

Felizmente, você nem sempre tem que fazer isso. Quando você quer apenas adicionar um ou mais arquivos faltantes sem alterar a mensagem de commit, você pode usar a opção `--no-edit`, desta forma:

`git commit --amend --no-edit`

Desta forma, Git não abrirá seu editor de texto, mantendo a mensagem de commit original.

### QueroMesclar Vários Commits Em Um Só
A fusão de vários commits em um só é uma operação chamada "squashing". Mas por que você iria querer fazer isso?

Bem, tudo se resume ao seu estilo Git. Eu gosto de fazer pequenos commits, com muita freqüência. Depois, quando estou prestes a torná-los públicos (por exemplo, ao abrir um pull request) eu os junto em um único commit, com uma mensagem bem escrita.

Esta também é uma exigência comum dos mantenedores de projetos de código aberto, por isso é uma boa habilidade pra se ter. Vamos aprender como fazer isso.

Primeiro, vamos criar três comitês:

```bash
git commit --allow-empty -m "empty commit" -m
git commit --allow-empty -m "empty commit 2" -m
git commit --allow-empty -m "empty commit 3" -m
```

Ter de ficar criando arquivos inúteis para poder commitar é tedioso. É por isso que eu estou usando a opção `--allow-empty`, que me permite criar commits vazios.

Agora, digamos que eu preciso juntar os três commits acima em um só. Para fazer isso, precisarei rebaseá-los interativamente. Ao fazer um rebase interativo, você pode realizar tarefas como:

- Reordenar commits
- Abandonar um ou mais commits
- Mudar suas mensagens
- Mesclar um ou mais commits

Agora vem a parte que pode ser confusa, então preste atenção, por favor. Já que vamos trabalhar com os três últimos commits, dizemos que os estamos rebaseando em cima do quarto commit (contando a partir do último)

Então, use o comando `git log --oneline -4` para exibir os últimos quatro commits e depois copie o SHA-1 do quarto commit do resultado:

![](/img/git-beautiful-history/img3.png)

Copie o identificador desse commit e passe-o para o comando de rebase, assim:

`git rebase -i 45f90ca`

Naturalmente, seu valor real de SHA-1 será diferente. Mas há uma maneira mais fácil:

"rebase -i HEAD~3".

Para simplificar, `HEAD` aqui significa o último commit, e `~3` significa "três commits antes deste".

Após executar um dos dois comandos acima, seu editor irá abrir, mostrando um arquivo de texto que contém as mensagens dos três commits que queremos reorganizar, cada um precedido pela palavra "pick". E depois disso, um conjunto de instruções:

![](/img/git-beautiful-history/img4.png)

Observe que os commits aqui não estão na ordem em que você está acostumado a vê-los no Git. Em vez de estarem em ordem cronológica inversa, eles estão em ordem cronológica direta, e há uma razão para isso.

Cada linha que você vê acima é um comando que o Git executará quando você confirmar a operação de rebase. Há vários comandos disponíveis, e o `pick` é o comando padrão. Isso significa simplesmente que o commit será mantido como está. Você pode usar `drop` para remover um commit, `reword` para editar uma mensagem de commit, e assim por diante.

O comando que vamos utilizar é `squash`. Basta substituir a palavra `pick` por `squash` no segundo e terceiro commits, desta forma:

```bash
pick dd25df9 empty commit # empty
squash c68804f empty commit 2 # empty
squash a76fd60 empty commit 3 # empty
```

O comando `squash` mescla um commit com aquele anterior. Assim, o terceiro será fundido com o segundo, que será fundido com o primeiro. E é por isso que o primeiro precisa ser *picked*.

Depois de editar o texto como eu lhe disse, salve e feche o arquivo. Quando você fizer isso, seu editor será aberto novamente. Desta vez, você será solicitado a escrever uma mensagem de commit para o novo commit que irá surgir:

![](/img/git-beautiful-history/img5.png)

Substituir o conteúdo do arquivo por "this is now a single commit". Salve e feche o arquivo.

Finalmente, vamos ver o resultado:

`git log --oneline'.

Isto é o que você deveria ver:

![](/img/git-beautiful-history/img6.png)

Como você pode ver, os três commits vazios foram substituídos por um único commit. Você realizou com sucesso sua primeira operação de `squash`. Parabéns!

## Quando Não Se Deve Mexer Com a História
Antes de terminar, vamos entender quando a mudança da história é problemática.

Primeiro, entender que tanto `amend` quanto `rebase` produzem **mudanças destrutivas**. É como se eles estivessem destruindo a história e criando uma nova.

Então, imagine que você junta três commits (que já haviam sido enviados para o servidor) e depois faz o `push` desse novo commit para dentro do repositório remoto (você teria que forçar o `push` para que isso funcionasse, a propósito.) Mas enquanto você estava trabalhando, seu colega de trabalho tinha criado um branch novo a partir do (o que era então) último commit. 

Esse commit não existe mais (tecnicamente, isso não é bem verdade, mas vamos fingir por um minuto que é), o que significa que eles não serão capazes de simplesmente dar o push suas mudanças. Eles terão que puxar seus novos commits e então realizar um merge potencialmente complexo a fim de conseguir que as coisas sejam ordenadas.

Portanto, a regra de ouro é **nunca reescreva a história da qual outras pessoas dependem.** O que isto significa em específico dependerá de qualquer fluxo de trabalho ramificado que você e sua equipe utilizem. 

Se você usar [trunk-based development,](https://trunkbaseddevelopment.com/) nunca reescreva o branch master/main. O mesmo é verdade se seu trabalho com [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow). Se você usa o git-flow, isso significa nunca reescrever os branches permanentes, ou seja, master/main e develop.

## OK, Eu Menti: Toma Um Pouco De Teoria
Ao longo deste artigo, usei expressões como "mudar a mensagem do commit", "juntar múltiplos commits em um", e assim por diante.

Tecnicamente falando, tudo isso eram mentiras. Quando você utiliza comandos como `git commit --amend` ou `rebase -i`, você não está mudando nada. O que Git está fazendo é **criar novos commits***.

Lembra-se quando você usou o `amend` pela primeira vez e eu disse que era relevante que o commit agora tinha um novo identificador? Acontece que aquele era um commit completamente novo, e o antigo ainda está por aí!

O mesmo vale para a operação de rebase. Quando você "mescla três commits em um", não é isso que está acontecendo. Em vez disso, Git cria um novo commit e atualiza a referência do branch, de modo que aponte para o novo commit. Os três commits antigos ainda estão lá (pelo menos por algum tempo), mas como nenhum branch aponta para eles, eles são inalcançáveis - a menos que você consiga obter de alguma forma os valores SHA-1 deles.

A imagem a seguir representa o que realmente aconteceu depois que você deu squash nos seus commits:

![](/img/git-beautiful-history/img7.png)

Agora, vamos ver o cenário após o squash:

![](/img/git-beautiful-history/img8.png)

Como você pode ver, há agora um novo commit, em laranja, que é o resultado de "mesclar" os três originais. No entanto, os três commits antigos ainda estão lá. Mas não se pode alcançá-los facilmente, porque agora não há nenhum branch apontando para eles.

O leitor astuto vai notar que até mesmo as imagens acima são uma simplificação. "Deveríamos ter mais commits na imagem", dizem eles, com seu dedo indicador acusatório apontando para a tela. E adivinhe, eles estão certos.

Lembra-se de que começamos tudo isso alterando dois commits? Bem, como dar `amend` não altera os commits, mas cria novos, temos dois commits extra perdidos em nosso repositório. Eu os omiti dos diagramas acima <sup>porque eu estava com preguiça</sup> por uma questão de brevidade. Mas como um exercício para o leitor, você mesmo pode adicioná-los.

## Reescreva o Passado Para Parecer (e ser) Mais Inteligente
Reescrever a história é uma poderosa capacidade do Git. Com comandos como `git commit --amend` e `git rebase -i` você pode "mudar" seus commits passados, escondendo seus erros e fazendo parecer que você fez tudo certo desde o início. Eu faço isso o tempo todo e colho os benefícios: meus colegas de trabalho pensam que sou muito mais esperto do que realmente sou - por favor, não conta meu segredo pra eles.

Falando sério agora: esses comandos são ferramentas fantásticas para você conseguir um histórico mais organizado. Com eles, você pode perder de uma vez o medo de commitar com frequência. Faça commits pequenos e frequentes, e não ligue muito para a mensagem — por exemplo, se você usa [TDD](/2020-07-08-testes-unitarios-iniciantes-parte3.md), você pode commitar toda vez que os testes passarem.

Depois, quando for a hora de publicar o seu trabalho, dê squash nos commits e capriche na descrição. Aproveite e adote uma convenção de mensagens de commit para você e seu time, como o [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/). Seus colegas (e seu eu futuro) vão te agradecer.
