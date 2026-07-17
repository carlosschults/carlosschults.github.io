---
title: "C# 8.0 Features: A Glimpse of the Future"
ref: csharp8
lang: en
layout: post
author: Carlos Schults
permalink: /en/csharp-8-features/
canonical: https://blog.ndepend.com/c-8-0-features-glimpse-future/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1513817072/csharp8-1037x438_skogpz.jpg
tags:
- csharp
- language-features
- beginners
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1513817072/csharp8-1037x438_skogpz.jpg)

C# 8.0 is coming and will bring some great new features. Let's check out what the future holds for us.
<!--more-->

*Editorial note: I originally wrote this post for the NDepend blog.  You can [check out the original here, at their site](https://blog.ndepend.com/c-8-0-features-glimpse-future/). While you’re there, download NDepend and give it a try.*

It’s been almost 20 years since Microsoft released the first version of the C# language. From its inception—when some unjustly deemed it a mere Java copycat—until now, C# has had a remarkable evolution.

Nowadays, it’s frequently featured in both [most used](https://insights.stackoverflow.com/survey/2017#technology-programming-languages) and [most loved](https://insights.stackoverflow.com/survey/2017#most-loved-dreaded-and-wanted) programming languages lists. You can use it to develop desktop, web, and mobile apps, and you can write code that will run in all the major operating systems. Or you can jump right onto the IOT bandwagon and write code to "smarten" your house. We live in interesting times to be a C# developer indeed.

If the present is already exciting, what about the future? Would it be possible for us to get a glimpse of what lies ahead for the language?

Of course it is. Microsoft has developed C# "in the open" for quite a while now. You can just [take a look at the GitHub repo](https://github.com/dotnet/csharplang) to read (and participate—why not?) in the discussions and proposals.

Today, we’ve selected three feature proposals for C# 8.0 to talk about here: **extension everything**, **default implementations on interfaces,** and **nullable reference types**.

## Extension Everything

Extension everything is probably the least controversial of these three feature proposals, and in a certain way, it’s the least fleshed out also. So I figured it’d make a good starting point.

You’re probably familiar with extension methods, introduced in C# 3.0 in 2007. [And while it’s totally possible for them to be abused](https://www.daedtech.com/why-i-dont-like-c-extension-methods/), there’s no denying that extension methods, if used wisely, can be an awesome addition to the C# developer’s toolkit—not to mention they’re essential for LINQ.

At some point you may have wondered, though: why only extension *methods*? And you wouldn’t be alone. Extension properties, for instance, have been a desire of C# developers for quite a long time, as evidenced by [this 2009 Stack Overflow question](https://stackoverflow.com/questions/619033/does-c-sharp-have-extension-properties) or this [even older 2007(!) forum thread](https://channel9.msdn.com/forums/Coffeehouse/257556-C-Extension-Properties/).

But now it seems the wait is finally coming to an end. According to Mads Torgersen, the program manager for the C# design team, [a Microsoft intern proposed a new syntax for extension methods that will also allow "extension *other things*"](https://channel9.msdn.com/Blogs/Seth-Juarez/A-Preview-of-C-8-with-Mads-Torgersen).

### Let’s See the Code

Well, if I were you, I’d be itching to see some code. Here’s an example of an extension method using current syntax:

<script src="https://gist.github.com/carlosschults/d6ec153b7274ac699634d5dadb2e9644.js"></script>


Nothing surprising here, right? In the original syntax, an extension method is just a static method in a static class, with the *this* keyword before the first parameter.

The thing is this syntax only works with methods (and, really, how could it be otherwise, since what would be the first "parameter" of a property?)

Here comes "extension everything." This proposal suggests a new type declaration called an “extension”:

<script src="https://gist.github.com/carlosschults/5c1afca9c8fbc6837257cc5d289df2e9.js"></script>

The code above is an example; as of the date of this writing, the C# team is yet to settle on a syntax.

Regardless, the example shows the creation of an extension class that extends "int." We then declare a property as we normally do, and we’re done.

Now the caller code would be able to use the property normally:

<script src="https://gist.github.com/carlosschults/d401d37e182647b253fa721425eec828.js"></script>

This new feature is meant to support methods, properties, operators, and static members, at least in the beginning; events and constructors may come later.

You won’t be able to add additional state to the original instance, i.e., creating a private field in the extension class. According to Torgersen, this would add undesirable complexity in order to keep track of this new state.

### Current Status

You can [follow the feature development on its GitHub issue.](https://github.com/dotnet/csharplang/issues/192)

## Default Implementation on Interfaces

I admit I was surprised—and not exactly happy—when I first heard about default implementation on interfaces [in a talk Mads Torgersen gave in May 2017, at the Build 2017 Conference.](https://channel9.msdn.com/Events/Build/2017/B8104)

"What about record types?" I thought. “What about immutable objects? What we’re really getting is implementation on *interfaces*?”

You can safely guess what this feature is by its name: we’ll be able to add method implementations on interfaces. For instance:

<script src="https://gist.github.com/carlosschults/efde91de1a54a1bc4f44c1a7a748d70c.js"></script>

In C# 8.0, the code above would be perfectly legal. A class implementing the interface wouldn’t need to implement the method. If some implementation of the interface decides that the default implementation doesn’t fit its needs, then it can provide its own implementation.

Besides methods, you’ll also be allowed to add bodies for indexers, properties, and event accessors. Static members such as methods, properties, and indexers will be allowed as well.

Instance state will not be allowed in interfaces, though. You’ll be able to use static fields but not instance fields. As a consequence of this, auto-implement properties won’t be allowed as well, since they automatically declare a hidden backing-field.

### Use Cases

As stated in the feature [proposal](https://github.com/dotnet/csharplang/blob/master/proposals/default-interface-methods.md), the primary use case for default interface methods is to enable the developer to safely evolve an interface. You could add new methods to it and, as long as you provided a default implementation, existing clients of the interface wouldn’t be forced to implement it.

Currently, you could solve this problem with an extension method. This approach is limited, though: what if you wanted to provide a specialized version of the method for one of the implementations? Good luck with that.

That’s when default implementation shines.

Another important value proposition of default implementation on interfaces relates to Android and iOS. Since both Java and Swift offer this feature, it’s tricky to use C# to wrap Android/iOS APIs that make use of it. C# 8.0 will make it possible to wrap those APIs more faithfully.

### Will Interfaces Become Abstract Classes?

Sort of, but not really. As you know, there’s no multiple inheritance in languages like C# and Java, which means you can’t inherit from more than one class. On the other hand, a class is (and will continue to be) able to implement several interfaces.

### Current Status

This feature is currently being prototyped. [You can follow its development on the GitHub issue.](https://github.com/dotnet/csharplang/blob/master/proposals/default-interface-methods.md)

## Nullable Reference Types

"What?" you may be wondering. “Shouldn’t it be ‘**non**-nullable reference types’?” The name of this feature can be a bit confusing, indeed. I’ll get back to that soon, but first, let me address why this is even a thing.

I bet you’re familiar with the phrase "the billion dollar mistake." On the off-chance you’re not, the phrase refers to the null reference, and it [was coined by none other than Sir Tony Hoare, the inventor of the null reference himself.](https://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions)

### But why is that? Why is null so bad?

You could make several arguments as to why, but the biggest problem is, of course, the risk of getting the infamous null-reference exception (aka null-pointer exception in Java-land). Since everything ("everything" in the context of C# meaning all [reference types](https://carlosschults.net/en/value-reference-types-in-csharp/)) can be null, you always run the risk of getting an exception when you try to access some member of the object.

One of the biggest issues here is that the language itself lacks a syntax that would allow the author to express their intent. It isn’t possible for you to say "This parameter can never be null" or “This property may be null sometimes, and that’s ok.”

It’s common for functional languages to deal with this by having some type that represents the concept of a potential absent value, often called "Maybe" or “Option.”

The C# team decided against something like this since, according to them, it’d be the same as adding a new kind of null to the language and it’d probably make things more complex.

Let’s go back now to the naming issue. You may be thinking that I’ve got it backwards. It makes sense to talk about nullable value types since value types are non-nullable by default. But in the case of reference types, it shouldn’t, right? After all, they’ve been nullable from the beginning.

Here’s the catch: the C# design team—in a move not free of controversy—intends to make non-nullability the new default for reference types. In that sense, the "new" thing would be the nullable types.

To keep the language consistent, they propose to use the same syntax that already exists for nullable reference types—in other words, the question mark.

### Enough talking. Let’s see some code!

I suppose using the infamous "Person" class in an example is the software equivalent of playing “Stairway to Heaven” in a musical instruments store—it may be a little overdone. But using a more elaborate example would be both distracting and unnecessary, so please bear with me.

Suppose we have a "Person" class with an “Age” property of type “int.” Then, we write the following method:

<script src="https://gist.github.com/carlosschults/9b09f0572e737569e6f97315e5028411.js"></script>


Even though the code above will gladly compile, it’s fragile since "p" could be null. You probably should add an “if” statement to account for that possibility, but no one will make you do that. You’re completely free to leave the code as it is.

C# 8 promises to change that by making reference types non-nullable by default. In the example above, trying to access the "Age" property would be safe, since “p” would never be null.

If you wanted "p" to be nullable, then you’d have to add a question mark to the type, as I’ve mentioned before:

<script src="https://gist.github.com/carlosschults/8554d8863882955b554b486797b83726.js"></script>

Now that "p" can be null, trying to access Age isn’t safe anymore: you’ll get a warning for doing that. Want to get rid of the warning?

Just do what you (hopefully) already do today and perform a null check:

<script src="https://gist.github.com/carlosschults/edc992560bf6c005c6be821103e160a3.js"></script>

That way, a flow analysis will be performed; if the assignment line is reached, the compiler will know for a fact that "p" can’t possibly be null and will leave you alone.

Here’s another possibility:

<script src="https://gist.github.com/carlosschults/518c1b35560cafe17fca829aa2aef27b.js"></script>

In short, you have several options. As soon as you convince the compiler that your code offers no risk of throwing a null reference exception, the warning goes away.

### Preventing Assignment from Nullable to Non-Nullable

The new version of C# will also prevent assigning from a nullable variable to a non-nullable, so the code below will result in a warning as well:

<script src="https://gist.github.com/carlosschults/98f91bc50c924a8bd47897b874a7be89.js"></script>

This feature will come along with a new operator called the null-ignoring operator. You’ll basically use this operator to tell the compiler that "I, the developer, know best." There will be situations when a variable can’t possibly be null, but the compiler won’t be able to infer that.

One such example would be the use of the "string.IsNullOrEmpty()" method:

<script src="https://gist.github.com/carlosschults/7f0f2f7470f810d228f1d68559b1d6b7.js"></script>

The code above will generate a warning, despite it not being possible for "bar" to be null. That’s when this operator comes in handy:

<script src="https://gist.github.com/carlosschults/008709a0b9ff6a72abc8fc4882a467d3.js"></script>

Keep in my mind that, by using this operator, you’re basically telling the compiler: "Trust me! I know what I’m doing." So you’d better really know what you’re doing!

### What about backward compatibility?

I know what you’re probably thinking by now. "That sounds nice and all, but wouldn’t this change break a lot of existing code?"

Well, of course it would. That’s why this will be an **opt-in** change, activated on a per-project basis

### Current Status

This one is already prototyped. If you’re interested, [you can download, install, and test a preview for nullable reference types right away.](https://github.com/dotnet/csharplang/wiki/Nullable-Reference-Types-Preview)

As with the previous features, you can stay tuned by [following the relevant proposal in GitHub.](https://github.com/dotnet/csharplang/blob/master/proposals/nullable-reference-types.md)

## C# Has a Future. And It Looks Awesome

So now you know a bit more about three of the features we’re probably getting with the next major version of the C# language.

As you can see, evolving the language is hard work. The language has to remain compatible with the millions (billions?) of lines of code written with it in the last 17 years. At the same time, in order to continue being relevant, it must meet the needs of developers that are facing challenges that were unimaginable years ago. And it must do all of this without losing its essence: being an easy and approachable object-oriented C-like language.
