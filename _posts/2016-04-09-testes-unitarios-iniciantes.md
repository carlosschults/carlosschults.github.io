---
title: Testes unitários para iniciantes - Parte 1
permalink: /pt/testes-unitarios-iniciantes-parte1
lang: pt
ref: unit1
layout: post
author: Carlos Schults
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1459979937/testes-unitarios-iniciantes-min_povcse.png
tags:
- csharp
- iniciantes
- testes-de-software
- testes-unitarios
- testes-automatizados
- metodologias-ageis
- serie-testes-unitarios
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1459979937/testes-unitarios-iniciantes-min_povcse.png)

Você já deve ter trabalhado em um sistema assim: incrivelmente complexo, com uma base de código gigantesca, mal documentada, cheia de gambiarras, acoplamentos desnecessários, com arquitetura confusa, especificações inexistentes, onde era quase considerado um milagre que o software chegasse a funcionar. Talvez eu tenha acabado de descrever seu projeto atual!
<!--more-->

*Este post faz parte de uma série. [Veja os outros artigos.](http://carlosschults.net/tag_ptbr/serie-testes-unitarios/)*

Nesse tipo de projeto, é comum que os desenvolvedores fiquem com receio de mexer no código, pois sabem que, inevitavelmente, algo vai quebrar. E provavelmente, o erro só vai ser descoberto em produção.

Agora, imagine se a aplicação fosse completamente protegida por um sistema de alarmes. Cada vez que uma *feature* parasse de funcionar, o alarme dispararia. Os desenvolvedores seriam imediatamente notificados, e alguém resolveria o problema o mais rápido possível.

Imagine ainda que esse sistema de alarmes fosse composto por centenas de sistemas menores. Cada um desses subsistemas seria responsável por "vigiar" uma parte bem pequena e específica da sua aplicação. E para que o sistema de alarmes funcionasse bem, os subsistemas deveriam ser totalmente independentes uns dos outros.

A adoção de um sistema desse tipo traria muitos benefícios. Logo de cara, o medo de mexer no código iria embora. A refatoração se tornaria mais fácil e frequente, e, como consequência, a qualidade do código aumentaria.

O próprio processo de desenvolvimento seria simplificado. O sistema de alarmes reduziria drasticamente a necessidade dos lentos testes manuais, agilizando a entrega da aplicação para os usuários.

Por fim, a necessidade de independência entre os subsistemas incentivaria a diminuição do acoplamento entre as partes da aplicação.

Parece bom demais para ser verdade? Pois saiba que não é. Esse sistema de alarmes é o benefício que você ganha ao implementar uma **suíte de testes unitários** em sua aplicação.

## O que são testes unitários

Vamos ver a definição da Wikipédia:

> In computer programming, unit testing is a software testing method by which individual units of source code, [...] are tested to determine whether they are fit for use. Intuitively, one can view a unit as the smallest testable part of an application.  [...]
 Unit tests are typically written and run by software developers to ensure that code meets its design and behaves as intended.

Em tradução livre:

> Em programação de computadores, teste unitário é um método de teste de software pelo qual unidades individuais de código fonte [...] são testadas para determinar se são adequadas para o uso. Intuitivamente, pode-se considerar uma unidade como a menor parte testável de uma aplicação. [...]
 Testes unitários são tipicamente escritos e executados por desenvolvedores para garantir que o código está de acordo com o projeto e se comporta da maneira desejada.

A primeira coisa que chama a atenção é que os testes unitários **não têm o propósito de testar o sistema como um todo**. Pelo contrário, eles testam pequenas partes do software - as tais das unidades. E o que é uma unidade? Existem diversos pontos de vista conflitantes sobre isso, diversas "escolas de pensamento". Mas é seguro dizer que, no contexto de programação orientada a objeto, a maioria das pessoas considera unidade como sendo uma **classe**.

Logo a seguir, nós vemos que os testes unitários são tipicamente escritos e executados por programadores. Isso é interessante por dois motivos: primeiro, contradiz uma ideia antiga de que programadores não são bons testadores de software (vou voltar nesse ponto depois). E mais importante do que isso, ele deixa claro a principal característica dos testes unitários: eles são **automatizados**.

Tenha em mente que existem diversos tipos de testes automatizados, mas aqui estamos tratando apenas de testes unitários (os quais, de acordo com diversos autores, tais como [Martin Fowler](https://martinfowler.com/bliki/TestPyramid.html), são os que trazem mais benefícios para uma aplicação).

Na prática, os testes unitários consistem de classes contendo métodos que testam partes pequenas e isoladas do sistema. Essas classes são criadas com o auxílio de um framework de testes (como o JUnit no Java, ou o NUnit ou o Microsoft Test no .Net). Esses testes podem então ser executados pela linha de comando, pela sua IDE ou mesmo por um serviço de build automatizado.

![Exemplo de método de teste em C#](https://res.cloudinary.com/dz5ppacuo/image/upload/v1460211309/teste00_bnsbfl.png)

Após a execução dos testes, você obtém um retorno imediato sobre quais testes passaram e quais falharam, acompanhado do tempo de execução de cada um dos testes.

![Janela exibindo resultados da execução de testes unitários](https://res.cloudinary.com/dz5ppacuo/image/upload/v1459979476/teste01_ciglca.png)

Com base nesse feedback, você decide o melhor curso de ação. Idealmente, um teste que falha deveria ser sinal de erro no código. O código de produção deveria então ser ajustado para que o teste volte a passar.

## Benefícios dos testes unitários 

No começo do post, ao usar a metáfora do sistema de alarmes, eu falei de alguns dos benefícios que os testes unitários trazem, como por exemplo:

- incentivo à refatoração;
- incentivo à evolução da arquitetura do sistema;
- simplificação e agilidade na entrega do produto aos usuários;

Outro benefício que vale a pena citar é que os testes também servem como **documentação do código**. Pense bem: para cada classe de produção no seu sistema, existem diversos métodos de teste que exercitam e exemplificam todos os usos possíveis dessa classe. Uma boa suíte de testes poderia ajudar um recém-chegado ao time adquirir familiaridade com a base de código em pouco tempo.

Ou seja: documentação viva, executável, sempre atualizada, e que nunca mente.

Não podemos deixar de mencionar também que uma boa suíte de testes unitários também ajuda a prevenir a regressão de bugs. É uma ótima prática criar um novo teste toda vez que um bug for encontrado. Assim, caso alguma alteração futura faça com que o bug retorne ("regresse"), o teste vai indicar isso.  

Finalmente, um dos maiores benefícios da automação de testes que eu não vejo sendo alardeado por aí é a redução de custos - talvez por ser um fator mais de negócios do que técnico. Digamos que antes de cada release a sua equipe faça um teste completo na aplicação, com quatro testadores, trabalhando 8 horas por dia, durante duas semanas. Basta fazer uma simples multiplicação e você verá que **testes manuais custam caro.**

Pior ainda: eles custam caro duas vezes. Primeiro, há o custo dos testes em si, que você pode calcular com a fórmula *valor da hora de trabalho dos testadores x nº de testadores x horas gastas em teste.* 

Além disso, há o [custo de oportunidade](https://pt.wikipedia.org/wiki/Custo_de_oportunidade): quando profissionais precisam desempenhar testes manuais que poderiam ser automatizados, eles estão deixando de desempenhar atividades criativas/intelectuais que teriam potencial de trazer ganhos muito maiores para a empresa.

## Equívocos comuns

Nessa seção, vou tentar esclarecer alguns dos mitos e equívocos que existem a respeito de testes unitários.

### Programadores não deveriam escrever testes, pois geralmente são maus testadores

Existe uma ideia bastante difundida de que programadores não deveriam testar seu próprio código. O raciocínio é que eles, inconscientemente, evitariam usar a aplicação de uma maneira que a faria quebrar. E por experiência própria, eu digo que isso de fato acontece. Já perdi a conta de quantas vezes algum colega encontrou bugs em uma aplicação que eu fiz após **segundos** de uso, sendo que eu já havia passado muito mais tempo que isso testando e sem conseguir fazer falhar.

O ponto a salientar aqui é: **há testes e testes**. Geralmente, quando pessoas dizem que programadores não deveriam testar, elas estão se referindo a testes de sistema, também chamados testes ponta a ponta. Tais testes têm o propósito de testar o sistema como um todo, o que, como já vimos, não é o objetivo dos testes unitários.

Muitas vezes o que ocorre é simplesmente falta de informação: a pessoa talvez desconheça a natureza e propósito dos testes unitários, e os toma por testes de ponta a ponta.

### Escrever testes unitários é uma perda de tempo; é o mesmo que programar duas vezes

Ao tentar "vender" testes unitários para a gerência na sua empresa, uma boa estratégia é apelar para a redução de custos, como visto anteriormente. Mas...e os desenvolvedores? Como convencê-los a gastar mais tempo escrevendo código de teste além do código de produção?

Dizer que os testes unitários são perda de tempo é uma justificativa comum apresentada por desenvolvedores que não querem escrever testes. E é uma justificativa aparentemente legítima. Afinal, nossos prazos são apertadíssimos, como podemos arrumar tempo para ficar escrevendo casos de teste?

O que essas pessoas falham em perceber é que *elas já testam o próprio código constantemente, mesmo que não chamem por esse nome.* É bem provável que seu workflow de desenvolvimento seja bem parecido com isso:

- Escreve um pouco de código
- Compila
- Executa a aplicação, testa a funcionalidade
	- Se funcionou, começa a escrever a próxima funcionalidade
	- Se não funcionou, passa um tempo debugando até encontrar e corrigir o erro
- Repita

O que estamos propondo é simplesmente trocar o ciclo "escreve código de produção -> compila -> testa -> debuga -> repete" pelo ciclo "escreve código de produção -> escreve código de testes -> executa testes -> corrige código de produção se necessário".

É até possível argumentar que os ciclos são praticamente os mesmos. Mas a grande vantagem dos testes unitários é que, uma vez escritos, eles estão automatizados para o resto da vida do projeto. Você "perde tempo" só uma vez. Você investe tempo e esforço no começo, para criar os testes, e colhe os benefícios por tempo indefinido.

### Testes unitários substituem todos os testes manuais

Testes unitários não são os únicos tipos de testes que trazem benefícios a um projeto. Também podemos utilizar outros tipos de testes automatizados como **testes de integração** e **testes de aceitação**.

![Triângulo dos testes, mostrando a razão ideal entre os diversos tipos de teste de software](https://res.cloudinary.com/dz5ppacuo/image/upload/v1460217453/testing_triangle-300x233_nzq8kx.jpg)

Isso não significa que testes manuais devem ser extintos. Pelo contrário, eles continuam tendo um papel importante no processo de controle de qualidade. De preferência, os testes manuais devem se concentrar nas áreas que não podem ser automatizadas, como testes de usabilidade.

Dentro de um contexto de metodologias ágeis, é essencial que o Product Owner/Cliente/Pessoa de Negócios valide e aceite as histórias antes delas serem incluídas em uma release.

Testes manuais exploratórios, que não seguem um roteiro definido, costumam ser valiosos na detecção de certos tipos de bugs. Os casos de testes automatizados tendem a focar no "Happy Path", ou seja, o cenário no qual deu tudo certo, as unidades foram usadas exatamente do jeito que o codificador pensou e projetou. Na vida real, é muito comum que os usuários utilizem a aplicação de maneiras...como dizer?..."criativas". Então,colocar o software sob stress, utilizando-o de maneiras diferentes e inesperadas, podem acabar revelando bugs que de outra forma permaneceriam ocultos.

É claro que, uma vez que o bug tenha sido revelado pelo teste manual, deve-se imediatamente escrever um teste automatizado que o exponha. Assim, na eventualidade do bug regredir, ele será facilmente detectado.

## Conclusão 

Testes unitários - e automação de testes, no geral - são um tema gigantesco. Há muitos livros sobre esse tema, bem como teses de mestrado. Há conferências anuais em diversos países apenas sobre teste de software. Então, é claro que seria impossível que eu, com uma mera postagem no meu blog, fizesse jus a esse tema. 

Mas eu espero, sinceramente, ter feito uma boa introdução aos testes unitários e esclarecido um pouco das dúvidas que os iniciantes geralmente têm. Qualquer dúvida, sugestão ou crítica, a área de comentário é de vocês.

Este post é o início de uma série dedicada ao tema dos testes.
No próximo artigo, começaremos a colocar a mão na massa: vou mostrar a vocês como criar seus primeiros testes!

Até lá!
