---
title: "Os Cinco Níveis de Código Legível"
ref: five-levels-readable-code
lang: pt
layout: post
author: Carlos Schults
description: Neste post, eu proponho um modelo para avaliação de legibilidade de código.
permalink: /pt/cinco-niveis-codigo-legivel
img: /img/levels.jpg
tags:
- boas-praticas
- legibilidade
---

![]({{ page.img }})

<span>Foto por <a href="https://unsplash.com/@greysonjoralemon?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Greyson Joralemon</a> no site <a href="https://unsplash.com/photos/w000nNe9Xq8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a></span>  

Recentemente, tenho pensado bastante sobre a legibilidade do código. O que significa para um trecho de código ser legível? É possível definir a legibilidade de forma objetiva? Deveríamos tentar fazer isso?

Essas são algumas das perguntas sobre as quais tenho pensado e, nesta publicação, apresento minhas respostas na tentativa de iniciar uma conversa sobre legibilidade.

Aqui está a versão TL;DR: sim, acredito que definir objetivamente a legibilidade do código é possível e desejável e, neste artigo, sugiro um modelo para avaliar a legibilidade.

## A Importância de Uma Definição de Legibilidade de Código

A legibilidade sempre vai ser um pouco subjetiva e, até certo ponto, essa subjetividade é inofensiva. Entretanto, ela _pode_ causar problemas em alguns cenários. 

Se estivermos trabalhando em uma equipe, é importante definir pelo menos algumas diretrizes objetivas em relação à legibilidade do código, e isso se deve às revisões de código (code reviews). Se o time não conseguir chegar a um consenso sobre o que é código legível, o feedback dos reviews fica parecendo arbitrário.

Em resumo: as equipes precisam de convenções. Uma equipe deve ter uma visão sobre o que constitui um código bom e legível. 

## Um Framework Para Pensar Sobre a Legibilidade Do Código: Níveis

Há pouco tempo, comecei a pensar na legibilidade do código em termos de níveis. Os níveis representam preocupações específicas com relação à legibilidade e são ordenados em termos de prioridade. 

Ou seja, o nível 1 representa as coisas mais básicas que você precisa resolver primeiro, antes de avançar para os níveis mais altos. Arrume o básico e depois vá para o avançado. Tipo a [hierarquia de necessidades de Maslow](https://pt.wikipedia.org/wiki/Hierarquia_de_necessidades_de_Maslow), mas para código.

Você vai ver alguns exemplos de código, em C#. Mas o que vou mostrar aqui se aplica a qualquer linguagem, a menos que eu diga explicitamente o contrário.

Sem mais delongas, aqui estão os cinco níveis de código legível.

## Nível 1: Seu Código Faz O Mínimo Necessário

(Sim, nível um. Por favor, não me enche com isso de que "os programadores começam a contar no zero").

O nível 1 de código legível refere-se ao código que faz o mínimo necessário. Pense em diretrizes simples de legibilidade, como:

* Escolher [nomes descritivos](https://carlosschults.net/pt/como-escolher-bons-nomes/) para variáveis, funções, classes e assim por diante.
* Evitar muitos níveis de indentação.
* Manter a [complexidade ciclomática baixa](https://carlosschults.net/pt/reduzir-complexidade-ciclomatica/).
* Evitar [comentários que não agregam nenhum valor](https://carlosschults.net/pt/tipos-de-comentarios-a-evitar/).
* Manter [funções e outros blocos de código pequenos](https://blog.ploeh.dk/2019/11/04/the-80-24-rule/).
* Evitar [números mágicos](https://pt.wikipedia.org/wiki/N%C3%BAmero_m%C3%A1gico_(programa%C3%A7%C3%A3o_de_sistemas)).

Não é difícil aprender esses tipos de práticas recomendadas. Você pode aprender a maioria delas por meio da experiência, ouvindo o feedback de desenvolvedores mais experientes durante as revisões de código ou lendo livros e até mesmo publicações em blogs como os listados acima.

## Nível 2: Seu Código é Idiomático

Considere a seguinte classe C#:

```csharp
public class Person
{
    private string _name;
    private int _age;

    public Person(string name, int age)
    {
        _name = name;
        _age = age;
    }

    public void SetName(string name)
    {
        _name = name;
    }

    public string GetName() => _name;

    public void SetAge(int age)
    {
        _age = age;
    }

    public int GetAge => _age;
}
```

Não há nada de errado com a classe acima, pelo menos não tecnicamente. O compilador a compila sem problemas e a classe funciona como deveria.

Entretanto, se você tem pelo menos alguma experiência com o C#, notou algo estranho quando viu o código: os métodos getter e setter. A equipe de desenvolvimento do C# transformou os conceitos de getters e setters em um "cidadão de primeira classe" da linguagem desde o início, por meio do conceito de propriedades. Se não houver lógica adicional envolvida na definição e obtenção de valores, o programador poderá usar [propriedades autoimplementadas](https://learn.microsoft.com/pt-br/dotnet/csharp/programming-guide/classes-and-structs/auto-implemented-properties) com um resultado conciso (nem mesmo os campos privados precisam mais ser declarados explicitamente):

```csharp
public class Person
{
    public Person(string name, int age)
    {
        Name = nome;
        Age = idade;
    }

    public string Name { get; set; }
    public int Age { get; set; }
}
```

Tudo isso quer dizer que, para ser legível, um determinado trecho de código precisa ser *idiomático para a linguagem em que está sendo escrito.* Se estiver escrevendo em C#, siga os padrões de codificação e as convenções da linguagem. O mesmo se aplica a Java, JavaScript e qualquer outra linguagem.

A comunidade Python tem um conceito maravilhoso para descrever o código Python que segue os padrões e as filosofias da linguagem: "pythônico". Um trecho de código Python pode funcionar, mas se não for pythônico, os engenheiros experientes em Python acharão o código difícil de trabalhar.

Por que escrever um código idiomático é importante para a legibilidade? Quando você olha para um código - em qualquer linguagem - que não se parece com o que deveria ser, de acordo com o modelo mental que você tem dessa linguagem, fica mais difícil acompanhar o código. 

O código não idiomático aumenta a [complexidade cognitiva](https://linearb.io/blog/cognitive-complexity-in-software) de uma base de código. Isso dificulta a integração de desenvolvedores que estejam familiarizados com os padrões e expressões idiomáticas da linguagem. Se você tiver um projeto open source, o excesso de idiossincrasias no código pode afastar possíveis colaboradores.

É claro que o oposto de tudo isso é verdadeiro.

## Nível 3: Seu Código Revela a Intenção Por Meio Do Uso Tático Da Tipagem

Como o título sugere, este item, diferentemente dos dois anteriores, só se aplica a linguagens estaticamente tipadas - ou, talvez, dinamicamente tipadas que apresentem algum tipo de anotação de tipo opcional.

Vamos começar com um exemplo simples:

```csharp
Canvas.DrawLine(5);
```

Não leve em consideração o número mágico, que por si só já é um problema. Considere que você sabe que o método `DrawLine` tem um único parâmetro, `length`. A linha poderia ter se tornado um pouco mais legível com o uso de um [argumento nomeado,](https://learn.microsoft.com/pt-br/dotnet/csharp/programming-guide/classes-and-structs/named-and-optional-arguments), mas mesmo isso não resolveria o maior problema: qual é a unidade de medida?

Além de prejudicar a legibilidade, esse problema abre a possibilidade de bugs, devido a uma incompatibilidade de unidades - uma parte do código "pensa" que a unidade é centímetros, enquanto outras podem acreditar que é polegadas.

O que estou defendendo em vez disso? Bem, use a tipagem a seu favor. Aqui, uma boa solução seria criar um [value object](https://carlosschults.net/pt/value-objects-ferramenta/) chamado, digamos, `Length`. Esse tipo teria vários métodos factory com o nome de unidades de medida específicas, e seu construtor seria privado. Então, daria para mudar o exemplo anterior para isso:

```csharp
Canvas.DrawLine(Length.FromCentimeters(5));
```

Outro exemplo seria o uso do tipo `TimeSpan` para expressar durações, em vez de usar valores primitivos ou usar a classe [Uri](https://learn.microsoft.com/pt-br/dotnet/api/system.uri?view=net-7.0) em vez de apenas strings.

Talvez você esteja pensando que tudo isso é simplesmente uma forma complicada de dizer "evite a obsessão primitiva". Também, mas tem mais coisas.

Para ilustrar meu ponto de vista, vou compartilhar outro exemplo - talvez um pouco forçado, admito. Digamos que você esteja resolvendo um problema que exija o uso de uma [pilha](https://pt.wikipedia.org/wiki/Pilha_(inform%C3%A1tica)). Nesse caso, nada o impede de usar a classe `List<T>` como uma pilha, certo?

* O método `Add` seria seu substituto para a funcionalidade `push`.
* Para a funcionalidade `pop`, você usaria uma combinação de obter o último elemento da lista por meio de seu indexador e, em seguida, usar o método `RemoveAt` para excluir o item.

A solução acima, apesar de ser um pouco complicada, funcionaria. Mas eu o encorajaria fortemente a usar a classe `Stack<T>` normal. O uso do tipo mais específico tornaria o código imediatamente mais legível para qualquer pessoa que saiba o que é uma pilha. Isso faria com que o código revelasse sua intenção.

Resumindo: a menos que você tenha um motivo justificável para não fazer isso, **sempre prefira o tipo que representa melhor o conceito ou a funcionalidade de que você precisa**. Isso não apenas tornará seu código mais robusto, mas também revelará melhor sua intenção.

## Nível 4: Seu Código Não Mistura Níveis de Abstração

Seu código não deve misturar mais de um nível de abstração. O código que está na parte de "Regras de negócios" da sua base de código não deve mexer com o código que está na parte de "Preocupações de IO", para dar um exemplo.

Por que isso é um problema? Veja a função a seguir:

```csharp
public static double CalculateAverageTemperature(string filePath)
{
    List<ClimaticReading> readings = new();

    try
    {
        using var reader = new StreamReader(filePath);
        while (!reader.EndOfStream)
        {
            var line = reader.ReadLine();
            var values = line?.Split(',') ?? Array.Empty<string>();

            if (values.Length < 2)
                continue;
            
            if (DateTime.TryParse(values[0], out DateTime date) &&
                double.TryParse(
                    values[1],
                    NumberStyles.Float,
                    CultureInfo.InvariantCulture,
                    out double temperature))
            {
                var reading = new ClimaticReading
                {
                    Date = data,
                    Temperature = temperatura
                };
                readings.Add(reading);
            }
        }
    }
    catch (Exception ex)
    {
        throw new InvalidOperationException($"Erro ao ler o arquivo CSV: {ex.Message}");
    }

    if (readings.Count < 3)
    {
        throw new InvalidOperationException("Deve haver pelo menos 3 leituras para calcular a média.");
    }

    readings = readings.OrderBy(leitura => leitura.Temperatura).ToList();

    readings.RemoveAt(0);
    readings.RemoveAt(readings.Count - 1);

    double sum = readings.Sum(reading => reading.Temperature);
    double average = sum / readings.Count;

    return average;
}
```

A função lê e analisa um arquivo .CSV que contém leituras climáticas. As linhas que não têm os dois valores esperados (data e temperatura) são descartadas. Em seguida, ela classifica as leituras, remove os valores mais altos e mais baixos e, por fim, calcula e retorna a média dos valores restantes.

Essa função mistura pelo menos dois níveis de abstração:

* O nível de "lógica de domínio", ou seja, a parte que faz o cálculo
* O nível baixo: leitura e parsing do arquivo .CSV.

Você poderia até argumentar que há três níveis, já que o nível baixo pode ser dividido em dois: manipulação do sistema de arquivos e parsing de arquivos.

Essa função de exemplo não é a coisa mais difícil de ler no mundo, mas certamente é mais difícil do que deveria ser. Ela mistura lógica de domínio com IO. Ela mistura lógica de domínio com tratamento de erros de IO e até mesmo parsing. Uma solução melhor seria ter um método que obtivesse uma coleção de `ClimaticReading` e calculasse e retornasse a média. 

Em outras palavras, uma solução melhor e mais elegante seria ter uma **função pura**. Esse novo método, além de ser mais legível, seria mais robusto, menos propenso a erros e também determinístico, ou seja, sempre retornaria os mesmos resultados para a mesma entrada, tornando-o intrinsecamente [testável por testes de unidade](https://carlosschults.net/pt/testes-unitarios-csharp-intro-tdd/).

## Nível 5: Seu Código Fala a Linguagem Do Negócio

Você atingiu o nível 5 quando escreve um código que fala a linguagem do negócio. Quando você usa termos que são os mesmos que os especialistas no domínio usam.

Em outras palavras: sim, estou praticamente defendendo a mesma coisa que os programadores pragmáticos chamam de "programar mais próximo do domínio", ou que Eric Evans chamou de linguagem ubíqua em seu clássico "Domain-Driven Design: Tackling Complexity in the Heart of Software".

Se o seu código usa termos não ortodoxos em vez de termos do setor, isso dificulta a integração quando você traz novas pessoas que estão familiarizadas com o negócio, mas são novas na base de código. Se o código usar um jargão diferente do que os stakeholders usam, a comunicação se tornará mais cansativa, pois exigirá que você faça um mapeamento constante entre os conceitos apenas para conseguir acompanhar o que está acontecendo.

O nível 5 é, de certa forma, uma consequência lógica do nível 4. Se você separar cuidadosamente as preocupações da sua aplicação, certificando-se de que o código de alto nível não se misture com o código de baixo nível, a tendência é que o código de alto nível fique cada vez mais próximo do domínio em termos de nomenclatura.

## Dê um "Level Up" Na Legibilidade Do Seu Código

A maioria dos programadores concorda que a legibilidade do código é vital. Mas e quanto a concordar com a aparência de um "código legível"? Aí é outra história.

Como eu disse anteriormente, acho que um nível de subjetividade quando se trata de legibilidade é inevitável e inofensivo. Entretanto, no contexto de um time, deve haver pelo menos algum consenso sobre o que é um código legível. Caso contrário, as revisões de código se tornam exercícios de futilidade e o moral da equipe despenca.

Acredito que nosso setor se beneficiaria de uma forma mais objetiva de pensar sobre a legibilidade. Nesta publicação, dei minha pequena contribuição, na forma de um checklist de legibilidade, em ordem de prioridade.

Mas, novamente: a ideia desta publicação não é dar uma resposta definitiva, **mas iniciar uma conversa**. Você acha que os modelos de "níveis" não fazem sentido? Ou talvez queira compartilhar seus próprios níveis?  Convido-o a compartilhar sua opinião por meio de um comentário ou a me enviar um e-mail (meu endereço está na página sobre).

_Agradecimentos especiais a [Mark Seemann](https://blog.ploeh.dk/), [Pedro Barbosa](https://www.linkedin.com/in/pgpbarbosa/) e [Peter Morlion](https://www.linkedin.com/in/petermorlion/) por lerem e darem feedback em rascunhos deste post.
