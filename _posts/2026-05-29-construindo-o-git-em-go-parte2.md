---
title: "Construindo o git em Go do zero - Parte 2"
ref: building-git-in-go-part2
lang: pt
layout: post
author: Carlos Schults
description: "Esta é minha segunda atualização sobre a jornada de construir o git"
permalink: /pt/construindo-git-em-go-parte2
tags:
- projetos
- git
- go
- go-gitter
- controle-de-versao
---

Bem-vindo de volta à minha jornada de construir o git do zero em Go, com o objetivo de aprender mais sobre os dois. Se você não sabe do que estou falando, leia [o primeiro post](/pt/implementando-git-em-go).

## Já faz um tempo

Eu postei o primeiro post em 9 de março. O que eu fiquei fazendo, e por que demorei tanto para continuar a série?

A resposta é o que você provavelmente já sabe: eu sou um adulto ocupado e não tenho muito tempo. Além disso, outros projetos pessoais também demandam atenção.

Mas chega de desculpa. Vamos falar sobre o que consegui implementar desde a última atualização.

## Comandos Plumbing vs Porcelain

Antes de entrar em detalhes sobre o que implementei, preciso falar rapidinho sobre uma distinção que existe entre os comandos do git.

Quando você pensa em comandos do git, o que provavelmente vem à mente são coisas como `git add`, `git init`, `git log`, `git status`, e por aí vai. E mesmo isso só vale se você realmente usa a linha de comando. Muita gente usa interfaces gráficas para tudo e nunca aprende nem os comandos básicos.

Esses são os chamados comandos "porcelain". São os comandos de alto nível, voltados para os usuários finais do git, como você e eu.

Existe outra camada de comandos, conhecida como comandos "plumbing". Os comandos plumbing são os de baixo nível, que realizam a manipulação de dados que permite aos comandos de alto nível fazer o seu trabalho.

Recentemente, estive implementando alguns desses comandos plumbing que servem de fundação para grande parte do que o git faz. São eles: `hash-object` e `cat-file`.

## Entendendo o `hash-object` e o `cat-file`

Vou falar rapidamente sobre o que esses comandos fazem antes de contar minha experiência. O `hash-object` é o comando usado para salvar dados como um blob (binary large object) dentro de um repositório git. Você passa um texto para o comando, ele salva um objeto com aquela informação e te devolve um hash SHA1.

O `cat-file` faz o oposto. Você passa um hash de objeto e ele retorna o conteúdo (ou o tamanho, ou o tipo, dependendo de como você o chama).

### Calculando o hash do seu primeiro objeto

Quer testar? Execute o seguinte comando:

```bash
echo hi | git hash-object --stdin
```

Você deverá ver exatamente este hash como resultado: `45b983be36b73c0788dc9cbcb76cbb80fc7bb057`.

{% capture content %}
Se você está no Linux ou em outro sistema Unix, você provavelmente viu  o resultado acima. O mesmo vale para Windows usando o Git Bash. Mas se você está no Windows usando o prompt de comando ou o PowerShell, o resultado provavelmente foi diferente. Isso acontece por causa das diferenças de terminadores de linha entre os sistemas.
{% endcapture %}
{% include callout.html type="info" title="Info" content=content %}

O que aconteceu aqui é que o git calculou um hash para a string "hi" e o retornou para você. Usamos a flag `--stdin` para poder passar o conteúdo pela entrada padrão.

Porém, nada foi salvo em disco. Para de fato gravar os dados, você precisa usar uma versão diferente do comando, e desta vez dentro de um repositório.

### Salvando um objeto

Vá para algum lugar, crie uma nova pasta e inicialize um repositório nela:

```bash
mkdir testing-commands
cd testing-commands
git init
```

Pronto. Agora você pode fazer o seguinte:

```bash
echo hi | git hash-object -w --stdin
```

O comando é parecido com o anterior, mas repare na flag extra `-w`. Ela significa **write** (escrever) e é o que faz o git salvar o conteúdo em um arquivo. Você ainda receberá o hash SHA1 como resposta, igual a antes, mas agora um novo objeto blob foi salvo em algum lugar. Quer ver?

Vá até a pasta onde o repositório foi criado, dentro de `testing-commands`. Use um explorador de arquivos, não a linha de comando. Ative as configurações necessárias para visualizar pastas e arquivos ocultos. Você verá uma pasta `.git`:

Entre nessa pasta e você verá basicamente esta estrutura:

```
├───hooks
├───info
├───objects   
└───refs
- config
- description
- HEAD
```

`config`, `description` e `HEAD` são arquivos; os outros são pastas. Entre na pasta `objects`. Você provavelmente vai encontrar as pastas `info` e `pack` lá. Elas não importam pra gente.

O que nos interessa aqui é uma pasta cujo nome tem dois caracteres. Se você executou os comandos acima no Linux ou no Git Bash do Windows, ela deve ser `45`. Caso contrário, deve começar com os dois primeiros caracteres do hash que você recebeu ao rodar `echo hi | git hash-object -w --stdin`.

Entre nessa pasta. Dentro, você vai encontrar um arquivo cujo nome é formado pelo restante dos caracteres do hash. No meu caso, vejo `b983be36b73c0788dc9cbcb76cbb80fc7bb057`.

**Esse é o seu blob.** Esse arquivo é o objeto que o git salvou quando você executou o comando `hash-object` com a flag `-w`.

### Lendo objetos de volta

Tente abrir o arquivo do blob no seu editor de texto favorito. O arquivo abre normalmente, mas o conteúdo é puro lixo que não dá pra ler. Isso porque ele está em formato binário comprimido, não em texto puro.

O que o git faz, em sequência, é o seguinte:

1. Cria um cabeçalho concatenando a palavra "blob", um espaço e o tamanho do conteúdo em bytes. Por exemplo, `blob 2`.
2. Concatena isso com um [caractere nulo](https://pt.wikipedia.org/wiki/Caractere_nulo).
3. Concatena o conteúdo real em seguida. No nosso exemplo, "hi".
4. Gera o SHA1 da string completa.
5. Se você não usou a flag `-w`, o git retorna o SHA1 e para por aí.
6. Caso tenha usado a flag `-w`, o git comprime a string completa (cabeçalho + byte nulo + conteúdo).
7. Pega os dois primeiros caracteres do hash SHA1 e cria um diretório com esse nome dentro de `objects`.
8. Por fim, cria um arquivo dentro dessa pasta, com o nome formado pelos caracteres restantes do hash SHA1, e grava nesse arquivo o conteúdo comprimido com zlib.

Para ler esses dados de volta, você usa o comando `cat-file` com uma de suas flags. Para ler o conteúdo, use `cat-file -p`, onde `-p` significa "pretty print":

```bash
git cat-file -p 45b983be36b73c0788dc9cbcb76cbb80fc7bb057
```

Ao executar o comando acima, você recebe "hi" de volta. Você também pode usar a flag `-t` para obter o tipo do objeto, ou `-s` para retornar seu tamanho em bytes:

```bash
git cat-file -t 45b983be36b73c0788dc9cbcb76cbb80fc7bb057
blob

git cat-file -s 45b983be36b73c0788dc9cbcb76cbb80fc7bb057
3
```

## Implementação no Go-Gitter

Agora que você entende o que esses dois comandos fazem, vamos falar sobre como os implementei no `go-gitter`, começando pelo `hash-object`.

### Implementando o `hash-object`

Meu primeiro passo foi implementar a versão mais básica do `hash-object`, sem a flag `-w`. O comando conseguiria exibir o hash SHA1 de um texto passado como argumento, mas ainda sem salvar nada em disco.

Como você pode ver no [commit](https://github.com/carlosschults/go-gitter/commit/3ae9cc58f32059cda6091aa27dbab4507cebbca7), o código está longe de ser um exemplo de código limpo. Ele mistura o parsing de argumentos com a lógica real no mesmo arquivo. Naquele ponto, eu ainda nem tinha criado funções separadas para cada comando, mas fiz isso depois.

A parte do código que realiza o hash em si acabou sendo bem simples, assim que entendi qual deveria ser o formato:

```go
size := len(data)
header := fmt.Sprintf("blob %s%c", strconv.Itoa(size), 0)
content := header + string(data)
hash := sha1.New()
hash.Write([]byte(content))
hashedData := hash.Sum(nil)
hashedString := hex.EncodeToString(hashedData)
fmt.Println(hashedString)
```

Como você pode ver, criamos o cabeçalho concatenando a palavra "blob" mais um espaço com o tamanho do conteúdo e depois o caractere nulo, representado aqui pelo inteiro zero. Em seguida, hasheamos tudo, codificamos como string e imprimimos.

Precisei pesquisar um pouco para encontrar as bibliotecas necessárias e a sintaxe do Go, já que as regras que eu criei pra mim proíbem o uso de LLMs para geração de código, mas acabou dando certo.

No [commit seguinte](https://github.com/carlosschults/go-gitter/commit/8b08cb93545f3966b1485989ce67501e1a5ff3ba), adicionei suporte à flag `-w`. Nesse ponto, como você pode ver, criei uma função para o comando.

A diferença não é grande. O que acrescentei foi um parsing de argumentos bem simples para identificar se o conteúdo deve ser gravado em disco.

Então, o código que efetivamente faz a gravação:

```go
if saveFile {
	// cria o diretório para o blob
	if err := os.Mkdir(".git/objects/"+folderName, os.ModePerm); err != nil {
		log.Fatal(err)
		os.Exit(1)
	}

	// comprime o conteúdo com zlib e salva o arquivo
	var buffer bytes.Buffer
	w := zlib.NewWriter(&buffer)
	w.Write([]byte(content))
	w.Close()
	if err := os.WriteFile(".git/objects/"+folderName+"/"+fileName, buffer.Bytes(), 0666); err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
}
```

Demorei um pouco para acertar. Em grande parte porque, em determinado momento, eu estava entendendo completamente errado o que o git faz. Achei que deveria comprimir e salvar o _hash_ que calculei. Sim, eu sei, não faz sentido nenhum, mas o que posso dizer?

Depois que entendi o fluxo correto, fazer funcionar foi principalmente uma questão de descobrir como usar a compressão zlib. O Google e a documentação resolveram, como nos bons tempos.

### Implementando o `cat-file`

O `cat-file` foi mais fácil de implementar, porque é essencialmente o caminho inverso. A partir de um hash, localizar o arquivo correspondente, descomprimir o arquivo e ler o conteúdo.

Desta vez, criei uma função dedicada para o novo comando desde o início, como pode ser visto no [primeiro commit](https://github.com/carlosschults/go-gitter/commit/81c9f03e1ca76a483335876b42637833f8a0a524). Esse commit implementa apenas a flag `-p`.

Abaixo está uma versão resumida do código desse commit, sem o boilerplate da função e também sem o tratamento de erros:

```go
folderName := h[0:2]
fileName := h[2:]
fullPath := filepath.Join(".git/objects", folderName, fileName)

var contents []byte
var err error
contents, err = os.ReadFile(fullPath)

r, err := zlib.NewReader(bytes.NewReader(contents))

buf := new(strings.Builder)
_, err = io.Copy(buf, r)

uncompressedContents := buf.String()
contentsWithoutHeader := strings.Split(uncompressedContents, "\x00")[1]
r.Close()
fmt.Println(contentsWithoutHeader)
```

A variável `h` é o SHA1 recebido pelo comando. A partir dela, extraímos o nome do diretório e do arquivo, que usamos para montar o caminho completo, ler o conteúdo do arquivo e descomprimi-lo.

Por fim, faço um split da string pelo caractere nulo e retorno a segunda parte, que é tudo o que vem depois do cabeçalho.

O [commit seguinte](https://github.com/carlosschults/go-gitter/commit/56d10d3cb2ad0baa217a357b8f5d204eb5970620) implementa as flags restantes. Não vou percorrer linha por linha, já que a parte importante é bem simples:

```go
parts := strings.Split(uncompressedContents, "\x00")
flag := arguments[2]
var result string

switch flag {
case "-p":
    result = parts[1]
case "-t":
    result = strings.Fields(parts[0])[0]
case "-s":
    result = strings.Fields(parts[0])[1]
}
```

Para os programadores Go que estão lendo isso: eu sei que esse código não seja o mais bonito e idiomático que você já viu, e prometo que, conforme for aprendendo mais sobre a linguagem, vou refatorar. A prioridade no momento era fazer funcionar.

## O que aprendi até agora

O objetivo deste projeto é aprender a linguagem Go e também mais sobre a implementação do Git. Então, o que aprendi sobre os dois ao completar esses dois comandos?

Primeiro, o lado do Git. Posso dizer que me surpreendeu a simplicidade com que o git salva objetos. É realmente só o tipo do objeto, um espaço, o tamanho, um caractere nulo como delimitador e o conteúdo. Eu entendia, em alto nível, como o git armazenava objetos, mas implementar de fato me deu uma nova apreciação pela simplicidade e elegância do design.

E sobre o lado do Go? De maneira geral, estou gostando muito. Eu gosto da legibilidade da linguagem. Acho que até alguém com zero experiência em Go conseguiria ler este código e ao menos entender a essência, desde que já seja programador.

Gosto também do fato de Go ser opinativo. Por exemplo, se você tem um `if`, precisa usar as chaves. Do contrário, o código não compila. Isso elimina mais uma coisa para os programadores brigarem, reuniões sobre padrões de código, regras de linter. Simplifica a vida.

Um aspecto que não gosto é o tratamento de erros. Ter aqueles `if` verificando `err` em todo lugar polui o código. Em C#/.NET, quando ocorre um erro que deveria ser absolutamente impossível, eu só deixo a exceção subir até o middleware de tratamento de exceções no nível mais alto, onde ela é logada e o usuário recebe uma mensagem com o nível adequado de detalhes.

Talvez exista alguma forma idiomática de fazer algo assim em Go também, mas por enquanto não conheço. Fora isso, estou gostando muito da linguagem.

## O que vem a seguir?

Para o próximo passo vou implementar outro comando plumbing chamado [update-index](https://git-scm.com/docs/git-update-index). Ele é necessário para eu poder stagear mudanças e eventualmente fazer commits.

Se quiser experimentar o `go-gitter`, instale assim:

```bash
go install github.com/carlosschults/go-gitter/ggt@latest
```

Depois é só usar os comandos assim:

```bash
echo hi | ggt hash-object --stdin
ggt cat-file -p 45b983be36b73c0788dc9cbcb76cbb80fc7bb057
```

Você deve conseguir fazer o hash de algo com o git de verdade e ler com o go-gitter, e vice-versa.

Obrigado por ler, e até a próxima atualização.