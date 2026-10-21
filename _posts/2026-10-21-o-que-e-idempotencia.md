---
title: "O Que É Idempotência?"
ref: what-is-idempotency
lang: pt
layout: post
author: Carlos Schults
description: "Aprenda o que é idempotência em desenvolvimento de software: por que importa, equívocos comuns e como implementar"
permalink: /pt/o-que-e-idempotencia
tags:
- de-a-a-z
- idempotencia
- engenharia-de-software
- sistemas-distribuidos
- boas-praticas
---

## Introdução

Este post faz parte de uma série onde defino conceitos importantes em desenvolvimento de software. O primeiro foi sobre [breaking changes.](pt/o-que-sao-breaking-changes) Este é sobre **idempotência**.

Idempotência é um conceito chave pra qualquer desenvolvedor entender, especialmente se você trabalha com sistemas distribuídos. Apesar de ser um conceito simples, tem suas nuances, e existem errors comuns que as pessoas cometem. Você vai aprender sobre alguns deles.

E quando se trata de implementação, aí complica um pouco mais. Este post não é um guia aprofundado de implementação, mas vou falar um pouco sobre isso.

## O que é idempotência?

Da forma mais simples possível: uma operação é idempotente quando você pode executá-la várias vezes, mas os efeitos dela no estado do sistema são os mesmos que se ela tivesse sido executada apenas uma vez.

Vamos usar um exemplo fora da programação pra ilustrar. Há um tempo atrás, estava ouvindo o [episódio do Pragmatic Engineer Podcast com Sam Newman](https://www.youtube.com/watch?v=a0sZV0qIbI0)[^1]. Ele estava falando sobre resiliência em sistemas distribuídos e, quando foi pedido pra ele falar sobre idempotência, veio com uma analogia que eu achei muito legal.

Se você aperta o botão de "descer" pra chamar o elevador, ele acende. Mas se você apertar de novo, e de novo, isso não causa nenhuma mudança adicional no estado dele. Ele continua aceso. É idempotente. Já a maioria dos interruptores de luz são como uma chave. Você aperta, a luz acende. Aperta de novo, a luz apaga. Não são idempotentes.

O exemplo clássico de idempotência em programação é o processamento de pagamentos. Imagina que você tem um endpoint ou microsserviço que processa pagamentos. Se, por algum motivo, ele receber a mesma requisição duas vezes, você não deveria cobrar o cliente duas vezes. O serviço precisa ser capaz de, de alguma forma, deduplicar a requisição e realizar o efeito colateral apenas uma vez.

Idempotência, como conceito, se aplica a operações em geral. Por exemplo, comandos SQL. Um DELETE é naturalmente idempotente. Execute `DELETE FROM users WHERE id = 5`, e não existe mais nenhum usuário com id 5. Execute de novo, e ainda não existe nenhum usuário com esse id. Idempotente.

Um INSERT geralmente não é idempotente. Execute duas vezes e você vai ter duas linhas. O UPDATE pode ou não ser idempotente. Definir uma coluna para um valor específico é idempotente, enquanto incrementar com base no valor anterior não é.

```sql
UPDATE account SET balance = 4000 -- idempotente

UPDATE account SET balance = balance + 500 -- não idempotente
```


## Efeitos intencionais vs incidentais

É fundamental distinguir entre efeitos intencionais e incidentais no estado do sistema. Quando se fala de idempotência, geralmente nos preocupamos com as mudanças intencionais no estado do servidor ou sistema.

Por exemplo, o endpoint de processamento de pagamentos acima provavelmente gera entradas de log pra cada requisição. Isso é, sim, uma mudança de estado e um efeito colateral. Mas ao avaliar idempotência, logs e coisas do tipo são considerados efeitos incidentais, e nos importamos apenas com o objetivo principal da operação.


## Por que idempotência importa?

Espero que tenha ficado claro por que idempotência é desejável, depois do exemplo de pagamento. É porque requisições/mensagens podem chegar mais de uma vez, o que poderia resultar em efeitos colaterais sérios—um cartão de crédito sendo cobrado, uma entrega sendo agendada—acontecendo mais de uma vez.

Mas por que as mensagens podem ser duplicadas? Por que os sistemas não conseguem só enviar apenas uma requisição?

Vou responder com mais exemplos.

### Endpoints

Digamos que você está fazendo um POST pra um endpoint que causa um efeito colateral. Quais são alguns dos cenários possíveis?

* Você recebe um código 2xx de sucesso, com a resposta esperada. Tudo certo, vida que segue.
* Você recebe um 400 BAD REQUEST. Tem alguma coisa errada com a sua requisição, vai corrigir o código.
* 401 UNAUTHORIZED? API key inválida, token expirado, etc. Novamente, vai corrigir.

Os cenários acima são todos claros. No 2xx, você sabe com certeza que funcionou, e nos outros dois, você sabe com certeza que não funcionou e precisa corrigir alguma coisa.

Agora, digamos que você recebeu um 500 INTERNAL SERVER ERROR. Você sabe que isso significa que tem alguma coisa errada do lado deles e não tem muito o que fazer, a não ser esperar um tempo e tentar de novo. Mas você sabe com certeza se é seguro fazer o retry? O efeito colateral pode ter acontecido antes do código deles chegar no ponto onde quebrou.

E se você nunca receber nada de volta? Em algum momento a conexão vai dar timeout, e aí? Como você sabe se o efeito foi realmente realizado no servidor?

No fim das contas, quando se trata de comunicação em rede, existe uma ambiguidade intrínseca da qual você não consegue escapar. Às vezes, você simplesmente não sabe se o efeito colateral foi realizado ou não. Você tem que tentar de novo.

A consequência disso é que o endpoint que você está usando precisa ser amigável a retries. Pra ser seguro, ele deve assumir por padrão que a mesma requisição pode chegar múltiplas vezes, e então deduplicar do lado deles.


### Serviços assíncronos

Com message brokers, o problema de duplicação também pode acontecer. Se uma aplicação consumidora lê uma mensagem de uma fila ou subscription, realiza o trabalho que gera um efeito colateral, e então quebra antes de confirmar o recebimento, o broker vai entregar a mensagem de novo.

As duplicações também podem começar do lado do produtor. Imagina um endpoint que, ao receber uma requisição, adiciona alguns dados no banco de dados e depois publica um evento num message bus, para que os subscribers possam reagir.

Nesse cenário, você precisa que a escrita no banco e a publicação da mensagem sejam atômicas. Ou seja, ou as duas acontecem ou as duas falham. Do contrário, você pode acabar numa situação onde um evento aconteceu e você não avisou ninguém, ou você avisou todo mundo sobre um evento que não aconteceu.[^2]

Uma das abordagens mais conhecidas pra resolver isso é o outbox pattern. Basicamente, você adiciona uma linha tanto na tabela de negócio quanto numa tabela de outbox (caixa de saída), numa única transação. Um worker service então processa a tabela de outbox, publicando suas linhas como mensagens e marcando elas como processadas.

Mas e se o worker publicar a mensagem no bus e então falhar antes de marcar a linha como processada? Ele vai tentar de novo mais tarde e publicar a mesma mensagem outra vez.

Então, como você pode ver, a ambiguidade intrínseca da comunicação em rede torna a garantia de entrega exatamente-uma-vez geralmente fora de alcance. Ao implementar o outbox pattern e garantir que os serviços consumidores sejam idempotentes, garantimos um processamento efetivamente-uma-vez, que ainda assim é uma garantia bastante poderosa.

## Equívocos comuns

É relativamente fácil confundir idempotência com outros conceitos, especialmente quando você está aprendendo sobre o tema. Também não ajuda quando as pessoas usam o termo como se fosse intercambiável com termos como "seguro", "somente leitura", etc., mesmo sabendo que não é. Difusão semântica é uma coisa real, afinal.[^3]

Vamos esclarecer alguns desses equívocos agora.

### Idempotente != Seguro

Primeiramente, "seguro" aqui significa algo que não causa efeitos no estado do sistema. É importante pontuar que estamos falando apenas dos efeitos que o chamador se importa. Ainda podem existir mudanças incidentais, como geração de logs. Mas o chamador provavelmente não sabe e não se importa com esses efeitos, e do ponto de vista dele a chamada é essencialmente de somente leitura.

As pessoas frequentemente usam idempotente quando querem dizer seguro, o que não é preciso.

Nem todas as operações idempotentes são seguras. Criar/atualizar/deletar um recurso, solicitar um processamento de pagamento, agendar uma entrega—tudo isso causa um efeito observável no estado do sistema. Não são seguras, mas poderiam ser idempotentes, se implementadas assim.

No entanto, todas as operações seguras são por definição idempotentes.

### Idempotente != "A resposta é sempre a mesma"

Se você executa um DELETE pra deletar o usuário com id 5, vai receber de volta algo como "1 linha afetada", dependendo do seu banco de dados relacional e cliente. Se você executar o mesmo DELETE de novo, vai receber "0 linhas afetadas", o que faz sentido.

O mesmo vale ao usar o método DELETE num endpoint REST. Na primeira vez, você realmente deleta o recurso e recebe de volta, tipicamente, um 204 No Content. E na segunda vez? Os designers de APIs nem sempre concordam, mas seria razoável retornar 404 Not Found. Porque agora o recurso não existe mais, então 404 faz sentido semântico.

Tanto o comando SQL quanto o endpoint da API são perfeitamente idempotentes se considerarmos idempotência como sendo sobre mudanças de estado. O fato de eles retornarem respostas diferentes não muda isso.

### O verbo HTTP não garante idempotência

Você pode encontrar pessoas equiparando certos verbos/métodos HTTP com idempotência ou não-idempotência. "GET é sempre seguro e idempotente", "POST nunca é idempotente", e por aí vai. As coisas são mais complicadas do que isso.

Pra esclarecer equívocos, eu sempre prefiro ir à fonte mais autoritativa que consigo encontrar sobre o assunto. Com relação à semântica dos métodos HTTP, essa fonte é a RFC 9110.[^4]

Veja o que o documento diz sobre métodos seguros:

> Request methods are considered "safe" if their defined semantics are essentially read-only; i.e., the client does not request, and does not expect, any state change on the origin server as a result of applying a safe method to a target resource. Likewise, reasonable use of a safe method is not expected to cause any harm, loss of property, or unusual burden on the origin server.

Em tradução livre:

> Métodos de requisição são considerados "seguros" se sua semântica definida é essencialmente de somente leitura; ou seja, o cliente não solicita, e não espera, nenhuma mudança de estado no servidor de origem como resultado de aplicar um método seguro a um recurso alvo. Da mesma forma, o uso razoável de um método seguro não deve causar nenhum dano, perda de propriedade ou sobrecarga incomum no servidor de origem.

Alguns parágrafos abaixo, o documento diz que os métodos GET, HEAD, OPTIONS e TRACE são seguros.

Veja o que ele diz sobre os métodos idempotentes:

> A request method is considered "idempotent" if the intended effect on the server of multiple identical requests with that method is the same as the effect for a single such request. Of the request methods defined by this specification, PUT, DELETE, and safe request methods are idempotent.

Em tradução livre:

> Um método de requisição é considerado "idempotente" se o efeito pretendido no servidor de múltiplas requisições idênticas com esse método é o mesmo que o efeito de uma única requisição. Dos métodos de requisição definidos por esta especificação, PUT, DELETE e os métodos de requisição seguros são idempotentes.

Essas afirmações não significam que esses métodos são idempotentes e/ou seguros automaticamente. Nada impede você de escrever um endpoint GET que muta estado, ou um DELETE que, digamos, deleta recursos aleatórios além do que você pretendia deletar. Fazer essas coisas seria terrível, mas não é como se a polícia do REST fosse te prender.

A semântica HTTP definida pela RFC é sobre os resultados pretendidos do uso desses métodos. O desenvolvedor ainda precisa ser responsável por implementá-los corretamente. A RFC inclusive vai além e diz:

> This definition of safe methods does not prevent an implementation from including behavior that is potentially harmful, that is not entirely read-only, or that causes side effects while invoking a safe method.

Em tradução livre:

> Esta definição de métodos seguros não impede que uma implementação inclua comportamento potencialmente prejudicial, que não seja totalmente de somente leitura, ou que cause efeitos colaterais ao invocar um método seguro.

E o oposto também é verdade. Pela RFC, POST não é considerado um método idempotente. Mas você pode torná-lo idempotente e comunicar isso claramente aos seus usuários, pra que saibam que aquela operação é amigável a re-tentativas.


## Como implementar idempotência

Leitores mais atentos terão notado que eu venho falando sobre "a mesma requisição" sem definir o que isso significa. Além disso, quando falei sobre microsserviços e o outbox pattern, disse que os consumidores precisam conseguir lidar com requisições duplicadas, sem nunca explicar como eles detectam uma duplicação.

Voltando ao exemplo original de processamento de pagamentos: como distinguir entre uma requisição duplicada ou um cliente legitimamente fazendo uma nova compra com o mesmo valor?

A solução típica pra isso é uma chave de idempotência. É um id único que o cliente/chamador gera e anexa a cada requisição. Se uma requisição precisar ser reenviada, a mesma chave de idempotência é usada.

Quando o endpoint recebe uma requisição, o código verifica no banco de dados se aquela chave específica já foi processada.

Se não foi, a aplicação processa o pagamento e retorna a resposta apropriada. Mas se a chave já foi processada, o código não processa o pagamento de novo. Dessa forma, do ponto de vista do chamador, o processo simplesmente funciona, de forma transparente, independentemente de ser a primeira ou a enésima vez que a mesma requisição está sendo processada.

Para facilitar a vida do chamador, muitas implementações armazenam e reproduzem a resposta original exata. Pense nessa prática como uma "cortesia" ao chamador: facilita a vida dele, mas não é um requisito para tornar algo idempotente.


## Conclusão

Esta foi uma introdução rápida à idempotência. Aqui estão os principais pontos que gostaria que você lembrasse:

* Uma operação é idempotente quando você pode executá-la mais de uma vez, e os efeitos intencionais no estado serão os mesmos que se ela tivesse sido executada apenas uma vez
* Idempotência é necessária pra tornar operações amigáveis a re-tentativas, já que você frequentemente se encontra em situações onde gostaria de tentar de novo, mas o efeito colateral pretendido pode já ter acontecido
* Métodos HTTP não garantem idempotência. Isso é algo que o desenvolvedor precisa implementar por conta própria
* Entrega exatamente-uma-vez é tipicamente impossível de alcançar num cenário distribuído, mas com chaves de idempotência e consumidores idempotentes, você pode alcançar um processamento efetivamente-uma-vez
* Existem operações que são "naturalmente" idempotentes, como os DELETEs, enquanto outras podem ser tornadas idempotentes se você assim escolher

Também expliquei brevemente a implementação de idempotência para código backend. Foi bem simplificado, então não assuma que o que você viu aqui está pronto para produção. Aqui está uma lista dos principais pontos que ficaram de fora:

* O que fazer com uma requisição com uma chave já usada, mas payload diferente?
* Como lidar com race conditions com duas requisições concorrentes?
* E se a aplicação travar no meio da requisição?

Felizmente, esses tópicos são bem documentados online. Em particular, procure pelos [artigos da Stripe sobre idempotência](https://stripe.com/blog/idempotency). A Stripe é uma das principais processadoras de pagamento e a implementação deles tem sido considerada a referência da indústria há um bom tempo.

Obrigado por ler.


[^1]: Sam Newman é um líder na área de serviços distribuídos, autor do livro [Building Microservices](https://samnewman.io/books/building_microservices_2nd_edition/), entre outros.
[^2]: Esse problema é conhecido como o problema do dual write. Ou seja, como escrever em dois alvos independentes—um banco de dados e um message bus, no nosso exemplo—de forma atômica.
[^3]: "Difusão semântica" é o fenômeno de jargões/termos perderem seu significado com o tempo. Martin Fowler [escreveu sobre isso](https://martinfowler.com/bliki/SemanticDiffusion.html).
[^4]: RFC significa "Request for Comments", um tipo de publicação da Internet Engineering Task Force (IETF) que define padrões e protocolos para a internet. A [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html) cobre especificamente a semântica HTTP.
