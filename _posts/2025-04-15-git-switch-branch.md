---
title: "Git Switch Branch: Everything You Need to Know"
ref: git-switch-branch
lang: en
layout: post
author: Carlos Schults
description: "Learn how to successfully switch branches in Git in an easy and safe way, including how branches work, how to create them, and how to check out remote branches."
permalink: /en/git-switch-branch
canonical: https://www.cloudbees.com/blog/git-switch-branch-everything-to-know
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1673926044/git-beautiful-history/git-beautiful-history-cover.png
tags:
- git
- tutorial
---

![]({{ page.img }})

{% capture content %}
I originally wrote this post for Cloudbees. You can read the [original at their site]({{ page.canonical }}).

{% endcapture %}
{% include callout.html type="info" title="NOTE"  content=content %}

Repositories in [Git](/tag/git) work in a fundamentally different way from most other tools. One of the most glaring examples of said differences is branching. In most other VCS tools, branching is this elaborate ceremony. They make a huge deal out of it, and developers just give up, preferring workflows that don't rely on many branches.

In Git, the opposite is often true: branching is so cheap that most people do it a lot. People often get confused when trying to manage their branches. This post attempts to clear up some of that confusion by offering a guide on how to successfully git switch branch in an easy and safe way. Before we get there, though, we start with some basics, explaining what branches actually are in Git, how they work and how you create them.

Before wrapping up, we share a bonus tip, covering how to check out remote branches. Let's get started!

## How Do Git Branches Work?

How do branches work in Git? The first thing you need to know is that a repository in Git is made up of **objects** and **references**. The main types of objects in a Git repository are commits. References point to other references or to objects. The main types of references are—you've guessed it—branches.

Objects in Git are immutable. You can't change a commit in any way or move its position in history. There are commands that appear to change things, but they actually create new commits. References, on the other hand, change a lot. For instance, when you create a new commit, the current branch reference is updated to point to it.

When you create a new branch, all that happens is that a new reference is created pointing to a commit. That's why it's so cheap and fast to create branches in Git. Speaking of which…

## How Do I Create a New Branch?

We already have a whole post explaining how [you can create a branch in Git](/en/git-create-branch/), covering the four mains ways to do that.

Here, we'll just cover the easiest way to create a branch in Git, which is simply using the branch command from the current branch. Let's see an example:

```bash
mkdir git-switch-demo
cd git-switch-demo
git init
touch file1.txt
git add .
git commit -m "Create first file"
touch file2.txt
git add .
git commit -m "Create second file"
touch file3.txt
git add .
git commit -m "Create third file"
```

In the example above, we've created a new repository and added three commits to it, creating a new file per commit. Here's a visual representation of the current state of our repository:

![](/img/git-switch-branch/img1.webp)

To create a new branch from the current point, we just have to run:

```bash
git branch example
```

We've created a branch but haven't switched to it yet. This is how our repo looks like now:

![](/img/git-switch-branch/img2.webp)

What if we added a new commit while still in the master branch? Would that impact the example branch? The answer is no. Execute the following commands:

```bash
echo "Another file" > file4.txt
git add .
git commit -m "Create fourth file"
```

In the next section, we'll show how you can git switch branch, and then you'll be able to see for yourself how that new branch doesn't contain the fourth commit. For now, take a look at the visual representation of the current state of our repo:

![](/img/git-switch-branch/img3.webp)

## How Do You Switch Branches?

For most of Git's history, the checkout command was used for that. While you can still use it, version 2.23 of Git added the switch command (as well as the restore command) in an attempt to have more specific commands for some of the many tasks the checkout command is used for.

### How Do I Use Git Checkout?

The older, more well-know way of switching branches in Git is by using the `checkout` command. Following our example, if we wanted to change to the "example" branch, we'd just have to run:

```bash
git checkout example
```

After executing the command, you should see a message saying that you've successfully switched to the example branch:

![](/img/git-switch-branch/img4.webp)

Now you're in the new branch, that means you can add how many commits you want, knowing that the master branch won't be impacted. The checkout command, followed by a branch name, updates the working tree and the index, and it updates the HEAD reference, pointing it to the branch you've just checked out. What if you had uncommitted changes at the moment of switching? Those would be kept to allow you to commit them to the new branch.

Git allows you to use the checkout command in different ways. For instance, an incredibly common scenario is to create a branch and immediately switch to it. In fact, I'd argue that creating a branch and _not_ changing to it on the spot is the exception rather than the rule. So, Git offers us a shortcut. Instead of creating a branch and then checking it out, you can do it in one single step using the checkout command with the `-b` parameter.

So, doing this:

```bash
git checkout -b new
```

is equivalent to this:

```bash
git branch new
git checkout new
```

Checkout doesn't work only with branches, though. You can also checkout commits directly. Why would you want to do so?

Well, taking a look at how the project was some amount of time ago is often useful, particularly for testing purposes. But there's more. Checking out a commit puts your repository in a state called ["detached HEAD"](/en/git-detached-head) which allows you to create experimental changes, adding commits that you can then choose to keep or throw away.

### What Is Git Switch?

For the most part of Git's lifetime, the `checkout` command was the only one you'd use for switching branches. The problem is that this command also does other things, [which can lead to confusion, especially among new users](https://redfin.engineering/two-commits-that-wrecked-the-user-experience-of-git-f0075b77eab1).

The 2.23.0 version of Git solves this by adding two new commands: `switch` and `restore.` The restore command isn't relevant for us today. The switch command, on the other hand, is a new way to switch to branches.

The [manual page for the command](https://git-scm.com/docs/git-switch) lists all of its many options. On its most basic form, you use it the same way as `git checkout`, only swapping the command's name:

```bash
git switch example
```

If you want to go back to the previous branch, you can use a shortcut instead of its full name:

```bash
git switch -
```

What if you want to create a new branch and immediately switch to it? With checkout, we could use this shortcut:

```bash
git checkout -b <branch-name>
```

The new command also offers a shortcut, but in this case, we use the letter "C":

```bash
git switch -c <branch-name>
```

Is using the new command worth it? Well, I'll probably keep using `git checkout`, as long as they don't change it, mainly because of muscle memory. But when teaching Git to beginners? Then I'll definitely use the `switch` command. It has a name that's more closely related to the task it does and, therefore, it's more memorable.

### How Do I Switch to a Remote Branch?

Before wrapping up, we share a final tip: how to switch to remote branches?

For this example, we're going to use an open-source project called [Noda Time,](https://github.com/nodatime/nodatime) which is an alternative date and time API for .NET. Start by cloning the repository:

```bash
git clone https://github.com/nodatime/nodatime.git
```

If everything worked fine, you should have a "nodatime" folder now. Enter the folder and run the following command:

```bash
git branch -a
```

The `branch` command lists the branches in your repository. The "-a" option means you want to see all branches, not only local ones. The result should look like this:

![](/img/git-switch-branch/img5.webp)

As you can see, we have only one local branch, which is the master branch. You can see, in red, all of the remote branches. So, let's say you want to check out the branch called "slow-test." How would you go about that?

Well, technically speaking, Git doesn't allow you to work on other people's branches. And that's what remote branches are. What you actually do is to create a local "copy" of someone else's branch to work on. So, let's see how to do it.

When you create a branch, you can pass a commit or branch name as a parameter. So, in order to create a local branch from the remote "slow-test" branch, I'd just have to do:

```bash
git branch slow-test origin/slow-test
```

In the example, I'm using "slow-test" as the name for my local branch, but I could've really used any other valid name.

Alternatively, I could've used the `checkout` command with the -b option or the `switch` command with the -c option. So, the two following lines are equivalent to the line above:

```bash
git checkout -b slow-test origin/slow-test
git switch -c slow-test origin/slow-test
```

Finally, there's an even easier way. I could've just used:

```bash
git checkout slow-test
```

and the result would have been the same. That works because when you try to check out a branch and Git doesn't find a branch with that name, it tries to match it with a remote branch from one of your remotes. If it can successfully match it, things just work.

## Git Branches: Use in Moderation

In this post, we've shown you how to switch branches in Git. But we went further than that: we've explained what branches are and how they work. Hopefully, by now, you're more comfortable creating and using branches in Git.

Before we go, a final caveat: just because you can do something, it doesn't mean you should. Sometimes people get so carried away with the ease of branching in Git they end up using [workflows that rely on a number of long-lived branches](https://rollout.io/blog/pitfalls-feature-branching/), which makes their development process way too complex and error-prone and delays integration.

Thanks for reading, and until next time.