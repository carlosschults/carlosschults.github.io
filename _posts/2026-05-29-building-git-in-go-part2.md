---
title: "Building git in Go From Scratch - Part 2"
ref: building-git-in-go-part2
lang: en
layout: post
author: Carlos Schults
description: "This is my second update in my git building journey"
permalink: /en/building-git-in-go-part2
tags:
- projects
- git
- go
- go-gitter
- version-control-system
---

Welcome back to my journey of building git from scratch in Go, in order to learn more about both. If you don't know what
I'm talking about, go read [the first post](/en/implementing-git-in-go).

## It's Been a While
I published the first entry for this log of sorts on March 9th. What have I been up to, and why it took me so long to continue the series?

The answer is what you probably already know: I'm a busy adult and don't have much time. Also, there are other personal projects that demand my time.

Anyway, enough with the excuses. Let's talk about what I've managed to implement since the last update.

## Plumbing vs Porcelain Commands
Before I go into more detail about what I implemented, I'll need to digress a little bit and talk about a distinction that exists regarding git commands.

When you think about git commands, what come to your mind are probably commands like `git add`, `git init`, `git log`, `git status`, and so on. And even that only if you actually use commands. Many people simply use GUIs for everything and never manage to learn not even the basic commands.

These are the so-called "porcelain" commands. They are the high-level commands, intended to be used by git's end-users, like you and me.

There is another layer of commands, which people call "plumbing" commands. Plumbing commands are the low-level commands, which perform the nitty-gritty data manipulation that enables the high-level commands to do their work.

So, recently, I've been implementing some plumbing commands that act as the foundation for much of what git does. They are `hash-object` and `cat-file`.

## Understanding `hash-object` And `cat-file`
I'm going to talk very briefly about what these commands do before I talk about my experience implementing them. `hash-object` is the command used to save some data as a blob (binary large object) inside a git repository. You give the command a piece of text, and it saves an object with that information, and gives you back a SHA1 hash.

The `cat-file` command does the opposite. You give it an object hash, and it returns you its contents (or size, or type, depending on how you call it).

### Hashing Your First Object
Do you want to test it? Run the following command:

```bash
echo hi | git hash-object --stdin
```

After running this, you should see this exact hash as a result: `45b983be36b73c0788dc9cbcb76cbb80fc7bb057`.

{% capture content %}
If you're on Linux or another Unix system, you probably got the result above. The same is true for Windows if you're using Git Bash. But if you're on Windows and using the command prompt or powershell, your result was probably different. That happens because of different line endings between the systems.
{% endcapture %}
{% include callout.html type="info" title="Info"  content=content %}

What happened here is that git calculated a hash for the "hi" string and returned it to you. We're using the `--stdin` flag so you can pipe the content from the standard input.

However, that wasn't saved anywhere. To actually write the data to disk, you need to use a different version of the command, and this time it needs to be inside a repository.

### Saving an Object

Go to some place, create a new folder and a new repo inside it:

```bash
mkdir testing-commands
cd testing-commands
git init
```

That's good. Now, you can do this:

```bash
echo hi | git hash-object -w --stdin
```

This is similar to how you used the command before, but notice the extra `-w` flag. That means **write** and it's what makes git save the content to a file. You'll still get the SHA1 hash as a response, same as before, but now you got a brand new blob git object saved somewhere. Wanna see it?

Go to the folder where this repository lives, then go inside the `testing-commands` folder. As in, using a GUI, not in the command line. Change whatever configurations you need so you can see hidden folders and files. You'll see a `.git` folder:

Go inside this folder and you'll see basically this structure:

```
├───hooks
├───info
├───objects   
└───refs
- config
- description
- HEAD
```

`config`, `description` and `HEAD` are files, and the others are folders. Go inside the `objects` folder. You'll probably find an `info` and `pack` folders there, but ignore them.

What we're really after here is a folder named with two characters. If you ran the commands above on Linux or using Git bash on Windows, it should be `45`. Otherwise, it should be the first two characters of whatever hash you got back after running `echo hi | git hash-object -w --stdin`.

Go into that folder. Inside, you'll find a file named after the remaining characters of the hash you got back. In my case, I see `b983be36b73c0788dc9cbcb76cbb80fc7bb057`.

**That is your blob.** That file is the object that git saved when you ran the `hash-object` command with the `-w` flag.

### Reading Objects Back
Try opening the blob file using your text editor of choice. You'll see that, yes, the file opens fine. But the contents are pure giberish. That's because that's a compressed, binary format. It isn't plain text.

This is what git does, in sequence:
1. It creates a header, by concatenating the word "blob", a space, and the size, in bytes of the contents. For instance, `blob 2`
2. Then it concatenates that with a [null character](https://en.wikipedia.org/wiki/Null_character)
3. It then concatenates the actual content after that. In our example, "hi".
4. It generates the SHA1 of the complete string.
5. If you're not using the `-w` flag, git then returns the SHA1 and that's it.
6. In case you are using the `-w` flag, it the compresses the complete string (header + null byte + contents)
7. It takes the two first characters of the SHA1 hash and creates a directory with that name, inside `objects`
8. Finally, it creates a file inside that folder, named with the remaining characters of the SHA1 hash, and writes to this file the contents, compressed using zlib.

In order to read this data back, you use the `cat-file` command, along with one of its flags. In order to just read the contents, you use `cat-file -p`, where the `-p` flag means "pretty print":

```bash
git cat-file -p 45b983be36b73c0788dc9cbcb76cbb80fc7bb057
```

If you run the command above, you get "hi" back. You can also use the `-t` flag for the type of object, or `-s` to return its size in bytes:

```bash
git cat-file -t 45b983be36b73c0788dc9cbcb76cbb80fc7bb057
blob

git cat-file -s 45b983be36b73c0788dc9cbcb76cbb80fc7bb057
3
```

## Enter Go-Gitter
Now that you understand what these two commands do, let's talk about how I implemented them in `go-gitter`, starting with `hash-object`.

### Implementing `hash-object`

My first step was implementing the most basic version of `hash-object`, without the `-w` flag. So, the command would be able to display the SHA1 hash for a given text, but not actually save it to disk yet.

As you can see from the [commit](https://github.com/carlosschults/go-gitter/commit/3ae9cc58f32059cda6091aa27dbab4507cebbca7), this is far from an example of clean code. The code mixes argument parsing and actual logic into the same file. At this point, I hadn't even created functions for each command, though I ended up doing that later.

The part of the code that does the actual hashing turned out to be really simple, once I understood what the format was supposed to be:

```go
size := len(data)
header := fmt.Sprintf("blob %s%c", strconv.Itoa(size), 0)
content := header + string(data)
hash := sha1.New()
hash.Write([]byte(content))
hashedData := hash.Sum(nil)
hashedString := hex.EncodeToString(hashedData)
fmt.Println(hashedString)
```

So, as you can see we create the header by concatenating the word "blob" plus a space with the size of the contents and then the null character, here represented by the integer zero. Then we hash everything, encode it as a string and print that.

It took me some googling to find out the necessary libraries and the syntax to do this in go, since my self-imposed rules say I can't use LLMs for any code generation, but I ended up doing it fine.

In the [next commit](https://github.com/carlosschults/go-gitter/commit/8b08cb93545f3966b1485989ce67501e1a5ff3ba) I added support for the `-w` flag. As you can see, at that point I created a function for the command.

There isn't much difference, really. What I added was some primitive argument parsing to figure out whether I should write to disk.

Then, the actual code that does the writing:

```go
if saveFile {
	// create the directory for the blob
	if err := os.Mkdir(".git/objects/"+folderName, os.ModePerm); err != nil {
		log.Fatal(err)
		os.Exit(1)
	}

	// compress the content using zlib and save the file
	var buffer bytes.Buffer
	w := zlib.NewWriter(&buffer)
	w.Write([]byte(content))
	w.Close()
	if err := os.WriteFile(".git/objects/"+folderName+"/"+fileName, buffer.Bytes(), 0666); err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
}
```

It took me a bit of time to get this right. Mostly because at some point I was completely misunderstanding what git actually did. I thought I was supposed to compress and save the _hash_ that I calculated earlier. Yes, I know, makes no sense, but what can I say?

Once I understood that, getting this to work was mainly a matter of figuring out the zlib compression part. Google and documentation did it for me, like in the old days.

### Implementing `cat-file`
The `cat-file` command was easier to implement, because it's essentially just the opposite. Based on a hash, find the corresponding file, uncompress it, and read its contents.

This time I created a dedicated function for the new command from the start, as shown in the [first commit](https://github.com/carlosschults/go-gitter/commit/81c9f03e1ca76a483335876b42637833f8a0a524). This commit only implements the `-p` flag, though.

This is an abridged version of the code from the commit above, stripped of the function boilerplate and also the error handling:

```go
folderName := h[0:2]
fileName := h[2:]
fullPath := filepath.Join(".git/objects", folderName, fileName)

var contents []byte
var err error
contents, err = os.ReadFile(fullPath)

r, err := zlib.NewReader(bytes.NewReader(contents))

buf := new(strings.Builder)
_, err = io.Copy(buf, r)

uncompressedContents := buf.String()
contentsWithoutHeader := strings.Split(uncompressedContents, "\x00")[1]
r.Close()
fmt.Println(contentsWithoutHeader)
```

The `h` variable is the SHA1 the command receives. From that, we get the directory and file name, which we then use to assemble the full path, read the contents of the file and then uncompres it.

Finally, I split the string by the null character and return the second part, which is whatever comes after the header.

The [next commit](https://github.com/carlosschults/go-gitter/commit/56d10d3cb2ad0baa217a357b8f5d204eb5970620) after that implements the remaining flags. I won't go line by line, since the important part is super simple:

```go
parts := strings.Split(uncompressedContents, "\x00")
flag := arguments[2]
var result string

switch flag {
case "-p":
    result = parts[1]
case "-t":
    result = strings.Fields(parts[0])[0]
case "-s":
    result = strings.Fields(parts[0])[1]
}
```

Go programmers reading this: I suspect this code isn't the most beautiful and idiomatic Go you've ever seen, and I promise you that once I learn more about the language, I will refactor this. The priority for me at the moment was getting it to work.

## What I've Learned So Far
The goal of this project is to learn the Go language and also more about Git's implementation. So, what did I learn about both by completing these two commands?

First, the Git side. I can say I was surprised about how simple is the way git saves objects. It is really just the type of the object, a space, the size, a null character to act as delimiter, and then the contents. I understood, at a high level, how git stored objects, but actually implementing it gave me an appreciation for how simple and elegant it all is.

And about the Go side? Generally speaking, I really like it. I appreciate how readable the language is. I think even someone with zero experience in Go could read this code and at least get the gist of it, as long as they are already a programmer.

I also like the fact that Go is opinionated. For instance, if you have an `if` statement, you have to use the curly braces. Otherwise, your won't compile. So, this is one less thing for programmers to fight about and to have coding standard meeting about and to write linter rules about. It makes life simpler.

One aspect that I don't like is the error handling. Having those if statements verifing `err` everywhere polutes the code. In C#/.NET, when there is an error that is something that should be absolutely impossible, I just let the exception bubble out until it reaches the top level exception handling middleware, where it gets logged and the user receives a message with the adequate level of detail.

Maybe there's some idiomatic way to do something like that in Go as well, but right now I'm not aware. But other than that, I really like the language so far.

## What's Next?
For the next step I'll implement another plumbing command called [update-index](https://git-scm.com/docs/git-update-index). This is necessary so I can stage changes and eventually commit them.

If you want to play with `go-gitter`, install it like this:

```bash
go install github.com/carlosschults/go-gitter/ggt@latest
```

Then you can use the commands like this:

```bash
echo hi | gtt hash-object --stdin
ggt cat-file -p 45b983be36b73c0788dc9cbcb76cbb80fc7bb057
```

You should be able to hash something with real git and then reading it with go-gitter, and vice-versa.

Thanks for reading, and see you on the next update.