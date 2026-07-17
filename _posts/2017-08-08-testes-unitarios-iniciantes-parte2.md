---
title: Testes Unitários Para Iniciantes - Parte 2
ref: unit2
lang: pt
layout: post
author: Carlos Schults
permalink: /pt/testes-unitarios-iniciantes-parte-2
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

Antes tarde do que mais tarde! Hora de continuar nossa série sobre testes unitários para iniciantes. Hoje você vai escrever seu primeiro teste unitário.
<!--more-->

## Introdução

*Este post faz parte de uma série. [Veja os outros artigos.](http://carlosschults.net/tag_ptbr/serie-testes-unitarios/)*

No [primeiro artigo nesta série](https://carlosschults.net/pt/testes-unitarios-iniciantes-parte1) eu defini o que são testes unitários, e também falei dos benefícios de sua utilização.

Hoje você vai aprender, na prática, como criar testes unitários. Vou mostrar como instalar e utilizar o framework de testes **NUnit**. E depois vamos criar alguns testes para você conhecer algumas das features deste framework.

## Instalando o NUnit

Como eu expliquei no [primeiro post da série](https://carlosschults.net/pt/testes-unitarios-iniciantes-parte1), para utilizar testes unitários na sua aplicação você necessita de um **Framework de Testes**. 

O framework que vamos utilizar é o **NUnit**, que é baseado no JUnit, um framework de testes desenvolvido para a linguagem Java. Existem outros frameworks de teste disponíveis no mundo .Net, como o MS Test, desenvolvido pela própria Microsoft.
Se for do seu interesse, você poderá experimentar os outros frameworks por conta própria mais tarde. 

Ok, vamos começar. Para este projeto, eu vou utilizar o Visual Studio 2017. [Clique aqui para baixar a versão Community](https://www.visualstudio.com/pt-br/downloads/).

Crie uma nova solução do tipo **Class Library**, com o nome de **LearningUnitTesting**.

Uma coisa que eu sempre costumo fazer ao criar uma nova solução é excluir a classe `Class1` que vem criada por padrão. Você também poderia renomeá-la, é claro, mas fica totalmente ao seu critério.

Agora, vamos renomear o projeto padrão que foi criado para **Application**. Este projeto vai servir para guardar o *código de produção* em nossa solução.

> No contexto de testes unitários, usamos o termo **Código de Produção** para nos referirmos ao código "real" da nossa aplicação, em contraste ao **Código de Testes**.

O próximo passo é **criar o projeto de testes**. Existem algumas opiniões diferentes a respeito de *onde* devem ficar as classes de teste: se junto às classes de produção, ou em um local separado. Eu particularmente prefiro criar um projeto à parte, e o sistema de nomenclatura que eu costumo usar é: o mesmo nome do projeto de produção, mais a palavra *Test* no final.

O nome do projeto será, portanto, **ApllicationTest**, e também será do tipo **Class Library**. 
Após a criação do projeto, vou remover a classe adicionada por padrão, assim como fiz com o projeto de produção.

Sua solução deveria estar desta forma:

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1498503229/unit2-img1_ugbo3b.png)

Chegou a hora de instalarmos o NUnit. Felizmente, o framework é disponibilizado como um pacote do Nuget, o que torna sua instalação trivial.

Pimeiro, abra o **Console do Gerenciador de Pacotes**. Vá para: **Ferramentas** > **Gerenciador de Pacotes do Nuget** > **Console do Gerenciador de Pacotes**. 

Quando o console estiver aberto, digite ou copie e cole o seguinte comando:

> Install-Package NUnit

Verifique que o projeto de testes é o que está selecionado, como na imagem:

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1498503359/unit2-img2_nzedn5.png)

E pressione *ENTER*. A instalação será realizada em poucos segundos.

Entretanto, isto não é tudo. Precisamos instalar um outro pacote, o **NUnit Test Adapter**, para que sejamos capazes de executar os testes do NUnit com o Visual Studio. O processo é o mesmo, o que muda é o comando:

> Install-Package NUnit3TestAdapter

Assim como no passo anterior, verifique que o projeto correto está selecionado antes de confirmar. A instalação deve terminar em poucos segundos.

É isto.

## Criando e executando o primeiro teste

Vamos começar a criar alguns testes. Primeiro, vamos adicionar uma nova classe ao nosso projeto de Produção. A classe se chamará `Employee` e terá o seguinte código:

<script src="https://gist.github.com/carlosschults/3f42e324b10ceb42b360382686d314de.js"></script>

Eu imagino que a classe seja simples o suficiente e não necessita de explicação. Agora, vamos criar nossa classe de teste. No projeto **ApplicationTest**, adicione uma nova classe com o nome de **EmployeeTest**. 

> Este é um dos padrões de nomenclatura que eu também utilizo: nomear a classe de teste com o mesmo nome da classe de produção, acrescentando *Test* no final.

Após a criação da classe, adicione o namespace *NUnit.Framework* na lista de usings da classe. Em seguida, crie um novo método público de retorno *void* chamado **MyFirstTestMethod** e adicione o atributo `[Test]` a ele.

Nesse ponto, o código da classe deve estar assim:

<script src="https://gist.github.com/carlosschults/406525bd23d3ee2ecba4f7592c0f8af3.js"></script>

O esqueleto do teste já está pronto. Então vamos escrever nossa primeira **asserção**. Uma asserção é uma *afirmação* sobre como um determinado método deveria se comportar. Caso a afirmação se prove verdadeira, dizemos que o teste *passou*. Caso a afirmação se prove falsa, dizemos que o teste *falhou*, ou quebrou.

No NUnit, utilizamos a classe `Assert` para escrevermos nossas asserções. Esta classe possui um número grande de métodos que nos permitem expressar nossas expectativas com relação ao comportamento das unidades que estamos testando.

Adicione a seguinte linha de código ao método de teste:

> Assert.Pass();

Esta é uma asserção que serve para forçar o teste a passar. Vamos agora rodar esse teste para vê-lo passando. Primeiro, precisamos abrir o **Gerenciador de Testes**. Vá para: **Testar** > **Janelas** > **Gerenciador de Testes**.

Na janela exibida, clique em *Executar Tudo*. Caso tudo tenha funcionado da maneira correta, você verá isso:

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1498507514/MyFirstTestPass_atkrjl.png)

Ao clicar no nome do teste, serão exibidas algumas informações adicionais, como o arquivo do teste e tempo decorrido:

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1498508050/MyFirstTestPass2_ageqqm.png)

Note o uso da cor verde para indicar o sucesso do teste.

Vamos agora fazer o contrário: forçar a falha do teste. Substitua a linha no método por:

> Assert.Fail();

Execute o teste novamente e verá a mensagem de falha, dessa vez com a barra vermelha:

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1498508371/myfirsttestfail_xwuo5u.png)

Agora que você já está pegando o jeito, vamos começar a testar a nossa classe `Employee`. Não esqueça de voltar o método de teste que fizemos para `Assert.Pass` para que ele não fique falhando.

Em seguida, adicione um novo método de teste chamado `IntroduceMethodShouldWorkCorrectly`. Nele, vamos criar uma nova instância do objeto `Employee` e verificar que o método `Introduce` está funcionando como deveria.

Antes de fazermos isso, porém, precisamos adicionar uma referência do projeto de produção ao nosso projeto de testes. Do contrário, nossa classe de teste não conseguirá enxergar as classes que deveria testar!

Para isso, clique com o botão direito no projeto **ApplicationTest** > **Adicionar** > **Referência...**. Na janela exibida, selecione o projeto, conforme a imagem a seguir:

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1498509304/Captura_de_tela_2017-06-26_17.34.04_hgianj.png)

E depois clique em OK.

De volta à classe de teste, modifique o método de teste para que fique da forma abaixo:

<script src="https://gist.github.com/carlosschults/c840590dab95a023d4530962fca048db.js"></script>

Você vai notar que `Employee` está marcado como erro. Ao passar o cursor em cima, você verá uma mensagem avisando que o nome `Employee` não pode ser encontrado e perguntando se não tem alguma referência ou diretiva *using* faltando.

É claro que tem uma diretiva *using* faltando, relativa à referência que acabamos de adicionar. Para corrigir o problema, basta adicionar a linha `using Application;` no começo do arquivo.

Agora que o código compila, vamos entender este método, linha a linha. 

Na primeira linha, instanciamos nossa classe `Employee`, definindo nome, profissão e salário. Na linha seguinte, atribuímos a uma variável o valor que **esperamos** que o método retorne. Em seguida, atribuímos a outra variável o resultado da execução do método.

Finalmente, utilizamos o método `AreEqual` da classe `Assert` para verificar se os dois valores são iguais. Este método é, provavelmente, o que você mais vai utilizar durante seus testes.

Agora é hora de executar o teste. Utilize o atalho **CTRL + R, A** ou clique em **Executar Tudo** na janela do Gerenciador de Teste. Se tudo der certo, você verá a barra verde e a mensagem indicando que os dois testes passaram.

Vamos agora testar o teste: vamos "estragar" o método `Introduce` e ver se o método falha como deveria. De volta à classe de produção, vamos modificar o método da seguinte forma:

<script src="https://gist.github.com/carlosschults/02554ca9b8dd69f8c904dbbcc271c99e.js"></script>

Como você viu, nós retiramos os colchetes ao redor de JobTitle. Desta forma, a interpolação de string não será realizada, fixando o texto "JobTitle" ao invés de substituí-lo pelo valor da variável.

Ao rodar os testes novamente, obtemos o seguinte resultado:

> Mensagem:   Expected string length 48 but was 46. Strings differ at index 37.
Expected: "Hi! My name is Alice and I work as a Programmer."
But was:  "Hi! My name is Alice and I work as a JobTitle."
------------------------------------------------^
  
Em tradução livre, seria algo como:

> O comprimento esperado da string era 48 mas o obtido foi 46. As string diferem a partir do índice 37.
> Esperado: "Hi! My name is Alice and I work as a Programmer."
> Mas foi: "Hi! My name is Alice and I work as a JobTitle."
  
Como podemos ver, a mensagem é bem explicativa. Ela nos informa não apenas que as string divergiram mas exatamente em que parte elas começaram a divergir. Também nos informa exatamente o texto esperado e o que realmente foi obtido. É importante salientar que a ordem dos parâmetros do método `AreEqual` importa, pois isso influi na mensagem exibida quando o teste falha.
  
> **A ordem dos parâmetros no método `AreEqual` é muito importante. Passe primeiro o resultado esperado, e depois o que realmente foi obtido.**
  
Ótimo. Podemos voltar o método para sua implementação anterior e executar os testes novamente, para ver que o teste volte a passar.

Como você pode ver, um teste de unidade envolve uma sequência de passos bem definida: **preparamos** o cenário, **executamos** a ação, e **verificamos** o resultado. Essa sequência de passos - ou fases - é muitas vezes chamada de AAA: **Arrange-Act-Assert**.
  
> Um teste de unidade típico envolve as fases **Arrange-Act-Assert**.

Embora existam outras nomenclaturas para as fases do teste de unidade, vamos adotar **Arrange-Act-Assert** como nossa nomenclatura padrão, ao menos por enquanto.

Você talvez esteja se perguntando por qual motivo eu de o nome de "sut" à variável declarada no início do método. Este é um padrão de nomenclatura que aprendi lendo o blog do [Mark Seeman](https://blog.ploeh.dk/). **SUT** significa *System Under Test*, ou "Sistema Sob Teste", em tradução livre. É um termo usado para se referir à classe sendo testada no teste atual. Não há nada que obrigue a utilização de `sut` como o nome da variável, mas eu gosto de usar dessa forma, pois deixa evidente no teste quem é que está sendo testado.

> **Dica: Procure utilizar padrões de codificação que melhorem a legibilidade e deixem a intenção do autor explícita para o leitor do código.**
  
Logo abaixo temos o método de teste, dessa vez com comentários demonstrando cada fase do teste:
  
<script src="https://gist.github.com/carlosschults/a91d41ff7ac732fc9c57e63c03a6be07.js"></script>
  
Embora não seja realmente necessário, eu sugiro que você use comentários para demarcar as fases do teste como no exemplo acima, ao menos no início de seu aprendizado.
  
## Mais um teste: método `GiveRaise`
  
Um aumento no salário é sempre bem-vindo, concordam? Vamos testar que o método `GiveRaise` funciona como deveria. Na sua classe de teste, adicione o método a seguir:

<script src="https://gist.github.com/carlosschults/2ce153c1da6f83e80342fa7f83ea4786.js"></script>

Execute o teste e você deverá ver a familiar barra verde de sucesso. Deu certo? Ótimo. Hora de **testar o teste:** vamos "sabotar" a implementação do método `GiveRaise` e ver se o teste falha.

Na classe de produção, vamos deixar o método assim:

<script src="https://gist.github.com/carlosschults/fba5901aaa2f542bcd8528de0e96afff.js"></script>

Agora que o método está obviamente errado, o teste deveria falhar. Vamos executá-lo?

 > Mensagem:   Expected: 110
   But was:  5m
  

Ok, podemos ver que o teste realmente falhou. Podemos voltar o método ao normal e ver que agora tudo passa como deveria.

## Um último teste

Digamos que surgiu um novo requisito: se a porcentagem de aumento passada for negativa, o salário deve permanecer o mesmo. Vamos então alterar o método `GiveRaise` para tratar este caso:

<script src="https://gist.github.com/carlosschults/3f09a8043a1e58753adf9bfdee37350a.js"></script>

Fizemos uma alteração no código de produção. Nossa prioridade agora é **verificar que nada quebrou**. Execute os testes para verificar se todos ainda estão passando normalmente.

Tudo ainda está verde? Ótimo, vamos em frente. Agora precisamos criar um novo teste para documentar o caso da tentativa de aumento negativo.

> Testes de unidade também são uma forma de documentação.

Na classe de teste, adicione o método a seguir:

<script src="https://gist.github.com/carlosschults/a474698655450da6547dbfa6b9dbcb8c.js"></script>

Nada de surpreendente aqui, certo? À esta altura, você já deve ter pegado o jeito da coisa. Assim, vou deixar por sua conta o **teste do teste:** sabote o método de uma ou mais maneiras e confira que o teste falhou conforme deveria.

## Recapitulando

O artigo de hoje foi bem mais prático que o anterior. Conseguimos abordar diversos tópicos:

- Instalação do **NUnit** e **NUnit Test Adapter**;
- Criação de caso de teste;
- Conceito de *asserção* e classe `Assert`;
- Execução dos testes, tanto por meio do *Gerenciador de Testes* quanto por teclas de atalho;
- Interpretação da mensagem de erro do teste;
- Fases do teste unitário (*Arrange-Act-Assert*).

Além desses tópicos, também ampliamos nosso vocabulário relativo à testes, com os termos *SUT*, *asserção*, *código de teste x código de produção*, entre outros.

Também foram abordados alguns padrões de nomenclatura, tanto para classes quanto para métodos de teste.

Finalmente, você aprendeu sobre a importância de ver o teste falhar, e como podemos "testar o teste" através de uma sabotagem deliberada do código de produção.

## Notas

- O código do post de hoje [está no Github](https://github.com/carlosschults/learning-unit-testing/).
- Agradeço novamente ao amigo Gunter Italiano Ribeiro por revisar este artigo.

## Conclusão

Este foi o segundo artigo da minha série sobre testes unitários. Como já mencionei, ele é propositalmente maior e mais prático que o artigo inicial da série. Ainda assim, tudo o que foi abordado é apenas a ponta do iceberg do que existe a respeito de testes de unidade. Livros inteiros poderiam foram escritos sobre este assunto. Nos artigos futuros indicarei alguns, além de outros materiais para estudo.

Nos testes que escrevemos hoje, utilizamos a abordagem mais intuitiva - e provavelmente mais comum - de se criar os testes após o código de produção. Porém, muitas pessoas e equipes trabalham com uma metodologia diferente: eles escrevem os testes *antes* do código de produção.

Pode parecer estranho, à princípio, mas trabalhar desta forma pode trazer diversos benefícios para seu projeto. Este e outros tópicos serão abordados no próximo artigo.

Até lá!
