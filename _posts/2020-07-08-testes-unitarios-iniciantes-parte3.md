---
title: "Testes Unitários em C#: Iniciando Com TDD"
ref: unit3
lang: pt
layout: post
author: Carlos Schults
permalink: /pt/testes-unitarios-csharp-intro-tdd/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1459979937/testes-unitarios-iniciantes-min_povcse.png
description: Você provavelmente já ouviu falar de TDD. Neste post, aprenda como começar a usar essa técnica na prática.
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

*Este post faz parte de uma série. [Veja os outros artigos.](http://carlosschults.net/tag_ptbr/serie-testes-unitarios/)*

Hoje eu trago outro post para ajudá-los a começar com os testes da unidade C#. Já cobri o [básico de testes unitários](https://carlosschults.net/pt/testes-unitarios-iniciantes-parte1), explicando o que eles são e por que são tão importantes. Depois disso, mostrei [como começar com os testes unitários](https://carlosschults.net/pt/testes-unitarios-iniciantes-parte-2) com um exemplo prático. Hoje, vamos um passo adiante, explorando a metodologia TDD.

Você provavelmente já ouviu falar de TDD, mas pode ficar confuso quanto ao que é. A propósito, isto não é culpa sua. Há muitos equívocos em torno desta sigla. Algumas pessoas até a usam de forma intercambiável com os testes unitários. Neste post, você vai aprender por que eles estão errados, e mais.

Começamos o post com uma breve definição de TDD. Você aprenderá não apenas que TDD significa Desenvolvimento Orientado por Testes, mas também que não é uma técnica de teste, apesar do nome. Depois disso, eu explico o que é TDD e quais são seus benefícios.

Após o "o quê" e o "porquê" estarem ambos fora do nosso caminho, estaremos prontos para nos divertir um pouco. Vou lhes mostrar, na prática, como começar com a TDD, desenvolvendo uma solução para um famoso exercício de programação. Soa bem? Então, vamos começar.

## Testes Unitários em C# & TDD: Começando Pelo Básico

Já mencionei anteriormente que o TDD não é uma técnica de teste. Mas o que é isso? E como está relacionado ao teste de unidade C# (ou teste de unidade em geral, já agora?)

### Definindo TDD

Como você já viu, TDD significa "Test-Driven Development", ou "Desenvolvimento guiado por testes." É uma técnica ou metodologia de desenvolvimento de software que utiliza testes unitários para guiar ou dirigir o desenvolvimento da aplicação.

Em vez de fazer a coisa mais intuitiva, que seria escrever testes unitários após o código de produção, a metodologia TDD afirma que você deve começar escrevendo um teste unitário falho. Depois você escreve o código de produção, mas apenas o necessário para que o teste seja aprovado.

Acho que agora você está se perguntando pelo menos duas coisas:

- Como isso funciona na prática?
- Por que escrever o código de uma maneira tão estranha?

É o que vamos ver a seguir.

### As fases do TDD

O desenvolvimento orientado por testes depende da repetição de um ciclo incrivelmente curto. Este ciclo é composto de três fases:

1. Primeiro, você escreve um teste que representa um requisito específico da funcionalidade que você está tentando implementar.
2. Em seguida, você faz o teste passar, escrevendo a quantidade mínima de código de produção com a qual você pode escapar.
3. Se necessário, você refatoria o código para eliminar duplicações ou outros problemas.

Como a funcionalidade ainda não existe, o teste que você escreve no passo nº 1 falhará. Ou seja, em linguagens como Python ou Ruby. No caso de linguagens estaticamente digitadas, como Java ou C#, o código nem sequer será compilado. Para nossos propósitos, a não compilação do código conta como falha no teste.

No passo 2, você tem que fazer o teste passar, mas nada além disso. O que eu quero dizer é que seu objetivo aqui não é resolver o problema, pelo menos ainda não. Ao invés disso, seu único trabalho é fazer o teste passar, escrevendo a menor quantidade possível de código. Fazer batota - por exemplo, devolver um valor codificado - não só é OK, mas encorajado, como você logo verá.

Finalmente, a terceira fase é a única que permite a você escrever o código de produção sem ter que criar primeiro um teste de reprovação. Mas você não pode criar novas classes ou funções; você só pode refatorar o código que você escreveu na etapa anterior, para torná-lo mais legível, para eliminar a duplicação ou para resolver outro problema. E, é claro, o teste ainda deve ser aprovado.

As pessoas freqüentemente usam o TDD como "red green-refactor" porque a maioria das ferramentas de teste de unidade usa vermelho para denotar testes fracassados e verde para passar nos testes.

### Por que usar o TDD?

O difícil de entender quando se começa a usar o TDD não é o como. O "como" é trivial: escrever um teste, faze-lo passar, talvez refatorar, enxaguar, repetir. A parte preocupante é o "por quê". Por que desenvolver software de uma maneira tão não-intuitiva?

Vou falar mais sobre a filosofia TDD em artigos futuros. Em poucas palavras, aplicar TDD garante que você terá um código testável desde o início. Ele o incentivará a projetar seu código de uma maneira simples e modular.

Mas talvez a principal vantagem do TDD seja aumentar a confiança do desenvolvedor em seu código. Ao desenvolver um pequeno passo de cada vez, você nunca será capaz de errar muito, já que está fazendo muito pouco. Saber que você está apenas a um teste de reprovação de ter um código de trabalho é reconfortante.

## Testes Unitários em C# & TDD: O Guia Mão-Na-Massa

Eu cobri como começar com os testes de unidade C# no passado. Eu também cobri as ferramentas necessárias e como começar. Entretanto, não vou assumir que você tenha lido esses artigos. Em vez disso, vou cobrir tudo a partir do zero. Assim, você será capaz de seguir o tutorial mesmo que tenha zero de experiência com testes unitários.

### Nosso problema: O Kata String Calculator

Para nosso tutorial, escreveremos uma solução para o [coding kata String Calculator](https://osherove.com/tdd-kata-1), idealizado pelo Roy Osherov. Um kata de codificação é um exercício de programação, destinado a permitir que os desenvolvedores pratiquem práticas de engenharia de software ágeis fundamentais, como a refatoração, e - você adivinhou - TDD.

Para simplificar, vou ignorar algumas das exigências do kata. O que se segue são as exigências que vamos utilizar:

1. Vamos criar uma classe chamada StringCalculator, com um único método estático com a assinatura estática int Add(string numbers);
2. O método pega uma string representando números separados por uma vírgula, e retorna sua soma.
3. Se passarmos uma string vazia, o método deve retornar zero.
4. A passagem de um único número deve resultar no próprio número.
5. Se passarmos números negativos, o método deve lançar uma ArgumentException, com a mensagem "Números negativos não permitidos:" seguida dos negativos que foram especificados.
6. O método deve ignorar números maiores que 1000 devem. Portanto, "1.2.1000" deve resultar em 1003, mas "1.2.1001" deve resultar em 3.

### Criando o Projeto de Produção

Para este tutorial, estarei usando a edição comunitária do Visual Studio 2019. Se você ainda não o tem, pode baixá-lo e instalá-lo de graça.

Abra o VS e clique em "Criar um novo projeto", como na imagem a seguir:

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1594235427/unit3/img1.png)

Na janela aberta, escolha Biblioteca de Classes (.NET Core) como modelo para o novo projeto. Em seguida, clique em "Next" (Próximo):

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1594235427/unit3/img2.png)

A tela seguinte simplesmente pede um nome para o projeto e a solução. Eu escolhi" StringCalculatorKata" tanto para o projeto quanto para a solução. Você também terá que fornecer um local para salvar os arquivos do projeto. Quando terminar, basta clicar em "Criar".

Se tudo correr bem, você deverá ver a classe padrão aberta para você no Visual Studio. Vá ao Solution Explorer e exclua essa classe; não vamos precisar dela.

### Criando o Projeto de Teste

Agora, é hora de criar o projeto de teste. Poderíamos fazer isso de duas maneiras: criando um projeto regular de "Biblioteca de Classe" e depois adicionando as dependências necessárias a ele, ou criando um projeto de teste de unidade imediatamente. Iremos com este último, já que facilita tudo isso.

Você conhece o procedimento: clique com o botão direito do mouse na solução, vá para "Adicionar",depois para "Novo Projeto...". Em seguida, escolha o modelo "NUnit Test Project (.NET Core)".

Em seguida, você deverá fornecer um nome e um local para o projeto. Gosto de seguir a convenção de nomear o projeto de teste após o projeto de produção, com um ".Test" adicionado. Portanto, escolho "StringCalculatorKata.Test". Terminar a criação do projeto.

Se tudo correr bem, você deve ver agora uma nova classe que se parece com esta:

{% highlight csharp %}
public class Tests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void Test1()
    {
        Assert.Pass();
    }
}

{% endhighlight %}

Vamos fazer algumas coisas. Primeiro, livre-se do método `Setup()`. Não vamos precisar dele. Depois, acrescente um novo método com o código abaixo:

{% highlight csharp %}
[Test]
public void Test2()
{
    Assert.Fail();
}
{% endhighlight %}

Portanto, agora temos dois testes, um que deve passar e outro que deve falhar. Vamos examiná-los para ver se eles estão funcionando corretamente. Vá ao menu "Executar" e clique em "Executar todos os testes".

Agora, abra a janela Test Explorer (View -> Test Explorer). Deve ser parecido com isto:

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1594235427/unit3/tests-running.png)

Parece que tudo está funcionando bem! Mas antes de começarmos a fazer nosso exercício de codificação do kata, há dois passos finais que precisamos dar. Primeiro, vamos renomear a classe de teste. Ir para o explorador de soluções, expandir o projeto de teste de unidade, e excluir sua classe de teste padrão. Depois, clique com o botão direito do mouse no projeto de teste, vá para "Adicionar", depois para "Nova classe..." e adicione uma nova classe chamada "StringCalculatorKata". Alternativamente, você pode renomear a classe existente.

A segunda coisa que temos que fazer é garantir que nosso projeto de teste possa ver nosso projeto de produção. Para resolver isso, estamos acrescentando uma referência.

Vá até o explorador de soluções novamente, clique com o botão direito do mouse no projeto de teste, depois vá até "Adicionar" e clique em "Referência...".

Na nova janela, selecione "Projetos" no painel esquerdo, e depois selecione o projeto StringCalculatorKata, que deve ser o único disponível:

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1594235427/unit3/add-reference.png)

Depois, basta clicar em "OK", e agora você está pronto para continuar.

## Iniciando nosso Kata de Codificação

Agora, estamos prontos para escrever nosso primeiro teste de reprovação. Portanto, abra a classe StringCalculatorTest e acrescente a ela o seguinte método

{% highlight csharp %}
[Test]
public void Add_EmptyStringAsParam_ReturnsZero()
{
    Assert.AreEqual(0, StringCalculator.Add(string.Empty));
}
{% endhighlight %}

Em nosso primeiro caso de teste, testamos o cenário mais simples possível. Ou seja, chamamos o método Add de passar uma string vazia, que, de acordo com os requisitos que você viu antes, deve resultar em 0. É claro que nem o método Add nem a classe StringCalculator existem, portanto nosso código nem sequer é compilado. Bem, parabéns! Você realizou com sucesso o primeiro passo no ciclo vermelho-verde-refator, escrevendo um teste de reprovação! Lembre-se: em idiomas estaticamente digitados como C#, a falha em compilar conta como um teste reprovado.

Portanto, nosso primeiro passo é nos livrarmos do erro de compilação. Se você pairar sobre "StringCalculator", você deve ver um pequeno pop-up explicando o erro e oferecendo possíveis correções:

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1594238110/unit3/hover-tip.png)

Clique em "Mostrar correções potenciais" e depois em "Gerar novo tipo...". Você deve então ver uma janela solicitando os detalhes e a localização do novo tipo. Mude o "acesso" para "público" e a localização para o projeto de produção, que é "StringCalculatorKata". A janela deve ser parecida com esta:

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1594238213/unit3/create-production-class.png)

Clique em "OK". Agora, se você abrir o explorador de soluções e expandir o projeto StringCalculatorKata, você deve ver a classe StringCalculator.cs à espreita por lá. Legal.

Entretanto, nosso código ainda não está compilado. E isso porque, apesar de termos criado a classe de produção, não adicionamos o método Add a ela. Então, vamos fazer da mesma forma que fizemos com a classe.

Passe o mouse sobre a palavra "Adicionar" até que a ajuda apareça com a mensagem "' StringCalculator' não contém uma definição para 'Adicionar'". Clique em Mostrar correções potenciais, e depois clique em "Gerar método 'StringCalculator.Add'".

Você verá que a classe de produção agora contém um método chamado Add, com o dobro como um tipo de retorno. Queremos que o método retorne int, então vamos mudar isso. Vamos também mudar o nome do parâmetro para "números" para corresponder aos requisitos do kata de codificação. Neste ponto, sua classe StringCalculator completa deve ser parecida com esta:

{% highlight csharp %}
public class StringCalculator
{
    public static int Add(string numbers)
    {
        throw new NotImplementedException();
    }
}
{% endhighlight %}

Agora seu código deve ser compilado. Faça o teste novamente, e você verá que ele falha, com uma mensagem como esta:

<pre>
Add_EmptyStringAsParam_ReturnsZero
   Source: StringCalculatorTest.cs line 8
   Duration: 43 ms

  Message: 
    System.NotImplementedException : The method or operation is not implemented.
  Stack Trace: 
    StringCalculator.Add(String numbers) line 9
    StringCalculatorTest.Add_EmptyStringAsParam_ReturnsZero() line 10

</pre>

Temos uma falha de teste verdadeira. Estamos prontos para escrever o código de produção? Não tão rápido. Claro, nosso teste falha, mas falha da maneira errada. Como nosso teste contém uma asserção, esperávamos uma asserção fracassada. Em vez disso, o que temos é uma falha devido ao método em teste, lançando uma exceção.

A correção aqui é simples. Vamos apenas mudar o método Add, para que ele retorne qualquer número diferente de zero:

{% highlight csharp %}
public static int Add(string numbers)
{
    return -1;
}
{% endhighlight %}

Agora, faça o teste novamente, e você verá que a mensagem de erro é esta:

<pre>
Add_EmptyStringAsParam_ReturnsZero
   Source: StringCalculatorTest.cs line 8
   Duration: 76 ms

  Message: 
      Expected: 0
      But was:  -1
</pre>

### Fazendo o teste passar

Estamos agora finalmente prontos para fazer o teste passar. Como disse anteriormente, para passar no teste, você não só é permitido, mas também encorajado a fazer batota. Em nosso caso, podemos simplesmente fazer com que o método Add retorne zero:

{% highlight csharp %}
public static int Add(string numbers)
{
    return 0;
}
{% endhighlight %}

### Escrevendo o segundo teste: Um único número

Os requisitos dizem que a passagem de um único número deve retornar o próprio número. Isso soa como uma coisa útil para testar:

{% highlight csharp %}
[Test]
public void Add_StringContainingSingleNumber_ReturnsTheNumberItself()
{
    Assert.AreEqual(5, StringCalculator.Add("5"));
}
{% endhighlight %}

O teste falha com a seguinte mensagem:

<pre>
Add_StringContainingSingleNumber_ReturnsTheNumberItself
   Source: StringCalculatorTest.cs line 14
   Duration: 56 ms

  Message: 
      Expected: 5
      But was:  0

</pre>

Como podemos fazer o teste acima passar da maneira mais preguiçosa possível? Que tal assim?

{% highlight csharp %}
public static int Add(string numbers)
{
    if (numbers == string.Empty)
        return 0;

    return 5;
}
{% endhighlight %}

### Testando Dois Números

Como já testamos o método Add passando por números zero (uma seqüência vazia) e um único número, parece que o próximo passo natural para nós agora seria escrever um teste para o cenário de adição de dois números. Então, vamos fazer exatamente isso.

{% highlight csharp %}
[Test]
public void Add_TwoNumbersSeparatedByComma_ReturnsTheirSum()
{
    var numbers = "7,8";
    var expectedResult = 15;
    Assert.AreEqual(expectedResult, StringCalculator.Add(numbers));
}
{% endhighlight %}

O teste acima naturalmente falha uma vez que nosso método atualmente retorna 0 quando recebe um fio vazio e cinco de outra forma. Como podemos mudá-lo, para que este novo teste passe, os testes mais antigos continuem a passar, de uma forma que não resolve o problema em geral?

Esta é uma idéia:

{% highlight csharp %}
public static int Add(string numbers)
{
    if (numbers == string.Empty)
        return 0;

    if (numbers.Contains(','))
        return 15;

    return 5;
}
{% endhighlight %}

### Testando Três Números

Você já notou que, até agora, não fizemos nenhuma refatoração? Bem, estamos nos aproximando do ponto em que nossos testes nos levam a incluir alguma duplicação desagradável em nosso código. Então, usaremos a refatoração para alterar o código de uma forma que se aproxime de uma solução geral.

Vamos ver se podemos fazer isso testando o cenário com três números:

{% highlight csharp %}
[Test]
public void Add_ThreeNumbersSeparatedByComma_ReturnsTheirSum()
{
    var numbers = "1, 2, 3";
    var expected = 6;
    Assert.AreEqual(expected, StringCalculator.Add(numbers));
}
{% endhighlight %}

O teste naturalmente falhará. Como a corda fornecida contém vírgulas, caímos no ramo condicional que retorna 15. Nosso desafio agora é mudar o método de produção de forma a fazer este teste passar. Podemos fazê-lo sem ir à solução geral do problema? Vamos ver.

{% highlight csharp %}
public static int Add(string numbers)
{
    if (numbers == string.Empty)
        return 0;

    if (numbers == "1, 2, 3")
        return 6;

    if (numbers.Contains(','))
        return 15;

    return 5;
}
{% endhighlight %}

Comparando o parâmetro especificado com a entrada exata usada no teste, podemos fazer o teste passar, evitando ir para a solução geral. Entretanto, agora conseguimos criar uma duplicação de código. Você consegue ver isso? Estamos fazendo duas comparações contra o valor dos números, uma logo após a outra. Vamos ver se conseguimos nos livrar dessa duplicação.

{% highlight csharp %}
public static int Add(string numbers)
{
    if (numbers == "1, 2, 3")
        return 6;

    if (numbers.Contains(','))
        return 15;

    int.TryParse(numbers, outint result);
    return result;
}
{% endhighlight %}

Aproveitando o método `TryParse` do tipo `System.Int32`, consegui me livrar do primeiro if. Também usamos um recurso introduzido no [C# 7](https://carlosschults.net/pt/funcionalidades-csharp-7/) chamado "out variables". Este recurso nos permite utilizar parâmetros sem ter que declará-los previamente.

Todos os testes ainda passam, portanto, não posso escrever mais código de produção. Qual deve ser o próximo teste?

### Testando Mais de Três Números

Os requisitos não dizem que devemos ser capazes de lidar apenas com três números. Portanto, vamos criar outro caso de teste para cobrir os cenários com 4, 5, ou mais números. Já que estamos nisso, podemos também incluir a exigência de ignorar números maiores que 1000.

Para fazer isso sem ter que criar muitos métodos de teste, vamos aproveitar o recurso NUnit [testes parametrizados] (https://docs.nunit.org/articles/nunit/writing-tests/attributes/testcase.html), adicionando um único método com vários casos de teste:

{% highlight csharp %}
[TestCase("1,2,3,4", 10)]
[TestCase("8,7,20", 35)]
[TestCase("5,0,4,1001", 9)]
[TestCase("5,0,4,1000", 1009)]
[TestCase("26,6,90", 122)]
public void Add_MoreThanThreeNumbersSeparatedByComma_ReturnsTheirSum(
    string input, int result)
{
    Assert.AreEqual(result, StringCalculator.Add(input));
}
{% endhighlight %}

Observe que o terceiro caso de teste exemplifica a exigência que diz que devemos ignorar números superiores a 1000. O próximo caso de teste, no entanto, mostra que 1000 não deve ser ignorado. Se você executar os testes, verá que o test explorer mostra cada caso de teste como um teste distinto.

Como podemos fazer este teste passar? Honestamente, a essa altura, é muito mais fácil ir para a implementação correta do que trapacear. Então, vamos fazer exatamente isso:

{% highlight csharp %}
public static int Add(string numbers)
{
    var parts = numbers.Split(',');
    var result = 0;

    foreach (var part in parts)
    {
        int.TryParse(part, outint number);

        if (number <= 1000)
            result += number;
    }

    return result;
}
{% endhighlight %}

O código acima deve ser fácil de entender. Nós apenas dividimos o fio em partes usando a vírgula como delimitador. Então, para cada parte, nós a dividimos em um inteiro, verificamos se é igual ou inferior a mil e, se for o caso, adicionamo-la à variável de resultado. Finalmente, retornamos o resultado.

## Ainda não terminamos

Os requisitos dizem que números negativos não devem ser permitidos. Vamos acrescentar um teste para isso! Por uma questão de brevidade, acrescentaremos um único método de teste com vários casos de teste, de modo que somos forçados a ir imediatamente para a implementação correta:

{% highlight csharp %}
[TestCase("1,2,3,4,5,-5")]
[TestCase("-1,1,2,9")]
[TestCase("5,6,8,-5")]
public void Add_StringContainingNegativeNumbers_Throws(string numbers)
{
    Assert.Throws<ArgumentException>(() => StringCalculator.Add(numbers));
}
{% endhighlight %}

Para este teste, afirmamos que não estamos contra um valor de retorno. Ao invés disso, estamos verificando se o método em teste abre uma exceção.

Lembre-se que os requisitos dizem que devemos lançar uma exceção com uma mensagem dizendo que os negativos não são permitidos. Devemos também incluir uma lista dos negativos que foram aprovados. Isto exigirá algumas mudanças em nosso método:

{% highlight csharp %}
public static int Add(string numbers)
{
    var parts = numbers.Split(',');
    var result = 0; 
    var negatives = new List<int>();

    foreach (var part in parts)
    {
        int.TryParse(part, outint number);

        if (number < 0)
            negatives.Add(number);
        elseif (number <= 1000)
            result += number;
    }

    if (negatives.Count > 0)
    {
        var negativesList = string.Join(',', negatives);
        var exceptionMessage = $"Negative numbers not allowed: {negativesList}.";
        throw new ArgumentException(exceptionMessage);
    }
    
    return result;
}
{% endhighlight %}

Como você pode ver, logo no início, nós definimos uma instância de `List<int>` para armazenar os negativos que encontramos enquanto iteramos sobre todos os números. Dentro do laço, verificamos se o número atual é negativo. Se for, adicionamo-lo à lista. Se não for, verificamos se é menor ou igual a 1000, caso em que o adicionamos à variável de resultado.

Após o loop, verificamos se a lista negativa tem algum elemento. Se tiver, criamos uma mensagem de exceção que inclui os negativos especificados e, em seguida, lançamos uma nova ArgumentException. Caso contrário, devolvemos o resultado.

## Conclusão

Este post foi um guia prático sobre como começar com o TDD em C#. Então, para onde você vai a partir daqui?

Bem, a maioria das coisas na vida você aprende fazendo. A programação é certamente uma dessas coisas. Portanto, se você quer que os conceitos que você viu hoje realmente se afundem, você tem que praticar.

O código que escrevi durante este post está disponível como [um repositório público no GitHub.](https://github.com/carlosschults/string-calculator-kata) Vá lá, clone-o usando [Git,](https://carlosschults.net/pt/basicos-do-git-usuarios-tfvc), e comece a brincar com ele. 

Você verá que eu criei um compromisso para cada etapa do ciclo TDD. Dessa forma, torna-se mais fácil para os futuros leitores visualizar todas as etapas do processo, percorrendo a história do projeto, um compromisso de cada vez.

É possível melhorar o código que eu usei hoje. Por exemplo, o código do método `Add` pode ser escrito de uma forma mais curta, clara e eficiente, usando [LINQ](https://carlosschults.net/pt/programacao-funcional-csharp/.) Você pode criar mais testes. Os requisitos do exercício que apresentamos no início pedem por uma mensagem de erro específica ao lançar a exceção quando há números negativos na string. Apesar de termos implementado a mensagem como pedido, nós não criamos um teste pra isso. Você pode fazer isso, como forma de praticar.

Finalmente, fique atento a este blog. Este post é parte de uma série, à qual pretendo acrescentar mais partes.

Obrigado pela leitura, e até a próxima!
