---
title: "Sharpen the Saw: 4 Quick Tips for Your Dev Team"
ref: sharpenthesaw
lang: en
layout: post
author: Carlos Schults
description: Learn four easy ways your team members can improve their sills and deliver more value.
permalink: /en/sharpen-the-saw/
canonical: https://blog.submain.com/sharpen-saw/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1592314350/sharpen-the-saw-1038x437_z9ermr.jpg
tags:
- software-engineering
- best-practices
- programming
- career
- opinion
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1592314350/sharpen-the-saw-1038x437_z9ermr.jpg)
Photo by Sven Brandsma on Unsplash

*Editorial note: I originally wrote this post for the SubMain blog.  You can [check out the original here, at their site](https://blog.submain.com/sharpen-saw/). While you’re there, have a look at CodeIt.Right, their automated code review tool.*

Are you familiar with the expression "sharpen the saw" in the context of learning and continuous improvement? If you've read Stephen Covey's [The 7 Habits of Highly Effective People][1], then I'm sure you are. For those unfamiliar with the term, it basically means to engage in practices that will make you better at your craft without necessarily involving the craft itself.

What can you as a tech lead, lead developer, or software architect do to encourage the developers on your team to sharpen their saws? That's what we'll to answer with this post. We'll show you four quick, easy ways your team can improve their skills and deliver more value.

## 1. Sharpening the Saw by Reading: Create a Technical Book Club

Wouldn't it be awesome to have a team made up of incredibly well-informed people, who are up to date with the relevant, shiny new things and have solid knowledge on the fundamentals of our industry? Yeah, I thought so. And there's no better way of achieving that than by reading.

What I suggest here is something very simple. Every month, you and your team choose an assigned read for the dev team. On which subject, you ask? Design patterns, concurrency, refactoring, unit testing—I'd say virtually anything is fair game, as long as the developers themselves are interested.

Oh, and before I forget: this probably goes without mentioning, but your company should _buy_ the developers copies of the chosen books. If you feel you can't afford that, well, I don't believe you're going to have a company for very long, I'm afraid.

A less ideal solution would be to buy a copy of the book for one developer. Have them study the book in their spare time and then present their findings to the rest of the team by giving one or more internal talks. Then, select another book and another team member, and have that developer give the internal talk next month.

Now, speaking of internal talks…

## 2. Sharpening the Saw by Talking: Internal Presentations

Having the developers deliver internal talks to each other is a great way to spread knowledge throughout the company. For the developers giving the talk, it's the perfect opportunity to get some hands-on practice with several skills, such as

* Coming up with a subject and doing the necessary research.
* Creating an appealing slide deck.
* Speaking in public, which can be a tough experience for many of us.
* Answering questions.

I could go on and on, but in short, they'll be practicing the general skill of communication. That's simply priceless. Giving internal talks can be great practice for speaking at conferences, for example.

And what's on the table for the audience? Obviously, the learning opportunity. But I'll add that, in the case of internal company talks, the probability of actually putting that knowledge you gained into use is much higher. Since the speakers are actually your coworkers—people who share context with you every day and are aware of the problems and challenges your company is facing—I'd say it's very likely that they pick a topic that relates to the company.

## 3. Sharpening the Saw by Writing: Create and Maintain an Engineering Blog

When your developers give internal talks, they're teaching one another, which is fantastic. But what if they could spread this knowledge beyond just your shop, while at the same time improving their writing skills and ability to articulate an argument? What if they could do so while learning about things like content marketing and SEO? And while they're at it, what if they could demonstrate the technical know-how of your company, positioning it as an expert on its domain area?

There's a way to do just that, and it's called blogging.

Start an engineering blog. Decide on the specifics, such as:

* What topics should be covered?
* How frequently will you publish?
* Who will the authors be?

It would make sense if, at least at the beginning, the developers who are naturally better writers were the blog's authors. But since the goal here is to learn—to sharpen the saw—the ideal scenario is one in which every developer gets a chance to hone their writing chops.

## 4. Sharpening the Saw by Programming: Hold In-Company Coding Dojos

A [coding dojo][2]is a kind of training session for programmers in which they rotate in pairs, working in a collaborative manner on the same problem. The inspiration for the name comes from the martial arts. The goal of a coding dojo isn't necessarily to solve the problem?but to develop both engineering skills, such as unit testing/TDD, and social skills, such as [pair programming.][3]

To hold a coding dojo, you're going to need the following:

* **Space.** You need a?room large enough to hold from five to 15 people. (Some people say 20 people for a coding dojo is acceptable, but IMHO, this is way too much). Since we're talking about sharpening your team's saws, an office or meeting room at your company will probably do.
* **A computer**. It could be a desktop computer or laptop; it doesn't matter, as long as it's placed on a desk with two chairs, where two people can sit and collaborate comfortably together.
* **A projector or a large monitor**. All of the participants need to watch what's going on at any given moment.
* **Snacks and beverages!** A coding dojo should be a bonding experience, and human beings love to connect over food and drink. And [programmers are human beings][4], last time I checked. Just be considerate of those with dietary restrictions, and you should be good.

So, let's say you're actually doing this thing. You've assembled the needed gear, and people have shown up at the agreed-upon location. What now?

Well, first things first. You need a problem! But not all programming challenges make a good coding dojo problem. As I said earlier, solving the problem isn't necessarily the goal—rather, it's more about practicing engineering skills such as TDD and pair programming. So, writing a compiler from scratch isn't going to cut it. But implementing a converter to roman numerals might work quite well.

What makes for a good coding dojo problem?

* It's small, so it's feasible to solve it in a relatively short time.
* It lends itself well to TDD.
* It's finite and well-defined. Vague, open-ended challenges won't do.
* It's based on a real-world problem, not an abstract one.
* It's different from the challenges you solve at your day job.

You don't really need to worry about finding good problems, though. The [web's got your back.?][5]There are [plenty][6] of [sources][7] for [problems][8] out there.

With choosing the problem out of the way, it's time to pick a language to work on. You don't need to use the same language you use every day at your job. In fact, it's nice to use the coding dojo as an opportunity to try out different languages. This can help make things fresh and more challenging. Just don't forget to have a person who's knowledgeable about this language around so they can help when the group hits obstacles.

Now,?to start, you'll need two volunteers: one to be the driver and one to be the co-pilot. These terms come from pair programming. The driver is the person who's typing, and the co-pilot gives advice and feedback. The remaining people are the audience, at least for now. Ideally, everyone in a coding dojo session should write code.

So, with everyone in their places, the fun begins. The driver starts coding, using TDD's red-green-refactor cycle:

* First, they write a failing test.
* Then, they write just the smallest possible amount of code that will make the test pass.
* When the test is passing, it's time to refactor. Only in this phase?are people in the audience are allowed to speak, giving advice and feedback to help the driver better refactor the code.

At the end of a?previously-established time period (five to ten?minutes), the driver stops coding and returns to the audience. The copilot becomes the driver, and a new member of the audience becomes the copilot.

This cycle continues until everyone in the room had written code or the allotted time for the session expires—whatever comes first.

### Retrospective

As soon as the coding session itself is done, take some time to do a retrospective. Ask the participants about the things they liked and didn't like about the session, and write it all down. These two lists will serve as a guideline for what to do and not to do in your future coding dojos.

## Start Sharpening Your Saw—and Your Team's Saw—Right Away!

Software development is a profession of practice. It requires continuous learning—or should I say, continuous saw-sharpening. Beyond the tips I've just given you, there are plenty of other ways to sharpen your saw. In fact, you're doing one of them right now. You're reading a tech blog!

From [in-depth tutorials on tools like CodeIt.Right][9] that can help your team write better code?to [insights about best practices][10]?to even tips about things [you might have taken for granted][11], there's no shortage of interesting and useful topics you can learn about by reading a good tech blog.

Thanks for reading, and happy sharpening!

[1]: https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People "The 7 Habits of Highly Effective People"
[2]: http://codingdojo.org/
[3]: https://blog.submain.com/code-review-vs-pair-programming-2/
[4]: https://www.artima.com/weblogs/viewpost.jsp?thread=4414
[5]: http://codingdojo.org/KataCatalogue/
[6]: http://codekata.pragprog.com/
[7]: https://sites.google.com/site/tddproblems/
[8]: https://code.joejag.com/coding-dojo/example-katas/
[9]: https://blog.submain.com/category/rulesexplained/
[10]: https://blog.submain.com/coding-best-practices-short-time/
[11]: https://blog.submain.com/4-common-datetime-mistakes-c-avoid/ 