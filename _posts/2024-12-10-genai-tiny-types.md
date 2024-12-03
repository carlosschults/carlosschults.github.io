---
title: "Type-Safe C#: How GenAI Makes Tiny-Types Worth It"
ref: genai-tiny-types
lang: en
layout: post
author: Carlos Schults
description: Tiny types is a powerful design technique, seldom used. See how LLMs can change that.
permalink: /en/genai-tiny-types
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1466341001/csharp-min_buiizq.png
tags:
- csharp
- ia
- boas-praticas
- modelagem-de-software
---

![]({{ page.img }})

It's weird how our memory works, right? I can't quite remember what I had for dinner two nights ago, or the reason why I failed to attend the gym some days last week.
But I do remember vividly a specific bug that I fixed in my first programming job after graduating from college.

There was this method that wasn't working properly, and its signature was something like this:

```csharp
void ProcessOrder(int orderId, int customerId)
```

I've reviewed its code and couldn't find anything wrong with it. But when I started debugging, I realized that the calling site was passing the arguments in the wrong order—that is, `customerId` first and then `orderId`.

Mistakes like this are easy to make and hard to spot even in code review. Even testing might let it slip, since you might have the misfortune of supplying values that accidentally make the code work without blowing everything up.

As it turns out, there's a great way to prevent issues like the one I've just described. The problem? Most developers would think it's too much work to bother.

## Tiny Types: The Greatest Software Design Technique That Nobody Uses

I know, I know. I'll be the first one to admit this title is overblown. "An Interesting Software Design Technique That Many People Don't Use" just doesn't pack the same punch, I'm sorry.

So, what's this "tiny types" thing about? It's a radical solution to the primitive obsession code smell. Essentially, instead of using primitive types for domain concepts—for instance, using an `int` to represent a unique identifier—you wrap them all using an extremely simple [value object](/en/value-objects-tool/).

Using tiny types, we could rewrite the method signature from before like this:

```csharp
void ProcessOrder(OrderId orderId, CustomerId customerId)
```

### Implementing a Tiny Type
What would the `OrderId` type look like?

For starters, since `OrderId` is supposed to wrap an int, it should get an int as parameter and store it somewhere. Let's see:

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

I think the above is a good start, wouldn't you agree? We get an int as parameter, validate and throw an exception in case of zero or negative values, and then assign it to a private readonly field, which is fitting, since `OrderId`, as a value object, must be immutable.

Do you know what else value objects—and, by consequence, tiny types—need? Structural equality. That is, when comparing them, we should only consider their values, not whether their references point to the same object.

So, let's start by overriding `Equals`:

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

(For a more modern C# style, we could've used pattern matching, but I think the approach above is clearer.)

I get now a compiler warning because my type overrides `Equals` but not `GetHashCode`, so let's fix that:

```csharp
public override int GetHashCode()
{
    return _value.GetHashCode();
}
```

Since `OrderId` is a simple type representing unique, immutable values, it should really be a `struct` instead of a class, according to [Microsoft's Type Design Guidelines](https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/type):

    Structs are the general case of value types and should be reserved for small, simple types, similar to language primitives.

But the design guidelines also say that all structs should implement the `IEquatable<T>` interface, so let's do that. While we're at it, let's also implement `IComparable<T>` and overload comparison operators:

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

There are more things we could add, such as implicit/explicit conversions, but our type is already functional as it is. For those using modern C#, we could achieve the same with a more concise syntax:

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
                "Value must be a positive integer!");
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

### Tiny Types Are Too Expensive
My tiny `OrderId` type there takes 42 lines on my Visual Studio. Yes, there's some stylistic choices involved—for one, I do not like when lines are over 80 characters of length—but even so, it's quite some work.

The more concise version, which leverages the record feature of modern C#, is shorter, but still requires a reasonable amount of code.

Now imagine doing this for all ids in your application! And not only ids, of course. Imagine doing this for more types that required more complex validation/parsing:
- Zip codes
- License plates
- Telephone numbers.

And so on.

That's the main reason why developers who know this technique don't use it. Even when they like the idea and understand how it could be beneficial, they think doing all of that isn't worth the trouble.

## LLMs To The Rescue

It's been two years since OpenAI [introduced ChatGPT to the world](https://openai.com/index/chatgpt/), and I've been experimenting with LLMs since then. My current take on them is that their value proposition for 
experienced devs is two-fold:
- They act as a replacement for Google when learning something new
- They act as a code generator for mundane stuff I'd rather not do.

A few months ago, I've become a paid subscriber of [Claude](https://claude.ai). I've been using it mainly as an aid in a hobby project I'm working on, and I must say I'm very satisfied with the results I get, since Claude
is much better than ChatGPT for programming tasks.

I went to Claude with the following prompt:

> Generate a type called OrderId. It should be a wrapper over an int. Don't allow zero or negative values. Implement equality, hash code, overload comparison and equality operators.
> 
> Don't add explicit or implicit conversions.

And this is the result I've got:

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

That's a good start, but I'm not completely satisfied yet:

> Can you make it a record so the implementation is more concise? Also, use expression bodied methods for the one-liners.

And now Claude gave me this:

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

Finally, I went to Claude and asked this:

> Imagine there is an `Order` class that needs to be saved to the db. 
We use Entity Framework. How to ensure everything works since this model uses the `OrderId` type?

And this is my response, complete with the model and the necessary EF configuration to handle our
custom type:

```csharp
// The Order entity
public class Order
{
    public OrderId Id { get; private set; }
    public string CustomerName { get; set; } = default!;
    public decimal TotalAmount { get; set; }
    public DateTime OrderDate { get; set; }

    // Private parameterless constructor for EF
    private Order() { }

    public Order(string customerName, decimal totalAmount)
    {
        CustomerName = customerName;
        TotalAmount = totalAmount;
        OrderDate = DateTime.UtcNow;
    }
}

// Value converter for OrderId
public class OrderIdValueConverter : ValueConverter<OrderId, int>
{
    public OrderIdValueConverter() 
        : base(
            orderId => orderId.GetHashCode(), // Assuming this gets the underlying value
            value => new OrderId(value))
    { }
}

// DbContext configuration
public class OrderDbContext : DbContext
{
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(builder =>
        {
            builder.HasKey(o => o.Id);
            
            builder.Property(o => o.Id)
                .HasConversion<OrderIdValueConverter>()
                .ValueGeneratedOnAdd(); // Use database auto-increment
            
            builder.Property(o => o.CustomerName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(o => o.TotalAmount)
                .HasPrecision(18, 2);
        });
    }
}
```

## Conclusion
This post had two goals. First, to present the concept of tiny types to those of you who had never heard of it. I hope you agree that, despite being a simple idea, the tiny types pattern is something that can help you write code that is more robust.

Second, and more broadly, to demonstrate how LLMs can play an interesting role in fostering better software design. In the past, many software design techniques might have been dismissed as too much work to be worth it. Now, with the help of Claude, ChatGPT, or coding assistants like Copilot, we can streamline the writing of "boring" code, which makes the economics of design techniques such as the one I've presented in this post make more sense.