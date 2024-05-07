---
title: "C# Regex: Como Expressões Regulares Funcionam em C#, Com Exemplos"
ref: csharp-regex
lang: pt
layout: post
author: Carlos Schults
description: Neste post, você aprenderá o básico das expressões regulares em C#
permalink: /pt/csharp-expressoes-regulares
canonical: https://stackify.com/c-regex-how-regular-expressions-work-in-c-with-examples/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1513817072/csharp8-1037x438_skogpz.jpg
tags:
- csharp
- regex
- expressoes_regulares
- tutorial
---

![]({{ page.img }})
*NOTA: Eu originalmente escrevi esse post para o blog da empresa Stackify.  Você pode [ler o artigo original, em inglês, no site deles]({{ page.canonical }}).*

A manipulação de texto é uma das tarefas mais comuns na programação, sendo que praticamente todas as principais linguagens de programação oferecem suporte a regex (expressão regular) por meio de suas bibliotecas padrão. O C# não é exceção, portanto, hoje trazemos a você um guia de regex do C#.

Você aprenderá o que são expressões regulares, por que você deseja usá-las e como começar de uma maneira abrangente e acessível. Dessa forma, você poderá começar a usar expressões regulares para resolver problemas reais o mais rápido possível.

Prepare-se para sua jornada de aprendizado de regex, que começa agora!

## O Que é Regex?
Uma expressão regular (também chamadas de regex, abreviação para _regular expression_) é uma expressão que contém um ou vários caracteres que expressam um determinado padrão no texto. Se isso parecer um pouco vago, um exemplo vai ajudar. Considere uma data no seguinte formato:

```
28-JUL-2023
```

Usando um regex, podemos expressar esse formato da seguinte forma:

```
[0-9]{2}-[A-Z]{3}-[0-9]{4}
```

Observe que a expressão regular acima expressa um padrão com:

* dois dígitos numéricos seguidos de um hífen
* três letras maiúsculas seguidas de um hífen
* mais quatro números

Você saberá mais sobre o significado de cada parte de uma regex em um minuto. Por enquanto, lembre-se de que a regex acima não _sabe_ nada sobre datas. Acontece que conseguimos criar uma expressão regular que corresponde ao padrão ou ao formato da data. Todos os itens a seguir correspondem a essa regex, mesmo que não sejam datas válidas:

```
32-ABC-7894
30-FEV-1978
00-AAA-9999
```

## Existe Regex no C#?

Sim, é claro. Mas isso não vem da própria linguagem. Em vez disso, o suporte a regex vem da [.NET's BCL (Base Class Library),](https://learn.microsoft.com/pt-br/dotnet/standard/class-library-overview) que é essencialmente a biblioteca padrão do C#.

## Por Que Usar Regex em C#?

Como você viu, regex é algo a ser usado para expressar um padrão que pode corresponder a um determinado texto. 

Na prática, todos os usos de regex em C# ou em outras linguagens se resumem a três motivos: validação, manipulação e extração.

### Validação

Um caso de uso incrivelmente comum para regex é a validação de dados. Por exemplo, digamos que você tenha um formulário da Web e queira garantir que um determinado campo só aceite entradas em um formato específico. Como resolver isso? O Regex vem em seu socorro.

### Manipulação

Às vezes, você precisa alterar informações dentro do texto. Vamos voltar ao exemplo anterior. Imagine que, por motivos de compliance, você precise remover todos os números de telefone desse corpo de texto e substituí-los pela palavra "REDACTED". Novamente, as expressões regulares seriam perfeitas para essa situação.

É interessante notar que as linguagens de programação não são as únicas a usar expressões regulares para resolver problemas. Até mesmo os editores de texto, como o Notepad++, oferecem recursos de localizar e substituir com o auxílio de expressões regulares.

## Extração

Digamos que você tenha uma quantidade considerável de texto. Esse texto contém números de telefone que você precisa extrair. Você conhece o formato desses números e o fato de que eles estão dentro do texto, mas esse é o limite do seu conhecimento.

Como você faria para extrair essas informações? Um regex C# bem feito certamente seria útil nessa situação.

## Como usar o Regex em C#: Primeiros passos na prática

O C# é uma [linguagem orientada a objetos](https://stackify.com/oop-concepts-c-sharp/), portanto, não é de surpreender que você use uma classe para trabalhar com regex no C#. Mais especificamente, a classe de que estou falando é apropriadamente chamada de `Regex` e reside no namespace `System.Text.RegularExpressions`.

### C# Regex: Um exemplo de validação

Vamos começar com um exemplo simples de validação sobre como usar regex para validar se várias cadeias de caracteres correspondem a um determinado padrão. A primeira etapa é adicionar a seguinte instrução **using** ao seu código:

{% highlight c# %}
using System.Text.RegularExpressions;
{% endhighlight %}

Agora, vamos criar um array de strings e preenchê-la com alguns valores:

{% highlight c# %}
var candidates = new[]
{
    "28-JUL-2023",
    "whatever",
    "89-ABC-1234",
    "11-JUN-2022",
    "11-JUN-2022, uma data e outras coisas",
    "Isso certamente não é uma data"
};
{% endhighlight %}

Por fim, percorreremos os valores e usaremos o método estático `IsMatch` da classe `Regex` para verificar qual das cadeias de caracteres corresponde ao padrão desejado:

{% highlight c# %}
var pattern = "[0-9]{2}-[A-Z]{3}-[0-9]{4}";
foreach (var c in candidates)
{
    if (Regex.IsMatch(c, pattern))
    {
        Console.WriteLine($"A string '{c}' corresponde ao padrão '{pattern}'");
    }
}
{% endhighlight %}

Antes de prosseguir, vamos detalhar o padrão parte por parte:

- **\[0-9\]{2}**: A primeira parte significa "Corresponde exatamente a dois caracteres, que devem ser dígitos de 0 a 9".
- **\-**: Esse caractere corresponde exatamente a um hífen.
- **\[A-Z\]{3}**: Aqui, a expressão diz: "Vamos corresponder exatamente a três caracteres, que podem ser qualquer uma das letras de A a Z."
- **\-**: Isso corresponde a outro hífen
- **\[0-9\]{4}**: Isso já deve ser fácil de entender, certo? Exatamente quatro números.

Agora, vamos executar o código e ver o que obtemos:

```
A string '28-JUL-2023' corresponde ao padrão '[0-9]{2}-[A-Z]{3}-[0-9]{4}'
A string '89-ABC-1234' corresponde ao padrão '[0-9]{2}-[A-Z]{3}-[0-9]{4}'
A cadeia de caracteres '11-JUN-2022' corresponde ao padrão '[0-9]{2}-[A-Z]{3}-[0-9]{4}'
A cadeia de caracteres '11-JUN-2022, a date plus other stuff' corresponde ao padrão '[0-9]{2}-[A-Z]{3}-[0-9]{4}'
```

Os três primeiros resultados provavelmente não o surpreenderam. Eu até incluí algo que não é uma data, mas que corresponde ao padrão que estamos usando para realmente enfatizar que as expressões regulares tratam de padrões e formas e não de qualquer semântica dos dados que estamos procurando.

Entretanto, o quarto resultado pode tê-lo surpreendido. O texto de fato começa com dados que correspondem ao padrão que estamos procurando, mas depois tem algum texto adicional. E mesmo assim, essa string correspondeu!

A explicação para esse comportamento é simples e está explicada para nós no [summary](https://learn.microsoft.com/pt-br/dotnet/api/system.text.regularexpressions.regex.ismatch?view=net-7.0#system-text-regularexpressions-regex-ismatch(system-string-system-string)) do método `IsMatch`:

```
Indica se a expressão regular especificada encontra uma correspondência na cadeia de caracteres de entrada especificada.
```

A expressão regular de fato encontrou uma correspondência na string de entrada especificada ("11-JUN-2022, a date plus other stuff"), e é por isso que foi considerada uma correspondência.

Mas e se quiséssemos uma correspondência exata? Nesse caso, seria necessário alterar o padrão, adicionando um acento circunflexo ("^") ao início do padrão e um cifrão ("$") ao seu final. Em outras palavras, veja como o padrão deve ficar agora:

{% highlight c# %}
var pattern = "^[0-9]{2}-[A-Z]{3}-[0-9]{4}$";
{% endhighlight %}

Se executarmos o código agora, ele exibirá apenas as cadeias de caracteres que são uma correspondência exata com o padrão:

```
A string '28-JUL-2023' corresponde ao padrão '^[0-9]{2}-[A-Z]{3}-[0-9]{4}
```

### C# Regex: Um exemplo de manipulação

Considere que você tem um texto que contém dados sensíveis do usuário. Devido a questões de privacidade/compliance, você deseja excluir esses dados. Felizmente para você, é muito fácil usar uma regex para isso. 

Vamos começar criando uma matriz contendo nomes e números de telefone de pessoas fictícias:

{% highlight c# %}
var contacts = new[] {
    "Emily Johnson,(555) 123-4567",
    "Benjamin Williams,(555) 987-6543",
    "Olivia Davis,(555) 222-3333",
    "Alexander Smith,(555) 444-5555",
    "Sophia Brown,(555) 777-8888",
    "William Anderson,(555) 111-2222",
    "Ava Martinez,(555) 666-7777",
    "James Thompson,(555) 888-9999",
    "Isabella Wilson,(555) 333-4444",
    "Michael Taylor,(555) 777-1111"
};
{% endhighlight %}

Em seguida, vamos criar o padrão para corresponder aos números de telefone:

{% highlight c# %}
var pattern = @"\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}";
{% endhighlight %}

O padrão acima é um pouco mais complexo do que os que usamos anteriormente, mas ainda é simples. No entanto, há alguns elementos novos:

- **A barra invertida (\\):** Precisamos dela aqui para escapar dos parênteses de abertura e fechamento, que é um caractere com significado em uma expressão regular. Nesse caso, queremos de fato corresponder a um caractere "(", portanto, precisamos escapar dele.
- **O caractere \\s:** corresponde a um único espaço.

Por fim, vamos percorrer essa matriz e, para cada item, usar o método `Regex.Replace` para gerar uma nova string na qual o número de telefone é substituído por todos os zeros:

{% highlight c# %}
foreach (var contact in contacts)
{
    Console.WriteLine(
        Regex.Replace(contact, pattern, "(000) 000-0000"));
}
{% endhighlight %}

Usar o método estático `Replace` é fácil. Embora ele tenha várias sobrecargas, a que usamos recebe apenas três argumentos:

* a string de entrada
* o padrão que você deseja corresponder
* a string de substituição

Depois de executar o código, eis o resultado que obtemos:

```
Emily Johnson,(000) 000-0000
Benjamin Williams,(000) 000-0000
Olivia Davis,(000) 000-0000
Alexander Smith,(000) 000-0000
Sophia Brown,(000) 000-0000
William Anderson,(000) 000-0000
Ava Martinez,(000) 000-0000
James Thompson,(000) 000-0000
Isabella Wilson,(000) 000-0000
Michael Taylor,(000) 000-0000
```

### C# Regex: Um exemplo de extração

Para o nosso último exemplo, vamos extrair dados de uma string usando uma expressão regular. Vamos começar convertendo o array do exemplo anterior em uma única string:

{% highlight c# %}
var contacts =
    "Emily Johnson+(555) 123-4567" +
    "\nBenjamin Williams+(555) 987-6543" +
    "\nOlivia Davis+(555) 222-3333" +
    "\nAlexander Smith+(555) 444-5555" +
    "\nSophia Brown+(555) 777-8888" +
    "\nWilliam Anderson+(555) 111-2222" +
    "\nAva Martinez+(555) 666-7777" +
    "\nJames Thompson+(555) 888-9999" +
    "\nIsabella Wilson+(555) 333-4444" +
    "\nMichael Taylor+(555) 777-1111";
{% endhighlight %}

Em seguida, definimos o padrão novamente (o mesmo) e usamos o método estático `Matches` para obter todas as correspondências da string:

{% highlight c# %}
var pattern = @"\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}";
MatchCollection matches = Regex.Matches(contacts, pattern);
{% endhighlight %}

A classe `MatchCollection` contém todas as cadeias de caracteres que corresponderam ao padrão que fornecemos ao método. Esse objeto é enumerável, portanto, podemos fazer um loop sobre ele com um foreach:

{% highlight c# %}
Console.WriteLine("Aqui estão os números de telefone extraídos:");
foreach (Match match in matches)
{
    Console.WriteLine(match.Value);
}
{% endhighlight %}

E, finalmente, nossos resultados: 

{% highlight c# %}
Aqui estão os números de telefone extraídos:
(555) 123-4567
(555) 987-6543
(555) 222-3333
(555) 444-5555
(555) 777-8888
(555) 111-2222
(555) 666-7777
(555) 888-9999
(555) 333-4444
(555) 777-1111
{% endhighlight %}

## C# Regex: Uma Ferramenta Indispensável

Como dissemos na introdução, a manipulação de texto é um elemento básico da programação, e as expressões regulares facilitam essa tarefa. Neste guia de regex em C#, você aprendeu o que são expressões regulares, seus cenários de uso mais comuns e como começar a usar expressões regulares em C#.

Antes de ir embora, algumas dicas:

- Faça mais experimentos com a classe `Regex`. Ela oferece muitos recursos, e os métodos que usamos hoje têm muitas sobrecargas com recursos úteis.
- Saiba mais e pratique a escrita de expressões regulares. [Aqui está um ótimo site](https://regexr.com/) que você pode usar.
- Informe-se sobre as considerações de desempenho do C# regex. Por exemplo, leia este [artigo da Microsoft sobre a compilação e a reutilização de expressões regulares](https://learn.microsoft.com/pt-br/dotnet/standard/base-types/compilation-and-reuse-in-regular-expressions?redirectedfrom=MSDN).

Por fim, se quiser saber mais sobre o C# em geral, o blog da Stackify está repleto de recursos úteis. Como sugestão, dê uma olhada em [os prós e contras dos 3 principais frameworks de teste de unidade para C#](https://stackify.com/unit-test-frameworks-csharp/), [como capturar exceções e localizar erros de aplicativos em C#](https://stackify.com/csharp-catch-all-exceptions/) e [como funciona a reflexão em C#](https://stackify.com/what-is-c-reflection/).

Obrigado pela leitura!
