---
title: "Code Review vs Pair-Programming: Which One Should Your Team Pick?"
ref: cr-vs-pp
lang: en
layout: post
author: Carlos Schults
description: Do code reviews and pair programming offer the same benefits? Find out on today's post.
permalink: /en/code-review-vs-pair-programming/
canonical: https://blog.submain.com/code-review-vs-pair-programming-2/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1516470435/code-review-vs-pair-programming1038x437_w99q2t.jpg
tags:
- pair-programming
- best-practices
- code-review
- agile
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1516470435/code-review-vs-pair-programming1038x437_w99q2t.jpg)

*Editorial note: I originally wrote this post for the SubMain blog.  You can [check out the original here, at their site](https://blog.submain.com/code-review-vs-pair-programming-2/). While you’re there, have a look at CodeIt.Right, which can help you with automated code reviews.*

Some weeks ago, I was browsing Twitter when I saw this:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Pair Programming &gt; Code Review</p>&mdash; Rafael Ponte (@rponte) <a href="https://twitter.com/rponte/status/932390250848178176?ref_src=twsrc%5Etfw">November 19, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

This prompted a brief discussion between the author and me. He made good arguments, but I left unconvinced that pair programming was the obvious winner.

As someone who's implemented code review with success and also paired to some extent, I could see how both practices can be valuable. But is one of them clearly *better* than the other? Are code review and pair programming interchangeable, or are there scenarios in which one clearly shines?

That's what I'm going to answer today. Let's dive in.

## What I Mean By Code Review

Picture this: you're a young programmer on your first development job. After you finish your first assignment, they call you to a meeting room; there you find your tech lead and three senior developers. There's also a large monitor displaying your code. Time for review!

For two-and-a-half excruciating hours, they scrutinize your work while you sweat profusely. From criticizing your high-level design decisions to nitpicking over the most trivial stylistic preferences, nothing gets a free pass.

Is this the scene your mind conjures when you see the words "code review"? 

Good news, then. That's *not* the kind of review I'm talking about. Instead, think of a very informal and lightweight process. You submit your code for review by creating a pull request or maybe using some embedded functionality on your IDE.

### The Good

After touching briefly on the *what* and *how* of a code review, let's get to the *why*. Why should your team adopt this practice? What are the benefits?

The first reason is, not surprisingly, **to catch bugs**. I'd bet you're familiar with that old piece of software wisdom that says [that the later a defect is found, the higher the cost of fixing it][2]. Then why not use a relatively cheap process [that can catch up to 60% of defects][2]?

Here's another reason your company should perform code reviews: to **improve the readability of the code**. Trying to read and understand some new piece of code frequently leads to the discovery of issues such as

- Poor naming.
- Bad indentation.
- Instances of [cargo cult programming](https://en.wikipedia.org/wiki/Cargo_cult_programming).
- Non-idiomatic code.

The reviewer could also spot overlooked corner cases or help the author assess how performative their code is.

And here's one last reason. A well-done code review can **spread knowledge throughout the team.** This improves the product's quality by destroying knowledge silos.

### The Bad

While some say code reviews are [the number one practice you should adopt][3] to improve your code, [this kind of enthusiasm is not universal][4]. So, what are the potential drawbacks?

For the most part, their complaint is **time**. When you submit some code for review, you'll have to wait until the reviewer is done.

What should you do while waiting? Ideally, your team should break up the available work in small, discrete units so it can work on these pieces somewhat independently. That's not always feasible, though. And by the way, the **constant switching of tasks might be detrimental to the developer's focus and productivity**.

Let's say Bob spends *x* hours implementing a feature. Then Alice reviews his work and says his implementation is completely wrong, and he needs to start from scratch. **Those *x* development hours were just thrown away**.

Finally, people sometimes will waste ridiculous amounts of time **arguing on pointless stylistic details**, such as the position of braces or whether or not to include an underscore before a private field's name. These debates can unfortunately escalate to levels that turn the workplace toxic.

## Pair Programming: Not Just a Super Code Review

Pair programming is a technique in which two developers collaborate on the code together, sitting at one workstation.

They periodically take turns in two roles. The *driver* writes the code, thinking out loud in order to explain their design decisions and thought process. The *navigator* observes the driver's work, giving real-time feedback and advice.

So, is it just "code review on steroids", [as put by Jeff Atwood][5]?

Maybe not. One of the basic principles of agile methodologies is the shorter your feedback loop, the better you are. You can see how getting someone to review your code sooner rather than later works in harmony with the principles that make agile so successful.

### The Good

Well, it should be no surprise that many benefits of pair programming are also benefits of code reviews, such as fewer bugs, improvement in code readability, and knowledge dispersion throughout the team.

Pair programming may provide exclusive benefits as well, such as:

- **Higher focus**. The presence of a peer may exert some pressure to stay motivated to solve the task at hand.
- **Shorter feedback cycle**. Since your pair is reviewing your code in real time, there’s a lot less risk of wasting time due to delayed feedback.
- **Increase in usage of other good engineering practices**. As suggested in a study done at North Carolina State University, [teams using pair programming tend to increasingly use development practices such as unit testing, continuous integration, and establishing coding standards](https://collaboration.csc.ncsu.edu/laurie/Papers/ESE%20WilliamsPairProgramming_V2.pdf).

### The Bad

As in the case of the code review, pair programming is far from being a universally accepted practice. While many developers love it, [others don't have such happy stories to tell][6]. So, what are some of the most cited problems with pairing?

Let's start with one common complaint: pair programming **can be exhausting**. In fact, many claim that [pairing is more effective when used for shorter blocks of time—from one and a half to two and a half hours.][7]

Obviously, an odd number of team members doesn't work well for pair programming. But a shifting number of available personnel is inevitable.

Next on our list of problems is the fact that paring isn't very remote friendly. You can better imagine the issue after hearing what Daniel Kaplan, who wrote "[What It's Like to Pair for a Year][8]," had to say about pairing:

> These scheduling interruptions happen, but on a typical day we avoid them by having the pairs show up at the same time (for breakfast and standup), go to lunch at the same time, and leave at the same time. This maximizes the time the pairs are pairing.

So, pairing **requires synchronicity**, which might make it a non-option for remote teams (or even co-located teams with flexible hours).

Some people argue that pairing can **undermine creativity and prevent experimentation.** While pairing, it'd be rude to waste your pair's time trying some experimental approach that might ultimately end up not working. So, the safest possible design tends to always prevail, even if it's not the best possible one.

Finally, pairing doesn't really provide one of the key benefits of the after-the-fact code review: a person with zero context analyzing the code. The two developers **share a context from the beginning of the session**, and the effect this has cannot be underestimated. People tend to [overvalue their contributions and get emotionally attached to what they create][9]; that's why it's so important to get a second person that doesn't have this attachment and is thus able to provide a clearer judgment.

## Code Review vs Pair Programming: The Verdict?

I've reached the conclusion that, although code review and pair programming *seem* equivalent, they're really not. There is some overlap, but each practice also presents some unique benefits and challenges.

There's no getting around that pair programming, despite its benefits, requires an even number of people, working at the same time. If your team consists of developers living across several time zones (or even a co-located team with extremely flexible hours), then it's a no-brainer: code review to the rescue.

If your team doesn't fit the above description, then give pair programming a try. As long as you work hard to accommodate and have empathy for [different kinds of personalities][10] and don't make it mandatory, it can be beneficial to your team.

Finally, there's nothing stopping you from using *both*. You could adopt pair programming as the default MO and leave soloing and code review to fill in the gaps where pair programming doesn't quite fit so well.

## No Matter What You Do, Embrace Automation

Imagine you write for a publication, such as a magazine. After you have a draft, you submit it for review. Would it make sense for the editor to spend all their time looking for spelling errors? Of course not! We have automated spell-check for that, freeing the editor to look for more *high-level* problems, such as poorly chosen words, lack of cohesion, inappropriate tone, and all those things your English teacher kept nagging you about in high school.

With software, things should not be so different. By using [an automated code review tool][11], you can eliminate a lot of the bickering that often occurs in code reviews or pair programming sessions. There will be no arguing about naming and formatting conventions, the position of brackets, and others pointless trivia.

You can also employ a static analysis tool to warn you about potential bugs and opportunities for refactoring. That way, the reviewer/navigator is free to focus on the high-level stuff that requires human creativity, intelligence, and empathy.

## Trust and Respect

While researching for this post, one theme kept reappearing: that code review emerges from a lack of trust in our developers or that pair programming infantilizes them.

I couldn't disagree more.

Precisely because we respect our developers—and our clients—we should employ techniques and tools at our disposal to improve the quality of our work.

It's not about lack of trust. It's about recognizing that programming is hard and sometimes, just one brain isn't up to the task.

[2]: https://www.cs.umd.edu/projects/SoftEng/ESEG/papers/82.78.pdf
[3]: https://blog.codinghorror.com/code-reviews-just-do-it/
[4]: https://blog.nelhage.com/2010/06/i-hate-code-review/
[5]: https://blog.codinghorror.com/pair-programming-vs-code-reviews/
[6]: https://web.archive.org/web/20110101145142/https://tersesystems.com/2010/12/29/where-pair-programming-fails-for-me
[7]: https://softwareengineering.stackexchange.com/a/9518
[8]: https://builttoadapt.io/what-its-like-to-pair-for-a-year-86d048494324
[9]: https://en.wikipedia.org/wiki/IKEA_effect
[10]: https://www.amazon.com/Quiet-Power-Introverts-World-Talking/dp/0307352153/ref=asap_bc?ie=UTF8
[11]: https://submain.com/products/codeit.right.aspx
[12]: https://submain.com/landing/codeit.right/
