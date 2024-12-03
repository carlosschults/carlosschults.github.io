---
title: "C# Type Safe: Como a IA Generativa Torna os Tiny-Types Viáveis"
ref: genai-tiny-types
lang: pt-br
layout: post
author: Carlos Schults
description: Tiny types é uma técnica de design poderosa, raramente utilizada. Veja como os LLMs podem mudar isso.
permalink: /pt-br/genai-tiny-types
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1466341001/csharp-min_buiizq.png
tags:
- csharp
- ai
- software-design
- best-practices
---

![]({{ page.img }})

É estranho como nossa memória funciona, não é? Não consigo lembrar exatamente o que jantei há duas noites, ou o motivo pelo qual deixei de ir à academia em alguns dias da semana passada.
Mas me lembro vividamente de um bug específico que corrigi no meu primeiro emprego como programador depois de me formar na faculdade.

Havia este método que não estava funcionando corretamente, e sua assinatura era algo assim:

```csharp
void ProcessOrder(int orderId, int customerId)
```

Eu revisei o código e não consegui encontrar nada de errado. Mas quando comecei a debugar, percebi que o local da chamada estava passando os argumentos na ordem errada — ou seja, `customerId` primeiro e depois `orderId`.

Erros como este são fáceis de cometer e difíceis de detectar mesmo em revisões de código. Até mesmo os testes podem deixar passar, já que você pode ter o azar de fornecer valores que acidentalmente fazem o código funcionar sem explodir tudo.

Como acontece, existe uma ótima maneira de prevenir problemas como o que acabei de descrever. O problema? A maioria dos desenvolvedores acharia que é trabalho demais para se preocupar.

## Tiny Types: A Melhor Técnica de Design de Software Que Ninguém Usa

Eu sei, eu sei. Vou ser o primeiro a admitir que este título é exagerado. "Uma Técnica Interessante de Design de Software Que Muitas Pessoas Não Usam" simplesmente não tem o mesmo impacto, foi mal.

Então, o que é essa coisa de "tiny types"? É uma solução radical para o code smell de obsessão primitiva. Essencialmente, em vez de usar tipos primitivos para conceitos de domínio — por exemplo, usar um `int` para representar um identificador único — você envolve todos eles usando um [objeto de valor](/pt/value-objects-ferramenta/) extremamente simples.

Usando tiny types, poderíamos reescrever a assinatura do método anterior assim:

```csharp
void ProcessOrder(OrderId orderId, CustomerId customerId)
```

### Implementando um Tiny Type
Como seria o tipo `OrderId`?

Para começar, já que `OrderId` deve envolver um int, ele deve receber um int como parâmetro e armazená-lo em algum lugar. Vejamos:

```csharp
public class OrderId
{
    private readonly int _value;
    public OrderId(int value)
    {
        if (value <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(value),
                 "Value must be a positive integer!");
        }
        _value = value;
    }
}
```

Acho que o exemplo acima é um bom começo, você não concorda? Recebemos um int como parâmetro, validamos e lançamos uma exceção em caso de valores zero ou negativos, e então o atribuímos a um campo privado readonly, o que é apropriado, já que `OrderId`, como um objeto de valor, deve ser imutável.

Você sabe do que mais os objetos de valor — e, por consequência, os tiny types — precisam? Igualdade estrutural. Ou seja, ao compará-los, devemos considerar apenas seus valores, não se suas referências apontam para o mesmo objeto.

Então, vamos começar sobrescrevendo `Equals`:

```csharp
public override bool Equals(object? obj)
{
    var other = obj as OrderId;
    if (other == null)
    {
        return false;
    }
    return other._value == _value;
}
```

(Para um estilo C# mais moderno, poderíamos ter usado pattern matching, mas acho que a abordagem acima é mais clara.)

Agora recebo um aviso do compilador porque meu tipo sobrescreve `Equals` mas não `GetHashCode`, então vamos corrigir isso:

```csharp
public override int GetHashCode()
{
    return _value.GetHashCode();
}
```

Como `OrderId` é um tipo simples representando valores únicos e imutáveis, ele deveria realmente ser uma `struct` em vez de uma classe, de acordo com as [Diretrizes de Design de Tipos da Microsoft](https://learn.microsoft.com/pt-br/dotnet/standard/design-guidelines/type):

    Structs são o caso geral de tipos de valor e devem ser reservadas para tipos pequenos e simples, semelhantes aos primitivos da linguagem.

Mas as diretrizes de design também dizem que todas as structs devem implementar a interface `IEquatable<T>`, então vamos fazer isso. Aliás, já que estamos aqui, vamos também implementar `IComparable<T>` e dar overload nos operadores de comparação:

```csharp
public struct OrderId : IEquatable<OrderId>, IComparable<OrderId>
{
    private readonly int _value;
    public OrderId(int value)
    {
        if (value <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(value),
                 "Value must be a positive integer!");
        }
        _value = value;
    }

    public override bool Equals(object? obj)
    {
        if (obj is OrderId other)
        {
            return _value == other._value;
        }
        return false;
    }

    public bool Equals(OrderId other) => _value == other._value;

    public override int GetHashCode()
    {
        return _value.GetHashCode();
    }

    public int CompareTo(OrderId other) => _value.CompareTo(other._value);

    public static bool operator ==(OrderId left, OrderId right) => left.Equals(right);
    public static bool operator !=(OrderId left, OrderId right) => !(left == right);
    public static bool operator <(OrderId left, OrderId right) => left.CompareTo(right) < 0;
    public static bool operator >(OrderId left, OrderId right) => left.CompareTo(right) > 0;
    public static bool operator <=(OrderId left, OrderId right) => left.CompareTo(right) <= 0;
    public static bool operator >=(OrderId left, OrderId right) => left.CompareTo(right) >= 0;
    
    public override string ToString() => _value.ToString();
}
```

Existem mais coisas que poderíamos adicionar, como conversões implícitas/explícitas, mas nosso tipo já é funcional como está. Para aqueles que usam C# moderno, poderíamos alcançar o mesmo com uma sintaxe mais concisa:

```csharp
public readonly record struct OrderId : IComparable<OrderId>
{
    private readonly int _value;

    public OrderId(int value)
    {
        if (value <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(value),
                "O valor deve ser um inteiro positivo!");
        }
        _value = value;
    }

    public int CompareTo(OrderId other) => _value.CompareTo(other._value);

    public static bool operator <(OrderId left, OrderId right) => left.CompareTo(right) < 0;
    public static bool operator >(OrderId left, OrderId right) => left.CompareTo(right) > 0;
    public static bool operator <=(OrderId left, OrderId right) => left.CompareTo(right) <= 0;
    public static bool operator >=(OrderId left, OrderId right) => left.CompareTo(right) >= 0;
    
    public override string ToString() => _value.ToString();
}
```

### Tiny Types São Muito Caros
Meu pequeno tipo `OrderId` ali ocupa 42 linhas no meu Visual Studio. Sim, existem algumas escolhas estilísticas envolvidas — por exemplo, eu não gosto quando as linhas têm mais de 80 caracteres de comprimento — mas mesmo assim, é bastante trabalho.

A versão mais concisa, que aproveita o recurso record do C# moderno, é mais curta, mas ainda requer uma quantidade razoável de código.

Agora imagine fazer isso para todos os ids em sua aplicação! E não apenas ids, claro. Imagine fazer isso para mais tipos que exigem validação/análise mais complexa:
- CEPs
- Placas de carro
- Números de telefone.

E assim por diante.

Essa é a principal razão pela qual desenvolvedores que conhecem esta técnica não a usam. Mesmo quando gostam da ideia e entendem como ela poderia ser benéfica, eles acham que fazer tudo isso não vale o trabalho.

## LLMs ao Resgate

Já se passaram dois anos desde que a OpenAI [apresentou o ChatGPT ao mundo](https://openai.com/index/chatgpt/), e tenho experimentado com LLMs desde então. Minha opinião atual sobre eles é que sua proposta de valor para desenvolvedores experientes é dupla:
- Eles atuam como um substituto do Google ao aprender algo novo
- Eles atuam como um gerador de código para coisas mundanas que eu preferiria não fazer.

Há alguns meses, tornei-me um assinante pago do [Claude](https://claude.ai). Tenho usado principalmente como auxílio em um projeto hobby no qual estou trabalhando, e devo dizer que estou muito satisfeito com os resultados que obtenho, já que o Claude é muito melhor que o ChatGPT para tarefas de programação.

Fui ao Claude com o seguinte prompt:

> Gere um tipo chamado OrderId. Deve ser um wrapper sobre um int. Não permita valores zero ou negativos. Implemente igualdade, hash code, sobrecarga de operadores de comparação e igualdade.
> 
> Não adicione conversões explícitas ou implícitas.

E este é o resultado que obtive:

```csharp
public readonly struct OrderId : IEquatable<OrderId>, IComparable<OrderId>
{
    private readonly int value;

    public OrderId(int value)
    {
        if (value <= 0)
        {
            throw new ArgumentException("Order ID must be greater than zero", nameof(value));
        }
        this.value = value;
    }

    public override bool Equals(object? obj)
    {
        return obj is OrderId other && Equals(other);
    }

    public bool Equals(OrderId other)
    {
        return value == other.value;
    }

    public override int GetHashCode()
    {
        return value.GetHashCode();
    }

    public int CompareTo(OrderId other)
    {
        return value.CompareTo(other.value);
    }

    public static bool operator ==(OrderId left, OrderId right)
    {
        return left.Equals(right);
    }

    public static bool operator !=(OrderId left, OrderId right)
    {
        return !(left == right);
    }

    public static bool operator <(OrderId left, OrderId right)
    {
        return left.CompareTo(right) < 0;
    }

    public static bool operator <=(OrderId left, OrderId right)
    {
        return left.CompareTo(right) <= 0;
    }

    public static bool operator >(OrderId left, OrderId right)
    {
        return left.CompareTo(right) > 0;
    }

    public static bool operator >=(OrderId left, OrderId right)
    {
        return left.CompareTo(right) >= 0;
    }

    public override string ToString()
    {
        return value.ToString();
    }
}
```

É um bom começo, mas ainda não estou completamente satisfeito:

> Pode torná-lo um record para que a implementação seja mais concisa? Além disso, use métodos com corpo de expressão para as linhas únicas.

E agora o Claude me deu isso:

```csharp
public readonly record struct OrderId : IComparable<OrderId>
{
    private readonly int value;

    public OrderId(int value)
    {
        if (value <= 0)
             throw new ArgumentException("Order ID must be greater than zero", nameof(value));
        this.value = value;
    }

    public int CompareTo(OrderId other) => value.CompareTo(other.value);

    public static bool operator <(OrderId left, OrderId right) => left.CompareTo(right) < 0;
    public static bool operator <=(OrderId left, OrderId right) => left.CompareTo(right) <= 0;
    public static bool operator >(OrderId left, OrderId right) => left.CompareTo(right) > 0;
    public static bool operator >=(OrderId left, OrderId right) => left.CompareTo(right) >= 0;

    public override string ToString() => value.ToString();
}
```

Finalmente, fui ao Claude e perguntei isto:

> Imagine que existe uma classe `Order` que precisa ser salva no banco de dados. 
Usamos Entity Framework. Como garantir que tudo funcione já que este modelo usa o tipo `OrderId`?

E esta é minha resposta, completa com o modelo e a configuração necessária do EF para lidar com nosso
tipo personalizado:

```csharp
.HasConversion<OrderIdValueConverter>()
                .ValueGeneratedOnAdd(); // Usar auto-incremento do banco de dados
            
            builder.Property(o => o.CustomerName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(o => o.TotalAmount)
                .HasPrecision(18, 2);
        });
    }
}
```

## Conclusão
Este post tinha dois objetivos. Primeiro, apresentar o conceito de tiny types para aqueles de vocês que nunca ouviram falar dele. Espero que concordem que, apesar de ser uma ideia simples, o padrão tiny types é algo que pode ajudar você a escrever código mais robusto.

Segundo, e de forma mais ampla, demonstrar como os LLMs podem desempenhar um papel interessante no fomento de um melhor design de software. No passado, muitas técnicas de design de software podem ter sido descartadas por serem consideradas trabalho demais para valer a pena. Agora, com a ajuda do Claude, ChatGPT ou assistentes de código como o Copilot, podemos agilizar a escrita de código "chato", o que faz com que a economia das técnicas de design, como a que apresentei neste post, faça mais sentido.
