---
title: "Implementing git in Go From Scratch, For Fun and...Profit?"
ref: implementing-git-in-go
lang: en
layout: post
author: Carlos Schults
description: "I'm building Git in Go so I can learn both. Join me!"
permalink: /en/implementing-git-in-go
tags:
- projects
- git
- go
- go-gitter
---

I've recently started working on my newest project: building git in Go, from scratch. What's the point in that?, you might be wondering.

Well, it's quite a useless project in the sense that, you know, git has existed for 20 years. (Thanks, Linus).
My goal with this project is two-fold:
- learn the Go language
- strengthen my knowledge about git internals

## Project Scope
I don't intend to implement 100% of git. That would be simply too hard. What I'm going to do is to implement a small subset of git commands, only in their most basic variations for the most part. 
This is the current list of what I intend to implement:
- `git init`
- `git add`
- `git status`
- `git commit`
- `git log`

This list isn't static. I might decide to implement more commands, or fewer. It all depends whether I feel like I've learned enough. We'll see how this goes.

## Project Workflow (I really didn't know what to call this section)
How will I go about all of this, in practice? I'm already going, since I've started about a week ago. So, the way I am going about this is basically going through that list of commands, implementing one by one, and documenting my learnings on this blog.

I'm not sure about the cadence of the blog posts yet, though. I feel like weekly updates are too much; since I only have about 30 to 50 minutes per day to work on this, I don't want to lose too much time writing the updates themselves.

So I guess I will start by writing the posts whenever I feel I've accumulated enough interesting updates to share, then I'll share them. I might later settle into a regular cadence, but don't count on that.

## About LLM Usage
I've imposed some rules on myself for this project. The most important one is that zero code will be written by AI/LLMs. It would defeat the purpose, since the goal of this is to actually learn the language.

That doesn't mean I'm not using AI at all. I'm using Claude to help me plan the roadmap, so to speak. It's been helping me decide the order of the commands that make more sense, what are the Go concepts that are required for me to build this and which ones I can skip, and so on.

For my actual Go learning, I'm using the Go documentation and good-old search. Like the old days.

## Building git in Go: The First Update
So, what have I done so far?
I've started this project on Monday, 2026-03-02. One week ago as the time of this writing. During the first three days, I've followed the [Go Tour](https://go.dev/tour/welcome/1) in order to remember the few things I knew about the language and to learn more of the fundamentals.

On Thursday, I finished the tour. I skimmed the lessons about generics very quickly and completely skipped the ones about concurrency. On this day, I created the [repository](https://github.com/carlosschults/go-gitter) and wrote a "Hello World." 

For some reason, I didn't touch the project on Friday. Saturday was the day I actually implemented my first command, and the only one implemented so far: `ggt init`.

Oh yeah, by the way: my executable for this will be `ggt`, because the project itself is called **go-gitter**. Yes, it's silly, but I like silly names, what can I do?

Implementing `init` was very easy and I'm sure it's only getting harder from now on. Creating a git repository is surprisingly easy, and it's something you can do manually, without using git itself at all. Doubt it? Ok, I'll teach you.

Go somewhere in your computer and create a folder. Go inside this folder and create a new one called `.git`. Exactly like this.

Now, go inside `.git` and create a text file called HEAD. Just like this, without any extensions. Inside this file, put the following text, then save it:
```
ref: refs/heads/main
```
Next step: create two new folders, `objects` and `refs`. Inside `objects`, create yet two empty folders: `info` and `pack`. Inside `refs`, create `heads` and `tags`.

Now, using the terminal, go to the same level where the .git folder is and then run `git status`. You'll see a result like this:
```
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```
Congrats! You've just created a git repo, manually. This is exactly what [my Go code is doing](https://github.com/carlosschults/go-gitter/blob/main/ggt/main.go).

## Follow the Updates
The updates to this progress will be tracked by the <a href="{{ site.baseurl }}/tag/go-gitter">go-gitter</a> tag, so you can bookmark that page, if you want. 
I've already linked to the repository, but here it is again, in case you've missed: [go-gitter](https://github.com/carlosschults/go-gitter).

Thanks for reading. See you on the next update.