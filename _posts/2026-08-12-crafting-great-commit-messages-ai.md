---
title: "Crafting Great Commit Messages in the AI Era"
ref: great-commit-messages-ai-era
lang: en
layout: post
author: Carlos Schults
description: "Using LLMs doesn't automatically guarantee great commit messages. Learn how to achieve that in this guide."
permalink: /en/great-commit-messages-ai-era
tags:
- tutorial
- git
- ai
- llm
- claude
- version-control-system
- best-practices
---

A while ago, I told you why [your commit messages suck and what to do about it](/en/your-commit-messages-suck). On that occasion, I talked briefly about AI, stating that I don't think that the usage of LLMs (Large Language Models) fundamentally changes any of the points I made in the post.

However, the topic of LLM-generated commit messages is relevant enough to deserve its own treatment, especially now that more and more people are using agents to generate code.

So, this is what this post is about. I'll be essentially sharing my experiences about what works and what doesn't work regarding creating great commit messages.

## Why LLMs Are Not Automatically Good At Creating Great Commit Messages
When it comes to writing commit messages, there is one area where LLMs perform really well. They're great at looking at a diff and generating a summary of those changes.

In other words, they excel at describing what you did in detail...which, if you've read my other post, you know it's exactly what you shouldn't be doing!

What LLMs are not good at by default is understanding the context. They can look at a diff and say, "Ok, the user has disabled the OUTPUT clause for SQL Server in their EF Core configuration" and then write a detailed commit message describing those changes. Which is useless, because the commit diff already shows the changes.

What the LLM _can't_ do is figure out that I made the change because we had introduced triggers to a few tables and EF Core started failing because the OUTPUT clause conflicts with triggers, so we had to disable it.

You see, there's a whole narrative behind a change, but the AI won't be able to learn the narrative if nobody tells it.

## AI Can't Read Your Mind
I see that many people get frustrated with AI-generated code, and it's a common pattern. People will make an incredibly vague and broad request, then get something in return, then get frustrated it's not what they had in mind. Well, if you have something specific in mind that the AI should take into account, make sure to get that out of your mind and into the AI! 

Repeat with me: **AI doesn't read minds.**

Besides that, AI is incredibly confident. It will always give you *something* back. Which might be what you want, kind of, but it also might be not, since it will be biased towards approaches the LLM has seen the most in its training data.

For instance, if you ask for a commit message for a diff, without further instructions, it will very likely spit out something using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), simply because a lot of people use that. Personally, I don't like that standard and don't want to use it, but of course Claude doesn't know that about me unless I tell it.

## What To Do Then?
In the other post I shared the prompt I was using with Claude at the time:

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

I wasn't entirely satisfied with the results I was getting from this prompt, though, and kept iterating on it. One thing that I added at some point was that Claude should ask me about the context if it wasn't sure about it. This worked, but somewhat inconsistently.

Then, I don't remember when exactly, another thing happened. But before going into that, I need to digress a little bit and explain why I don't use Conventional Commits.

## Conventional Commits Is Not a Good Standard
I don't like or use Conventional Commits. In the past, I did, but started changing my mind after some time.

For a while, I couldn't quite articulate why I disliked this standard, until I read [this blog post](https://sumnerevans.com/posts/software-engineering/stop-using-conventional-commits/) by Sumner Evans.

The gist of why Evans dislikes Conventional Commits is that it focuses on the wrong things, making the type of commit ("feat", "fix", etc.) the most important piece of information, instead of the scope. That is, what areas or part of the system the commit changes.

Conventional Commits is often paired with tools that automatically generate changelogs and bump version numbers based on the messages. Evans argues, and I agree, that this is a fundamentally bad idea.

There are more reasons why this widespread standard is not as great as you might think, but go read Evans' post to know more.

The question then becomes: what to use instead?

## Enter Scoped Commits
In his post, after making a compelling case against Conventional Commits, Evans offers [a different alternative](https://sumnerevans.com/posts/software-engineering/stop-using-conventional-commits/#a-better-way). Based on the standards used by successful open-source projects such as Git, the Linux kernel, Go, among others, he proposes a new standard which he called [Scoped Commits](https://scopedcommits.com/).

Giving a super complete treatment of Scoped Commits would be...you know...out of scope for this blog post. But the gist of it is incredibly simple. You stop using the type of change as the prefix for your message, and use a scope, which relates to the area, subsystem, or part of your application that the commit touches.

This is one example:

```
auth: Add SSO login controller

The login page previously relied on a legacy form-based flow that
was being decommissioned. Introduced a new controller and service
layer to handle SSO natively, preserving existing session logic
while decoupling it from the legacy system.

Closes: AB998
```

## Enter The Claude Skill
It was around this time that I started experimenting with Claude skills, because I was getting sick of repeating the same instructions over and over. I decided to try to encapsulate all of those preferences into a skill I could use. After a good deal of trial-and-error and rewrites, I reached something that I think is useful.

The most important parts of the skill, for me, are the following:

```markdown
- Read the full diff carefully before writing anything
- If the scope isn't clear from the diff, ask one focused question
- **If the diff shows *what* changed but not *why*** — the underlying
  problem, bug, or motivation isn't inferable from the code itself — ask
  one focused question about the reason for the change before writing the
  body. A body written without knowing the "why" tends to just restate the
  diff in prose, which isn't useful. It's fine to write the summary line
  in the meantime, but hold off on the body until you know the reason, or
  proceed with summary-only (ticket in parentheses) if the user doesn't
  have more context to give.
```

They help me make sure Claude gets the right context for the change. Otherwise, it will just provide a detailed list of changes, which is not what I'm after. 

If you're interested, see the complete skill [here](https://github.com/carlosschults/claude-config/blob/main/skills/commit-message/SKILL.md).

## My Verdict?
I've been satisfied with the results I've been getting so far from the skill. It's not perfect, though.

One problem that I have often is that Claude sometimes "forgets" to use the skill. It just goes on and writes whatever as the commit message, and then I have to reprimand it and remind it of the skill. Most times, it uses the skill, though, so that's not that big of a deal.

Another issue is that sometimes it will not respect the 50/72 rule for the maximum lengths of lines. Lines in the body will often be as long as 75 or 76 characters. Sometimes, it takes two or three iterations until it gets it right. Often, I just get sick of it and fix it myself.

Speaking of which, I often amend and edit the generated commit message myself. Sometimes, there is a critical piece of context missing, or Claude misunderstood something, and it's just easier and quicker to fix it myself rather than keep prompting the [clanker](https://en.wikipedia.org/wiki/Clanker) until it gets it right.

So, what's the verdict? Overall, I'm satisfied, but there is room for improvement for sure.

## What Should You Do?
You can do whatever you want, of course, but if you're looking for advice on how to get the best commit messages possible from your LLM of choice, here it goes: **make sure you give it context.**

You don't have to use scoped commits, though I recommend giving it a try. You don't have to use my `commit-message` skill, or any skill at all if you don't want to.

Just make sure that, whatever workflow you use when generating commit messages, there is a step in there where you provide the context, the "why" behind your change. That's the most important piece of information a commit message should contain, and your little robot minion won't get that alone. It needs your help.