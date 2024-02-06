---
title: "Operador 'Join' do LINQ: Um Tutorial Completo"
ref: linq-join-operator
lang: pt
layout: post
author: Carlos Schults
description: LINQ oferece uma maneira fluente, intuitiva e consistente de consultar conjuntos de dados. Aprenda como fazer joins em LINQ neste guia.
permalink: /pt/operador-linq-join
canonical: https://stackify.com/the-linq-join-operator-a-complete-tutorial/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1617641333/reduce-cyclomatic-complexity/reduce-cyclomatic-complexity-1038x437.jpg
tags:
- csharp
- linq
- dotnet
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1617641333/reduce-cyclomatic-complexity/reduce-cyclomatic-complexity-1038x437.jpg)

*NOTA: Eu escrevi este artigo, originalmente, para o blog da Stackify. Caso lhe interesse, você pode [ver o artigo original, em inglês, no site deles]({{ page.canonical }}).*

Acho que a maioria dos desenvolvedores C# concordaria que o LINQ é parte essencial da experiência de escrever código com a linguagem. O LINQ oferece uma maneira fluente, intuitiva e consistente de consultar conjuntos de dados. Neste artigo, ajudaremos você a dominar o LINQ, abordando o operador `join`.

Vou abrir o post com uma definição do próprio LINQ, para que estejamos todos na mesma página. Depois disso, você verá uma explicação das operações de join no LINQ. Depois, é hora de arregaçar as mangas e colocar a mão na massa com nosso guia prático sobre o operador de `join`.

Vamos começar.

## O Quê é LINQ?
[LINQ](https://learn.microsoft.com/pt-br/dotnet/csharp/linq/) significa _Language Integrated Query_. É um recurso do C# que oferece uma sintaxe única e consistente para consultar conjuntos de dados, independentemente da origem deles. A principal vantagem do LINQ é que você pode usar a mesma sintaxe para consultar dados na memória, em um banco de dados, em arquivos XML e assim por diante.

O LINQ está disponível em dois "sabores" diferentes: a sintaxe de consulta (query syntax) e a sintaxe de método (method syntax).

A sintaxe de consulta utiliza palavras-chave especiais para criar uma sintaxe que é familiar a qualquer pessoa que tenha trabalhado com SQL. Aqui está um exemplo que consulta uma sequência de números, filtrando os maiores que 5:

{% highlight c# %}
int[] numbers = { 2, 8, 4, 9, 3, 6, 1, 7, 5 };
var largerThanFive =
    from num in numbers
    where num > 5
    select num;
{% endhighlight %}

A syntaxe de método usa métodos de extensão para realizar a mesma consulta:

{% highlight c# %}
int[] numbers = { 2, 8, 4, 9, 3, 6, 1, 7, 5 };
var largerThanFive = numbers.Where(x => x > 5);
{% endhighlight %}

## O que é o operador LINQ Join?

Ao trabalhar com dados, um cenário comum é ter duas fontes de dados que você deseja combinar com base em alguns critérios. Por exemplo, você pode ter uma tabela `Books` (Livros) e uma tabela `Authors` (Autores) em seu banco de dados, com um relacionamento de um para muitos entre elas, ou seja, um autor pode ser autor de muitos livros, mas cada livro tem apenas um autor. Se você precisar compilar uma lista de livros que contenha o nome do autor, precisará executar uma junção para fazer a correspondência entre cada linha da tabela `Books` e sua contraparte na tabela `Authors`.

Uma junção no LINQ é essencialmente a mesma coisa: uma operação em que você pode mesclar duas coleções de acordo com alguns critérios que você define.

## O operador LINQ Join na prática

Os exemplos sempre deixam as coisas mais claras. Então, vamos ver como usar o operador `join` na prática.

### **Iniciando com um problema**

Digamos que você tenha um aplicativo de comércio eletrônico com alguns dados sobre categorias:

|Id |Name       |
|---|-----------|
|1  |Electronics|
|4  |Toys       |
|5  |Stationery |
|7  |Books      |
|10 |Clothes    |


Agora, vamos ver alguns produtos:


|Id |Name               |Category_Id|
|---|-------------------|-----------|
|1  |Amazon Kindle      |1          |
|2  |Refactoring        |7          |
|3  |C# in Depth        |7          |
|4  |Legal Pad 50 sheets|5          |

Você já entendeu aonde isso vai, né? A próxima coisa que você deseja fazer é produzir uma única coleção, com a lista de produtos e os nomes das categorias às quais eles pertencem. Em outras palavras, uma visualização como esta:

|Id |Name               |Category   |
|---|-------------------|-----------|
|1  |Amazon Kindle      |Electronics|
|2  |Refactoring        |Books      |
|3  |C# in Depth        |Books      |
|4  |Legal Pad 50 sheets|Stationery |

### Resolvendo o problema: executando um LINQ Inner Join

Como seria essa operação no código? Em primeiro lugar, precisamos de código para representar nossas categorias e produtos. Graças ao recurso de `record` do C#, duas linhas de código são suficientes para isso:

{% highlight c# %}
public record Product(int Id, string Name, int CategoryId);
public record Category(int Id, string Name);
{% endhighlight %}


Agora, vamos ter uma lista de cada tipo:

{% highlight c# %}
var categories = new List<Category>
{
    new Category(1, "Electronics"),
    new Category(4, "Toys"),
    new Category(5, "Stationery"),
    new Category(7, "Books"),
    new Category(10, "Clothes" (Categoria 10, "Roupas")
};

var products = new List<Product>
{
    new Product(1, "Amazon Kindle", 1),
    new Product(2, "Refactoring", 7),
    new Product(3, "C# In Depth", 7),
    new Product(4, "Legal Pad 50 Sheets", 5),
    new Product(5, "Surgical Gloves", 12)
};
{% endhighlight %}


Como você pode ver, a lista de produtos tem um produto adicional (luvas cirúrgicas) cujo ID de categoria não corresponde a nenhuma das categorias disponíveis. Tenha isso em mente, pois será relevante em um momento.

Agora, vamos escrever o código para realizar essa união. Vou mostrar o código de uma só vez e depois eu explico:

{% highlight c# %}
var query =
    from p in products
    join c in categories
    on p.CategoryId equals c.Id
    select new
    {
        Id = p.Id,
        Name = p.Name,
        Category = c.Name
    };

foreach (var line in query)
{
    Console.WriteLine(line);
}
{% endhighlight %}

Agora, a explicação:

**from p in products** -> estamos definindo a origem de uma de nossas fontes de dados
* **join c in categories** -> Aqui, estamos dizendo que queremos juntar a coleção anterior com esta
*on p.CategoryId equals c.Id** -> Essa é a condição para a união: o CategoryId em cada produto deve corresponder ao Id de uma categoria
* **select new...** \-> Aqui, estamos aproveitando o recurso de objetos anônimos do C# para criar um novo objeto em tempo real, que tem as propriedades que desejamos

O resultado dessa consulta é um `IEnumerable` do nosso objeto anônimo. Em seguida, iteramos por cada item dessa coleção, exibindo-o no console. Este é o resultado:
`
```
{ Id = 1, Name = Amazon Kindle, Category = Electronics }
{ Id = 2, Name = Refactoring, Category = Books }
{ Id = 3, Name = C# In Depth, Category = Books }
{ Id = 4, Name = Legal Pad 50 Sheets, Category = Stationery }
```

Aqueles que se lembram das aulas de banco de dados perceberão que a junção LINQ que realizamos é equivalente a uma junção interna (_inner join_) no SQL. Em outras palavras, somente os itens que têm uma correspondência são retornados. Em SQL, a consulta equivalente seria a seguinte:

{% highlight sql %}
SELECT p.Id, p.Name, c.Name AS Category
FROM products AS p
JOIN categories AS c ON p.CategoryId = c.Id
{% endhighlight %}

### Executando uma junção externa (OUTER JOIN) no LINQ

E se você quisesse executar o equivalente a um `OUTER JOIN` do SQL? Ou seja, você deseja recuperar todos os produtos, mesmo aqueles que não correspondem a nenhuma categoria. Como fazer isso?

Aqui está a consulta atualizada:

{% highlight c# %}
var query =
    from p in products
    join c in categories
    on p.CategoryId equals c.Id into joinedCategories
    from c in joinedCategories.DefaultIfEmpty()
    select new
    {
        Id = p.Id,
        Name = p.Name,
        Category = c?.Name
    };
{% endhighlight %}


Parece semelhante, mas há duas diferenças:

* **on p.CategoryId equals c.Id into joinedCategories** \-> aqui, depois de unir produtos com categorias, enviamos o resultado, como uma sequência agrupada, para a variável de intervalo **joinedCategories**
* **from c in joinedCategories.DefaultIfEmpty()** -> Em seguida, recuperamos os itens da groupedSequence, usando o método DefaultIfEmpty() para retornar o valor padrão quando nenhuma correspondência for encontrada
* **Category = c?.Name** -> Por fim, ao atribuir o nome da categoria à propriedade Category do nosso objeto anônimo, precisamos usar o operador condicional nulo para evitar uma exceção de referência nula (já que o valor padrão de Category é nulo porque é um [tipo de referência](https://carlosschults.net/pt/tipos-valor-referencia-em-csharp/)).

O resultado agora é diferente:

{% highlight json %}
{ Id = 1, Name = Amazon Kindle, Category = Electronics }
{ Id = 2, Name = Refactoring, Category = Books }
{ Id = 3, Name = C# In Depth, Category = Books }
{ Id = 4, Name = Legal Pad 50 Sheets, Category = Stationery }
{ Id = 5, Name = Surgical Gloves, Category = }
{% endhighlight %}

Como você pode ver, o produto "Surgical Gloves" (Luvas cirúrgicas) agora aparece, mesmo que não tenha uma categoria correspondente.

### Inner Join do LINQ com a condição `Where`

Realizar uma junção com uma cláusula `where` é muito fácil. Neste exemplo, realizaremos uma junção interna, filtrando apenas os produtos cujo id seja igual ou maior que 3:

{% highlight c# %}
var query =
    from p in products
    where p.Id >= 3
    join c in categories
    on p.CategoryId equals c.Id
    select new
    {
        Id = p.Id,
        Name = p.Name,
        Category = c.Name
    };
{% endhighlight %}

### Inner Join do LINQ com várias condições

Se você quiser usar várias condições em sua junção, basta usar mais de uma cláusula where. Vamos atualizar nossa consulta mais uma vez:

{% highlight c# %}
var query =
    from p in products
    join c in categories
    on p.CategoryId equals c.Id
    where p.Id >= 3
    where c.Name.EndsWith('s')
    select new
    {
        Id = p.Id,
        Name = p.Name,
        Category = c.Name
    };
{% endhighlight %}

Aqui, estamos filtrando apenas as categorias cujos nomes terminam com a letra "s".`

### LINQ Join com chave composta

Até agora, todos os nossos exemplos usaram chaves únicas para fazer a correspondência. Você também pode usar chaves compostas, ou seja, mais de um valor, para fazer a correspondência.

Suponha que as nossas classes `Product` e `Category` tenham adquirido uma nova propriedade chamada `Status`, que é um enum que pode variar entre três estados: `Pending` (pendente), `Active` (ativo) e `Archived` (arquivado). Agora, a propriedade Status também precisa ser usada para a correspondência.

Todos os nossos produtos estão ativos, mas nem todas as categorias:

{% highlight c# %}
var categories = new List<Category>
{
    new Category(1, "Electronics", Status.Active),
    new Category(4, "Toys", Status.Active),
    new Category(5, "Stationery", Status.Archived),
    new Category (7, "Books", Status.Pending),
    new Category (10, "Clothes", Status.Active)
};

var products = new List<Product>
{
    new Product(1, "Amazon Kindle", 1, Status.Active),
    new Product(2, "Refactoring", 7, Status.Active),
    new Product(3, "C# In Depth", 7, Status.Active),
    new Product(4, "Legal Pad 50 Sheets", 5, Status.Active),
    new Product(5, "Surgical Gloves", 12, Status.Active)
};
{% endhighlight %}

Fica assim a consulta atualizada:

{% highlight c# %}
var query =
    from p in products
    join c in categories
    on new { Id = p.CategoryId, Status = p.Status }
    equals new { Id = c.Id, Status = c.Status }
    select new
    {
        Id = p.Id,
        Name = p.Name,
        Category = c.Name
    };
{% endhighlight %}

Não é muito mais complicado do que antes. A diferença é que, agora, usamos um objeto anônimo para realizar a comparação usando as propriedades id e status.

Um único resultado é exibido a partir dessa consulta:

{% highlight c# %}
{ Id = 1, Name = Amazon Kindle, Category = Electronics }
{% endhighlight %}


## Conclusão

Como vimos, o LINQ é uma parte essencial do trabalho com o C#. Você pode aproveitar o LINQ em muitos cenários diferentes, desde o trabalho com dados na memória até XML e SQL. Você pode usar o LINQ em ORMs, como [NHibernate e Entity Framework](https://stackify.com/entity-framework-core-nhibernate/).

As equipes que desejam tornar suas experiências com LINQ ainda melhores podem usar as ferramentas à sua disposição. Por exemplo, [Stackify's Prefix](https://stackify.com/prefix/) e [Retrace](https://stackify.com/retrace-code-profiling/) oferecem recursos avançados de rastreamento, criação de perfil e registro centralizado que ajudam as equipes a inspecionar seu código para encontrar oportunidades de melhorias de desempenho, o que inclui consultas LINQ.