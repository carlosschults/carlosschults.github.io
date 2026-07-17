---
title: "4 Erros Comuns Com Data e Hora no C# — E como evitá-los"
ref: 4dtmistakes
lang: pt
layout: post
author: Carlos Schults
description: Neste post eu mostro quatro erros que programadores C# cometem com frequência ao lidar com tempo, e também ensino como se livrar deles.
permalink: /pt/4-erros-comuns-datetime-csharp/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1531165684/4-datetime-mistakes-1038x437_nm6csc.jpg
tags:
- csharp
- boas-praticas
- tempo
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1531165684/4-datetime-mistakes-1038x437_nm6csc.jpg)

*NOTA: Eu escrevi este post originalmente para o blog da SubMain.  Você pode [conferir o original no site deles, em inglês](https://blog.submain.com/4-common-datetime-mistakes-c-avoid/). Enquanto estiver por lá, dê uma conferida no CodeIt.Right, uma ferramenta que pode lhe ajudar com problemas relacionados a tempo e muitos outros.*

Você se lembra daqueles posts no estilo "inverdades que programadores acreditam sobre _X_" que ficaram bastante populares em blogs de software há alguns anos? O primeiro foi sobre [nomes](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/), mas logo apareceram vários outros, cobrindo tópicos como [endereços](https://www.mjt.me.uk/posts/falsehoods-programmers-believe-about-addresses/), [geografia](https://wiesmann.codiferes.net/wordpress/?p=15187&lang=en) e [compras online](https://wiesmann.codiferes.net/wordpress/?p=22201).

O meu favorito era [o post sobre tempo](https://infiniteundo.com/post/25326999628/falsehoods-programmers-believe-about-time). Até esse ponto, eu não havia pensado profundamente sobre tempo e e suas intricacies, e eu fiquei intrigado em saber que um domínio tão fundamental pudesse ser um terreno tão fértil para bugs e confusões.

Agora, mesmo eu tendo gostado do post, eu vejo um problema com ele: o post lista vários suposições erradas, e basicamente para por aí. Quem lê o artigo provavelmente termina se perguntando:

*   Por que essas suposições são falsas?
*   Qual é a probabilidade de eu me dar mal por causa dessas inverdades?
*   Qual é a maneira adequada de lidar com esses problemas?

O artigo é interessante, mas eu acho que faria sentido oferecer informações um pouco mais acionáveis.

E é exatamente esse é o objetivo do post de hoje. Eu vou mostrar 4 erros comuns que as pessoas cometem ao lidar com tempo em C#/.NET. E não para por aí. Eu também vou mostrar o que você deve fazer para evitar esses erros e tornar seu código mais seguro e mais fácil de ser compreendido.

## 1. Calculando Durações de Maneira Ingênua

Considere o código abaixo:

<script src="https://gist.github.com/carlosschults/3e18612b9a9238382b6d4fa3c574a231.js"></script>

Ele funciona corretamente? Depende de onde e quando ele será executado.

Quando você usa `DateTime.Now`, o valor que você obtém representa a data e hora locais em relação à máquina atual (ou seja, a propriedade `Kind` está configurada para `Local`).

Se o lugar que você mora observa Horário de Verão, então você sabe que existe um dia do ano no qual você deve adiantar os relógios em uma certa medida (geralmente 1 hora, embora existam lugares que ajustam por outras quantidades). E é claro, existe também um dia no qual o oposto acontece.

Agora imagine o que seguinte: hoje é 12 de março de 2017, e você more na cidade de Nova York. Você começa a usar o programa acima. O método `StartMatch()` é executado exatamente às 13h. Uma hora e quinze minutos mais tarde, o método `EndMatch` é executado. O cálculo é realizado e o texto abaixo é exibido:

_Duration of the match: 00:02:15_

Eu imagino que você compreendeu o que aconteceu aqui: quando os relógios estavam prestes a marcar 14h, o Horário de Verão entrou em efeito, movendo-os diretamente para 15h. Então o método `EndMatch` recuperou o horário atual, somando uma hora adicional ao cálculo. Se o experimento tivesse acontecido no fim do Horário de Verão, o resultado seria apenas 15 minutos!

Sim, o código mostrado é apenas um exemplo, uma brincadeira. Mas e se fosse algo mais sério? Uma aplicação de folha de pagamento, digamos. Você gostaria de pagar o valor errado a um funcionário?

### O que fazer?

Quando precisar calcular a duração de atividades humanas, use UTC para os tempos de início e fim. Dessa forma, você será capaz de **referenciar de maneira não ambígua um ponto específico no tempo**. Ao invés de usar a propriedade `Now`, use `UtcNow` para recuperar a data e hora já em formato UTC para realizar os cálculos:

<script src="https://gist.github.com/carlosschults/82492845edaa8f8fc16c646ed2bbcf2a.js"></script>

Mas e se os valores `DateTime` que você tem já são do tipo `Local`? Nesse caso, você deve usar o método `ToUniversalTime()` para convertê-los para UTC:

<script src="https://gist.github.com/carlosschults/58837695af07386836753ef6541233aa.js"></script>

### Uma Rápida Advertência Sobre `ToUniversalTime()`

O uso do método `ToUniversalTime()` - e seu irmão, `ToLocalTime()` - pode ser um pouco chato. O problema é que esses métodos fazem suposições sobre o que você quer baseados no valor da propriedade `Kind` do objeto datetime que você tem, o que pode trazer resultados inesperados.

Ao chamar `ToUniversalTime()`, uma das seguintes coisas vai acontecer:

* Se `Kind` estiver configurado como UTC, o mesmo valor é retornado.
* Por outro lado, se estiver configurado como `Local`, então o valor correspondente em UTC é retornado.
* Finalmente, se `Kind` estiver como `Unspecified`, **então é assumido que o objeto sempre teve a intenção de ser local,**, e você recebe o valor correspondente à conversão para UTC.

O problema aqui é que [valores de data/hora locais não não "transportáveis"](https://codeofmatt.com/2013/04/25/the-case-against-datetime-now/#localkindsdontroundtrip). Como assim? Eles são locais enquanto eles permanecerem no contexto da máquina atual. Se você salva um datetime local para um banco de dados e depois o recupera de lá, a informação de que ele é local se perde: agora ele é `Unspecified`.

Assim, o seguinte cenário pode acontecer:

*   Você recupera a data e hora atuais usando `DateTime.UtcNow`.
*   Você salva esse valor no banco de dados.
*   Outra parte do código recupera esse valor. Sem estar ciente de que o valor já está em UTC, chama o método `ToUniversalTime()` na instância.
*   Como o valor recuperado do banco possui o tipo `Unspecified`, o método vai tratá-lo como local e realizar uma conversão desnecessária, gerando um valor errado.

Como evitar que isso aconteça? Uma prática recomendada é usar UTC para armazenar o tempo em que um evento aconteceu. Minha sugestão é seguir esse conselho e também esse fato bem explícito. Coloque o sufixo "UTC" em cada coluna de tabela no banco de dados e também em nomes de propriedades que se referem a um valor em UTC. Ao invés de "Inclusao", use "InclusaoUTC" e assim por diante. Não é tão bonito, mas com certeza é mais claro.

## 2. Não Usar UTC Quando Deveria (e vice-versa)

Nós podemos definir isso como uma regra universal: use UTC para registrar quando eventos aconteceram. Ao logar, auditar, e registrar todo tipo de _timestamps_ na sua aplicação, UTC é a resposta.

Então, é só usar UTC em todo lugar! Certo? Não, não tão rápido.

Digamos que você precisa ser capaz de reconstruir o tempo local - na perspectiva do usuário - de quando algo aconteceu, e a única informação que você tem é um _timestamp_ em UTC. Mal dia.

Em casos assim, faria mais sentido (a) registrar o momento em UTC e gravar também o fuso horário do usuário ou (b) usar o tipo `DateTimeOffset`, que armazena a data/hora local junto com o deslocamento, ou _offset_, para UTC, permitindo que você reconstrua o valor em UTC quando precisar.

Outro caso de uso comum para o qual UTC não é a solução correta é  [o agendamento de eventos locais no futuro](https://stackoverflow.com/questions/19626177/how-to-store-repeating-dates-keeping-in-mind-daylight-savings-time?noredirect=1&lq=1). Você não quer que seu alarme acorde você uma hora mais cedo ou uma hora mais tarde nos dias de transição do Horário de Verão, certo? Pois é exatamente isso que aconteceria se você configurasse o seu alarme pelo horário UTC.

## 3. Não Validar Entrada dos Usuários

Imagine que você criou uma aplicação desktop simples que permite que usuários configurem lembretes. A pessoa informa a data e hora que quer receber o lembrete, clica em um botão, e pronto.

Tudo parece estar funcionando direito até que alguém do Brasil envia um e-mail para você, reclamando que o lembrete que ela configurou para 15 de outubro às 0h15 não funcionou. O que será que aconteceu?

### O Horário de Verão Contra Ataca

O vilão aqui é o bom e velho Horário de Verão novamente. Em 2017, o Horário de Verão no Brasil começou à meia-noite do dia 15 de outubro. Então, a combinação de data e hora que a usuária informou **simplesmente não existe em seu fuso-horário!**

É claro que o problema oposto também é possível. Quando o Horário de Verão chega ao fim e os relógios são atrasados, isso **gera horas ambíguas**.

### Qual É A Solução?

Como lidar com esse tipo de problema no C#? A classe `TimeZoneInfo` pode lhe salvar. Ela serve para representar um fuso horário e também oferece métodos para verificar se um determinado objeto `DateTime` é válido:

<script src="https://gist.github.com/carlosschults/2b94d57390b3518294730c01003f159c.js"></script>

Mas o que fazer então? O que deveria substituir os comentários "do something" nos trechos acima?

Você poderia mostrar uma mensagem dizendo que a data informada é inválida. Ou você poderia escolher outra data para a pessoa automaticamente.

Vamos abordar o caso das horas inválidas primeiro. Suas opções são: mover para frente ou para trás. É uma decisão meio arbitrária, então qual você deve escolher? Por exemplo, o app do Google Calendar no Android move para frente. E até que faz sentido se você parar pra pensar. Isso é exatamente o que seus relógios fizeram devido ao horário de verão. Por que sua aplicação não pode fazer o mesmo?

E no caso das horas ambíguas? Você também tem duas opções: escolher entre a primeira e segunda ocorrências. Novamente, é meio arbitrário, mas eu aconselho você a escolher a primeira ocorrência, pelo simples fato de tornar as coisas mais simples.

## 4. Confundir um _Offset_  com um Fuso Horário

Considere o timestamp a seguir: 1995-07-14T13:05:00.0000000-03:00. Quando alguém pergunta o que o "-03:00" no final é chamado, muita gente responde "o fuso horário".

A questão é essa. Essas pessoas provavelmente assumem corretamente que o número representa o offset, ou deslocamento, em relação a UTC. Também é provável que elas sabem que podem reconstruir a hora correspondente em UTC por meio desse offset. (Muitos desenvolvedores não entendem que, em uma string assim, o offset já está aplicado: para obter o tempo em UTC, você deve inverter o sinal do offset. E só depois, aplicá-lo ao valor da hora).

O erro está em achar que o offset é a única informação que um fuso horário representa. Mas não é. Um fuso horário é uma área geográfica, e contém muitas informações, tais como:

*   Um ou mais offsets. (Horário de verão existe, afinal de contas.)
*   As datas nas quais as transições do horário de verão acontecem. (As quais podem mudar e mudam, sempre que os políticos resolvem).
*   A quantidade de tempo pelo qual os relógios são atrasados ou adiantados na transição. (Não é uma hora em todo lugar.)
*   O registro histórico das mudanças nas regras acima.

Em resumo: não tente adivinhar um fuso horário pelo offset. Você vai errar a maioria das vezes.

## Quer aprender sobre tempo? Já não era sem tempo!

Esta lista não é de forma alguma exausitiva. Eu apenas quis oferecer a vocês uma introdução ao fascinante e meio bizarro mundo dos problemas com hora e data em programação. Há muitos recursos valiosos por aí, como[a tag time zone no Stack Overflow](https://stackoverflow.com/tags/timezone/info) ou blogs como [o de Jon Skeet](https://codeblog.jonskeet.uk/) e [o de Matt Johnson](https://codeofmatt.com/) que são autores da popular biblioteca NodaTime.

E finalmente, sempre use as ferramentas que estão à sua disposição. Por exemplo, [o produto da SubMain chamado CodeIt.Right](https://blog.submain.com/codeit-right-rules-explained-part-2/) tem uma regra que você a especificar um `IFormatProvider` em situações nas quais é opcional, o que pode acabar salvando você de bugs difíceis ao fazer tratamento de datas.
