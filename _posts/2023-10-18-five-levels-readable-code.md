---
title: "The 5 Levels of Readable Code"
ref: five-levels-readable-code
lang: en
layout: post
author: Carlos Schults
description: In this post, I propose a model to evaluate code readability.
permalink: /en/fivel-levels-readable-code/
img: /img/levels.jpg
tags:
- best-practices
- readability
---

![]({{ page.img }})

<span>Photo by <a href="https://unsplash.com/@greysonjoralemon?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Greyson Joralemon</a> on <a href="https://unsplash.com/photos/w000nNe9Xq8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a></span>  

Recently I’ve been thinking a lot about code readability. What does it mean for a piece of code to be readable? Is it possible to define readability objectively? Should we attempt to do it?

These are some of the questions I’ve been thinking about, and in this post, I present my answers in an attempt to start a conversation around readability.

Here’s the TL;DR version: yes, I believe objectively defining code readability is both possible and desirable, and in this article, I suggest a model for evaluating readability.

## The Importance of a Code Readability Definition 

Readability will always be somewhat subjective and, to some degree, that subjectivity is harmless. However, it _can_ cause problems in some scenarios. 

If we’re working within a team, it’s important to come up with at least some objective guidelines regarding code readability, and that’s because of code reviews. If the team can’t agree on what constitutes readable code, then code review feedback will feel like arbitrary whims.

In short: teams need conventions. A team should have a vision when it comes to what constitutes good, readable code. 

## A Framework For Thinking About Code Readability: Levels

Not long ago I started thinking about code readability in terms of levels. The levels represent specific concerns regarding readability, and they’re ordered in terms of priority. 

So, level 1 represents the most basic stuff you’ve got to take care of first, before progressing towards higher levels. Tidy up the basics, then go for the advanced stuff. Something like [Maslow's hierarchy of needs](https://en.wikipedia.org/wiki/Maslow%27s_hierarchy_of_needs), but for code.

There will be some code examples, and I’ll be using C# for those. However, what I’ll show here applies to any language, unless I explicitly say otherwise.

Without further ado, here are the five levels of readable code.

## Level 1: Your Code Does The Bare Minimum

(Yes, level one. Please spare me that "programmers start counting at zero” nonsense.)

Level 1 of readable code refers to code that does the bare minimum. Think of simple readability guidelines such as:

* Picking [descriptive names ](https://carlosschults.net/en/how-to-choose-good-names/)for variables, functions, classes, and so on.
* Avoiding too many indentation levels.
* Keeping [cyclomatic complexity low.](https://carlosschults.net/en/reduce-cyclomatic-complexity/)
* Avoiding [comments that don’t bring any value](https://carlosschults.net/en/types-of-comments-to-avoid/).
* Keeping [functions and other blocks of code small.](https://blog.ploeh.dk/2019/11/04/the-80-24-rule/)
* Avoiding [magic numbers](https://en.wikipedia.org/wiki/Magic_number_(programming)).

It’s not hard to learn these kinds of best practices. You can pick up most of these through sheer experience, by listening to the feedback of more experienced engineers during code reviews, or by reading books and even blog posts like the ones listed above.

## Level 2: Your Code Is Idiomatic

Consider the following C# class:

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

There’s nothing wrong with the above class, at least not technically. The compiler happily compiles it, and the class works as it should.

However, if you’re at least somewhat experienced with C#, you noticed something weird when you saw the code: the getter and setter methods. The C# development team made the concepts of getters and setters a first-class citizen of the language early on, via the concept of properties. If there’s no additional logic involved in the setting and getting of values, the programmer can make usage of [auto-implemented properties](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/auto-implemented-properties) with a concise result (even the backing private fields no longer need to be explicitly declared):

```csharp
public class Person
{
    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }

    public string Name { get; set; }
    public int Age { get; set; }
}
```

All of this is to say: that to be readable, a given piece of code needs to be idiomatic to the language it’s written into. If you’re writing C#, follow the coding standards and conventions of the language. The same applies to Java, JavaScript, and any other language.

The Python community has a wonderful concept to describe Python code that adheres to the standards and philosophies of the language: “pythonic”. A piece of Python code might work, but if it’s not Pythonic, experienced Python engineers will find the code awkward to work with.

Why does writing idiomatic code matter for readability? When you look at code—in whatever language—that doesn’t look like what it should look, according to the mental model you have of that language, it becomes harder to follow the code. 

Non-idiomatic code increases the [cognitive complexity ](https://linearb.io/blog/cognitive-complexity-in-software)of a code base. It makes it harder to onboard developers who are familiar with the language standards and idioms. If you have an open-source project, too many idiosyncrasies in the code might push away potential contributors.

Of course, the opposite of all of this is true.

## Level 3: Your Code Reveals Intent Via Tactical Use of Typing

As the title suggests, this item, unlike the previous two, only applies to statically typed languages—or, perhaps, dynamically typed ones that feature some kind of optional type annotation.

Let’s start with a simple example. Look at the following lines:

```csharp
Canvas.DrawLine(5);
```

Disregard the magic number, which is itself already a problem. Consider that you know that the `DrawLine` method has a single parameter, `length`. The line could’ve been made slightly more readable through the usage of a [named argument,](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/named-and-optional-arguments) but even that wouldn’t solve the biggest issue: what the heck is the unit of measurement?

Besides harming readability, this problem opens up the possibility of bugs, due to a mismatch of units—a portion of the code “thinks” the unit is centimeters, while others might believe it’s inches.

What am I advocating instead? Well, use typing to your favor. Here, a good solution would be to create a [value object ](https://carlosschults.net/en/value-objects-tool/)called, let’s say, `Length`. This type would have several static factory methods named after specific units of measurement, and its constructor would be private. Then, you’d be able to rewrite the previous example to something like this:

```csharp
Canvas.DrawLine(Length.FromCentimeters(5));
```

Another example would be the usage of the `TimeSpan` type to express durations, instead of using primitive values or employing the [Uri class ](https://learn.microsoft.com/en-us/dotnet/api/system.uri?view=net-7.0)instead of just strings.

Maybe you’re thinking all of this is simply a convoluted way of saying “avoid primitive obsession.” There’s more to it than that, though.

To illustrate my point, I’ll share another—maybe a bit contrived, I admit—example. Let’s say you’re solving a problem that calls for the usage of a [stack](https://en.wikipedia.org/wiki/Stack_(abstract_data_type)). In this case, nothing is stopping you from using the `List<T>` class as a stack, right?

* The `Add` method would be your replacement for the `push` functionality
* For the `pop` functionality, you’d use a combination of getting the last element from the list via its indexer and then using the `RemoveAt` method to delete the item.

The above solution, despite being somewhat convoluted, would work. But I’d vehemently encourage you to just go and use the regular `Stack<T>` class. Using the more specific type would make the code immediately more readable to anyone who knows what a stack is. It would make the code reveal its intent.

In short: unless you have a justifiable reason to not do so, always prefer the type that more closely represents the concept or functionality you need. It’ll not only make your code more robust but also more intention-revealing.

## Level 4: Your Code Doesn’t Mix Levels of Abstraction

Your code shouldn’t mix more than one level of abstraction. Code that lives in the “Business Rules” portion of your codebase shouldn’t mess with code that lives in the “IO concerns” neighborhood, to give you an example.

Why is this a problem? See the following function:

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
                    Date = date,
                    Temperature = temperature
                };
                readings.Add(reading);
            }
        }
    }
    catch (Exception ex)
    {
        throw new InvalidOperationException($"Error reading the CSV file: {ex.Message}");
    }

    if (readings.Count < 3)
    {
        throw new InvalidOperationException("There must be at least 3 readings to calculate the average.");
    }

    readings = readings.OrderBy(reading => reading.Temperature).ToList();

    readings.RemoveAt(0);
    readings.RemoveAt(readings.Count - 1);

    double sum = readings.Sum(reading => reading.Temperature);
    double average = sum / readings.Count;

    return average;
}
```

The function reads and parses a .CSV file containing climatic readings. Lines that don't have the expected two values (date and temperature) are dismissed. Then it sorts the readings, removes the highest and lowest values, and, finally, calculates and returns the average of the remaining values.

This function mixes at least two abstraction levels:

* The “domain logic” level—i.e. the part that makes the calculation
* The low level: reading and parsing the .CSV file.

You could even make the argument that there are three levels, since the low level could be split into two: file system manipulation and parsing.

This example function isn’t the hardest thing in the world to read, but it’s certainly harder than it has to be. It mixes domain logic with IO error handling and even parsing. A better solution would be to have a method that gets a collection of `ClimaticReading` and calculates and returns the average. 

In other words, a better and more elegant solution would be to have a **pure function**. This new method, besides being more readable, would be more robust, less error-prone, and also deterministic—i.e. always returns the same results for the same input—making it intrinsically [unit testable.](https://carlosschults.net/en/csharp-unit-testing-intro-tdd/)

## Level 5: Your Code Speaks The Language of The Business

You’ve reached level 5 when you write code that speaks the language of the business. When you use terms that are the same ones that domain experts use.

In other words: yeah, I’m pretty much advocating for the same thing that the pragmatic programmers call “program closer to the domain”, or that Eric Evans famously dubbed ubiquitous language in his classical—but definitely not a page-turner—tome, “Domain-Driven Design: Tackling Complexity in the Heart of Software.”

If your code uses unorthodox terms instead of industry terms, it makes onboarding harder when you bring in new people that are familiar with the business but new to the codebase. If the code uses different jargon than that of stakeholders, communication becomes more taxing, since it requires you to perform a constant mapping between concepts just to stay afloat.

Level 5 is somewhat of a logical consequence of level 4. If you carefully segregate the concerns of your app, making sure that high level code doesn’t mix with low level code, the tendency is for the high level code to become closer and closer to the domain in terms of naming.

## Level Up The Readability of Your Code

Most programmers would agree that code readability is vital. But what about agreeing on what “readable code” looks like? That’s a horse of a different color.

As I said earlier, I think a level of subjectivity when it comes to readability is both inevitable and harmless. However, in the context of a team, there has to be at least some consensus of what readable code is. Otherwise, code reviews become exercises of futility, and team morale sinks.

I believe that our industry would benefit from a more objective way to reason about readability. In this post, I gave my small contribution,  in the form of a readability “checklist”, in prioritized order.

But again: the idea of this post isn’t to give a definitive answer, **but to start a conversation**. Do you think the “levels” models make no sense? Or maybe you’d like to share your own levels?  I invite you to share your opinion via a comment, or shoot me an e-mail (you can find my address on the about page).

_Special thanks to [Mark Seemann](https://blog.ploeh.dk/), [Pedro Barbosa](https://www.linkedin.com/in/pgpbarbosa/) and [Peter Morlion](https://www.linkedin.com/in/petermorlion/) for giving feedback on earlier drafts of this post._
