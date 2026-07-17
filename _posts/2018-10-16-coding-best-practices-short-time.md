---
title: "Coding Best Practices When You’re Short On Time"
ref: best-practices-short-time
lang: en
layout: post
author: Carlos Schults
description: Today I'll show you some coding best practices that are easy to implement and can raise your application's quality in very little time.
permalink: /en/coding-best-practices-short-time/
canonical: https://blog.submain.com/coding-best-practices-short-time/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1539703469/coding-best-practices-1038x437_ugnhab.jpg
tags:
- csharp
- best-practices
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1539703469/coding-best-practices-1038x437_ugnhab.jpg)
Photo by Ales Nesetril on Unsplash

*Editorial note: I originally wrote this post for the SubMain blog.  You can [check out the original here, at their site](https://blog.submain.com/coding-best-practices-short-time/). While you’re there, download and try their CodeIt.Right product.*

One topic in software development that really fascinates me is coding best practices. I'm always searching for ways to improve my work and deliver value in a fast and consistent manner.

It can be tricky to define what a "[coding best practice" is](https://www.daedtech.com/what-is-a-best-practice-in-software-development/). Some people are even in favor of [downright retiring the term!](https://dzone.com/articles/death-best-practices) But one thing pretty much everyone agrees upon is this: coming up with and implementing strategies---by whatever name you call them---to improve the output of one's work is something that any developer worth his or her salt should be continuously doing.

Of course, there's no free lunch. The adoption of a best practice takes time...and sometimes you just don't have much of that to begin with. And then there's management, whose buy-in is not always guaranteed.

So, what to do if your development team is struggling with the poor quality of a codebase while lacking time to implement best practices that would help?

The answer I offer you today is what I'll call the "coding best practices emergency pack": *a small list of coding best practices that you can adopt on relatively short notice to get your team and your codebase from utter chaos to a more manageable state*.

Because there's lots of advice on coding best practices out there, to the point where it's hard not to feel overwhelmed, I narrowed down my list of emergency-pack best practices by requiring they meet three criteria:

-   They must be fundamental, in the sense that they're the building blocks with which you can implement more sophisticated practices later.
-   You can adopt them in relatively short notice. (I'd say a week is feasible.)
-   Their cost is free or very low.

The practices that follow all fit these parameters. And without further ado, here it is: my coding best practices emergency pack, with items listed in the order they should be implemented and starting with the most critical one.

## Version Control System

I once worked for a software development shop where no version control system was used. The source files were placed in a shared folder that every developer could access. What was the process we used when editing a file? Yeah, you guessed it:  we'd simply create a copy of the file and rename it to "filename_old.ext" or something like that.

This was about eight or nine years ago. So maybe things have improved, right? Well, they certainly have, to some extent, but not completely. There are still [companies out there that don't use a VCS](https://twitter.com/_m_b_j_/status/938785388268806146).

### How to Proceed?

From now on, I'll just assume you agree that a VCS is a fundamental coding best practice. If that's not the case, there's plenty of resources out there explaining [what a VCS is](https://www.git-tower.com/learn/git/ebook/en/desktop-gui/basics/what-is-version-control#start) and [why should you use one.](https://www.atlassian.com/git/tutorials/what-is-version-control#benefits-of-version-control)

With that out of the way, it's time to get to specifics. Which tool should you use? How to go about its adoption?

[Git](https://git-scm.com/) is a solid choice. And despite having a steeper learning curve for [those more used to centralized version control systems, such as Subversion or TFVC](https://carlosschults.net/en/git-basics-for-tfs-users), it's *de facto* standard in our industry. So by all means, learn it, since not doing so can harm your career in the future.

But it's possible that Git is not the best choice for your team **right now**. Remember, you're short on time. So we need to get your team to adopt these coding best practices ASAP.

How do we do this? So, let's say you have experience with [Subversion](https://subversion.apache.org/), having used it at your previous company, but you have no experience with Git at all. If that's the case, I'd say Subversion is the best choice for you. The overhead of learning a new system and teaching it to your co-workers while putting it into production would be too great.

## Code Review


I'm not going to lie: I *love *code reviews---and [I'm not alone in that](https://www.codinghorror.com/blog/archives/000495.html). I've witnessed firsthand how a good code review can reduce the number of bugs in a codebase, make the code look and feel more consistent, and perhaps best of all, spread knowledge throughout a development team.

And here's a major selling point: a code review practice is relatively easy to implement. Start as simple as you can, and then tweak and experiment with your approach as the need arises.

### What Do I Mean by Code Review?

Talking about "code review" can be tricky. People sometimes mean widely different things when they use the term, so I think it warrants further clarification.

I'm not in favor of a highly stressful and bureaucratic code review process, where your code is scrutinized and criticized in public for hours. I don't believe in public shaming as a tool for achieving quality. On the contrary, [the type of code review I advocate for](https://blog.submain.com/code-review-vs-pair-programming-2/) is a lightweight and low-stress process, usually initiated by submitting a pull request or using your favorite IDE.

### How to Proceed 

Since we're now on the same page about what a code review should look like, how would one go about implementing the practice? My answer is, not surprisingly, "the simplest way that could possibly work." 

For instance, if yours is a .NET shop using TFS/TFVC, you can start by [installing a check-in policy](https://marketplace.visualstudio.com/items?itemName=ColinD.ColinsALMCheckinPoliciesVS2017) that requires a code review for each check-in. If your team uses GitHub, you can use [pull requests](https://help.github.com/articles/about-pull-requests/). Just start performing reviews so you and your team can get used to it. Then, with time, start tuning and perfecting your approach.

Here are some of the questions that can appear as you refine your process for this:

-   **What's the goal of a code review?** Are we looking for bugs? Trying to improve readability? Checking adherence to the company's coding standard?
-   **Where do we draw the line between "suggestions" and "impediments"?** Is it OK to give a thumbs-down to someone's code for bad indentation or a slightly off variable name?
-   **What do when reviewer and reviewee can't come to a consensus?** Bring in a mediator to give the final word? And who should be this mediator? The lead developer?

The answer to all of these questions can be found in **automation**. Much of the awkwardness of a code review can be removed when you employ a [code analyzer](https://blog.submain.com/different-styles-code-analyzer/) to handle the automatable portions of the process.

For instance, [SubMain's CodeIt.Right](https://submain.com/codeit.right/features) will give you real-time feedback from inside Visual Studio, alerting you of possible coding issues and even automatically fix code smells and violations for you.

By employing automation, you set your developers free to worry about higher level concerns when performing reviews, such as code clarity or architectural decisions.

## Automated Builds


You may be thinking that I've got it wrong. After all, does it even make sense to talk about automated builds without mentioning automated tests?

Well, I'm going argue that yes, it does make sense, and for one very simple reason: it eliminates "[it works on my machine](https://blog.codinghorror.com/the-works-on-my-machine-certification-program/)" syndrome. 

By having a central place where builds are performed, you shed light on all kinds of problems, from poor management of dependencies to bad test discipline.

### How to Proceed

My advice here is the same as before: do the simplest thing that could work.

If your team already uses TFS, then learn how to create a [build definition and you're good to go](https://docs.microsoft.com/en-us/vsts/build-release/actions/ci-cd-part-1). On the other hand, if you host your projects on GitHub, you might be interested in taking a look at [Travis CI.](https://travis-ci.org/)

With time, you should improve your strategy. Remember the static code analyzers I mentioned earlier? You can integrate them into your build process. Unit testing and other kinds of automated tests are a very important addition as well.

Speaking of which...

## Notable Absences

You might be surprised to see that I haven't included unit testing in the list of coding best practices, [despite being myself a firm believer in the importance of automated testing](https://carlosschults.net/en/unit-testing-for-beginners-part1/) to the overall quality of a codebase. And why is that?

Adding unit tests to a legacy application, unfortunately, is *hard*, to the point that there's even [a famous book](https://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052/ref=sr_1_1?ie=UTF8&qid=1515443597&sr=8-1&keywords=working+effectively+with+legacy+code)that focuses solely on this. It's just not a feasible task for you to tackle quickly.

In a similar fashion, it's possible that a portion of readers expected me to talk about clean code or the [SOLID](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design))principles. I do encourage you to research and learn about these topics,  but I don't think they're a good fit for the purpose of this post. They are, as the name already points out, principles. Think of them as philosophical guidelines---useful, but not as easy to break down into simple, actionable advice.

## Deploy Your Package ASAP!

It's possible that some of you found these practices to be extremely basic and not post-worthy. "Who doesn't use version control in twenty-freaking-eighteen???" I hear you saying.

Well, it really doesn't take long to find evidence (anecdotal, but still) that [things are not all sunshine and rainbows](https://softwareengineering.stackexchange.com/questions/65931/are-there-serious-companies-that-dont-use-version-control-and-continuous-integr). To believe that even basic coding best practices, such as using version control or automated testing, are universally applied is probably more wishful thinking than what we'd like to believe.

For the rest of you, I hope this list proves useful.

You know what they say. "When in a hole, stop digging." And that's exactly the type of help I wanted to offer with this post: a quick and easy fix, meant to give you and your teammates just enough sanity that you can focus and regain control of your application, ensuring its long-term health.