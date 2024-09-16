---
title: "Erro 'Git Detached Head': O Que Significa e Como Resolver"
ref: git-detached-head
lang: pt
layout: post
author: Carlos Schults
description: O Que a mensagem "git detached head" signigica e como resolver? Aprenda nesse post
permalink: /pt/git-detached-head
original: https://www.cloudbees.com/blog/git-detached-head
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1673926044/git-beautiful-history/git-beautiful-history-cover.png
tags:
- git
- tutorial
---

![]({{ page.img }})

{% capture content %}
*Nota editorial: Eu originalmente escrevi este post para o blog da Cloudbees.  Você pode [ler o original, em inglês, no site deles]({{ page.original }}).*
{% endcapture %}
{% include callout.html type="info" title="Info"  content=content %}

# Índice

1. [Introdução](#introdução)
2. [Reproduzindo o "Problema"](#git-detached-head-reproduzindo-o-problema)
3. [O que é um HEAD no Git?](#o-que-é-um-head-no-git)
   - [Você está no estado 'detached HEAD'?](#você-está-no-estado-detached-head)
4. [Benefícios de um HEAD Desanexado](#benefícios-de-um-head-desanexado)
5. [Como Corrigir um HEAD Desanexado no Git?](#como-corrigir-um-head-desanexado-no-git)
   - [Cenário #1: Estou Aqui por Acidente](#cenário-1-estou-aqui-por-acidente)
   - [Cenário #2: Fiz Mudanças Experimentais e Quero Descartá-las](#cenário-2-fiz-mudanças-experimentais-e-quero-descartá-las)
   - [Cenário #3: Fiz Mudanças Experimentais e Quero Mantê-las](#cenário-3-fiz-mudanças-experimentais-e-quero-mantê-las)
6. [Removendo a Mensagem "Git Detached HEAD"](#removendo-a-mensagem-git-detached-head)
7. [Conclusão](#git-detached-head-menos-assustador-do-que-parece)

## Introdução

Iniciantes no Git frequentemente ficam confusos com algumas das mensagens que esta [ferramenta de controle de versão](https://www.atlassian.com/git/tutorials/what-is-version-control) apresenta. A mensagem "You are in 'detached HEAD' state" (Você está no estado 'HEAD desanexado') é certamente uma das mais estranhas. Após se deparar com essa mensagem, a maioria das pessoas começa a pesquisar freneticamente no Google por termos como "git detached HEAD", "git detached HEAD fix", ou similares, buscando qualquer coisa que possa ajudar. Se esse é o seu caso, você veio ao lugar certo.

Aqui está a primeira coisa que você deve saber: *você não fez nada de errado*. Seu repositório não está quebrado nem nada parecido. A expressão "Detached HEAD" pode soar um tanto bizarra, mas é um estado perfeitamente válido em um repositório Git. Claro, não é o estado *normal*, que seria - você adivinhou! - quando o HEAD está anexado. A segunda coisa que você precisa saber é que voltar ao normal é super fácil. Se você só quer fazer isso e seguir com o seu dia, vá para a seção ["Como corrigir um HEAD desanexado no Git?"](#como-corrigir-um-head-desanexado-no-git) deste post para ver como é feito.

Mas se você quer saber mais - e eu acho que quer - fique por aqui e nós vamos te ajudar. O que significa HEAD no Git? O que significa estar anexado ou desanexado? Essas são o tipo de perguntas que responderemos neste post. Ao final dele, você terá uma melhor compreensão dos fundamentos do Git, e HEADs desanexados nunca mais te incomodarão. Bora começar?

## Git Detached HEAD: Reproduzindo o "Problema"

Vamos começar com uma rápida demonstração de como chegar ao estado de HEAD desanexado. Criaremos um repositório e adicionaremos alguns commits a ele:

{% highlight bash %}
mkdir git-head-demo
cd git-head-demo 
git init
touch file.txt
git add .
git commit -m "Create file"
echo "Hello World!" > file.txt
git commit -a -m "Add line to the file"
echo "Second file" > file2.txt
git add .
git commit -m "Create second file"
{% endhighlight %}

Com os comandos acima, criamos uma nova pasta com um novo repositório dentro dela. Em seguida, criamos um novo arquivo vazio e fizemos o commit com a mensagem "Criar arquivo". Depois, adicionamos uma linha a esse arquivo e fizemos o commit da alteração, com a mensagem "Adicionar linha ao arquivo". Por fim, criamos outro arquivo com uma linha de texto e também fizemos o commit. Se você usar o comando **git log --oneline**, verá algo como isto:

![](/img/git-detached-head/image3.png)

Digamos que, para fins de teste, precisamos ver como as coisas estavam no momento do segundo commit. Como faríamos isso? Na verdade, podemos fazer checkout de um commit da mesma forma que faríamos checkout de branches. Lembre-se, branches são apenas nomes para commits. Então, com base no exemplo de saída acima, executaríamos **git checkout 87ec91d**. Tenha em mente que, se você estiver seguindo junto e executando esses comandos em seu próprio sistema, o hash para seus commits será diferente dos exemplos. Use o comando log para encontrá-lo.

Após executar o comando, recebemos a mensagem "You are in 'detached HEAD' state[...]". Antes de continuarmos, certifique-se de manter isso em mente: você chega ao estado de HEAD desanexado fazendo checkout diretamente de um commit.

## O que é um HEAD no Git?

O que significa HEAD no Git? Para entender isso, precisamos dar um passo atrás e falar sobre os fundamentos.

Um repositório Git é uma coleção de **objetos** e **referências**. Os objetos têm relações entre si, e as referências apontam para objetos e para outras referências. Os principais objetos em um repositório Git são commits, mas outros objetos incluem [blobs](https://developer.github.com/v3/git/blobs/) e [trees](https://developer.github.com/v3/git/trees/). As referências mais importantes no Git são as [branches](/pt/git-criar-branch), que você pode pensar como rótulos que você coloca em um commit.

HEAD é outro tipo importante de referência. O propósito do HEAD é manter o controle do ponto atual em um repositório Git. Em outras palavras, HEAD responde à pergunta: "Onde eu estou agora?"

Por exemplo, quando você usa o comando **log**, como o Git sabe de qual commit ele deve começar a exibir os resultados? HEAD fornece a resposta. Quando você cria um novo commit, seu pai é indicado pelo local para onde o HEAD está apontando atualmente.

### Você está no estado 'detached HEAD'?

Você acabou de ver que HEAD no Git é apenas o nome de uma referência que indica o ponto atual em um repositório. Então, o que significa estar anexado ou desanexado?

Na maioria das vezes, HEAD aponta para um nome de branch. Quando você adiciona um novo commit, a referência do seu branch é atualizada para apontar para ele, mas o HEAD permanece o mesmo. Quando você muda de branch, o HEAD é atualizado para apontar para o branch para o qual você mudou. Tudo isso significa que, nesses cenários, HEAD é sinônimo de "o último commit no branch atual". Este é o estado *normal*, no qual HEAD está *anexado* a um branch.

Uma representação visual do nosso repositório de demonstração seria assim:
![](/img/git-detached-head/image5.png)

Como você pode ver, HEAD aponta para o branch master, que aponta para o último commit. Tudo parece perfeito. Após executar **git checkout 87ec91d**, o repositório fica assim:
![](/img/git-detached-head/image4.png)

Este é o estado de HEAD desanexado; HEAD está apontando diretamente para um commit em vez de um branch.

### Benefícios de um HEAD Desanexado

Existem boas razões para você estar no estado de HEAD desanexado? Com certeza!

Como você viu, você desanexa o HEAD fazendo checkout de um commit. Isso já é útil por si só, pois permite que você volte a um ponto anterior na história do projeto. Digamos que você queira verificar se um determinado bug já existia na terça-feira passada. Você pode usar o comando **log**, filtrando por data, para encontrar o hash do commit relevante. Em seguida, você pode fazer checkout do commit e testar a aplicação, seja manualmente ou executando sua suíte de testes automatizados.

E se você pudesse não apenas olhar para o passado, mas também mudá-lo? É isso que um HEAD desanexado permite que você faça. Vamos revisar como a mensagem de desanexação começa:

```
Você está no estado 'detached HEAD'.
Você pode olhar ao redor, fazer mudanças experimentais e fazer commits delas,
e você pode descartar quaisquer commits que fizer neste estado sem
impactar nenhum branch, simplesmente mudando de volta para um branch.
```

Neste estado, você pode fazer mudanças experimentais, efetivamente criando uma história alternativa. Então, vamos criar alguns commits adicionais no estado de HEAD desanexado e ver como nosso repositório fica depois:

{% highlight bash %}
echo "Welcome to the alternate timeline, Morty!" > new-file.txt
git add .
git commit -m "Create new file"
echo "Another line" >> new-file.txt
git commit -a -m "Add a new line to the file"
{% endhighlight %}

Agora temos dois commits adicionais que descendem do nosso segundo commit. Vamos executar **git log --oneline** e ver o resultado:
![](/img/git-detached-head/image7.png)

Assim é como o diagrama fica agora:
![](/img/git-detached-head/image6.png)

O que você deve fazer se quiser manter essas mudanças? E o que deve fazer se quiser descartá-las? É isso que veremos a seguir.

## Como corrigir um HEAD desanexado no Git?

Você não pode corrigir o que não está quebrado. Como eu disse antes, um HEAD desanexado é um estado válido no Git. Não é um problema. Mas você ainda pode querer saber como voltar ao normal, e isso depende do motivo pelo qual você está nessa situação em primeiro lugar.

### Cenário #1: Estou aqui por acidente

Se você chegou ao estado de HEAD desanexado por acidente - ou seja, você não tinha a intenção de fazer checkout de um commit - voltar é fácil. Basta fazer checkout do branch em que você estava antes:

{% highlight bash %}
git checkout <nome-do-branch>
{% endhighlight %}

Se você está usando o Git 2.23.0 ou mais recente, você também pode usar **switch** em vez de **checkout**:

{% highlight bash %}
git switch <nome-do-branch>
{% endhighlight %}

### Cenário #2: Fiz mudanças experimentais e quero descartá-las

Você entrou no estado de HEAD desanexado e fez alguns commits. O experimento não levou a lugar nenhum, e você não vai mais trabalhar nele. O que você faz? Você faz o mesmo que no cenário anterior: volta para o seu branch original. As mudanças que você fez enquanto estava na linha do tempo alternativa não terão nenhum impacto no seu branch atual.

### Cenário #3: Fiz mudanças experimentais e quero mantê-las

Se você quer manter as mudanças feitas com um HEAD desanexado, basta [criar um novo branch](/pt/git-criar-branch/) e mudar para ele. Você pode criá-lo logo após chegar a um HEAD desanexado ou após criar um ou mais commits. O resultado é o mesmo. A única restrição é que você deve fazê-lo antes de retornar ao seu branch normal.

Vamos fazer isso em nosso repositório de demonstração:

{% highlight bash%}
git branch alt-history
git checkout alt-history
{% endhighlight %}

Observe como o resultado de **git log --oneline** é exatamente o mesmo de antes (a única diferença sendo o nome do branch indicado no último commit):
![](/img/git-detached-head/image2.png)

Poderíamos apenas executar **git branch alt-history**, e estaríamos prontos. Essa é a nova - e final - versão do nosso diagrama:
![](/img/git-detached-head/image1.png)

## Removendo a mensagem "Git Detached HEAD"

Antes de concluir, vamos compartilhar uma última dica rápida. Agora que você entende tudo sobre HEAD desanexado no Git e sabe que não é tão grave assim, ver essa mensagem toda vez que fizer checkout de um commit pode se tornar cansativo. Felizmente, há uma maneira de não ver mais o aviso. Basta executar o seguinte comando:

{% highlight bash%}
git config advice.detached head false
{% endhighlight %}

Fácil, não é? Você também pode usar o modificador **--global** se quiser que a mudança se aplique a todos os repositórios e não apenas ao atual.

## Git Detached HEAD: Menos assustador do que parece

Uma mensagem falando sobre cabeças não estarem anexadas não soa como uma mensagem de erro de software rotineira, certo? Bem, não é uma mensagem de erro.

Como você viu neste post, um HEAD desanexado não significa que algo está errado com seu repositório. **Detached HEAD** é apenas um estado menos usual em que seu repositório pode estar. Além de não ser um erro, pode ser bastante útil, permitindo que você execute experimentos que depois pode escolher manter ou descartar.

Gostaria de aprender mais sobre Git? Confira alguns dos seguintes posts:

- [Fazendo Seu Histórico Git Ficar Bonitão Com Amend e Rebase](/pt/git-historico-bonito/)
- [Git Bisect: Uma Introdução Para Iniciantes](/pt/git-bisect-intro/)
- [Git Criar Branch: 4 Maneiras Diferentes](/pt/git-criar-branch)

Obrigado por ler!