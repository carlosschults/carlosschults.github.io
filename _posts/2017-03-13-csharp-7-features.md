---
title: C# 7 Features Worth Knowing - Part 1
ref: csharp7
lang: en
layout: post
author: Carlos Schults
permalink: /en/csharp-7-features/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1489452722/charp7-features-cover_ciekql.jpg
tags:
- csharp
- beginners
- language-features
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1489452722/charp7-features-cover_ciekql.jpg)

C# 7 is finally among us. Time to check out some of its features.
<!--more-->

In my [last post](https://carlosschults.net/en/csharp-6-features/) I've written about some of the more interesting (for me, at least) features of C# 6. Visual Studio 2017 and C# 7 were officially released the following day, so I guess now it's the perfect time for us to discuss the new version of the language.

I think it's fair to say that the seventh version of C# continues the trend started by its predecessor. Instead of adding radically new capabilities to the language, the design team again chose to include features meant to make your code cleaner and more concise.

In this version, they "expanded" certain features that made their debut in C# 6. It seems that the previous version acted as a kind of rehearsal for some features; now that the design team knows that those features were well accepted, they can take them to their next level.

So, without further ado, let's begin.

## Digit separators and binary literals

Take a look at the code bellow:

<script src="https://gist.github.com/carlosschults/00e899d0f7611e3ca3b54f109f58619b.js"></script>

What are those underscores for? **Readability**, that's what.

Large numbers can become quite hard to read. To address this issue, C# 7 lets you to use the `_` as a digit separator.

The separators make no difference on the value. You can place them wherever you like in the number, and in any quantity.

And in case you're wondering, you're not restricted to using them with integers only; they also work with the other numeric types as well.

The new version of C# also introduces binary literals, as seen in the third line of the example shown above. If you need to write a binary value, just put `0b` at the beginning of the number, and that's it!

## Out variables

In previous versions of C#, working with *out* variables has been somewhat inconvenient. You'd have to split their declaration and usage into two steps.

Now, C# 7 allows you to declare the variable at the argument list:

<script src="https://gist.github.com/carlosschults/fbd60b4e31a09c1e0a4f19b431b10320.js"></script>

Some important things to bear in mind:

- Even though I've explicitly written the type name in the declaration, this is not always required. I could have used `var` and it would've worked just the same.
- You may think that the declared variable will go out of scope after we leave the `if/else` block. That is **not** the case. The variable continues to be accessible until going out of its normal scope.

<script src="https://gist.github.com/carlosschults/a23411376a6610e0e9081674faf1b0a5.js"></script>

## (More) Expression-bodied members

At the beginning of this post, I said that C# 7 expands some of its predecessor's features, remember? Well, this is one of those cases.

In the last post, we've seen that [C# 6 brought us Expression-bodied members](https://carlosschults.net/en/csharp-6-features/#expression-bodied-methods-and-properties), which is a nice and shorter way of writing members of the class, using the lambda expression syntax.

However, you could only use this feature with **methods, read-only properties and indexers**. 

C# 7 changes the game. Now you can use expression-bodied constructors, destructors, and writable properties.

<script src="https://gist.github.com/carlosschults/50512925b89eb8ee590190793846a724.js"></script>

## throw Expressions

This one is very simple. Consider the following code:

<script src="https://gist.github.com/carlosschults/8f89e4fff3cf3e6302bc8325d4df5617.js"></script>

That is 9 lines of code for just an assignment. And most of those lines are not performing the assignment itself; they're just a guard clause. Of course, they're important, but they tend to pollute your code. What if there was a better way?

Now there is. 

In the previous versions of C#, `throw` was a statement. Now, it is an **expression**, which allows us to throw exceptions in places like the second hand of the Null Coalescing Operator and in conditional expressions.

Using a *throw expression*, the example shown above becomes as simple as this:

<script src="https://gist.github.com/carlosschults/a10cfa584d08fda2d3497075926d073d.js"></script>

Of course, there's nothing stopping us from turning the constructor into an expression-bodied member:

<script src="https://gist.github.com/carlosschults/02548a3f2d735468518e6c00eea385a8.js"></script>

## Conclusion

In this post, we've seen some of the new features from the seventh version of C#. This was just the fist part. More parts will come, in which I intend to cover all (or at least most) of the new features.

As I've said earlier, C# 7 kind of continues the path started by C# 6. The design team didn't just include crazy new features just for the sake of it; instead, they carefully selected the ones that would help all of us to improve the quality of our code.

That being said, I do consider that this version is a little bit...less shy - for lack of a better word - than its predecessor. Some of the features that I didn't talk about today show that the language is being pushed to interesting new directions, and I think there is a very exciting ride ahead of us.

Thanks for reading, and stay tuned for part 2!
