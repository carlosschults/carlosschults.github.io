---
title: Null Is Evil. What's The Best Alternative? Null.
ref: null-evil
lang: en
layout: post
author: Carlos Schults
permalink: /en/null-is-evil
canonical: https://blog.ndepend.com/null-evil/
description: Many people consider null to be a mistke in programming languages. What's the best alternative?
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1593715153/null-evill-1068x437_ztikwf.jpg
tags:
- software-engineering
- best-practices
- programming
- csharp
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1593715153/null-evill-1068x437_ztikwf.jpg)
<span>Photo by <a href="https://unsplash.com/@benhershey?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Ben Hershey</a> on <a href="https://unsplash.com/s/photos/null?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

*Editorial note: I originally wrote this post for the NDepend blog.  You can [check out the original here, at their site](https://blog.ndepend.com/null-evil/).*

"Null is evil." If you've been a software developer for any reasonable length of time, I bet you've come across that statement several times.

I'd say it's also very likely that you agree with the sentiment, i.e., that the null reference is a feature our programming languages would be better off without. Even its creator has expressed regret over the null reference, [famously calling it his "billion-dollar mistake."](https://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions)

Bashing poor old null tends to get old, so authors don't do just that. They also offer alternatives. And while I do believe that many of the presented alternatives have their merits, I also think we may have overlooked the best solution for the whole thing.

In this post, we're going to examine some of the common alternatives for returning null before making the argument that the best alternative is null itself. Let's get started!

## Null Is Toxic…

I won't dwell too much on the whole "null is evil" thing, since a lot has been written about it already. Some examples:

[Null Is Evil]("https://sidburn.github.io/blog/2016/03/20/null-is-evil">Null is Evil)
[Null has no type, but Maybe has]("http://blog.ploeh.dk/2015/11/13/null-has-no-type-but-maybe-has/">)

[This Stack Overflow answer](https://softwareengineering.stackexchange.com/questions/12777/are-null-references-really-a-bad-thing) also has some valuable information.

## …But Useful. What Are the Alternatives?

Now, I hope we're on the same page regarding null's status as a problematic language feature. But toxic or not, null serves some purposes. People use it to represent an absent, invalid, or unknown piece of data, or even to indicate that an error has occurred.

What should they be doing instead?

### Throw an Exception

In some situations in which people return null, the reasonable thing to do is to throw an exception. Think of it this way: if a method promises to perform something and fails to do so, it should throw. In other words: when a method fails to fulfill its contract, then it is reasonable to throw.

Of course, you should reserve exceptions for scenarios that are truly exceptional. If a certain situation happens often, then an exception is not the best solution.

### Null Object Pattern

Consider the following lines of code:

{% highlight csharp %}
var contract = repository.Find(42);
contract.Extend(12);
{% endhighlight %}

What should happen if there isn't a contract with ID equals to 42? If the "Find" method returns null, then you're in for a nasty NullReferenceException. As I've said earlier, null makes your code lie. If we were to be really pedantic about it, the method "Find" should be renamed to "FindOrReturnNull". Too verbose, but more honest.

Anyway, the [null object pattern](https://en.wikipedia.org/wiki/Null_object_pattern) is an attempt to solve this problem. And how does it do that? By creating its own kind of null.

To implement the pattern, we create a new class  ** ** (let's call it "NullContract") that represents the case when a contract is missing. We make this new class fulfill the same contract as the original class, but we do nothing in the methods. So, if we imagine that "Contract" implements "IContract", our NullContract class could look something like this:

{% highlight csharp %}
public class NullContract : IContract
{
	// ctor, properties, etc 
	
	public void Extend(int months)
	{
		// deliberately does nothing
	}
}
{% endhighlight %}

By employing the null object pattern you could—theoretically, at least—be sure that you'll always get an object that fulfills the contract you expect it to honor without blowing up in your face.

### Maybe/Option

Finally, we have a very interesting alternative that is often found in [functional programming](https://blog.ndepend.com/functional-programming-makes-code-not-oo/) languages. This alternative is the use of a dedicated type meant to represent the use case of a potentially absent value. For instance, [in F# this is called the option type](https://docs.microsoft.com/en-us/dotnet/fsharp/language-reference/options); Haskell calls it [Maybe](https://hackage.haskell.org/package/base-4.11.0.0/docs/Data-Maybe.html). Starting in version 8, Java introduced the [Optional](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html) class.

At this time, C# doesn't offer something along those lines natively.

## Alternatives to Null: Are They Any Good?

Having presented the more commonly used alternatives for null, it's time for the final verdict. Let's start with the "throw exception" option.

### Exceptions

If the caller fails to supply the correct arguments for the function they're calling, then we could say they're breaking the function's contract. Throwing an exception is the correct thing do to in this situation.

The following code is a good example of what  **not**  to do:

{% highlight csharp %}
public Foo Bar(int a, string b)
{
    if (a > 0 && a <= 100)
    {
        if (!string.IsNullOrWhiteSpace(b))
        {
            // all is fine with the world; let's do what must be done and return some Foo!
            return new Foo();
        }
    }
 
    // uh-oh! Something wrong with the input parameters. Let's return null. Sounds like a good idea!
    return null;
}
{% endhighlight %}

I see code like this all the time in production. Nested ifs are awful. They should have at least used an "and" to fit the whole thing in just one if. But what should really happen is something like this:

{% highlight csharp %}
public Foo Bar(int a, string b)
{
    if (a <= 0 || a > 100)
    {
        throw new ArgumentOutOfRangeException(
        nameof(a),
        "The value should be in the range of 1 to 100, inclusive");
    }
 
    if (string.IsNullOrWhiteSpace(b))
    {
        throw new ArgumentException(
             "The value should be a valid string.",
             nameof(b)
             );
    }
 
    // all is fine with the world; let's do what must be done and return some Foo!
    return new Foo();
}
{% endhighlight %}

Also, [don't catch exogenous exceptions](https://blogs.msdn.microsoft.com/ericlippert/2008/09/10/vexing-exceptions/) that might happen inside your method and return null; instead, just let them bubble up since these type of exceptions represent problems outside of your control. Issues like a failure in the network are problems that you couldn't have prevented anyway, code-wise.

### Null Object Pattern

Let's consider the null object pattern, which I'm certainly not a huge fan of. One problem with this pattern is that you should only use it when the calling code doesn't care about the outcome of whatever it's trying to accomplish. Consider again our contract example:

{% highlight csharp %}
var contract = repository.Find(42);contract.Extend(12);
{% endhighlight %}

This line of code is not "aware" (nor does it care) if the "Contract" variable refers to a valid contract or an instance of NullContract. If it's a valid contract, it will be extended by 12 months. If it's not, then nothing will happen. Sometimes, that's exactly what you want, but not always. In this example, if a contract with ID equals to 42 really was supposed to exist but did not…maybe throwing an exception would work best.

All I've said so far is that the null object pattern isn't well suited for every scenario. This isn't that bad of a problem; you could say the same about pretty much anything.

My main issue with the null object pattern is that it amounts to little more than creating a new type of null without really solving the problem. You see,  **using the pattern doesn't prevent you from returning null**. If I consume some method written by a third party that claims to use the pattern, I should be able to assume that whatever it returns is safe for me to deference. But I can't know for sure. I have three options:

- Trust the author of the code;
- Inspect the source code, if possible; or
- Continue to check for null, which completely defeats the purpose of using the pattern.

You could argue that these problems aren't relevant in the context of a single team working with the same codebase. The developers could agree on using the pattern correctly. But if everything amounts to trust and convention at the end of the day, you might as well just agree to never return null and you'd have the same result.

### Maybe/Option

Last but not least, what about Maybe/Option types? This is an alternative that's both elegant and robust, especially in languages such as F# where you're actually forced, in a sense, to handle both cases by using pattern matching.

But the sad reality is this: while maybe/option types are amazing approaches, they can't change the fact that null exists and will continue existing. You can't really stop people from using it, nor can you remove it from all the lines of code people have been writing since the dawn of C#.

So, even though they are great approaches, they still suffer from the problem of being yet another type of null for the developers to deal with.

## The Solution for Null: Null Itself

Do you know the old saying "When in a hole, stop digging?" For better or worse, null exists. Toxic or not, it's a feature people use. So maybe the solution for this whole thing is just to fix null.

The [kotlin](https://kotlinlang.org/) language got it right by having different nullable and non-nullable types and adding all kinds of checks to prevent the developer from doing things that would end badly, like dereferencing a nullable type without checking it for null or assigning a nullable value to a non-nullable variable.

C# gave us the first step in the right direction many years ago with [nullable value types](https://docs.microsoft.com/pt-br/dotnet/csharp/programming-guide/nullable-types/). After a long wait, [reference types will finally get the same benefit with C# 8.0](https://blog.ndepend.com/c-8-0-features-glimpse-future/).

The alternative for null is null itself… **when done properly**.