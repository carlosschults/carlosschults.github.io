---
title: "Cargo Cult Programming Is The Art of Programming by Coincidence"
ref: cargo
lang: en
layout: post
author: Carlos Schults
description: Have you heard of cargo cult programming? In this post I'm going to show you what this is and why you, as a developer, should care.
permalink: /en/cargo-cult-programming/
canonical: https://blog.ndepend.com/cargo-cult-programming/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1516152067/cargo-cult-programming-1037x438_spoxet.jpg
tags:
- csharp
- best-practices
- cargo-cult-programming
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1516152067/cargo-cult-programming-1037x438_spoxet.jpg)

*Editorial note: I originally wrote this post for the NDepend blog.  You can [check out the original here, at their site](https://blog.ndepend.com/cargo-cult-programming/). While you’re there, download NDepend and give it a try.*

I first learned about cargo cult programming a few years ago. I remember thinking back then, “What a strange name for a programming-related concept.”

If you share my past self’s astonishment, then today’s post is for you!

First, you’ll see what cargo cult programming is and why you should care. Then, we’re going to look at some practical examples, using the C# language. Finally, we’ll close with advice about what you can do, as a developer, to avoid falling into this trap.

## Cargo Cult Programming: Doing Stuff Just Because

[According to Wikipedia](https://en.wikipedia.org/wiki/Cargo_cult_programming), “Cargo cult programming is a style of computer programming characterized by the ritual inclusion of code or program structures that serve no real purpose.”

In other words, it’s when a developer writes code without really understanding it. The developer may use a very trial-and-error approach—maybe copy and paste some code from somewhere else and then tweak it and test it until works, or sort of works. Then the developer will stop tweaking the code, for fear it will stop working. In the process, maybe they leave some lines of code that don’t do anything.

Or maybe they tried to use an idiom they picked up from another developer while failing to understand that the contexts are different and it’s useless in the current situation.

Finally, it might just be lack of education: maybe the developer has a poor mental model of how the tools they’re using really work.

## Why is Cargo Cult Programming a Problem?
As Eric Lippert puts it, [cargo cult programmers struggle to make meaningful changes to a program](https://blogs.msdn.microsoft.com/ericlippert/2004/03/01/syntax-semantics-micronesian-cults-and-novice-programmers/) and end up using a trial-and-error approach since they don’t understand the inner workings of the code they’re about to change.

This is not so different from what the [Pragmatic Bookshelf calls “programming by coincidence”](https://pragprog.com/the-pragmatic-programmer/extracts/coincidence):

> Fred doesn’t know why the code is failing because he didn’t know why it worked in the first place. It seemed to work, given the limited “testing” that Fred did, but that was just a coincidence.

That single sentence pretty much sums it up for me: if you don’t know how or why your code works, neither will you understand what happened when it no longer works.

## Origin of the Term
Although practices that are considered cargo cult today [have been recorded as early as the late 19th century](https://en.wikipedia.org/wiki/Cargo_cult#First_occurrences), the term itself dates from 1945, when it was first used to describe practices that emerged during and after World War II between Melanesian islanders.

These islanders would mimic the soldiers’ behavior, such as dressing up as flight controllers and waving sticks, hoping that airplanes would descend from the skies with a lot of cargo.

Since then, the term cargo cult has been used in a variety of contexts to mean **to imitate form without content**—to perfectly copy the superficial elements while failing to understand the deeper meanings and workings of whatever one’s trying to emulate.

## Talk is Cheap; Show Me the Code!
Enough with the history lesson. Time to see some code! I’m going to show you five examples of cargo cult programming in the C# language. 

### Checking a Non-Nullable Value Type for Null
This one is a pet peeve of mine since I see it a lot in production code. It goes like this:

{% highlight c# %}
	public Product Find(int id)
	{
   	   if (id != null) // this check is useless
	   {
	       Console.WriteLine("This line will always get reached.");
	   }
	
	   return new Product();
	}
{% endhighlight %}

Here we have a developer that probably doesn’t grok the [difference between value and reference types](https://carlosschults.net/en/value-reference-types-in-csharp/). It would be completely forgivable, in the case of a junior developer, except for the fact that the compiler warns you about that.

You could argue that I’m nitpicking. After all, the code will run fine in spite of this. In fact, the check won’t even be included in the resulting IL, as you can see from this print of a decompiling tool:

![An image depicting a code excerpt that does not contain the null check.](https://res.cloudinary.com/dz5ppacuo/image/upload/v1515684957/just-decompile1_qk69k2.png)

You can see in this code snippet that the compiler has optimized the null check out.

There are plenty of worse problems, granted. Yes, the application won’t *crash* because of this. So what’s the big deal?

Well, for starters, I’d be worried about a development shop where the sole quality measure was “it runs without crashing.” But the real problem is that this type of code shows a lack of understanding of some fundamental characteristics of the language and platform that can bite you in the future.

### Unnecessary Use of ToList() in LINQ to Object Queries
Like the previous one, this is something I routinely see in production code. Consider the code below:

{% highlight c# %}
	var result = users.ToList()
	.Where(x => x.PremiumUser)
	.ToList()
	.Select(x => new { Name = x.Name, Birth = x.DateOfBirth })
	.ToList();
{% endhighlight %}

The problem we have here is that these calls to `ToList()` are completely unnecessary (except maybe the last one, if you really needed the result to be a `List` and not only an `IEnumerable`).

In my experience, this happens when the developer doesn’t understand the nature of LINQ; they erroneously think that the LINQ methods belong to the concrete type `List<T>` instead of being extension methods that can be used with any `IEnumerable<T>` implementation.

By calling `ToList()` several times like this, the developer creates several new lists, which can be detrimental to the performance of the application.

You could rewrite the code above like this:

{% highlight c# %}
	var result = users.Where(x => x.PremiumUser).Select(x => new { Name = x.Name, Birth = x.DateOfBirth });
{% endhighlight %}

### Unnecessary Conversions
Consider the following line:

{% highlight c# %}
	DateTime creationDate = DateTime.Parse(row["creation_date"].ToString());
{% endhighlight %}

Here we have not only one but two unnecessary conversions. First, the developer creates a new string and then parses it to `DateTime` when a simple cast would have sufficed:

{% highlight c# %}
	DateTime creationDate = (DateTime)row["creation_date"];
{% endhighlight %}

This example assumes that the underlying database type is some specific type for dealing with dates (for instance, `date` or `datetime` in SQL Server). Of course, if you were using an inadequate type (such as `varchar`) then this would be a problem of its own.

### Try-Catch Everywhere
Also known as Pokémon syndrome (“Gotta catch ’em all!”), the anti-pattern here is to add a try-catch block to every single line that could possibly throw an exception.

Bonus points if the code is attempting to catch `System.Exception` instead of a more specific exception, thus blurring the distinction between expected and unexpected errors.

More bonus points if the catch block doesn’t contain any code at all!

The general advice here is this: never catch unless you have a very specific reason for doing so. Otherwise, just the let the exception bubble up until it’s dealt with by the top-level exception handler.

If this advice seems vague (“How would I know if I have the right reason for catching an exception?”), that’s because it is vague. It’s beyond the scope of this post to go deeper into this matter, but [Eric Lippert’s excellent article called “Vexing Exceptions”](https://blogs.msdn.microsoft.com/ericlippert/2008/09/10/vexing-exceptions/) will greatly improve your understanding of exception handling.

### Using StringBuilder Everywhere
It’s the stuff of superhero movies: after reading somewhere that concatenating strings by using the ‘+’ operator is incredibly inefficient, the well-meaning developer takes upon themselves the Herculean task of updating every single concatenation in the codebase to `StringBuilder`.

The reasoning for this is, of course, that `System.String` is immutable. So every time you “modify” a string, you’re in fact creating a new instance in memory, which can hurt performance pretty badly.

Well, guess what? The compiler is pretty smart. Let’s say you have the following line:

{% highlight c# %}
	string a = "Hello " + "World";
{% endhighlight %}

This, in fact, gets translated to

{% highlight c# %}
	string a = "Hello World";
{% endhighlight %}

The fast rule of thumb is it’s fine to use the simple concatenation when you know the number of strings to append in compile time. Otherwise, a [`StringBuilder` probably makes more sense](https://stackoverflow.com/a/21644889).

Of course, some scenarios aren’t that clear-cut. The only advice worth giving here is to do your homework. When in doubt, research and benchmark to your heart’s content.

I’ll leave you with more sound advice from Eric Lippert:

> Unnecessary code changes are expensive and dangerous; **don’t make performance-based changes unless you’ve identified a performance problem.**

## Is There a Remedy?
I’d say it’s fair to assume that more inexperienced developers are more prone to commit mistakes due to cargo cult programming. But no developer is really immune to it, independent of their knowledge or experience.

We’re only human after all. Tiredness, deadlines, cognitive biases, and (to be really honest) the eventual laziness can turn even the best developer into a cargo cult programmer.

Unfortunately, there’s no 100%  guaranteed way of preventing this from happening. Yet there are some measures you could take to, at least, decrease the odds.

Let’s take a look at some of them.

### Use Code Review/Pair Programming
The first measure you could take to avoid cargo cult programming is to simply get a second pair of eyes on your code. The benefits of having a second person reviewing each line of code before it goes to production can’t be overstated. And while code review and pair programming aren’t perfect equivalents, both of these practices will bring you this benefit.

### Always Test Your Hypothesis
Write unit tests (and other types of tests as well). Monitor your application in production. If something doesn’t perform well, benchmark the heck out of it. Don’t just assume things. Testing your hypothesis can bring valuable insights and save you when your intuition gets it wrong.

### Read Other People’s Code
Reading other people’s code is a great way to learn. It’s a perfect tool to compare your own ideas and assumptions against what other developers are doing, exposing you to novel concepts that can force you to gain a deeper understanding of the issues at hand.

In the era of [GitHub](https://github.com/), there isn’t much of an excuse for not doing that.

### Learn From Your Tools
There are currently a plethora of tools that can help [your team improve the quality of their code](https://www.ndepend.com/). Here’s the thing, though: you shouldn’t just use these tools. You should also learn from them. If you use NDepend, [read about its rules](https://www.ndepend.com/default-rules/webframe.html). Try and understand the rationale behind them. What are the principles and best practices that guided its authors when coming up with the rules?

The same goes for other types of tools—and even the warnings the compiler gives you.

## Computer Science, Not Computer *Superstition*
Even though no one is immune to cargo cult programming, we should strive to overcome it. There’s hard-earned industry wisdom at our disposal, slowly generated over more than seven decades. Let’s use it. Let’s understand our tools and our craft and write better software.
