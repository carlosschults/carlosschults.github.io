---
title: "C# Regex: How Regular Expressions Work in C#, With Examples"
ref: csharp-regex
lang: en
layout: post
author: Carlos Schults
description: In this post you'll learn what a regex is and how to use it in C#
permalink: /en/csharp-regex
canonical: https://stackify.com/c-regex-how-regular-expressions-work-in-c-with-examples/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1513817072/csharp8-1037x438_skogpz.jpg
tags:
- csharp
- regex
- regular_expressions
- tutorial
---

![]({{ page.img }})
*Editorial note: I originally wrote this post for the Stackify blog.  You can [check out the original here, at their site]({{ page.canonical }}).*

Text manipulation is one of the most common tasks in programming with virtually all major programming languages usually supporting regex (regular expression) via their standard libraries. C# is no exception, so today we bring you a C# regex guide.

You’ll learn what regexes are, why you’d want to use them and how to get started in a comprehensive, approachable manner. That way, you can start using regular expressions to solve real problems ASAP.

Buckle up for your regex learning journey, starting now!

## What Is Regex?
A regular expression (regex) is an expression containing one or many characters that expresses a given pattern in text. If that sounds a little vague, an example will help. Consider a date in the following format:

```
28-JUL-2023
```

Using a regex, we can express that format like this:

```
[0-9]{2}-[A-Z]{3}-[0-9]{4}
```

Note that the regular expression above expresses a pattern with:

*   two numeric digits followed by a hyphen
*   three upper-case letters followed by a hyphen
*   four more numbers

You’ll learn more about what each part of a regex means in a minute. For now, just bear in mind that the regex above doesn’t _know_ anything about dates. It just happens that we were able to devise a regular expression that matches the pattern or shape of the date. All of the following match with that regex, even though they’re not valid dates:

```
32-ABC-7894
30-FEV-1978
00-AAA-9999
```

## Is There Regex in C#?

Yes, of course. But that doesn’t come from the language itself. Instead, regex support comes from [.NET’s BCL (Base Class Library),](https://learn.microsoft.com/en-us/dotnet/standard/class-library-overview) which is essentially C#’s standard library.

## Why Use Regex In C#?

As you’ve seen, regex is something to use to express a pattern that can match a given text. 

In practice, all uses of regex in C# or other languages boil down to three reasons: validation, manipulation and extraction.

### Validation

An incredibly common use case for regex is data validation. For instance, let’s say you have a web form and want to ensure a certain field only accepts inputs in a specific format. How to solve that? Regex comes to the rescue.

### Manipulation

Sometimes you need to change information within text. Let’s go back to the previous example. Imagine for compliance reasons you need to remove all phone numbers from this body of text and replace them with the word “REDACTED.” Again, regexes would be a perfect fit for this situation.

Interestingly, programming languages are not alone in using regular expressions to solve problems. Even text editors such as Notepad++ offer find-and-replace features powered by regexes.

### Extraction

Let’s say you have considerable amounts of text. This text contains telephone numbers that you need to extract. You know the format of those numbers and the fact that they’re inside the text, but that’s the extent of your knowledge.

How would you go about extracting that information? A neat C# regex would certainly come in handy in that situation.

## How to Use Regex In C#: Getting Started in Practice

C# is an [OOP language](https://stackify.com/oop-concepts-c-sharp/), so it shouldn’t be a surprise that you’ll use a class for your C# regex work. More specifically, the class I’m talking about is appropriately called Regex and resides in the System.Text.RegularExpressions namespace**.**

### C# Regex: A Validation Example

Let’s start with a simple validation example on how to use regex to validate whether several strings match a given pattern. The first step is to add the following **using** statement to your code:

using System.Text.RegularExpressions;

Now, let’s create an array of strings and populate it with some values:

{% highlight c# %}
var candidates = new[]
{
    "28-JUL-2023",
    "whatever",
    "89-ABC-1234",
    "11-JUN-2022",
    "11-JUN-2022, a date plus other stuff",
    "This is certainly not a date"
};
{% endhighlight %}

Finally, we’ll loop through the values and use the `IsMatch` static method from the `Regex` class to verify which of the strings matches our desired pattern:

{% highlight c# %}
var pattern = "[0-9]{2}-[A-Z]{3}-[0-9]{4}";
foreach (var c in candidates)
{
    if (Regex.IsMatch(c, pattern))
    {
        Console.WriteLine($"The string '{c}' matches the pattern '{pattern}'");
    }
}
{% endhighlight %}

Before going further, let’s break down the pattern piece by piece:

*   **\[0-9\]{2}:** The first part means “Match exactly two characters, that must be digits from 0 to 9.”
*   **\-:** This character matches exactly a hyphen.
*   **\[A-Z\]{3}:** Here, the expression says, “Let’s match exactly three characters, which can be any of the letters from A to Z.”
*   **\-:** This matches another hyphen
*   **\[0-9\]{4}:** This should be easy to understand by now, right? Exactly four numbers.

Now, let’s run the code and see what we get:

```
The string '28-JUL-2023' matches the pattern '[0-9]{2}-[A-Z]{3}-[0-9]{4}'
The string '89-ABC-1234' matches the pattern '[0-9]{2}-[A-Z]{3}-[0-9]{4}'
The string '11-JUN-2022' matches the pattern '[0-9]{2}-[A-Z]{3}-[0-9]{4}'
The string '11-JUN-2022, a date plus other stuff' matches the pattern '[0-9]{2}-[A-Z]{3}-[0-9]{4}'
```

The first three results probably didn’t surprise you. I even include something that’s not a date but matches the pattern we’re using in order to really drive home the point that regular expressions are about patterns and shapes and not about any semantics of the data we’re looking for.

However, the fourth result might’ve surprised you. The text indeed starts with data that matches the pattern we’re looking for, but then it has some additional text. And even then, this string matched!

The explanation for this behavior is simple, and it’s spelled out for us in the [summary](https://learn.microsoft.com/en-us/dotnet/api/system.text.regularexpressions.regex.ismatch?view=net-7.0#system-text-regularexpressions-regex-ismatch(system-string-system-string)) for the `IsMatch` method:

```
Indicates whether the specified regular expression finds a match in the specified input string.
```

The regular expression indeed found a match in the specified input string (“11-JUN-2022, a date plus other stuff”), and that’s why it was considered a match.

But what if we wanted an exact match? In that case, you’d have to change the pattern, adding a circumflex accent (“^”) to the star of the pattern and a dollar sign (“$”) to its end. In other words, here’s how the pattern should look now:

{% highlight c# %}
var pattern = "^[0-9]{2}-[A-Z]{3}-[0-9]{4}$";
{% endhighlight %}

If we run the code now, it displays only the strings that are an exact match with the pattern:

```
The string '28-JUL-2023' matches the pattern '^[0-9]{2}-[A-Z]{3}-[0-9]{4}
```

### C# Regex: A Manipulation Example

Consider you have a body of text containing sensible user data. Due to privacy/compliance concerns, you want to redact those data points. Luckily for you, it’s quite easy to use a regex for that. 

Let’s start by creating an array containing names and phone numbers for fictitious people:

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

Then, let’s create the pattern to match the phone numbers:

{% highlight c# %}
var pattern = @"\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}";
{% endhighlight %}

The pattern above is a bit more involved than the ones we used earlier, but it’s still simple. There are a couple of new elements, though:

*   **The backward slash (\\):** We need it here in order to escape the opening and closing parenthesis, which is a character with meaning in a regular expression. In this instance, we actually do want to match a “(” character, so we need to escape it.
*   **The \\s character:** matches a single space.

Finally, let’s loop through this array and, for each item, use the `Regex.Replace` method to generate a new string in which the phone number is replaced by all zeroes:

{% highlight c# %}
foreach (var contact in contacts)
{
    Console.WriteLine(
        Regex.Replace(contact, pattern, "(000) 000-0000"));
}
{% endhighlight %}

Using the Replace static method is easy. Though it has several overloads, the one we use just takes three arguments:

*   the input string
*   the pattern you want to match
*   the replacement string

After running the code, here’s the output we get:

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

### C# Regex: An Extraction Example

For our last example, let’s extract data from a string using a regular expression. Let’s start by converting the array from the previous example into a single string:

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

Then, we define the pattern again (same one) and use the Matches static method to get all of the matches from the string:

{% highlight c# %}
var pattern = @"\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}";
MatchCollection matches = Regex.Matches(contacts, pattern);
{% endhighlight %}

The `MatchCollection` class holds all of the strings that matched the pattern we gave to the method. This object is enumerable, so we can loop over it with a foreach:

{% highlight c# %}
Console.WriteLine("Here are the extracted phone numbers:");
foreach (Match match in matches)
{
    Console.WriteLine(match.Value);
}
{% endhighlight %}

And, finally, our results: 

{% highlight c# %}
Here are the extracted phone numbers:
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

## C# Regex: An Indispensable Tool

As we said in the intro, text manipulation is a staple of programming, and regular expressions make this task easier. In this C# regex guide, you’ve learned what regular expressions are, their most common usage scenarios and how to get started with regular expressions in C#.

Before departing, a few tips:

*   Experiment more with the `Regex` class. It offers plenty of features, and the methods we’ve used today have many overloads with useful capabilities.
*   Learn more and practice writing regular expressions. [Here’s a great site](https://regexr.com/) you can use.
*   Educate yourself on the performance considerations of C# regex. For instance, read this [Microsoft article on the compilation and reuse of regular expressions](https://learn.microsoft.com/en-us/dotnet/standard/base-types/compilation-and-reuse-in-regular-expressions?redirectedfrom=MSDN).

Finally, if you want to learn more about C# in general, you’re in the right place. The Stackify blog is full of useful resources. As a suggestion, take a look at [the pros and cons of the top 3 unit test frameworks for C#](https://stackify.com/unit-test-frameworks-csharp/), [how to catch exceptions and find application errors in C#](https://stackify.com/csharp-catch-all-exceptions/), and [how C# reflection works](https://stackify.com/what-is-c-reflection/) next.

Thanks for reading!
