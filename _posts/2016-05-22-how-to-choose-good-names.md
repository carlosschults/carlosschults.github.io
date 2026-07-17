---
title: Ten tips to help you choose good names
permalink: /en/how-to-choose-good-names/
lang: en
ref: howtonamethings
layout: post
author: Carlos Schults
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1462225938/baby-name-min_nosetz.png
tags:
- best-practices
- readability
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1462225938/baby-name-min_nosetz.png)

> There are only two hard things in Computer Science: cache invalidation and naming things.
> 
> Phil Karlton

Do you want to write great code? Clean, understandable, human-readable code? Well, there are several skills you need to acquire. But I'd say #1 on the list is "Picking Good Names".
<!--more-->

Choosing great names for your classes, methods, variables and the like is essential. Wisely chosen names often are the difference between good and awful code.

But what exactly is a good name?  Even though there are some generally accepted guidelines, I'm afraid there isn't a real consensus. (As it is with a lot of topics in our field, I'd say).

So, today I'm going to talk about naming conventions and principles that I try to use whenever I'm coding. It's a mix of what I learned in college, studying by my own and working as a professional developer. It's been useful to me, so I hope it's going to be useful to you as well.

Some of the tips I'm going show you here today come from the book "Clean Code", by Robert C. Martin (Uncle Bob). It's one of my favorite programming books, and I'll write a review on it sometime soon. Stay tuned!

## 0. Use self-explanatory names

What your variable/class/whatever does? How it's supposed to be used? Choose a name that answers these questions.

Some people have the misguided notion that shorter names are always better. I can't understand this. Are they trying to save keystrokes or something?

Let's say you're browsing a code base and you see some code like this:

{% highlight c# %}
    int d; // days until deadline
{% endhighlight %}

You could argue that this code is fine. The variable's meaning is perfectly expressed in the comment. Great, but remember that the variable will probably be used in other points, away from the declaration and the comment.

So...why not just drop the comment and use the comment's text as the variable's name?

{% highlight c# %}
    int daysUntilDealine;
{% endhighlight %}

## 1. Use abbreviations only when they're widely known

It would be crazy to name a variable "ServiceUniformResourceLocator" instead of "ServiceUrl". Every developer knows what a Url is. The same thing with Ftp, UI, IO, and so on. So, it's ok to use abbreviations to name things, but only if they are widely known and used. It would be counterproductive not to do so.

By the way. When I say "widely known", I don't necessarily mean *worldwide known*. Of course you can use abbreviations that are common in your business domain. It is considered a best practice to program as close as possible to the customer's language. So, if your fellow developers and the business people are comfortable with the abbreviations, there's no problem at all in using them.

## 2. Choose clarity over brevity

This is somewhat related to the first point. All else being equal, shorter names are better. But one day you'll have to choose between clarity and brevity. When that day comes, always pick clarity. Six months down the road, when you have to revisit that code, you're going to thank yourself.
 
## 3. Use widely accepted conventions (most of the time)

There are very few points in the book "Clean Code" that I disagree with. One of them is Uncle Bob's recommendation to not start interface names with a capital "I".  He argues that this practice is reminiscent of Hungarian notation, and thus should die. Even though I understand why he thinks like this, I'm still starting my interface names with an "I".

Why? One simple reason: starting interface names with an "I" is a very widespread and accepted convention in the .Net community. When you go against an established convention, you risk alienating developers who are used to that convention, like potential new team members or open-source projects contributors.

I think you should abandon a widely accepted convention only when the benefit of doing so greatly outweighs the costs. And I don't think that's the case here.

## 4. Don't use Hungarian notation 

Maybe you've heard about Hungarian Notation, maybe you haven't. But I bet you've seen it, or even used it yourself, even if the name doesn't ring a bell immediately.

So, what is this Hungarian thing? Our friend Wikipedia comes to our rescue:

> Hungarian notation is an identifier naming convention in computer programming, in which the name of a variable 
>  or function indicates its type or intended use.
>  
>  [Wikipedia: Hungarian Notation](https://en.wikipedia.org/wiki/Hungarian_notation)

So, in a nutshell, Hungarian notation is encoding the type of the variable in its name. So, if I have an int variable meant to store the age of a student, I'd call it `iStudentAge` or `intStudentAge`. Similarly, a string variable supposed to store a product's description would be called `sProductDescription`, or even `strProductDescription`.

And why is this bad? Here are a few reasons:

- First of all, it's useless. If your variable has a self-explaining name (see item #0), it will give you a decent clue about its type. If you spot a variable called `productName`, would you think it's a floating-point number? Besides, most modern IDEs can tell you not only the variable's type, but also if it's a local variable,instance member or a method parameter, and even how many times it's been referenced.
- It can be misleading. People make mistakes, and it's perfectly possible to change the variable's type but forget to also change its name to reflect the new type. So now you have a variable prefixed with "int" but it's actually a long.
- It makes the names more difficult to pronounce, and this may complicate discussion about the code and the architecture of your application.

## 5. Stick to the language/framework/project's coding style

Most C# developers tend to use CamelCase to name local variables, instance variables and methods parameters, as in `productName`. In Ruby, for instance, the recommended style is `snake_case`, as in `product_name`. 

Development frameworks and open-source projects might have their own guidelines and standards as well. 

It would be pointless to fight against established standards, due to a matter of taste and preference. If you're writing Ruby code, write the way the Ruby community expects. The same with Java, C#, PHP, what have you. 

It's like they say: "When in Rome, do as the Romans do".

## 6. Method names should start with a verb

This one is really short. Methods are usually actions that an object can perform. As such, their names should start with a verb that indicates the action to be performed, e.g. `PrintReport()`, `DrawShape(IShape shape)`.

## 7. Class names should be nouns

Likewise, class names should be nouns, like `Product`, `Customer`, `Student`. Avoid using the words like `Manager`, `Data`, because they add little or no value.

## 8. Property names should be nouns or adjective phrases (C# specific)

Properties should be names with nouns, noun phrases or adjectives. When naming boolean properties, you may add the prefixes `Can`, `Is` or `Has`, when doing so provides value to the caller.

## 9. Use pronounceable/searchable names

Work hard to choose names that are pronounceable. When you pick a name that is hard or impossible to pronounce, you discourage discussion about your code, which is never a good thing. 

Likewise, try to avoid names with a single letter. Among other reasons, they may give you a very hard time when you have to search for them! They make good names only for loop control variables or in lambda expressions. But even then, only when the scope is super short.

## Conclusion

Choosing names is really hard. A name should express purpose, intention, meaning. It doesn't necessarily need to be clever -- but there are certain tricky situations that will require a little bit of cleverness. 

A name should clearly express the purpose of the entity being named. But there are a lot of things that are very complex by their own nature, and it's not so easy to come up with a perfect name for a very complex concept.

Sometimes, the difficulty you experience while choosing a name is a symptom of another problem, like a messy   architecture, for instance. If you can't decide between five options when naming a class, maybe the class is violating the Single Responsibility Principle (it's trying to do more than one thing). 

On the other hand, if you feel like calling a dozen classes the same thing...maybe they belong together as a single class.

Choosing names is ultimately about communication. And I think that's why it's such a hard task. Because we, developers, are not necessarily famous for our communication skills.

In "Clean Code", at the end of the chapter about choosing good names, Uncle Bob writes:

> The hardest thing about choosing good names is that it requires good descriptive skills and a shared cultural background. This is a teaching issue rather than a technical, business, or management issue. As a result, many people in this field do not do it very well.

Don't be like most people in our field. Do the hard work and learn how to name things. You'll thank yourself in the future.
