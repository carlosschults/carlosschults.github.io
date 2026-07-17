---
title: "Programação Funcional em C#: Mapeando, Filtrando e Reduzindo Em Busca de Código Limpo"
ref: functionalcsharp
lang: pt
layout: post
author: Carlos Schults
description: Neste post você vai aprender como usar o estilo funcoinal pode melhorar seu código em C#
permalink: /pt/programacao-funcional-csharp/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1548200356/Untitled_xfahmy.jpg
tags:
- csharp
- boas-praticas
- programacao-funcional
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1548200356/Untitled_xfahmy.jpg)

*NOTA: Este post foi originalmente publicado no blog da SubMain. Você pode [ler o original aqui, em inglês](https://blog.submain.com/csharp-functional-programming/). Aproveite para conferir o CodeIt.Right, um produto que pode ajudar a melhorar seu código.*

Você provavelmente pensa no C# como uma linguagem orientada a objeto. Mas é possível que você, ao programar em C#, tenha usado conceitos de programação funcional sem sequer ter notado.

O post de hoje trata desse tema. Vou começar abordando as vantagens da programação funcional, mostrando a justificativa se aplicá-la mesmo usando uma assim chamada linguagem orientada a objetos. Depois vou explicar como você já está usando um pouco do estilo funcional em seu código C#, mesmo sem estar ciente disso. Finalmente, vou demonstrar como aplicar um pouco de pensamento funcional ao seu código pode torná-lo mais limpo, seguro e mais expressivo.

## Programação Funcional em C#: Por quê?

Nós sabemos que o .NET framework oferece algumas capacidades funcionais na forma dos métodos de extensão do LINQ, mas qual seria a vantagem de usá-las?

Para responder bem essa pergunta, precisamos voltar um passo e entender os atrativos da programação funcional em si. Na minha opinião, para começar a entender os benefícios da programação funcional você precisa primeiro entender dois tópicos: **funções puras** e **imutabilidade**.

**Funções puras** são funções que apenas podem acessar os valores que receberam por argumentos e, como consequência, não podem ter nenhum efeito colateral. **Imutabilidade** se refere a objetos ou estruturas de dados que, uma vez inicializados, não podem sofrer nenhuma mudança em seus valores. Isso os torna mais fáceis de entender e seguros para serem usados em código com múltiplas threads.

## Operações Fundamentais da Programação Funcional e Como Executá-las Usando C#

Como já cobrimos o *o quê* e o *porquê* da programação funcional, está na hora de vermos o *como*.

Eu vou abordar três operações: **map**, **filter** e **reduce**. Vou começar mostrando alguns problemas, usando uma abordagem procedural tradicional para resolvê-los. Em seguida, vou apresentar a alternativa usando o estilo funcional.

## Map

Em termos simples, a operação "map" recebe uma sequência de valores, aplica alguma transformação em cada um dos itens, e retorna uma nova sequência contendo os valores resultantes. Vamos ver alguns exemplos:

Imagine que você escreveu o código a seguir, devido à requisição de algum cliente:

{% highlight c# %}
	static void AddThreeToEachElement(int[] arr)
	{
	    for (var i = 0; i < arr.Length; i++)
	    {
	       arr[i] += 3;
	    }
	}
{% endhighlight %}

É uma função que adiciona três a cada elemento do [array](https://blog.submain.com/c-array/) de inteiros especificado. Bem tranquilo.

Então aparece o pedido de uma nova função. Dessa vez, é para adicionar cinco a cada elemento do vetor. Ignorando a [regra de três,](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)) você pula direto para uma versão generalizada, parametrizando o número a ser adicionado:

{% highlight c# %}
	static void AddNumberToEachElement(int[] arr, int n)
	{
	   for (var i = 0; i < arr.Length; i++)
	   {
	        arr[i] += n;
	   }
	}
{% endhighlight %}

Então aparece um novo pedido. Agora você tem que escrever uma função para multiplicar cada elemento do array especificado por três. Não vou me dar ao trabalho de adicionar o código de exemplo, porque seria bem trivial. A esse ponto, você já sabe o suficiente para evitar fixar o número no código, então você provavelmente vai pular direto para uma versão generalizada. Mesmo assim, alguma duplicação ainda vai permanecer: o laço de repetição em si. E se você pudesse manter o loop e parametrizar a ação a ser aplicada nos itens?

### A Maneira Funcional

Leve em consideração o que você acabou de ler sobre funções puras—e também seu conhecimento prévio de [boas práticas de programação](https://blog.submain.com/coding-best-practices-short-time/) em geral—e pense em maneiras nas quais o código do exemplo poderia ser melhorado.

No meu ponto de vista, os problemas principais são:

- **O código é muito específico**. Não é fácil modificá-lo para acomodar outras transformações a serem aplicadas nos elementos do array. O código só faz uma soma, e é só.
- **Muito código boilerplate**. Olhe novamente o exemplo anterior. Conte as linhas. Há sete, das quais apenas uma realmente tem algo a ver com a regra de negócio do método.

Como que o estilo funcional pode melhorar isso? O código a seguir mostra como eu reescreveria o exemplo em F#, por exemplo:

{% highlight c# %}
	let result = Seq.map (fun x -> x + 3) numbers
{% endhighlight %}

Aqui, "numbers" represente uma sequência de números que eu consegui de alguma forma. Então eu uso a função **map** que pertence ao módulo **Seq**, passando a sequência como um dos parâmetros, junto com uma função que recebe um número inteiro e adiciona três a ele.

### O Jeito Funcional, sabor C#

O .NET implementa a operação map na forma do método de extensão do LINQ chamado "Select." Então, para converter o código em F# acima para C#, você faria assim:

var result = numbers.Select(x => x + 3);

É importante salientar o que o tipo da sequência resultante não precisa ser o mesmo da sequência de entrada. Você tem uma lista de objetos do tipo "Employee" e precisa recuperar os seus ids, na forma de uma sequência de ints? Fácil:

{% highlight c# %}
	List<Employee> employees = EmployeeRepository.All();
	IEnumerable<int> ids = employees.Select(x => x.Id);
{% endhighlight %}


## Filter

A operação filter é, sem dúvida, a mais fácil das três. Ela tem um nome bastante intuitivo, e a necessidade de se filtrar coisas é algo tão comum na programação que eu tenho certeza de que você adivinhou o que ela faz só pelo nome (caso já não soubesse antes).

Mesmo assim, vamos defini-la. A operação filter filtra uma sequência, retornando uma nova sequência contendo apenas os itens aprovados por um ou mais critérios especificados.

### O Jeito Imperativo

Já que nós usamos o exemplo de "employees" na seção anterior, vamos continuar dentro do mesmo tema. Digamos que você precise recuperar uma lista com os funcionários que tenham tirado pelo menos três dias de atestado médico.

Em um estilo mais procedura, você provavelmente escreveria algo assim:

{% highlight c# %}
	public static List<Employee> GetEmployeesWithAtLeastNSickdays(List<Employee> employees, int number)
	{
	    List<Employee> result = new List<Employee>();
	
	    foreach (var e in employees)
	    {
	        if (e.Sickdays >= number)
	        {
	            result.Add(e);
	        }   
	    }
	
	    return result;
	}
{% endhighlight %}

Eu não acho que o código acima esteja errado. O nome do método é um pouco longo, porém bastante descritivo. O código faz o que promete. E a legibilidade está boa.

Mas da mesma forma que no exemplo anterior, nós poderíamos fazer o argumento de que o código está poluído demais Podemos dizer quem, na prática, a única linha que faz algo relacionado à lógica do problema é o teste do if. Todas as outras linhas são código boilerplate. Será que a abordagem funcional consegue melhorar a situação?

### A Maneira Funcional

Vamos reescrever o código acima usando LINQ:

{% highlight c# %}
	public static List<Employee> GetEmployeesWithAtLeastNSickdays(List<Employee> employees, int number)
	{
	    return employees.Where(x => x.SickDays >= n).ToList();
	}
{% endhighlight %}

Here we use the “Where” extension method, passing the filtering criterium as a delegate. To be honest, the outer method became not very useful since it just delegates the work. In real life, I’d get rid of it.

Aqui nós usamos o método "Here", passando o critério de filtragem como parâmetro. Para ser honesto, o método de fora não é tão útil, já que ele só delega o trabalho para o método do LINQ. Na vida real, em código de produção, eu jogaria ele fora.

## Reduce

Geralmente, a operação reduce é a que algumas pessoas costumam ter dificuldade entendendo. Mas não tem nada de difícil. Pense dessa forma: você tem uma sequência de alguma coisa, e também tem uma função que recebe duas dessas coisas e retorna uma.


Então você começa a aplicar a função. Você a aplica nos dois primeiros elementos na sequência e guarda o resultado. Então aplica de novo, com o resultado e o terceiro elemento. Depois faz a mesma coisa, aplicando a função ao resultado da última etapa e o quarto elemento, e assim sucessivamente.

O exemplo clássico do reduce é a soma de uma lista de números, então é exatamente isso que vamos fazer.

### O Modo Imperativo

Suponha que temos que somar um punhado de números inteiros. Poderíamos fazer assim:

{% highlight c# %}
	public int Sum(IEnumerable<int> numbers)
	{
	    var result = 0;
	    foreach (var number in numbers)
	    {
	        result += number;
	    }
	
	    return result;
	}
{% endhighlight %}

A essa altura do campeonato você já pode até prever o que eu tenho a dizer a respeito desse código: não está necessariamente errado, mas é pouco flexível e cheio de ruído. Mas a programação funcional pode nos salvar.

### O Modo Funcional

No .NET framework, a operação "reduce" toma a forma do método de extensão "Aggregate". Dessa vez, vou me livrar do método externo e escrever a solução usando LINQ de uma vez:

{% highlight c# %}
	var sum = number.Aggregate((x, y) => x + y);
{% endhighlight %}

A aparência disso é um pouco mais complexa, mas não se assuste. Nesse caso, nós estamos apenas passando uma função que recebe dois parâmetros ao invés de um só, como nos exemplos anteriores. Precisa ser assim, já que a função precisa ser aplicada a dois elementos da sequência cada vez.

But as it turns out, there’s an even easier way of solving this particular problem (adding a bunch of numbers). Since summing a sequence of numbers is such a common use case, there’s a dedicated method to do just that. It’s called, not surprisingly, “Sum”:

Mas na verdade tem uma maneira ainda mais fácil de resolver esse problema em particular (somar vários números).
Sendo esse um caso de uso tão comum, o framework disponibiliza um método dedicado para fazer só isso. O qual, surpreendendo a um total de zero pessoas, é chamado de "Sum":

{% highlight c# %}
	var sum = numbers.Sum();
{% endhighlight %}

Para que serve o "Aggregate", então? Adicionar uma lista de números é apenas uma das muitas aplicações do reduce, mas você pode usá-lo com qualquer operação binária, como concatenação de strings ou a soma de tipos customizados.

## O Veredito: A Abordagem Funcional é Melhor?

Após esses exemplos, você talvez esteja em dúvida se o jeito funcional de fazer as coisas é realmente melhor. Seria extremamente difícil definir o que "melhor" significa, então nem vou tentar. Vamos considerar outro critério: legibilidade.

Apesar de sabermos que legibilidade de código [também pode ser bastante subjetiva,](https://blog.submain.com/evaluate-code-readability/) eu diria que sim, os exemplos funcionais são mais legíveis. Imagine que nós recuperar e somar todos os salários dos funcionários com mais de cinco anos de casa. Nós poderíamos facilmente fazer isso usando um loop, dentro do qual nós testaríamos a condição e acumularíamos o salário em uma variável, caso o teste tenha retornado verdadeiro.

Ou poderíamos escrever isso:

{% highlight c# %}
	var sum = employees.Where(x => x.CompanyTimeInYears > 5).Select(x => x.Salary).Sum();
{% endhighlight %}

Eu honestamente acredito que essa versão é mais legível (e melhor, em geral) que a abordagem procedural. É mais declarativa. Ela demonstra a intenção do **que** estamos tentando fazer sem se preocupar tanto com o **como**.

It almost reads like natural language: “The list of employees where their time in the company is greater than five years, select their salary and sum them”.

Para quem entende inglês, quase parece linguagem natural: "Da lista de todos os funcionários, onde o tempo de empresa é mais de cinco anos, selecione o salário e some."

## Uso Um Pouco de Tempero Funcional e Deixe Seu Código Mais Saboroso

Muitas pessoas usam LINQ por anos sem nem perceber que estão usando conceitos de programação funcional. Eu enxergo isso como prova de que a programação funcional não está além das capacidades do típico desenvolvedor enterprise que não tem uma sólida formação matemática.

Alguns dos conceitos apresentados aqui não são novos nem restritos à programação funcional. Os benefícios de distinguir entre funções que causam efeitos colaterais e as que não causam é a base de princípios como [command-query separation (CQS)](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation), por exemplo.

O objetivo desse post não é ensinar programação funcional para ninguém. Isso está além das minhas capacidades, já que eu ainda estou aprendendo. E além disso, [existem ótimos recursos para aprender programação funcional, para aqueles que se interessarem](https://fsharpforfunandprofit.com).

Ao contrário, o que eu queria fazer aqui era mostrar um pouco do que um estilo funcional pode fazer com seu código: torná-lo mais expressivo, conciso e declarativo. Agora depende de você aplicar o estilo funcional ao código que você escreve.