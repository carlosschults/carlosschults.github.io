---
title: "Construindo o git em Go do Zero - Parte 3"
ref: building-git-in-go-part3
lang: pt
layout: post
author: Carlos Schults
description: "Esta é a terceira atualização da minha jornada construindo o git"
permalink: /pt/construindo-git-em-go-parte-3
tags:
- projects
- git
- go
- go-gitter
- version-control-system
---

Bem-vindo de volta à minha jornada de construir o git do zero em Go, para aprender mais sobre os dois. Se você não sabe do que estou falando, vá ler [o primeiro post](/pt/implementando-git-em-go). Depois, é claro, você deve seguir para [a segunda parte](/pt/construindo-git-em-go-parte2).

## Já Faz um Tempo, de Novo
Espero que tenham tido um ótimo feriado de independência. Já estamos em setembro, dá para acreditar? Eu sei, dessa vez demorou ainda mais. E a ~~desculpa~~ explicação é a mesma: eu não tive muito tempo.

Além disso, para ser honesto, acabei meio que esquecendo de atualizar o post enquanto trabalhava no projeto. É como se eu não quisesse perder o ritmo em que estava, então meu cérebro meio que bloqueou a ideia de parar para escrever esta atualização...? Enfim, faz sentido para mim. Vamos continuar.

## Recapitulando
No final do último post, mencionei que [o próximo passo seria implementar o comando `update-index`](/pt/construindo-git-em-go-parte2#o-que-vem-a-seguir). Isso está feito, e você vai ler um pouco sobre ele.

Mas esta atualização será, de modo geral, menos sobre o comando em si e mais sobre tudo o que está ao redor dele.

Isso porque, depois de implementar esse comando, decidi fazer uma refatoração que já estava bastante atrasada. O código estava chegando a um nível de bagunça que estava começando a me incomodar. Mas, como o próprio Martin Fowler[^1] certamente diria, refatorar sem testes automatizados é arriscado.

Então, decidi adicionar testes automatizados para garantir que meus comandos continuassem funcionando corretamente enquanto eu os refatorava. Este post é a história dessa refatoração.

## Implementando `update-index`
Vamos começar falando sobre a implementação do `update-index`. Esse não é um comando que você usaria normalmente no dia a dia, já que ele é um comando de plumbing[^2]. Então por que implementá-lo?

### Motivação
Estou avançando em direção ao objetivo de conseguir fazer commits. Você deve se lembrar de que, antes de fazer um commit no git, é preciso fazer o stage da alteração. Fazer o "staging" de uma alteração significa adicioná-la ao index, para que, quando você fizer o commit, a alteração presente no index seja a que será adicionada ao commit.

O `update-index` recebe caminhos de arquivos como argumentos e os adiciona ao index. Minha implementação, no momento, só lida com um arquivo. Ainda preciso trabalhar para que ela realmente consiga lidar com múltiplos arquivos.

Minha implementação foi feita em duas etapas. Primeiro, criei um [esqueleto para o comando](https://github.com/carlosschults/go-gitter/commit/1f90b863b6f77d75f1ab85f2031f457b515c1efa), escrevendo um arquivo de index mínimo que era estruturalmente correto, mas não estava certo no sentido de que, naquele momento, ele não estava realmente escrevendo um arquivo de verdade no index.

O [commit seguinte](https://github.com/carlosschults/go-gitter/commit/f82f8612b3ad9e6b00a27eeb0ded9bf701bd7862) terminou a implementação, levando o arquivo em consideração e salvando-o corretamente. O resultado foi que eu agora tinha um comando capaz de escrever no arquivo de index de uma maneira totalmente válida. Eu podia verificar isso usando o git de verdade para ler o arquivo de index novamente, usando outro comando de plumbing, `git ls-files`.

### Mas que diabos é um arquivo de index?
Eu venho falando em "adicionar ao index", como se fosse algo que todo mundo entendesse. Então, o que exatamente significa adicionar algo ao arquivo de index? E, afinal, o que é esse arquivo de index?

O arquivo de index é um arquivo binário que o git grava em `.git/index`. Diferentemente de objetos como blobs que, quando descomprimidos, nos devolvem texto legível, o index não funciona assim. Seu conteúdo é, basicamente, uma sequência de bytes que segue um formato muito específico. O motivo disso é eficiência: armazenar esses dados em formato binário garante que a leitura e a escrita sejam mais rápidas do que seriam em um arquivo baseado em texto, além de evitar que o arquivo fique grande demais.

Se você ler a [implementação](https://github.com/carlosschults/go-gitter/blob/f82f8612b3ad9e6b00a27eeb0ded9bf701bd7862/ggt/main.go#L176), poderá ver qual é o formato do arquivo de index. Não vou entrar em muitos detalhes aqui, mas, em linhas gerais, temos:

1. Um header, que sempre contém `DIRC` como assinatura, um número de versão e a quantidade de arquivos staged, que no meu caso está fixada em 1.
2. Uma entrada para cada arquivo staged, contendo metadados, o hash SHA-1 do arquivo e seu nome.
3. Um checksum, composto por um hash SHA-1 de todas as informações que vieram antes dele, para que o git consiga detectar corrupção no arquivo de index.

Para os campos de metadados, simplesmente deixei muita coisa fixa. Muitos desses campos não são realmente relevantes no Windows e, de qualquer forma, são usados principalmente para otimizações de performance. Em outras palavras, são algo desejável, mas não essencial, então coloquei tudo como zero para simplificar.

### Encontrei um bug
Isso é meio vergonhoso, mas enquanto escrevia este post encontrei um bug na minha implementação. Quer dizer, a implementação já estava parcialmente incompleta por design, já que atualmente consegue lidar com apenas um arquivo. Mas encontrei um bug de verdade: meu `update-index` não cria um blob object depois de fazer o hash do arquivo.

Aqui está a parte problemática do código:

```go
// append the hash
_, hash := hashData(contents, "blob")
dataToSave, err = binary.Append(dataToSave, binary.BigEndian, hash)
```

Perceba que `hashData` retorna dois valores e nós descartamos o primeiro. Esse é o problema. Em vez de descartá-lo, deveríamos ter usado esse retorno e salvado o resultado no disco como um blob, [assim como o comando `hash-object` faz](https://github.com/carlosschults/go-gitter/blob/f82f8612b3ad9e6b00a27eeb0ded9bf701bd7862/ggt/main.go#L149-L170).

Encontrei o bug enquanto fazia [rubber-ducking](https://pt.wikipedia.org/wiki/Debug_com_Pato_de_Borracha) com o Claude sobre o roadmap. Como mencionei [na primeira parte](/pt/implementando-git-em-go), não estou usando AI para gerar nenhum código desse projeto, o que também é uma das razões pelas quais isso está demorando tanto. Mas estou usando o Claude para me ajudar a planejar o roadmap, definir a sequência correta de comandos e entender como o Git funciona internamente, para que eu possa implementá-los.

Enfim, o bug está lá. O que vou fazer? Por enquanto, nada. Vou simplesmente deixá-lo anotado e voltar a ele no futuro, depois que terminar minha refatoração.

Isso é algo que mencionei brevemente no começo do post, mas, depois que o `update-index` estava mais ou menos funcionando, decidi que o próximo passo seria refatorar o código existente, que estava ficando bagunçado demais.

## Testes antes da refatoração
Olhe para o estado do [arquivo principal naquele momento da história](https://github.com/carlosschults/go-gitter/blob/f82f8612b3ad9e6b00a27eeb0ded9bf701bd7862/ggt/main.go) e você provavelmente vai concordar comigo que ele não é exatamente um exemplo de separação de responsabilidades. É um arquivo grande que mistura parsing de argumentos, dispatching de comandos e funções puras e impuras, tudo junto.

Meu plano para a refatoração tinha duas partes: primeiro, extrair todos os comandos para seus próprios arquivos, usando um parsing de argumentos adequado. Depois, separar as funções puras das impuras, para que eu pudesse testar as primeiras facilmente com unit tests.

Mas uma refatoração desse tipo é arriscada, então decidi primeiro criar integration tests que iriam:
- buildar o projeto e gerar um executável
- criar um repositório temporário para os testes
- usar o executável gerado para executar alguns comandos dentro do repositório temporário
- verificar os resultados esperados

E foi basicamente isso que fiz. Primeiro, [configurei a infraestrutura de testes](https://github.com/carlosschults/go-gitter/commit/496442c83924bd89893d36a58d86111ebc0079a8), criando uma função auxiliar que gera o executável e salva seu caminho para uso posterior, e outra que configura o repositório temporário.

Depois, o [commit seguinte](https://github.com/carlosschults/go-gitter/commit/3c0c6e260d10df68a974377c1c44534299257f86) adicionou testes para o comando `update-index`. O que estava incorreto, como você acabou de ver, mas eu não sabia disso na época e, portanto, meu teste passou.

Uma coisa interessante que aprendi sobre testes em Go é que, aparentemente, eles normalmente não usam assertions? Existem bibliotecas de terceiros que adicionam assertions, mas, se você usar apenas os recursos de testing nativos do Go, precisa fazer as verificações "manualmente". Veja um exemplo:

```go
func TestUpdateIndexAddSingleFile(t *testing.T) {
	testRepoPath := setupGitRepo(t)
	if err := os.WriteFile(filepath.Join(testRepoPath, "file.txt"), []byte("hello world"), 0666); err != nil {
		t.Fatalf("Creating the test file failed: %s", err)
	}

	cmd := exec.Command(ggtBinaryPath, "update-index", "--add", "file.txt")
	cmd.Dir = testRepoPath
	_, err := cmd.Output()
	if err != nil {
		t.Fatalf("Command failed: %s", err)
	}

	cmd = exec.Command("git", "ls-files")
	cmd.Dir = testRepoPath
	result, err := cmd.Output()
	if err != nil {
		t.Fatalf("Command failed: %s", err)
	}

	if !strings.Contains(string(result), "file.txt") {
		t.Fatalf("Test failed")
	}
}
```

No teste acima, eu executo meu comando `update-index` e, depois disso, executo o comando `ls-files` do Git de verdade e verifico se a saída contém o nome do arquivo que adicionei.
Se não contiver, eu sinalizo um erro. Se o método chegar até o final sem retornar um código de erro, significa que o teste passou.

Depois disso, continuei adicionando testes até que todos os comandos estivessem cobertos e, então, adicionei um pipeline do GitHub Actions para executar os testes a cada push ou quando um PR fosse mergeado em `main`.

## Extraindo os comandos
Para o próximo passo, eu queria extrair todos os comandos para seus próprios arquivos e usar um parsing de argumentos adequado. Depois de pesquisar um pouco, descobri que [Cobra](https://github.com/spf13/cobra) é a principal biblioteca para parsing de argumentos em Go, então decidi usá-la.

A mudança resultante foi feita em [um único commit](https://github.com/carlosschults/go-gitter/commit/9c4976fd77d3822b85d50523377694c0f275f035). A extração exigiu algumas mudanças na estrutura de pastas, mas tomei cuidado para garantir que os testes continuassem passando.

Depois disso, fiz uma limpeza no código e adicionei algumas pequenas melhorias, como um make file (porque eu continuava esquecendo como executar todos os testes) e descrições corretas para todos os comandos.

O código resultante está muito mais agradável agora. Este é o meu entry point atualmente:

```go
package main

import "github.com/carlosschults/go-gitter/cmd"

func main() {
	cmd.Execute()
}
```
E este é o arquivo do comando `init`:

```go
package cmd

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Create an empty Git repository or reinitialize an existing one",
	Run: func(cmd *cobra.Command, args []string) {
		path, _ := filepath.Abs(".git")
		standardizedPath := filepath.ToSlash(path) + "/"

		if _, err := os.Stat(".git"); err == nil {
			fmt.Println("Reinitialized existing Git repository in", standardizedPath)
			os.Exit(0)
		}

		if err := os.Mkdir(".git", os.ModePerm); err != nil {
			log.Fatal(err)
		}

		if err := os.WriteFile(".git/HEAD", []byte("ref: refs/heads/main"), 0666); err != nil {
			log.Fatal(err)
		}

		if err := os.MkdirAll(".git/objects/info", os.ModePerm); err != nil {
			log.Fatal(err)
		}

		if err := os.MkdirAll(".git/objects/pack", os.ModePerm); err != nil {
			log.Fatal(err)
		}

		if err := os.MkdirAll(".git/refs/heads", os.ModePerm); err != nil {
			log.Fatal(err)
		}

		if err := os.MkdirAll(".git/refs/tags", os.ModePerm); err != nil {
			log.Fatal(err)
		}

		fmt.Println("Initialized empty Git repository in", standardizedPath)
		os.Exit(0)
	},
}

func init() {
	rootCmd.AddCommand(initCmd)
}
```

## Quais são os próximos passos?
Ainda tem bastante trabalho pela frente.

Primeiro, quero corrigir esse bug no `update-index`. Depois, preciso terminar sua implementação. Ou seja, fazer com que ele consiga salvar qualquer quantidade de arquivos, já que atualmente só lida com um arquivo.

Depois disso, vou fazer a refatoração que mencionei anteriormente: separar as funções puras das impuras e escrever testes para as funções puras.

Só depois de terminar tudo isso vou passar para os próximos comandos: `ls-files`, depois `write-tree` e `commit-tree`, avançando finalmente em direção ao objetivo de conseguir criar um commit de verdade.

Prometo trazer atualizações com mais frequência. Por enquanto, obrigado por ler.


[^1]: Um conhecido nome na área de software e autor do livro [Refactoring](https://martinfowler.com/books/refactoring.html), entre vários outros.
[^2]: Comandos de plumbing são os comandos internos do git, que manipulam objetos no nível mais baixo. Os comandos de porcelain (de alto nível), por sua vez, chamam e orquestram os comandos de plumbing para realizar as tarefas que um usuário do git normalmente executa.
