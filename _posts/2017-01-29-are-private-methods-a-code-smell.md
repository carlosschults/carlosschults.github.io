---
title: "Are private methods a code smell?"
ref: privates
lang: en
layout: post
author: Carlos Schults
permalink: /en/are-private-methods-a-code-smell/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1485700794/capa-min_no1cci.jpg
tags:
- code-smell
- best-practices
- oop
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1485700794/capa-min_no1cci.jpg)

Some people believe private methods should be avoided. Are they right?
<!--more-->

A couple of months ago, [Marcos Douglas](https://twitter.com/mdbs99) published a post about [how the use of rules and constraints can help you keep your code clean and maintainable](https://gist.github.com/carlosschults/5f4ba7cfb2453977c8d11424b2926686)*. This [premise](https://medium.com/@cscalfani/why-programmers-need-limits-3d96e1a0a6db#.rptqu89ec) keeps showing up [again](https://blog.ploeh.dk/2015/04/13/less-is-more-language-features/) and [again](https://robots.thoughtbot.com/sandi-metz-rules-for-developers) around the web, and I totally agree with it. 

Marcos lays out several useful guidelines such as the ideal number of arguments in a method, the ideal numbers of methods in a class, and so on. The post is very good, and I think you should all [check it out](https://gist.github.com/carlosschults/5f4ba7cfb2453977c8d11424b2926686), but it is not the focus of today's post. 

Instead, I want to talk about a subject that showed up in the comment's thread: private methods as a [code smell](https://martinfowler.com/bliki/CodeSmell.html).

Since I'd never heard something along those lines, I was naturally surprised and decided to do some research.

## What's the matter with private methods?

First, let's try to understand why would private methods be a problem.

One common argument is that private methods violate the Single Responsibility Principle. The SRP states that each class should do only one thing. If you're tempted to create private methods, the argument follows, that's a sign that your class is doing too much.

> Private helper methods indicate classes are doing too many things. Moving private helper methods to different classes, including creating new classes if necessary, splits the original responsibilities across multiple classes leading to simpler, better designs.
>
> Kent R Spillner, in [Private Methods are a Code Smell](https://kent.spillner.org/blog/work/2009/11/12/private-methods-stink.html)

Here is another similar view:

> Private methods are not inherently bad, but they are a sign that you might be missing out on an opportunity to make a useful abstraction. If you have a private method that calls another private method, then there is almost certainly an area of responsibility that remains unidentified.
>
> John McDowall, in [Break. It. Up! – Private Method Access Modifiers as Code Smells](https://blog.stormid.com/2015/03/method-access-modifiers-as-code-smells/)

Another argument is that private methods make unit testing difficult:

> Make it public!
>
>[...]This is probably the simplest way to overcome the problem of untestability.[...] There’s a reason for that:  testability is a perfectly good reason to make something public.  And you should test most of your code.

> Jason M Baker, in [Enemies of Test Driven Development part I: encapsulation](https://jasonmbaker.wordpress.com/2009/01/08/enemies-of-test-driven-development-part-i-encapsulation/)

Finally, people also argue that private methods play an important role in messing with internal states in objects, which can get you in real trouble.

>Functional programming teaches that state (in the form of member variables) is evil, because it makes your code more complex and harder to test.
>
> Ryan Ginstrom, in [Three reasons to avoid private class members](https://ginstrom.com/scribbles/2007/11/12/three-reasons-to-avoid-private-class-members/) 

I've just outlined some of the common arguments against the creation of private methods, so now it's time to show my opinions on this.

## Private methods are *not* necessarily SRP violations 

The first argument presented states that private methods violate the Single Responsibility Principle.

> *Private helper methods indicate classes are doing too many things.*

I don't think that's the case. At least, not always. It depends on what the private method is doing.

You probably shouldn't add a method called `ValidateEmailAddress` to your `Customer` class, whether private or not. After all, a customer is not the only entity that can have an email address. Instead, create an `Email` class and put all the pertinent validations in it.

On the other hand, let's say you're creating a `Sort` method for a custom data structure. In this case, it'd make a lot of sense to keep the `Sort` method public, and have some auxiliary private methods, such as `CompareItems` and `Swap`.

> *Moving private helper methods to different classes, including creating new classes if necessary, splits the original responsibilities across multiple classes leading to simpler, better designs.*

My main issue with this argument is not that small classes are generally better than large ones, which I agree.

My problem is that I don't agree that creating new classes and public methods **just for the sake of avoiding private methods** will **automatically** lead to "simpler, better designs". It sure *can*; but it can lead you to worse designs as well. Each situation is unique.

## I don't buy testability for testability's sake

I really like unit tests (and automated tests in general). I helped evangelize unit testing in my workplace, and I'm currently supervising the team that is adding unit and integration tests to our codebase.

And one of the first questions that people ask when you're teaching unit testing to them is: How do I unit test private methods?

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1485701114/unicorn_dies-min_epffty.jpg)

My answer usually is: **you shouldn't**. IMHO, it's just not that productive to put a lot of effort into testing private methods: since they are called by the public ones, they're going to be exercised by your tests anyway.

The goal of a unit test should be to test and document a "unit" (a class) by using its public API. Which leads us to the next point.

## Your public API should be stable!

API stands for "Application Programming Interface". This term can mean a bunch of things, but in this context, think of the API as the set of all public classes and methods that your application exposes to consumers. 

The API acts as a kind of contract between you and your consumers. It's a deal. If you alter the deal, the other party won't be happy.

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1485701325/deal-min_th2zxm.jpg)

Your public API should be as stable as possible. This is specially true when you're writing a web service, a library, or any kind of tool that other parties depend on.

By the way, this third party doesn't have to be geographically distant from you. It's common for a medium to large company to have several teams that depend on code provided by each other. What would happen if each team constantly made drastic changes in their APIs? Chaos.

When you expose a method publicly, from that moment on you're "forced" to keep that method working and honoring its contract; otherwise, your consumers will suffer with breaking changes in their code!

A good usage of private methods can help ensure proper encapsulation in your design.

Here's yet another quote from Kent R Spillner:

> Sometimes, private methods are created just to give pieces of functionality more descriptive names. Although descriptive names are desirable, creating private methods to provide descriptive names for things is still a smell. Moving these methods to collaborators and making them public creates opportunities for future reuse without reducing the clarity of the original code.

This is one of the points I most vehemently disagree with. I often create private methods for the exact reason Kent R Spillner criticizes here, i.e. giving descriptive names for chunks of code, a habit I developed after reading Robert C. Martin's book *Clean Code*.

Mr. Spillner defends that the proper way to deal with this should be to move these methods to other classes and make them public.

But in doing that, I've just added a new public method to the public API of my system! Now it's one more method to document, test and support, even though it was never *meant* to be part of the public API. 

Here we have a definition for access modifiers that I think is spot on:

> public - this method is part of the published API and will not change within major versions of the class
> 
>[...]
>
> private - this method was refactored out of a well tested public or protected method for reasons of clarity or internal re-use. This method may absolutely change, even in patch releases, and should not be relied upon to even exist.

I subscribe to this definition. Thus, in my opinion:

- Private methods are not necessarily a bad thing to be avoided at all costs.
- Making private methods public don't automatically lead to better design; it can also lead to an unnecessary inflated API, weak encapsulation, and increased maintenance overhead.
- Testability is a noble goal, but should be pursued pragmatically. Well tested and documented public methods should be enough, for most cases.

## Private methods can be good or bad; learn to tell them apart

All being said, I do think there are cases in which private methods are used in a wrong way. Like any other tool, they can be abused. You should probably watch out for some red flags.

If a private method is at a **different level of abstraction** than the public ones in a class, it's a sign that it belongs in another class. Reading/writing to a file is at a lower level than calculating an employee's  monthly payment, for instance.

When a private method is so complex that you really, really wished you could unit test it...then it probably should be made public. (Before you point out my apparent contradiction, I'm not saying that **every** private method should be made public in order to become testable...just the ones who cross some threshold of complexity).

<blockquote class="twitter-tweet" data-lang="pt"><p lang="en" dir="ltr"><a href="https://twitter.com/pablogl">@pablogl</a> i only test public methods. if a private method is complex enough to need testing, it generally needs its own object.</p>&mdash; Kent Beck (@KentBeck) <a href="https://twitter.com/KentBeck/status/3579860805">27 de agosto de 2009</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

What about a private method that contains duplicated code, as in, copied and pasted from another class...? Get rid of the duplication immediately! 

So, here is the thing: two out of the three signs I've just outlined are somewhat subjective. At some point, you have to make some choices. How complex is complex enough for a private method to need unit testing? How to properly tell about different levels of abstractions?

The best tip I can offer is: **Use an extra pair of eyes**. Always have another person look and examine your code before you check it in. Pair-programming and/or code review are great techniques, not only for improving design and catching bugs, but also for spreading knowledge across a team. Not only technical knowledge, but domain knowledge as well, and that can make the difference when the time comes to make those tough decisions.

## In conclusion

Although private methods can be used in bad ways, I think it's premature to automatically label them as a bad thing and something to be avoided.

It seems to me that some of the people that claim to be arguing against private methods **are in fact arguing against issues that are orthogonal to private methods**; you can violate SRP with and without private methods; you can mess with internal mutable state with and without private methods, and so on.

Software development is an art, full of trade-offs and uncertainty. And while rules-of-thumbs can be useful, they should not be followed blindly. 

This post turned out way longer than I intended. Thanks if you've made this far. See you next time!

## References

- [https://stackoverflow.com/questions/2620699/why-private-methods-in-the-object-oriented](https://stackoverflow.com/questions/2620699/why-private-methods-in-the-object-oriented)
- [https://kent.spillner.org/blog/work/2009/11/12/private-methods-stink.html](https://kent.spillner.org/blog/work/2009/11/12/private-methods-stink.html)
- [https://blog.stormid.com/2015/03/method-access-modifiers-as-code-smells/](https://blog.stormid.com/2015/03/method-access-modifiers-as-code-smells/)
- [https://jasonmbaker.wordpress.com/2009/01/08/enemies-of-test-driven-development-part-i-encapsulation/](https://jasonmbaker.wordpress.com/2009/01/08/enemies-of-test-driven-development-part-i-encapsulation/)
- [https://medium.com/i-m-h-o/private-methods-smelly-ish-435e93ff8c39#.cl06rkgct](https://medium.com/i-m-h-o/private-methods-smelly-ish-435e93ff8c39#.cl06rkgct)
- [https://ginstrom.com/scribbles/2007/11/12/three-reasons-to-avoid-private-class-members/](https://ginstrom.com/scribbles/2007/11/12/three-reasons-to-avoid-private-class-members/)
- [https://rc3.org/2010/01/26/the-argument-against-private-methods/](https://rc3.org/2010/01/26/the-argument-against-private-methods/)
- [https://naildrivin5.com/blog/2010/05/26/is-private-a-code-smell.html](https://naildrivin5.com/blog/2010/05/26/is-private-a-code-smell.html)


\* The author has given me permission to translate the article to English. [Here is the original version, in Portuguese](https://objectpascalprogramming.com/posts/menos-e-mais/).

