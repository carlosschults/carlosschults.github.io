---
title: Unit testing for beginners - Part 1
permalink: /en/unit-testing-for-beginners-part1/
lang: en
ref: unit1
layout: post
author: Carlos Schults
description: Learn what unit tests are and the benefits they can bring to your apps.
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1459979937/testes-unitarios-iniciantes-min_povcse.png
tags:
- software-testing
- beginners
- unit-testing
- unit-testing-series
- automated-testing
- agile
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1459979937/testes-unitarios-iniciantes-min_povcse.png)

Maybe, some time in your career, you might have worked on an incredibly complex application, with an enormous, poorly-documented code base, full of hacks, unnecessary couplings, with a confused architecture and no specifications at all. That kind of app you'd call a miracle if it even works. Maybe I've just described your current project!
<!--more-->

*This post is part of a series. [See all the articles in the series.](http://carlosschults.net/tag/unit-testing-series/)*

In this type of project, it's very common for the developers to get afraid of touching the code, cause they know that if they do, something is going to break for sure. And worse: it's going to break in production, most likely.

Now, imagine that your application is completely covered by an alarm system. Every time a feature stops working, the alarm goes off. The developers are immediately notified, and someone can take action and solve the problem as soon as possible.

Imagine yet that this alarm system consists of hundreds of smaller systems. Each subsystem must watch a very specific part of your application. In order for the main system to function properly, each subsystem must be totally independent from the others.

The adoption of such a system would bring several benefits. First of all, developers would lose the fear of touching the code. Code refactoring would become easier to do, and it would be done more often. As a consequence, the quality of the code would improve.

The development process itself would be simplified. The alarm system would dramatically reduce the need for slow manual tests, thus speeding the release to the users.

Finally, the need for independence between the subsystems would promote the reduction of coupling between modules of the application.

It sounds too good to be true? Well, it isn't. This "alarm system" is exactly the benefit you get after adding a suite of unit tests to your application.

## What are unit tests?

Let's see what Wikipedia tells us:

> In computer programming, unit testing is a software testing method by which individual units of source code, [...] are tested to determine whether they are fit for use. Intuitively, one can view a unit as the smallest testable part of an application.  [...]
 Unit tests are typically written and run by software developers to ensure that code meets its design and behaves as intended.

The first thing worth mentioning is that unit tests **don't have the goal of testing the system as a whole**. On the contrary, they test small pieces of the application - the units. And what is a unit? There are several conflicting points of view on this, several "schools of thought". But it's safe to say that, in a context of Object Oriented Programming, most people would consider the class as being a unit.

Right after this, we see that unit tests are usually written and run by programmers. This is interesting for two reasons: first, it apparently goes against the idea that programmers don't make good testers (I'm going back to this point later). And more importantly than that, it shows the principal feature of unit tests: they are **automated**.

Bear in mind that there are a lot of types of automated tests, but here we're only talking about unit tests (which, according to several authors, such as [Martin Fowler](https://martinfowler.com/bliki/TestPyramid.html), are the ones who benefits the application the most).

In practice, unit tests are classes that contains methods who test small and isolated pieces of functionality. These classes are created with the aid of a test framework (such as JUnit in Java, NUnit or Microsoft Test in .Net). Then, the tests can be run via command line, by your IDE or even by an automated build service.


![Example of test case in C#](https://res.cloudinary.com/dz5ppacuo/image/upload/v1460211309/teste00_bnsbfl.png)

After the tests are run, you get an immediate feedback about which tests failed and which ones succeeded, along with the run time of each one of them.

![Windows displaying the result of a test run](https://res.cloudinary.com/dz5ppacuo/image/upload/v1459979476/teste01_ciglca.png)

With this feedback, you can decide on your best course of action. Ideally, a failing test should signal something wrong in the production code. The production code should then be fixed so the test can pass.

## Benefits of unit tests

In the beginning of the post, while using the alarm system metaphor, I've talked about some of the benefits that unit tests can provide, for instance:

- they promote and facilitate code refactoring;
- they promote architectural improvement of the system;
- they can simplify and accelerate the release of the product to the final users;

Another benefit worth mention is that unit tests **document the code**. Think of it: for each production class in your system, there are several test cases, that exercise every possible use of this class. A good test suite could help a recent hire to quickly gain familiarity with the code base.

That is, the best type of documentation: the one that is alive, executable, always up-to-date, and never lies.

We must also mention that a good and comprehensive test suite helps to prevent bug regression. It's a best practice to create a new test every time a new bug is found. That way, if the bug ever comes back due to a change, the test is going to show you.

Finally, one of the more important benefits that test automation can provide is cost reduction. Oddly enough, I don't see this benefit being talked about too much - maybe because it's more related to the business side of things. Let's say that your team tests the whole application, every time your about to release. You use four testers, working full-time, during two weeks. Just do the math and you'll see that **manual tests are freaking expensive!**

Worse yet: they are expensive twice. First, there's the cost itself, that you can calculate with the formula *hourly rate of tester x number of testers x hours spent in testing*. Pretty straightforward, no surprises here.

But, besides that, there is also an [opportunity cost](https://en.wikipedia.org/wiki/Opportunity_cost): if professionals are spending time doing manual tests that could be automated, then they are *NOT* doing other tasks that could have a greater ROI to the company.

## Common misconceptions

In this section, I'm going to try to clarify some of the myths and misconceptions that some people have about unit testing.

### Programmers shouldn't write tests, because they are bad testers

There is a widespread notion that programmers shouldn't test their own code. The rationale for this is that the developers would unconsciously avoid to use the app in a way that would break it. And from experience I can say that this indeed happens. I've lost count of how many times a coworker found bugs in an app I made after literally **seconds** of using it, in spite of the fact that I had already tested it a lot without making it fail.

The important point here is: **there are tests and tests**. Often, when people say that developers shouldn't test, they're talking about system tests, also called end-to-end tests. Such tests mean to test the system as a whole, which is not the goal of unit tests, as I said before.

Maybe, it's just lack of information: the person probably doesn't know the nature and purpose of unit tests, and mistake them for end-to-end tests.

## Writing unit tests is a waste of time; it's like coding the same thing twice

When you try to convince management that unit tests are worth it, it would be wise to focus on cost reduction. But, what about the developers? How to convince them to spend time writing test code, when they're already in tight deadlines and under a lot of pressure?

So, don't be so surprised if you try to sell unit testing to your fellow developers, and they just say to you: "Wast of time. We're not going to do that". 

What these people don't grasp is that *they're already testing their own code all the time, even if they don't call it that way*. Not convinced? Well, I bet your development work-flow looks something like this:

- Write a bit of code
- Compile
- Run the app, test the new feature
	- If it works, start to code next functionality;
	- If if doesn't, debug until you find what's wrong, then fix it.
- Repeat

What we propose is just to swap the "write production code -> compile -> test manually -> debug -> repeat" cycle for the "write production code -> write test code -> run tests -> fix production code if necessary".

You could argue that the cycles are the same - they kind of are. But the big advantage of unit tests is that, once written, they are easily repeatable until the end of the project's life. You "waste time" only once. Or better, you **invest** time and effort in the beginning, in order to create the tests, and seize the benefits for indefinite time.

### Unit tests replace all manual tests

Unit tests are not the only types of tests that can be beneficial to a project. We can also use several other types of automated tests such as **integration tests** and *acceptance tests*.

![Testing pyramid, showing the ideal ratio of different types of software testing](https://res.cloudinary.com/dz5ppacuo/image/upload/v1460217453/testing_triangle-300x233_nzq8kx.jpg)

That doesn't mean that manual testing should be extinct. On the contrary, manual tests still have an important role in quality assurance processes. Ideally, manual tests should focus on the areas that can't be automated, like usability testing.

In regards to agile methodologies, it is key that the Product Owner/Client/Business Person approves and accepts the user stories before they are included in a release.

Exploratory manual tests, that doesn't follow a script, can be useful to detect certain kinds of bugs. Most automated test cases tend to focus on the "Happy Path", that is, the scenario in which everything went right.
In real life, is very common for the users to use the application in...hm..."creative" ways. So, when you put the system under stress, using it in ways that the developers never intended, nasty bugs that would otherwise keep hidden, can show up.

Of course, once the bug is found, you should immediately write a test that exposes it. That way, if the bug ever comes back, it'll be easily detected.

## Conclusion

Unit testing - and automated software testing, in general - is a huge subject. There are a lot of books about it, there are master's theses about it. So, of course I can't do justice to this subject with a mere blog post.

But I sincerely hope that I had made a proper introduction to unit tests and clarified some of the questions that beginners usually have. If you have a question, suggestion or criticism, the comment are is all yours.

This post is the first one in a series dedicated to unit testing.
Next post: time to get your hands dirty! I'm going to show how to create your first unit test!

See you there!
