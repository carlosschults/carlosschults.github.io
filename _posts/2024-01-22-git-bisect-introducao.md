---
title: "Git Bisect: Uma Introdução Para Iniciantes"
ref: git-bisect-intro
lang: pt
layout: post
author: Carlos Schults
description: Neste post, você vai aprender um comando git muito útil para seu dia-a-dia.
permalink: /pt/git-bisect-intro/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1673926044/git-beautiful-history/git-beautiful-history-cover.png
tags:
- git
---

![]({{ page.img }})

<span>Foto por <a href="https://unsplash.com/@yancymin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Yancy Min</a> on <a href="https://unsplash.com/photos/842ofHC6MaI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></span>

Se você está tentando melhorar seu _git-fu_, uma boa dica é aprender o `git bisect`. O git tem a sua quota injusta de comandos complicados, isso é verdade. A boa notícia é que, diferente desses, o `git bisect` é bem fácil de entender e usar, pelo menos em sua forma mais básica. A notícia ainda melhor é que ele é super útil para ajudá-lo a corrigir bugs.

## Pré-requisitos

Antes de começarmos, vamos rever alguns pré-requisitos que você precisará para acompanhar o post:
- Ter o git instalado em sua máquina
- Conhecer pelo menos os comandos básicos do git
- Ter o Node.js instalado na sua máquina (mais adiante você vai usar uma aplicação exemplo fornecida por mim, e ela é escrita em JavaScript).

Tem tudo isso? Show, vamos em frente.

## O que é o Git Bisect? Por que você precisa dele?

O `Git bisect` é um comando que permite realizar uma busca binária no seu histórico de commits. Por que fazer isso?

Aqui está um cenário comum durante o desenvolvimento. Alguém relata um bug. Você vai dar uma olhada e descobre que, duas semanas atrás, a funcionalidade estava funcionando muito bem.

Para corrigir o bug, seria útil descobrir quando exatamente ele foi introduzido. Uma vez que você conhece um commit que você tem certeza que é "bom" - isto é, que não contém o bug - você podia ir fazendo o `git checkout` até lá, voltando um commit de cada vez e testando para ver se a aplicação funciona.

Isso iria funcionar, mas pode potencialmente levar muito tempo, dependendo do número de commits que você teria que verificar e onde está o problema. Para aqueles que se lembram das aulas de Ciência da Computação, a abordagem descrita acima é uma [busca linear](https://en.wikipedia.org/wiki/Linear_search), que não é a melhor maneira de procurar um valor dentro de uma lista.

Sabe o que é mais eficiente? Uma pesquisa binária. Se você tem, digamos, 50 commits que você precisa verificar, e você testa o 25º e não encontra o bug, o que isso significa? Pode ignorar os primeiros 25 commits e continuar a sua pesquisa nos 25 commits posteriores. Continue o processo, sempre dividindo pela metade, e você encontrará o erro em muito menos verificações do que seria necessário com uma busca linear.

Fazer isso manualmente seria muito chato. E é aí que o `git bisect` ajuda. Ele tem uma sintaxe fácil que permite que você especifique tanto um commit bom quanto um ruim, e então o git irá executar as partições binárias pra você. Em cada passo, terá de testar a sua aplicação e informar o git se esse commit é bom ou ruim. Depois, o git calcula o próximo passo, leva você até lá e o processo termina quando encontrar o culpado.

## Como usar o `Git Bisect` na prática?

Hora de aprender a usar o `git bisect` na prática. Para praticar este comando, é necessário um repositório com pelo menos alguns commits, e que tenha um bug. Ia levar um tempo para você configurar um repositório assim então eu já fiz um para você - pode falar, eu sei que eu sou legal.

### Obtendo a aplicação de exemplo
Basta [clonar este repositório do GitHub](https://github.com/carlosschults/git-bisect-intro) e você está pronto para começar.

O repositório contém uma aplicação JavaScript que implementa algumas das regras do [String Calculator Kata proposto por Roy Osherov](https://osherove.com/tdd-kata-1). Aqui está o que a aplicação deve fazer:
- depois de executá-la, a aplicação pedirá uma lista de números, separados por vírgula;
- o usuário fornece os números;
- a soma dos números é apresentada.
- Os números maiores que 1000 são ignorados. Assim, a string "1,2,1000" deve produzir o resultado 1003, mas "1,2,1001" deve resultar em 3.
- os números negativos não devem ser permitidos. Se informar um ou mais números negativos, a aplicação deve lançar um erro com a mensagem "Negativos não permitidos", seguido dos números negativos que foram introduzidos.

Depois de clonar o repositório, vamos testar a aplicação. Acesse sua pasta através da linha de comandos, execute `node index.js` e, quando lhe forem pedidos os números, digite "1,2,3" e dê enter.

Vixi, parece que deu ruim.

```
node:internal/readline/emitKeypressEvents:74
            throw err;
            ^

Error: Negatives not allowed: .
    at C:\repos\git-bisect-intro\index.js:11:11
    at [_onLine] [as _onLine] (node:internal/readline/interface:423:7)
    at [_line] [as _line] (node:internal/readline/interface:886:18)
    at [_ttyWrite] [as _ttyWrite] (node:internal/readline/interface:1264:22)
    at ReadStream.onkeypress (node:internal/readline/interface:273:20)
    at ReadStream.emit (node:events:513:28)
    at emitKeys (node:internal/readline/utils:357:14)
    at emitKeys.next (<anonymous>)
    at ReadStream.onData (node:internal/readline/emitKeypressEvents:64:36)
    at ReadStream.emit (node:events:513:28)

Node.js v18.12.1
```
A aplicação não funciona. Ela gera o erro "negatives not allowed" (negativos não permitidos) mesmo que nenhum negativo tenha sido inserido. Se você quiser ver a aplicação funcionando, facilitei as coisas para você: Criei uma tag chamada `good-commit` que faz referência a um ponto no histórico que é garantidamente bom. Basta ir até lá e verificar:

`git checkout good-commit`

Após executar o comando acima, é possível que você veja algumas mensagens sobre [detached HEAD](https://www.cloudbees.com/blog/git-detached-head) e outras coisas. Simplesmente ignore-as. Execute a aplicação novamente e _voilá_:

```
Enter a list of numbers separated by comma:
1,2,3
The sum of the entered numbers is 6.
```

Massa, agora vamos testar a regra de que números maiores do que 1000 devem ser ignorados:

```
Enter a list of numbers separated by comma:
1,2,1000, 1001
The sum of the entered numbers is 1003.
```

Show de bola. Como esperado, o número 1000 é considerado, mas 1001 é ignorado. Para um teste final, vamos verificar a proibição de números negativos:

```
Enter a list of numbers separated by comma:
1,2,3,-5,-4,-7
node:internal/readline/emitKeypressEvents:74
            throw err;
            ^

Error: Negatives not allowed: -5, -4, -7.
```

Muito bom. Agora, vamos para a próxima etapa. Mas, primeiro, execute `git checkout main` para retornar ao último commit.

### Hora de arregaçar as mangas
Para começar a usar o comando `git bisect`, você precisa iniciar uma _sessão bisect_. Para isso, basta executar o comando `git bisect start`. Em seguida, você verá a seguinte mensagem:

`status: waiting for both good and bad commits`

Agora, você precisa informar ao git sobre um commit que é conhecido por ser "bom" - ou seja, não contém o bug - e um commit que contém o bug. Vamos começar com o bom:

`git bisect good good-commit`

Como eu disse antes, criei uma tag para apontar para um commit bom conhecido para facilitar as coisas para você. Mas você não está restrito às tags quando se trata de apontar para um commit em uma sessão de bissecção. Os nomes de branches também funcionam, assim como os SHAs dos commits e praticamente todas as referências que levam a um commit.

De qualquer forma, depois de executar o comando, você verá o seguinte:
`status: waiting for bad commit, 1 good commit known`

Agora é hora de apontar para um commit ruim. Tenho certeza de que você já adivinhou a sintaxe: `git bisect bad <REFERENCE-TO-COMMIT>`. Mas como o commit em que estamos - em outras palavras, a ponta do `main` - é sabidamente ruim, você pode simplesmente executar:

`git bisect bad`

Agora começa a diversão! O Git exibirá uma mensagem, mostrando o status da operação de bissecção. Ele lhe dirá quantas revisões restam para testar, quantas etapas seriam necessárias e para qual commit ele "transportou" você:

```
Bisecting: 11 revisions left to test after this (roughly 4 steps)
[e159647d4d142c410894aaf10c1e11e2208848d7] Edit to negative rule
```

Seu trabalho agora é testar a aplicação e informar ao git se esse é um commit bom ou ruim. Então, vamos executar o `node index.js` e fornecer alguns números:
```
Enter a list of numbers separated by comma:
1,2,3
node:internal/readline/emitKeypressEvents:74
            throw err;
            ^

Error: Negatives not allowed: .
```

Cortei parte da saída para ser breve, mas de qualquer forma: a aplicação não está funcionando. Então, diga isso ao git:

`git bisect bad`

Isso o levará a um commit diferente:

```
Bisecting: 5 revisions left to test after this (roughly 3 steps)
[0b8f71999bed054d8a95d9da3be6f0c831074cd7] Update README.md - Commit 6
```

Vamos repetir o teste com `node index.js`:

```
Enter a list of numbers separated by comma:
1,2,3
The sum of the entered numbers is 6.
```

Fantástico! Neste commit, a aplicação parece funcionar bem. Vamos fazer um teste diferente, usando números negativos:

```
Enter a list of numbers separated by comma:
1,2,3,-5,-4,-10
node:internal/readline/emitKeypressEvents:74
            throw err;
            ^

Error: Negatives not allowed: -5, -4, -10.
```

Perfeito: ele está gerando um erro, como deveria fazer nesse cenário. Portanto, execute `git bisect good` para marcar esse commit como bom.

```
Bisecting: 2 revisions left to test after this (roughly 2 steps)
[e6413a915c7ca92871394b01a8497c8df3fc46ae] Update README.md - Commit 9
```

Mais um commit, mais um teste:

```
node index.js
Enter a list of numbers separated by comma:
1,2,3
The sum of the entered numbers is 6.
```
Vamos testar os negativos:

```
node index.js
Enter a list of numbers separated by comma:
10,20,-5
node:internal/readline/emitKeypressEvents:74
            throw err;
            ^

Error: Negatives not allowed: -5.
```

Tudo parece bem, vamos marcá-lo como bom:
`git bisect good`

E o resultado:
```
Bisecting: 0 revisions left to test after this (roughly 1 step)
[053207649aefdb09cd255567df673cadbe2e38e3] Restore README
```

Estamos chegando perto! Vamos testar:
```
node index.js
Enter a list of numbers separated by comma:
1,2,3
The sum of the entered numbers is 6.

node index.js
Enter a list of numbers separated by comma:
1,2,3,-5,-6
node:internal/readline/emitKeypressEvents:74
            throw err;
            ^

Error: Negatives not allowed: -5, -6.
```

Marcando-o como bom: `git bisect good`. E, tcharam!, aqui está nossa resposta:

```
e159647d4d142c410894aaf10c1e11e2208848d7 is the first bad commit
commit e159647d4d142c410894aaf10c1e11e2208848d7
Author: Carlos Schults <carlos.schults@gmail.com>
Date:   Tue Jan 9 08:53:47 2024 -0300

    Edit to negative rule

 index.js | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

### E agora?
Ok, agora você sabe que o commit `e159647d4d142c410894aaf10c1e11e2208848d7` foi o que introduziu o bug. O que você deve fazer agora?

Em resumo, você precisa ver os detalhes desse commit, para saber quais alterações ele faz e entender o que causou o problema. Vamos usar o comando `git show` para isso:

`git show e159647d4d142c410894aaf10c1e11e2208848d7`

Esse comando exibirá várias informações sobre o commit, incluindo autor, data e mensagem. Vou reproduzir apenas a parte que me interessa, que é a diferença:

```
diff --git a/index.js b/index.js
index 5f351e0..4e65e0c 100644
--- a/index.js
+++ b/index.js
@@ -6,7 +6,7 @@ const readline = require('readline').createInterface({
   readline.question('Enter a list of numbers separated by comma:\n', numbers => {
     let integers = numbers.split(',').map(x => parseInt(x) || 0);
     let negatives = integers.filter(x => x < 0);
-    if (negatives.length > 0) {
+    if (negatives.length >= 0) {
       throw new Error(`Negatives not allowed: ${negatives.join(', ')}.`);
     }
```

E agora como uma imagem, para que você possa ver as cores:

![](/img/diff.png)

Como você pode ver, esse commit fez uma alteração na instrução `if` que testa números negativos, adicionando um sinal de igual à comparação. Dessa forma, o erro será lançado independentemente do fato de o array `negatives` ter elementos.

Agora que você sabe como o erro foi introduzido, é muito fácil corrigi-lo. Para encerrar a sessão de bisect, execute `git bisect reset`. Assim, você voltará ao commit/branch onde você estava originalmente.

## Uma observação sobre "bom" e "ruim"

Leitores atentos devem ter notado que, embora esse comando use termos como "bom", "ruim" e "bug", não há nada que o impeça de usar o `git bisect` para descobrir o ponto no tempo em que qualquer propriedade da base de código foi alterada. Afinal de contas, o Git não tem como saber como o seu código _deveria_ funcionar; foi você, o tempo todo, quem o testou.

Até mesmo a [documentação do comando](https://git-scm.com/docs/git-bisect#_alternate_terms) reconhece esse fato:

> Às vezes, você não está procurando o commit que introduziu uma quebra, mas sim um commit que causou uma alteração entre algum outro estado "antigo" e o estado "novo". Por exemplo, você pode estar procurando o commit que introduziu uma correção específica. Ou pode estar procurando o primeiro commit em que os nomes de arquivo do código-fonte foram finalmente convertidos para o padrão de nomenclatura da sua empresa. Ou qualquer outra coisa.

Nesse cenário, seria estranho usar os termos "good" e "bad". A boa notícia é que, em vez disso, você pode usar _new_ e _old_: o commit _novo_ é aquele que contém a propriedade que você está procurando, e o _antigo_ não contém essa propriedade. 

Para usar essa terminologia, basta iniciar uma sessão de bisect normalmente e, em seguida, executar `git bisect old <COMMIT>` para indicar o commit antigo e `git bisect new <COMMIT>` para indicar o novo.

Lembre-se de que você pode usar good/bad ou old/new, mas não pode misturar os dois. A qualquer momento durante uma sessão, você pode executar `git bisect terms` para ser lembrado dos termos que está usando.

O comando é ainda mais flexível do que isso: você pode escolher seus próprios termos! Basta iniciar uma sessão executando o seguinte:

`git bisect start --term-old <term-old> --term-new <term-new>`

## Git Bisect: Quais Os Próximos Passos?

Não são dados estatísticos, mas, a partir de minhas observações, eu diria que o `git bisect` é um comando subutilizado. O que é muito triste, considerando que o `git bisect` é a) incrivelmente útil e b) fácil de entender e usar, pelo menos em seu caso de uso mais básico.

Se você já estiver familiarizado com os comandos mais comuns do git - ou seja, `status`, `log`, `commit`, `add`, `pull`, `push`, `checkout` - e quiser dar um passo adiante, aprender o `git bisect` é um ótimo ponto de partida.

Então, você aprendeu o básico sobre esse comando com a introdução que escrevi. Massa demais, mas o que você deve fazer a partir daqui? Tenho algumas sugestões:

- Coloque-o em prática o mais rápido possível. Mesmo que não esteja caçando bugs no momento, pense em _alguma_ característica da sua aplicação e encontre o commit em que ela foi introduzida usando o `git bisect`.
- Aprofunde-se mais no comando e procure casos de uso mais avançados. Por exemplo, é possível [automatizar o `git bisect`](https://dev.to/emilysamp/how-to-run-an-automated-git-bisect-with-rspec-3dm3) para que você não precise testar manualmente a fim de separar os commits bons dos ruins!
- Leia a [documentação](https://git-scm.com/docs/git-bisect) do `git bisect`. Volte a ela de tempos em tempos, e você certamente aprenderá algo novo e útil.

Isso é tudo por hoje. Espero que você tenha gostado e agradeço muito qualquer feedback. Obrigado pela leitura!