---
title: "4 Common Datetime Mistakes in C# — And How to Avoid Them"
ref: 4dtmistakes
lang: en
layout: post
author: Carlos Schults
description: In this post I'll show you 4 mistakes C# developers make when dealing with time..and how to get rid of them!
permalink: /en/4-common-datetime-mistakes-csharp/
canonical: https://blog.submain.com/4-common-datetime-mistakes-c-avoid/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1531165684/4-datetime-mistakes-1038x437_nm6csc.jpg
tags:
- csharp
- best-practices
- time
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1531165684/4-datetime-mistakes-1038x437_nm6csc.jpg)

*Editorial note: I originally wrote this post for the SubMain blog.  You can [check out the original here, at their site](https://blog.submain.com/4-common-datetime-mistakes-c-avoid/). While you’re there, have a look at CodeIt.Right, which can help you with time-related issues and much more.*

Do you remember the "falsehoods programmers believe about _X_"  meme that became popular among software blogs a few years ago? The first one was about [names](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/), but several others soon followed, covering topics such as [addresses](https://www.mjt.me.uk/posts/falsehoods-programmers-believe-about-addresses/), [geography,](https://wiesmann.codiferes.net/wordpress/?p=15187&lang=en) and [online shopping](https://wiesmann.codiferes.net/wordpress/?p=22201).

My favorite was [the one about time](https://infiniteundo.com/post/25326999628/falsehoods-programmers-believe-about-time). I hadn't thought deeply about time and its intricacies up until that point, and I was intrigued by how a fundamental domain could be such a fertile ground for misunderstandings.

Now even though I like the post, I have a problem with it: it lists wrong assumptions, and then it basically stops there. The reader is likely to leave the article wondering:

*   Why are these assumptions falsehoods?
*   How likely is it that I'll get in trouble due to one of these assumptions?
*   What's the proper way of dealing with these issues?

The article is interesting food for thought, but I think it'd make sense to provide more actionable information.

That's what today's post is about. I'm going to show you four common mistakes C#/.NET developers make when dealing with time. And that's not all. I'll also show what you should do to avoid them and make your code safer and easier to reason about.

## 1. Naively Calculating Durations

Consider the code below:

<script src="https://gist.github.com/carlosschults/3e18612b9a9238382b6d4fa3c574a231.js"></script>

Will this code work? It depends on where and when it's going to run.

When you use `DateTime.Now`, the `DateTime` you get represents the current date and time local to your machine (i.e., it has the `Kind` property set to `Local`).

If you live in an area that observes DST (Daylight Saving Time), you know there's one day in the year when all clocks must be moved forward a certain amount of time (generally one hour, but there are places that adjust by other offsets). Of course, there's also the day when the opposite happens.

Now picture this: today is March 12th, 2017, and you live in New York City. You start using the program above. The `StartMatch()` method runs at exactly 01:00 AM.  One hour and 15 minutes later, the `EndMatch()` method runs. The calculation is performed, and the following text is shown:

_Duration of the match: 00:02:15_

I bet you've correctly guessed what just happened here: when clocks were about to hit 2 AM, DST just kicked in and moved them straight to 3 AM. Then `EndMatch` got back the current time, effectively adding a whole hour to the calculation. If the same had happened at the end of DST, the result would've been just 15 minutes!

Sure, the code above is just a toy example, but what if it were a payroll application? Would you like to pay an employee the wrong amount?

### What to Do?

When calculating the duration of human activities, use UTC for the start and end dates. That way, you'll be able to** unambiguously point to an instant in time**. Instead of using the `Now` property on `DateTime`, use `UtcNow to retrieve the date time already in UTC to perform the calculations:

<script src="https://gist.github.com/carlosschults/82492845edaa8f8fc16c646ed2bbcf2a.js"></script>

What if the `DateTime` objects you already have are set to Local? In that case, you should use the ToUniversalTime() method to convert them to UTC:

<script src="https://gist.github.com/carlosschults/58837695af07386836753ef6541233aa.js"></script>

### A Little Warning About ToUniversalTime()

The usage of `ToUniversalTime()` — and its sibling, `ToLocalTime()`— can be a little tricky. The problem is that these methods make assumptions about what you want based on the value of the Kind property of your date, and that can cause unexpected results.

When calling `ToUniversalTime()`, one of the following things will happen:

*   If `Kind` is set to UTC, then the same value is returned.
*   On the other hand, if it's set to Local, the corresponding value in UTC is returned.
*   Finally, if Kind is set to Unspecified,** then it's assumed the datetime is meant to be local, **and the corresponding UTC datetime is returned.

The problem we have here is [that local times don't roundtrip](https://codeofmatt.com/2013/04/25/the-case-against-datetime-now/#localkindsdontroundtrip). They're local as long as they don't leave the context of your machine. If you save a local datetime to a database and then retrieve it back, the information that's supposed to be local is lost: now it's unspecified.

So, the following scenario can happen:

*   You retrieve the current date and time using `DateTime.UtcNow`.
*   You save it to the database.
*   Another part of the code retrieves this value and, unaware that it's supposed to already be in UTC, calls `ToUniversalTime()` on it.
*   Since the datetime is unspecified, the method will treat it as Local and perform an unnecessary conversion, generating a wrong value.

How do you prevent this? It's a recommended practice to use UTC to record the time when an event happened. My suggestion here is to follow this advice and also to make it explicit that you're doing so. Append the "UTC" suffix to every database column and class property that holds a UTC datetime. Instead of Created, change it to CreatedUTC and so on. It's not as pretty, but it's definitely more clear.


## 2. Not Using UTC When It Should Be Used (and Vice Versa)

We could define this as a universal rule: use UTC to record the time when events _happened_. When logging, auditing, and recording all types of timestamps in your application, UTC is the way to go.

So, use UTC everywhere! …Right? Nope, not so fast.

Let's say you need to be able to reconstruct the local datetime — to the user's perspective — of when something happened, and the only information you have is a timestamp in UTC. That's a piece of bad luck.

In cases like this, it'd make more sense to either (a) store the datetime in UTC along with the user's time zone or (b) use the `DateTimeOffset` type, which will record the local date along with the UTC offset, enabling you to reconstruct the UTC date from it when you need it.

Another common use case where UTC is not the right solution is [scheduling future local events](https://stackoverflow.com/questions/19626177/how-to-store-repeating-dates-keeping-in-mind-daylight-savings-time?noredirect=1&lq=1). You wouldn't want to wake up one hour later or earlier in the days of DST transitions, right? That's exactly what would happen if you'd set your alarm clock by UTC.


## 3. Not Validating User Input

Let's say you've created a simple Windows desktop app that lets users set reminders for themselves. The user enters the date and time at which they want to receive the reminder, clicks a button, and that's it.

Everything seems to be working fine until a user from Brazil emails you, complaining the reminder she set for October 15th at 12:15 AM didn't work. What happened?

### DST Strikes Back

The villain here is good old Daylight Saving Time again. In 2017, DST in Brazil started at midnight on October 15th. (Remember that Brazil is in the southern hemisphere.) So, the date-time combination the user supplied **simply didn't exist in her time zone!**

Of course, the opposite problem is also possible. When DST ends and clocks turn backward by one hour, this **generates ambiguous times.**

### What Is the Remedy?

How do you deal with those issues as a C# developer? The `TimeZoneInfo` class has got you covered. It not only represents a time zone but it also provides methods to check for a datetime validity:

<script src="https://gist.github.com/carlosschults/2b94d57390b3518294730c01003f159c.js"></script>

What should you do then? What should replace the "do something" comments in the snippets above?

You could show the user a message saying the input date is invalid. Or you could preemptively choose another date for the user.

Let's talk about invalid times first. Your options: move forward or backward. It's somewhat of an arbitrary decision, so which one should you pick? For instance, the Google Calendar app on Android chooses the former. And it makes sense when you think about it. That's exactly what your clocks already did due to DST. Why shouldn't you do the same?

And what about ambiguous times? You also have two options: choose between the first and second occurrences. Then again, it's somewhat arbitrary, but my advice is to pick the first one. Since you have to choose one, why not make things simpler?


## 4. Mistaking an Offset for a Time Zone

Consider the following timestamp: 1995-07-14T13:05:00.0000000-03:00. When asked what the -03:00 at the end is called, many developers answer, "a time zone."

Here's the thing. They probably correctly assume that the number represents the offset from UTC. Also, they'd probably see that you can get the corresponding time in UTC from the offset. (Many developers fail to understand that in a string like this, the offset is already applied: to get the UTC time, you should invert the offset sign. Only then should you add it to the time.)

The mistake is in thinking that the offset is all there is to a time zone. It's not.  A time zone is a geographical area, and it consists of many pieces of information, such as:

*   One or more offsets. (DST is a thing, after all.)
*   The dates when DST transitions happen. (These can and do change whenever governments feel like it.)
*   The amount of time applied when transitions happened. (It's not one hour everywhere.)
*   The historical records of changes to the above rules.

In short: don't try to guess a time zone by the offset. You'll be wrong most of the time.

## It's About Time…You Learn About Time!

This list is by no means exhaustive. I only wanted to give you a quick start in the fascinating and somewhat bizarre world of datetime issues. There are plenty of valuable resources out there for you to learn from, such as the [time zone tag on Stack Overflow](https://stackoverflow.com/tags/timezone/info) or blogs such as [Jon Skeet's](https://codeblog.jonskeet.uk/) and [Matt Johnson's,](https://codeofmatt.com/) who are authors of the popular NodaTime library.

And of course, always use the tools at your disposal. For instance, [SubMain's CodeIt.Right](https://blog.submain.com/codeit-right-rules-explained-part-2/) has a rule to force you to specify a `IFormatProvider` in situations where it's optional, which can save you from nasty bugs when parsing dates.
