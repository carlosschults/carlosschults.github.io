---
title: "Your Commit Messages Suck. Let Me Show You How To Fix That"
ref: your-commit-messages-suck
lang: en
layout: post
author: Carlos Schults
description: "Your future self hates your commit messages. Let's change this."
permalink: /en/your-commit-messages-suck
tags:
- tutorial
- git
- rant
---

Your commit messages suck. They are, at best, useless. At worse, they are harmful and misleading.
I don't say this to be mean. Quite the opposite, I mean this in the most charitable way possible. I'm here to help.

If you know you're the exception, you can stop reading. I'm serious, close this step and go watch some YouTube. There, I just gave you back some minutes, you're welcome.

Still here? That's great, recognizing you have a problem is the first step to get better. As I was saying, your commit messages are useless.

Don't get offended. This is mostly not your fault. Chances are, nobody every taught you how to write good messages, or even why that's important. And writing is freaking *hard*, let me tell you.

Good news is, you've finally got someone to help you. In this post, I will explain everything you need to know about terrible commit messages and, of course, how to write great ones instead.

## Your commit Messages Suck Because...
Why is it that most commit messages are so bad? In my experience, the reasons amount to the reason I'll talk about now. Keep in mind that there is nothing scientific or data-driven about any of these. They're all based on my personal experience. 

### ...You Only Care About Coding
If you're like most developers, you only or mostly care about coding. This is where the fun lives, and everything else you see it as a waste of time.
Also, I acknowledge that you're probably under a lot of pressure to perform, to deliver as much value as quickly as possible. So, what you want the most is finish what you're doing, merge your PR and then get another ticket off of Jira/Azure/Linear to start implementing.

What ends up happening is that anything that is not coding is treated like an afterthought and not given as much care. This includes testing, documenting, preparing a review of the implemented feature for the weekly retro and, of course, writing commit messages and PR descriptions. 

### ...Sometimes You Don't Understand What You're Doing
Great commit messages and great documentation in general should focus on the *why* of things. What's the motivation behind you making those changes? What's the problem you're trying to solve, why is it worth solving, in which way it helps your team and your company?

It may seem crazy that a programmer would start working on a task he or she doesn't fully understand. But I know I have, and bet you have too. Of course, how are you supposed to explain the why behind a change when even you don't fully grasp it?

### ...Writing Is Hard
As Phil Karlton once put, [there are only two hard things in computer science](https://martinfowler.com/bliki/TwoHardThings.html), and naming things is one of them.

If you think about it, "naming things" is a form of writing. A subset of writing, if you will. So, yeah, writing commit messages is hard because writing, in general, is hard.

### ...Nobody Has Taught You
I think that developer education often fails to teach lots of important things that you actually need as a software engineer. True error handling is one of them.

Fair, they'll teach you the mechanics of how a try-catch-finally work, but often they won't teach you when to catch an exception, when not to catch it, when to throw an exception, when to log it or not, and so on.

And writing commit messages is one of those things.

### ...GitHub Taught You Bad Habits
Let's get this out of the way: I use GitHub every day, and I love it. GitHub is the [killer app](https://en.wikipedia.org/wiki/Killer_application) for Git, and Git wouldn't have gotten the same level of adoption without GitHub.

That being said, I do believe that the popularity of GitHub and pull requests caused people to care more about pull requests than about the individual commits. And it does make sense: pull requests support discussions that live on as a historical artifacts of that project, they support attachments, rich text and what have you.

So, it makes sense that some people don't put a lot of effort writing good commit messages, claiming that they can write rich PR descriptions instead.

Of course what ends up happening frequently is that they don't write PR descriptions either!

### ...Git's `-m` Option Trained You Poorly
I think that most programmers don't even know that commit messages can have a body with multiple lines. And the culprit here is the fact that most people teach the `commit`command like this:

```bash
git commit -m "Some message"
```
And not even mention that the `-m` flag is just a convenience for when you have a one-line message, which should be the exception rather than the norm.

### ...You Don't Have Proper Commit Hygiene
Writing commit messages that aren't trash is part of a broader thing that some people call "version control hygiene."

This is exactly what it sounds like: don't be a slob when writing code.

Sometimes you struggle when writing a commit message because you work in a messy way. If your changes are a hodgepodge of bug fixes, refactorings, dead code and half-baked implementation ideas, of course you're going to have a problem writing a descriptive and useful commit message.

This is often caused by a lack of Git skills. If you don't master tools like stashing, reseting, interactive rebasing and others, then you're more likely to make a big mess out of your work.

## Taxonomy of Bad Commit Messages
I have found that commit messages can be bad in a few number of categories. I'll cover now some of them.  

### Almost Useless One-Liner
This is the one-line message that gives a high-level explanation of what the change was. I call it "almost" useless because at least the summary is accurate.

It then fails to add any more context. I'm left with questions like:
- What was the problem that originated this change?
- Why did the author consider this change to be the most optimal way of solving this issue?
- Is there an issue or ticket associated with this work?

Some examples, with my comments:

```
Added new index to table # what index? what table? to what purpose?
Enable EF Core execution strategy# what is this strategy thing? why did you have to enable it?
Added Required attribute to model # Which model? Also, isn't this a breaking change that will affect current users?
```

### Useless One-Liner
The useless one-liner is...well, like the almost useless one-liner, but completely useless.

The examples don't merit more comments:

```
changes
ui
not working
more changes
```

I mean, by the time you're writing "changes" as a commit message, you might as well just say "potatoes". Or write a joke. It would be just as useless but at least it might have been funny.  

### Ticket System Reference Only
This is when people only add an id of issue/ticket/card from their issue system, and nothing more. Some examples:

```bash
JIRA-42
AZ-2234
#125
```
I think this category of commit messages manages to be both more useful but also more annoying then the previous ones. Yes, it's more useful, since I can go always go to our ticketing system, look for the issue, and learn more about the work. Of course, nothing guarantees that the commit will only have changes related to the issue in question, but this is a conversation for another time.

This is also more annoying because it requires the reader to stop and go to another place to get context for that change. I don't know about you, but I'd like to learn the reason behind a commit from the commit itself, just like ~~God~~Linus intended.

Besides the annoyance, there is a greater risk here: the possibility that, someday, your company will migrate from the current ticketing system and then you'll be left without those descriptions. All companies I've worked for as a software developer have done at least one such migration, and I'm sure you probably have lived through at least one.  

### The Misleading One-Liner
Sometimes you have a message that says something seemingly harmless, like `Add PrintHtmlOutput() method`. And then it turns out the changes also add a breaking change to an endpoint or change something in the way the application interacts with the database.

## You Will Write Great Commit Messages When You...
Now you understand why you write bad commit messages, and _how_ they are bad. Ready to learn how to improve?

### ...Stop Writing One-Liners
One-liners are great when the scope of your change is small. If your commit only fixes a typo, then `Fix typo` is a valid commit message. But most often commits contain many more changes, and in those cases writing a one-liner is a missed opportunity to write a durable piece of documentation.

So, please, stop using the `-m` flag when commiting. Write a proper body with more detail for most of your messages.

### ...Lead With The "What", Expand With The "Why" and "How"
So, now you know you're supposed to write a summary and a body for most of your commit messages. What should be in each?

Simple: start with the summary, in which you describe _what_ you did. Make it descriptive but concise.

Inside the body, describe what is the problem you're trying to solve, or the reason that motivated the change. Then, explain how you solved it, but from a high-level perspective. Don't add too much detail, because remember your reader can always see the diff.

If necessary, add more information, such as: 
- trade-offs involved in your decision
- alternatives you considered but ultimately decided against
- reference links for possibly unkown terms you used (for instance, a link to an Wikipedia article, or to Martin Fowler's [Catalog of Refactorings](https://refactoring.com/catalog/))
- reference links for the solution you employed (for instance, a link to a Stack Overflow answer)

### ...Follow the 50/72 Rule
The 50/72 rule is the closest we have to a standard when it comes to commit messages. It was [first proposed by Tim Pope](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) and it goes like this:

- Start with a summary, capitalized, and make it 50 characters long at the most
- Add a blank line
- Then you add a body, wrapping its lines at 72 chars at the most

These limits may seem arbitrary, but there are historical reasons they've been picked. To make a long story short, they play nicely with many different tools that work with commit messages.

Another important point is that you should write your summary in the imperative mood. That is, "Implement password hashing" instead of "Implemented password hashing", for instance. At first, this might look weird, but this is the standard that Git itself uses. If you don't believe, use `git revert` to revert a commit, and you'll see that the generated commit's message is in the imperative mood:

```bash
Revert "Add line of text"

This reverts commit 5ab08c5d3ee7bfdb334406d418d96f76d08962fe.
```

See? "Revert" instead of "Reverted."

Additionally, and optionally, you can add a commit trailer. Commit trailers are metadata you can add to the bottom of your commit message, following the `Name: value` syntax. They're used to add useful metadata, such as who signed-off on a change, who co-authored something with you, and also to associate your commit to an issue or ticket.

For instance, if you're using GitHub issues, you can add a trailer like this:

`Closes: #456`

And it would automatically associate the commit to the issue and close it. There are other keywords you can use, such as `Fixes`, `Resolves`, `Resolved`, and so on. You can learn more about automatically closing GH issues [here](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue).

### ...Adopt Atomic Commits
The idea of atomic commits is simple: have a commit only contain changes that are logically related. This is the opposite of the lack of version control hygiene that I talked about earlier.

So, let's say you're currently working on a feature. Then your boss tells you to stop and fix a bug. You go and fix the bug, and then you have your changes from the start of your feature implementation.

Don't commit everything together! Commit only the bug fix changes as a cohesive unit with a high-quality, descriptive message. Then you can go back to your feature and commit that.

Doing things like these require you master the tools of Git. You need to know how to stage changes and commit only those instead of everything. You need to know how to stash. Often, you'll need to know how to commit things and then edit that history.

Those skills are worth having. Get them!

### ...Commit Often, Perfect Later
You don't have to wait until you're "done" to commit. Instead, you should commit all of the time. Work in small increments, and commit along the way.

That way, if you make mistakes and needs to throw some work away, you just revert a few minutes' worth of work instead of hours. You also have those checkpoints you can go back to, should the power went off or something.

For instance, people who practice TDD (test-drive development) often commit every time they reach the green phase. In other words, every time they make the tests pass.

It's also a good idea to leave all your commits clean. By that I mean, all of your commits, when applied, should leave your project in a state where it builds successfully and all tests pass. That makes it easier for you or someone else to use [git bisect in the future to find where a bug was introduced](/git-bisect-intro/).

But if you follow this tip, you might end up with many tiny little commits that don't have good messages, or that don't represent a cohesive set of changes. How to solve this?

The answer is: [you edit your history to make it look beautiful](/en/git-beautiful-history/). Editing your history is frowned upon, and with good reason, when it's a branch other people already depend on. But if you're working on your own isolated branch and no one depends on your changes, you can do whatever you want up to that point. So, commit early and often, then amend and rebase your way into a history that makes sense and has great commit messages.

## Examples of Great Commit Messages
Now it's finally time to show you some examples of valuable commit messages that incorporate everything we've been covering so far.

For instance, instead of:

```bash
Added Required attribute to model
```

Write:

```bash
Make PhoneNumber required on /reservations endpoint

The /reservations endpoint originally didn't require a phone number.
The reservations were being accepted but, as data flowed to downstream
systems, the lack of phone number was causing some processes to crash.

We are now adding the [Required] attribute to the PhoneNumber property
on the ReservationRequestModel. This is a breaking change, so that's
why, as part of this changes, we are versioning the endpoint as 2.0

Fixes: AB#456
```
See how it goes:
- The message starts with a summary that describes what was done
- The body starts with a problem statement, then explains how the current change solves it
- Finally, we have a trailer to associate and close a ticket on our board

For the second example, let's do something a bit more elaborate. Instead of `Enable EF Core execution strategy`, you can use:

```bash
Enable EF Core execution strategy for Azure SQL

After migrating to Azure SQL, save operations started failing
intermittently in production with transient connection errors.
Azure SQL occasionally drops connections during scaling events
and failovers, and Entity Framework does not retry failed
operations by default.

Enabled the built-in SQL Server execution strategy in EF Core,
which automatically retries failed operations using exponential
backoff when a transient error is detected.

An execution strategy is a configurable EF Core component that
intercepts database operations and decides whether to retry
them on failure. The SQL Server provider ships with a strategy
that knows which error codes Azure SQL considers transient.

[1]: https://learn.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency

Closes: #89
```
Do all messages need this kind of in-depth message? Or course not. For instance, `Fix typo` is a great commit message, if all you're doing in that commit is fixing a typo. The same goes for `Remove commented-out code`, `Remove blank lines`, and so on.
The length of your commit message needs to be directly proportional to the size/scope of your change.


## AI Changes Everything. Or...Does It?
I know what you have been wondering all of this time. "But..but...but...what about AI?"

My honest take is that AI changes little, if anything at all, of what we've been discussing.

For starters, AI or not AI, the fundamentals remain the same:
- Great commit messages should still focus more on the why instead of on the what and how.
- The 50/72 is still a solid guideline to follow.
- Using the imperative mood for summaries continues to be the standard for lots of tooling, including Git and GitHub themselves.
- Great commit messages still carry immense value for future readers, which may include AI itself.

_But AI is great at writing commit messages? Why should I bother?_

When it comes to commit messages, AI is, in fact, great at one thing. And that is summarizing a collection of changes and writing a very well-written, grammatically correct, professional-sounding...detailed listing of all the changes. 

Which is exactly what you shouldn't be doing! Where AI fails is exactly the most important part, which, by now, you should be tired of reading: the why.

I'm not saying you shouldn't use AI to help you in crafting commit messages. Of course you can. I use it a lot. This is an example of prompt I frequently use with Claude, with some variations:

```
Write a concise, well-crafted commit message for the diff I'm going to give you.
Make it more high-level, focusing on the why rather than listing all changes in great detail.
Follow these rules:
- Summary
	- Brief description of what was done
	- 50 chars at the most
	- Use imperative mood
	- Do not use conventional commits
- Body
	- Brief description of the "how", but focus more on the reason for the changes
	- Use prose rather than bullet points.
	- Use past tense
	- Lines no longer than 72 chars
```

And then I run `git diff | clip` and paste the results there with this prompt.

What I get back is always a message that is very well-written, much more detailed about describing changes than what I'd like, and that completely misses the point of why we're doing the changes. Which is completely unsurprising, because how on Earth would it know if I haven't told it?

Then, what I do is explain the reasons we did the change. And ask to try again, and make it more high level and include the explanation. Sometimes the second version I get is good enough, but often I need at least three until I'm satisfied.

Do you understand the pattern? This is a collaboration between the AI and I. We are working together to craft a message. I'm not 100% offloading it to the AI.

When I'm using Claude Code, those rules from above exist in the `Claude.md` file for the project. In this scenario, it tends to do much better understanding the "why", because everything started with a prompt in which I explained the reason behind the change, and then we did a planning session before starting to implement the change.

But even then, the AI often still needs a lot of guidance until it's able to write a commit message that really focus on the reasons behind the change and gives information at the right level of abstraction. Left to its own devices, AI produces well-written messages that are essentially a diff in prose.

## Conclusion
By now, you've probably realized this was a fairly opinionated post. Some of the things covered here are very close to being a standard, such as the 50/72 rule and idea of writing the summaries using the imperative mood.

However, some of what I've discussed are personal preferences. For instance, I usually don't use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). The reasons for that go beyond the scope of this post, but they exist. But they're also fairly personal, so I won't hold it against you if you like to use Conventional Commits.

The main takeway I want you to take from this post is: put some work into your commit messages. Don't just write whatever; craft your messages. Work on them, hone them, until you can't possibly improve them.

Yeah, that's hard. It might be frustrating. It might feel a waste of time spending 10, 15, or even 20 minutes crafting a message that your favorite LLM could have knocked out in seconds.

But I guarantee you: years from now, when you're investigating a critical production issue and then you've come across some great commit messages that offer valuable insights into why some changes were made...you're going to be happy you did.

Thanks for reading.