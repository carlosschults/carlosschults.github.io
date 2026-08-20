---
title: "Building git in Go From Scratch - Part 3"
ref: building-git-in-go-part3
lang: en
layout: post
author: Carlos Schults
description: "This is my third update in my git building journey"
permalink: /en/building-git-in-go-part3
tags:
- projects
- git
- go
- go-gitter
- version-control-system
---

Welcome back to my journey of building git from scratch in Go, in order to learn more about both. If you don't know what
I'm talking about, go read [the first post](/en/implementing-git-in-go). You should of course then proceed to also read [the second entry](/en/building-git-in-go-part2).

## It's Been a While, Again
It's September already, can you believe it? I know, it's been a longer while this time. And the ~~excuse~~ explanation is the same: I didn't have much time.

Also, to be honest, I kind of forgot to update this, as I was working through the project. It's like I didn't want to lose the momentum I was in, so my brain sort of blocked this idea of stopping to write this update...? Anyway, it makes sense to me. Let's continue.

## Recap
At the end of last post, I mentioned that [the next step would be implementing the `update-index` command](https://carlosschults.net/en/building-git-in-go-part2#whats-next). That is done, and you'll read some about it.

But this update will be, in general, less about the command in itself and more about everything else around it. 

That's because, after implementing this command, I decided to do a much needed refactoring. The code was reaching a level of messiness that was making me uncomfortable. But, as Martin Fowler[^1] himself would certainly tell you, refactoring is risky without automated testing.

So, I decided to add automated tests so I could ensure my commands still worked fine as I refactored them. This post is the story of that refactoring.

## Implementing `update-index`
Let's start by talking about the implementation of `update-index`. This command is not one you would use normally in your day-to-day, since it's a plumbing[^2] command. Why implement it, then?

### Motivation
I'm working my way towards being able to commit changes. You'll remember that, before you commit some change in git, you need to stage it first. "Staging" a change means adding that to the index, so that when you commit, the change present in your index is the one which gets added to the commit.

`update-index` gets file paths as arguments and adds those to the index. My implementation, at the moment, only handles one file. There is future work for me to do so that it actually handles multiple files.

My implementation was done in two steps. First, I created a [skeleton for the command](https://github.com/carlosschults/go-gitter/commit/1f90b863b6f77d75f1ab85f2031f457b515c1efa), writing a minimum index file which was structurally correct but was not right, in the sense that it wasn't actually writing a real file to the index at that point.

The [commit after that](https://github.com/carlosschults/go-gitter/commit/f82f8612b3ad9e6b00a27eeb0ded9bf701bd7862) finished the implementation, by taking the file into account and saving it correctly. The result was that I now had a command that could write to the index file in a totally valid way. I could verify this by using real git to read the index file back, using another plumbing command, `git ls-files`.

### What the heck is an index file?
I've been saying "adding to the index", as if it's something that everyone understands. So, what does exactly mean to add something to the index file, and what even is the index file to begin with?

The index file is a binary file that git writes at `.git/index`. Unlike objects like blobs which, when decompressed, give back readable text, the index doesn't. Its contents are, basically, byte sequences that follow a very specific format. The reason for that is efficiency: storing this data in binary format ensures that writing and reading it is faster than it would've been doing the same to a text-based file, and it also ensures the file doesn't get too large.

If you read the [implementation](https://github.com/carlosschults/go-gitter/blob/f82f8612b3ad9e6b00a27eeb0ded9bf701bd7862/ggt/main.go#L176), you can see what is the format for the index file. I won't cover it in too much detail here, but the gist of it is:

1. A header, always containing DIRC as a signature, a version number, and a count of files staged, which in my case, is hardcoded to 1
2. One entry per staged file, containing metadata, the SHA-1 hash of the file, and its file name.
3. A checksum, consisting of a SHA-1 hash of all of the information that preceded it, so git can detect corruption in the index file.

For the metadata fields, I just hardcoded a lot of stuff. Many of those fields aren't really relevant on Windows, and they're mostly for performance optimizations either way. In other words, they are a nice-to-have rather than a must-have, so I zeroed them out for simplicity's sake.

### I found a bug
This is kind of embarrassing, but while writing this post I found a bug with my implementation. I mean, the implementation was already partially complete by design, since it currently can handle only one file. But I've found an actual bug: my `update-index` doesn't create a blob object after hashing the file.

Here, this is the offending part of the code:
```go
// append the hash
_, hash := hashData(contents, "blob")
dataToSave, err = binary.Append(dataToSave, binary.BigEndian, hash)
```

See how `hashData` has two return values and we discard the first? That's the issue. Instead of discarding it, we should have used that return and saved it to the disk as a blob. Like the way the `hash-object` command [does it](https://github.com/carlosschults/go-gitter/blob/f82f8612b3ad9e6b00a27eeb0ded9bf701bd7862/ggt/main.go#L149-L170).

I found the bug while [rubber-ducking](https://en.wikipedia.org/wiki/Rubber_duck_debugging) with Claude about the roadmap. As I stated [in the first entry](/en/implementing-git-in-go), I'm not using AI to generate any of the code for this, which is also one of the reasons this is taking so long. But I am using Claude to help me plan the roadmap, the correct sequence of commands, and understand Git's inner workings so I can implement them.

Anyway, the bug is there, what will I do? For now, nothing. I'll just put a pin on it and come back to it in the future, after I'm done with my refactoring.

This is something I've mentioned briefly at the start of the post, but after I had `update-index` sort of working, I decided the next step would be to refactor the existing code, which was becoming too messy.

## Tests before refactoring
Look at the state of the [main file at that point in history](https://github.com/carlosschults/go-gitter/blob/f82f8612b3ad9e6b00a27eeb0ded9bf701bd7862/ggt/main.go) and you'll agree with me it's not an example of separation of concerns. It's a big file that mixes argument parsing, command dispatching, pure and impure functions all jumbled together. 

My plan for the refactoring was two-fold: first, extract all commands into their own files, using proper argument parsing. Then, segregate pure and impure functions, so I could easily unit test the pure ones.

But such a refactoring is risky, and I decided to first create integration tests, that would:
- build the project and generate an executable
- create a temporary repository for testing
- use the generated executable to run some commands inside the temp repo
- assert the expected outcomes

And that's basically what I did. First, I [set up the test infrastructure](https://github.com/carlosschults/go-gitter/commit/496442c83924bd89893d36a58d86111ebc0079a8), by creating one helper function that generates the executable and saves its path for later usage and another one that sets up the temporary repository.

Then, the [commit after that](https://github.com/carlosschults/go-gitter/commit/3c0c6e260d10df68a974377c1c44534299257f86) added tests for the `update-index` command. Which was incorrect, as you've just seen, but I didn't know it at the time and, thus, my test passed.

An interesting learning I had regarding tests in Go is that they usually don't write assertions, apparently? There are third-party libraries you can use that introduce assertions, but if you use just the built-in testing facilities of Go, you have to assert "manually". Here, see an example:

```go
func TestUpdateIndexAddSingleFile(t *testing.T) {
	testRepoPath := setupGitRepo(t)
	if err := os.WriteFile(filepath.Join(testRepoPath, "file.txt"), []byte("hello world"), 0666); err != nil {
		t.Fatalf("Creating the test file failed: %s", err)
	}

	cmd := exec.Command(ggtBinaryPath, "update-index", "--add", "file.txt")
	cmd.Dir = testRepoPath
	_, err := cmd.Output()
	if err != nil {
		t.Fatalf("Command failed: %s", err)
	}

	cmd = exec.Command("git", "ls-files")
	cmd.Dir = testRepoPath
	result, err := cmd.Output()
	if err != nil {
		t.Fatalf("Command failed: %s", err)
	}

	if !strings.Contains(string(result), "file.txt") {
		t.Fatalf("Test failed")
	}
}
```

In the test above, I run my command `update-index`, then after that I run real Git's `ls-files` command, and verify that its output includes the name of the file I added.
If it doesn't, I error out. If the method makes it to the end without returning an error code, it means the test succeeded.

After that, I kept adding tests until all commands were covered, then added a GitHub Actions pipeline to test after every push or PR merged to `main`.

## Extracting commands
For the next step, I wanted to extract all commands to their own file and use proper argument parsing. After a bit of research, I learned that [Cobra](https://github.com/spf13/cobra) is the main library for argument parsing in Go, so I decided to use it.

The resulting change was done over [a single commit](https://github.com/carlosschults/go-gitter/commit/9c4976fd77d3822b85d50523377694c0f275f035). The extraction required some changes to the folder structure, but I made sure the tests kept passing.

After that, I did some clean-up and added some niceties, such as a make file (because I kept forgetting how to run all tests) and accurate descriptions for all commands.

The resulting code is much more pleasing now. This is what my entry point looks like now:

```go
package main

import "github.com/carlosschults/go-gitter/cmd"

func main() {
	cmd.Execute()
}
``` 
And this is the file for the `init` command:

```go
package cmd

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Create an empty Git repository or reinitialize an existing one",
	Run: func(cmd *cobra.Command, args []string) {
		path, _ := filepath.Abs(".git")
		standardizedPath := filepath.ToSlash(path) + "/"

		if _, err := os.Stat(".git"); err == nil {
			fmt.Println("Reinitialized existing Git repository in", standardizedPath)
			os.Exit(0)
		}

		if err := os.Mkdir(".git", os.ModePerm); err != nil {
			log.Fatal(err)
		}

		if err := os.WriteFile(".git/HEAD", []byte("ref: refs/heads/main"), 0666); err != nil {
			log.Fatal(err)
		}

		if err := os.MkdirAll(".git/objects/info", os.ModePerm); err != nil {
			log.Fatal(err)
		}

		if err := os.MkdirAll(".git/objects/pack", os.ModePerm); err != nil {
			log.Fatal(err)
		}

		if err := os.MkdirAll(".git/refs/heads", os.ModePerm); err != nil {
			log.Fatal(err)
		}

		if err := os.MkdirAll(".git/refs/tags", os.ModePerm); err != nil {
			log.Fatal(err)
		}

		fmt.Println("Initialized empty Git repository in", standardizedPath)
		os.Exit(0)
	},
}

func init() {
	rootCmd.AddCommand(initCmd)
}
```

## What's next?
Oh boy, do I have some work ahead of me!

First of all, I want to fix this bug with `update-index`. Then, I need to complete its implementation. That is, make it save any number of files, since it currently only handles one file.

After that, I will do the refactoring I mentioned earlier: segregate the pure from the impure functions, and write tests for the pure ones.

Only when I'm done with all of that I'll move to the next commands: `ls-files`, then `write-tree` and `commit-tree`, finally working my way towards being able to create a real commit.

I promise I'll bring updates more frequently. For now, thanks for reading.


[^1]: Famous software thought-leader, and author of the [Refactoring book](https://martinfowler.com/books/refactoring.html), among many others.
[^2]: Plumbing commands are the internal commands of git, which manipulate objects at the lowest level. The porcelain (high-level) commands then call and orchestrate the plumbing commands in order to carry out the tasks a git user normally does.