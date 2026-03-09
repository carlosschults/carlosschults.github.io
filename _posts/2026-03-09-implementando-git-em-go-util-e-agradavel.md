---
title: "Implementando o git em Go do Zero: Unindo o Útil ao...Agradável?"
ref: implementing-git-in-go
lang: pt
layout: post
author: Carlos Schults
description: "Estou construindo o Git em Go para aprender os dois. Bora acompanhar?"
permalink: /pt/implementando-git-em-go
tags:
- projetos
- git
- go
- go-gitter
---

Recentemente comecei a trabalhar no meu projeto mais novo: construir o git em Go, do zero. *Qual é o sentido disso?*, você pode estar se perguntando.

Tipo, é um projeto bastante inútil no sentido de que, você sabe, o git existe há 20 anos. (Obrigado, Linus.)
Meu objetivo com esse projeto é duplo:
- aprender a linguagem Go
- aprofundar meu conhecimento sobre os internos do git

## Escopo do Projeto
Não pretendo implementar 100% do git. Isso seria muito difícil. O que vou fazer é implementar um subconjunto pequeno de comandos do git, apenas em suas variações mais básicas.
Esta é a lista atual do que pretendo implementar:
- `git init`
- `git add`
- `git status`
- `git commit`
- `git log`

Essa lista não é estática. Posso decidir implementar mais comandos, ou menos. Tudo depende de eu decidir que aprendi o suficiente. Vamos ver como isso vai.

## Fluxo de Trabalho do Projeto (eu realmente não sabia como chamar essa seção)
Como vou fazer tudo isso, na prática? Já estou fazendo, já que comecei há cerca de uma semana. Então, a forma como estou conduzindo isso é basicamente percorrer essa lista de comandos, implementando um por um, e documentando meus aprendizados neste blog.

Ainda não tenho certeza sobre a cadência das postagens. Sinto que atualizações semanais são demais; já que tenho apenas cerca de 30 a 50 minutos por dia para trabalhar nisso, não quero perder muito tempo escrevendo as atualizações em si.

Então acho que vou começar escrevendo os posts sempre que sentir que acumulei atualizações interessantes o suficiente para compartilhar, e aí compartilho. Pode ser que depois eu estabeleça em uma cadência regular, mas também pode ser que não.

## Sobre o Uso de LLMs
Impus algumas regras a mim mesmo para este projeto. A mais importante é que zero linhas de código serão escritas por IA/LLMs. Isso derrotaria o propósito, já que o objetivo é realmente aprender a linguagem.

Isso não significa que não estou usando IA. Estou usando o Claude para me ajudar a planejar o roteiro, por assim dizer. Ele tem me ajudado a decidir a ordem dos comandos que faz mais sentido, quais são os conceitos de Go necessários para construir isso e quais posso pular, e assim por diante.

Para o meu aprendizado de Go em si, estou usando a documentação do Go e a boa e velha busca na web. Como nos velhos tempos.

## Construindo o git em Go: A Primeira Atualização
Então, o que fiz até agora?
Comecei este projeto na segunda-feira, 2026-03-02. Uma semana atrás no momento em que escrevo. Durante os primeiros três dias, segui o [Go Tour](https://go.dev/tour/welcome/1) para relembrar as poucas coisas que eu sabia sobre a linguagem e aprender mais dos fundamentos.

Na quinta-feira, terminei o tour. Passei pelos conteúdos sobre generics bem rapidamente e pulei completamente os de concorrência. Nesse dia, criei o [repositório](https://github.com/carlosschults/go-gitter) e escrevi um "Hello World."

Por algum motivo, não mexi no projeto na sexta-feira. Sábado foi o dia em que implementei de fato meu primeiro comando, e o único implementado até agora: `ggt init`.

Ah sim, a propósito: meu executável se chamará `ggt`, porque o próprio projeto se chama **go-gitter**. Isso é um trocadilho idiota com a expressão em inglês "go-getter", que se refere a uma pessoa que está sempre em ação, realizando muitas coisas e tal. 

Implementar o `init` foi muito fácil e tenho certeza de que só vai ficar mais difícil a partir de agora. Criar um repositório git é surpreendentemente simples, e é algo que você pode fazer manualmente, sem usar o git em si. Duvida? Ok, vou te ensinar.

Vá a algum lugar no seu computador e crie uma pasta. Entre nessa pasta e crie uma nova chamada `.git`. Exatamente assim.

Agora, entre em `.git` e crie um arquivo de texto chamado HEAD. Exatamente assim, sem extensão. Dentro desse arquivo, coloque o seguinte texto e salve:

```
ref: refs/heads/main
```

Próximo passo: crie duas novas pastas, `objects` e `refs`. Dentro de `objects`, crie mais duas pastas vazias: `info` e `pack`. Dentro de `refs`, crie `heads` e `tags`.

Agora, usando o terminal, vá ao mesmo nível onde a pasta .git está e execute `git status`. Você verá um resultado assim:
```
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```
Parabéns! Você acabou de criar um repositório git manualmente. Isso é exatamente o que [meu código Go está fazendo](https://github.com/carlosschults/go-gitter/blob/main/ggt/main.go).

## Acompanhe as Atualizações
As atualizações deste progresso serão rastreadas pela tag <a href="{{ site.baseurl }}/tag_ptbr/go-gitter">go-gitter</a>, então você pode salvar essa página nos favoritos, se quiser.
Já vinculei ao repositório, mas aqui está novamente, caso você tenha perdido: [go-gitter](https://github.com/carlosschults/go-gitter).

Obrigado pela leitura. Até a próxima atualização.