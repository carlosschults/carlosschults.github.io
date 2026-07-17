---
title: "Functional Programming in C#: Map, Filter, and Reduce Your Way to Clean Code"
ref: functionalcsharp
lang: en
layout: post
author: Carlos Schults
description: In this post you'll learn how using a functional approach can improve your code
permalink: /en/functional-programming-csharp/
canonical: https://blog.submain.com/csharp-functional-programming/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1548200356/Untitled_xfahmy.jpg
tags:
- csharp
- best-practices
- functional-programming
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1548200356/Untitled_xfahmy.jpg)

*Editorial note: I originally wrote this post for the SubMain blog.  You can [check out the original here, at their site](https://blog.submain.com/csharp-functional-programming/). While you’re there, have a look at CodeIt.Right, which can help you improve the quality of your code.*

C# is supposed to be an object-oriented language, but it’s possible that you, as a .NET/C# developer, have been using functional programming concepts without even knowing it.

And that’s what today’s post is about. I’ll just first briefly cover the attractions of functional programming and why it makes sense to apply it even when using a so-called object-oriented language. Then I’ll show you how you’ve already been using some functional style in your C# code, even if you’re not aware of it. I’ll tell you how you can apply functional thinking to your code in order to make it cleaner, safer, and more expressive.

## C# Functional Programming: Why?

We know the .NET framework offers some functional capabilities in the form of the LINQ extension methods, but should you use them?

To really answer this, we need to go back a step and understand the attraction of functional programming itself.  The way I see it, the easiest path to start understanding the benefits of functional programming is to first understand two topics: **pure functions** and **immutable data**

**Pure functions** are functions that can only access the data they receive as arguments and, as a consequence, can’t have any side effects. **Immutable data** are just objects or data structures that, once initialized, can’t have their values changed, making them easier to reason about and automatically thread-safe.

## Fundamental Functional Programming Operations and How to Perform Them Using C#

With the _what_ and _why_ of functional programming out of the way, it’s time to get to the *how*.

l’ll be covering three fundamental functions: map, filter, and reduce. I’ll start by showing some use cases, then I’ll show a traditional, procedural way of solving the problem. And finally, I’ll present the functional way.

## Map

In simple terms, the “map” operation takes a sequence of items, applies some transformation to each one of those items, and returns a new sequence with the resulting items. Let’s see some examples.

Suppose you wrote the following code, due to a customer’s demand:

{% highlight c# %}
	static void AddThreeToEachElement(int[] arr)
	{
	    for (var i = 0; i < arr.Length; i++)
	    {
	       arr[i] += 3;
	    }
	}
{% endhighlight %}

It’s a function that adds three to each element of the given [array](https://blog.submain.com/c-array/) of integers. Pretty straightforward.

Now a request for a new function comes in. This time, it should add five to each element in an array. Ignoring the [rule of three,](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)) you jump right ahead into a generalized version, parameterizing the number to be added:

{% highlight c# %}
	static void AddNumberToEachElement(int[] arr, int n)
	{
	   for (var i = 0; i < arr.Length; i++)
	   {
	        arr[i] += n;
	   }
	}
{% endhighlight %}

Then yet another request comes in. Now you must write a function that will multiply each element of the given array by, let’s say, three. I won’t add the code sample now because I’m sure you’ve got the picture. By now, you should know better than to hardcode the number, so you’d probably jump ahead to a general version right away. Even then, some duplication would still exist: the loop itself. Hmm…what if you could keep just the loop and instead parameterize the action to be applied on each item?  

### The Functional Way

Take into consideration what you’ve just read about pure functions—and also your previous knowledge of[programming best practices](https://blog.submain.com/coding-best-practices-short-time/) in general—and think of ways the code could be improved.

From my perspective, the main problems are

- **The code is too specific**. It can’t be easily changed to accommodate other transformations being applied to the array elements. It just performs a sum, and that’s it.
- **Too much boilerplate**. Look at the previous sample again. Count the lines. There are seven, of which only one really concerns itself with carrying through the business logic of the method.

How would the functional way improve on this? That’s the way I’d write the first example in F#, for instance:

{% highlight c# %}
	let result = Seq.map (fun x -> x + 3) numbers
{% endhighlight %}

I’m assuming here that “numbers” is a sequence of integers I’ve got somehow. Then I use the map function on the Seq module, passing the sequence as a parameter, along with a function that takes an int and adds three to it.

### The Functional Way, .NET/C# Flavor

.NET implements the map operation in the form of the “Select” LINQ extension method. So you could rewrite the F# example above like this:

var result = numbers.Select(x => x + 3);

One important point that needs explaining is that the type of the resulting sequence doesn’t need to match the type of the source sequence. Do you have a list of ‘Employee’ and need a sequence of ints (containing, for instance, their IDs)? Easy peasy:

{% highlight c# %}
	List<Employee> employees = EmployeeRepository.All();
	IEnumerable<int> ids = employees.Select(x => x.Id);
{% endhighlight %}


## Filter

I think filter is, hands down, the easiest operation of the bunch. It has a very intuitive name, and the need for filtering stuff is so common in programming that I bet you correctly guessed what it is just by its name (if you didn’t know it already).

For the sake of completeness, though, let’s define it. The filter operation…wait for it…filters a sequence, returning a new sequence containing just the items approved by some criteria.

### The Imperative Way

Since we’ve used employees in the previous section, let’s keep within the theme. Let’s say you need to come up with a list of the employees who have used at least three sick days.

In a more procedural style, you’d maybe write something along the following lines:

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

I wouldn’t say there’s something _definitely_ wrong with this code. The method’s name is a bit too long, but it’s very descriptive. The code does what it promises. And it’s readable enough.

But similarly to the previous section, we can make the argument that the code is too noisy. We can say that, essentially, the only line that does something domain related is the _if_ test. All the other lines are basically boilerplate-y infrastructure code. Can a functional approach help us here?

### The Functional Way

Let’s rewrite the method above by using LINQ:

{% highlight c# %}
	public static List<Employee> GetEmployeesWithAtLeastNSickdays(List<Employee> employees, int number)
	{
	    return employees.Where(x => x.SickDays >= n).ToList();
	}
{% endhighlight %}

Here we use the “Where” extension method, passing the filtering criterium as a delegate. To be honest, the outer method became not very useful since it just delegates the work. In real life, I’d get rid of it.

## Reduce

Reduce is often the one many developers have some difficulty understanding. But it isn’t hard at all. Think of it like this: you have a sequence of something, and you also have a function that takes two of these “somethings” and returns one, after doing some processing.

Then you start applying the function. You apply it to the first two elements in the sequence and store the result. Then you apply it again to the result and the third element. Then you do it again to the result and the fourth item, and so forth.

The classical example of reduce is adding up a list of numbers, so that’s exactly what we’re going to do in our example.

### The Imperative Way

So, suppose we’re to sum a bunch of integers. We could do it like this:

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

At this point, you’re probably familiar with what I have to say about this code: it isn’t necessarily wrong, but it’s inflexible and noisy. Can functional programming save us?

### The Functional Way

In .NET/C#, the “Reduce” operation assumes the form of the “Aggregate” extension method. This time, I’ll just get rid of the enclosing method and write the LINQ solution right away:

{% highlight c# %}
	var sum = number.Aggregate((x, y) => x + y);
{% endhighlight %}

Things look a little bit more complex here, but don’t get scared. In this case, we’re just passing a function that takes two parameters, instead of one, like in the previous examples. It has to be that way since the function must be applied to two elements of the sequence each time.

But as it turns out, there’s an even easier way of solving this particular problem (adding a bunch of numbers). Since summing a sequence of numbers is such a common use case, there’s a dedicated method to do just that. It’s called, not surprisingly, “Sum”:

{% highlight c# %}
	var sum = numbers.Sum();
{% endhighlight %}

What’s “Aggregate” good for, then? Well, adding a list of integers is just one of the applications for reduce, but you’re not in any way restricted to only that. You can use it with any binary operation, such as concatenating strings or summing custom types.

## The Verdict: Is the Functional Approach Better?

After these examples, you might be wondering if the “functional” way is any better? It’d be extremely hard to define what “better” is, so I won’t even bother. Let’s consider another criterion: readability.

Though we know that code readability [can also be highly subjective,](https://blog.submain.com/evaluate-code-readability/) I’d say that yes, the functional examples are more readable. Suppose we need to retrieve and sum all the salaries from employees with more than five years of company time. We could easily do that by writing a loop, in which we’d test the condition and accumulate the salary if the test turned out true.

Or we could just write this:

{% highlight c# %}
	var sum = employees.Where(x => x.CompanyTimeInYears > 5).Select(x => x.Salary).Sum();
{% endhighlight %}

I honestly believe this line to be more readable (and generally better) than the procedural approach. It’s more declarative; it shows the intention of **what** we’re trying to get done without being too concerned with the **how**.

It almost reads like natural language: “The list of employees where their time in the company is greater than five years, select their salary and sum them”.

## Add Some Functional Spice to Make Your Code Tastier

Many people use LINQ for years without even realizing they’re using functional programming concepts. I take this as proof that functional programming isn’t beyond the capabilities of the enterprise developer who lacks a strong background in math.

Some of the concepts presented here are neither new nor restricted to functional programming. The benefits of distinguishing between functions that produce side effects from those that don’t is the basis of principles like [command-query separation (CQS)](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation), for instance.

The goal of this post was not to teach you functional programming. This is honestly beyond my capabilities, as I’m still studying it myself. And besides, there are [awesome resources for that purpose if you want to learn more](https://fsharpforfunandprofit.com).

Instead, what I wanted here is to give you a little taste of what a functional style can do for your code, which is to make it more expressive, concise, and declarative. Now it’s up to you to try to apply the functional mindset to the code you write.