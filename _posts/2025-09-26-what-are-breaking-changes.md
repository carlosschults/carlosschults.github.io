---
title: "What Are Breaking Changes?"
ref: what-are-breaking-changes
lang: en
layout: post
author: Carlos Schults
img: /img/what-are-breaking-changes/cover.jpg
description: "Learn the concept of breaking changes in software: what they are, why they matter and what to do about them"
permalink: /en/what-are-breaking-changes
tags:
- from_a_to_z
- breaking_changes
---

![]({{ page.img }})
Photo by <a href="https://unsplash.com/@denisolvr?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Denis Oliveira</a> on <a href="https://unsplash.com/photos/grayscale-photography-of-speedboat-yplNhhXxBtM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>      

I'm starting a series of articles in which I'll define some concepts or terms that are common in software development, and I'm starting with **Breaking Changes**. After all, why start with A like a normal person?

Ok, but…why write such a series?

Mainly because I want to create the resources I wish I had when I was starting out.

Back then, it used to drive me crazy when people would just casually say things like I was already familiar with them.

Mind you, I'm an ~~old~~ experienced developer, which means in my time I didn't have an AI buddy to just ask those things. Yeah, Google was already a thing, how ~~old~~ experienced do you think I am? Jesus!

The problem is that often explanations you'd find by Googling weren't that great. Often, Stack Overflow helped, but not always. Nowadays, of course, you can ask your favorite LLM side-kick to explain things to you, if you don't mind the generic tone, depleted of any authentic human voice or anecdotes.

So, I'm writing these articles to help beginners out there understand a bit better some key software development concepts, one at a time, in a simple and hopefully engaging way, courtesy of yours truly.

Let's begin?

## What is a breaking change?
"Breaking change" means any change you make to your software that can cause the code of its users to break, after they upgrade. Breaking changes only make sense when you think about software that you create and somehow distribute for third-party users. 

![The relevant XKCD](https://imgs.xkcd.com/comics/workflow.png "There is always a relevant XKCD")

Think of things like:

- APIs
- libraries/packages
- frameworks
- CLI tools

Let's see an example. While developing an application for your company, you extracted some common functionality as a library and decided to publish that as an open-source package hosted on [https://www.nuget.org](https://www.nuget.org).

After a while, you publish a new version in which you change the name of one of the most important and used methods inside the package. Users upgrade to your newest version and now their code doesn't compile, because it still refers to the method using the original name. **That's a breaking change!**

{% capture content %}

Important: for something to be a breaking change, it's not required that 100% of the users break when they upgrade. In our example, it's possible that not all users were actually using that specific method in their code which means their code wouldn't have broken. But the change is still a breaking change, because the potential for breaking is there.

{% endcapture %}
{% include callout.html type="info" title="NOTE"  content=content %}

## Examples of Breaking Changes

In practice, what types of changes are breaking changes?

I'd say the most common one, or at least what most people would think of as a breaking change, would be deleting or renaming things.

If you rename an API endpoint, a public class or method from your package, or a command from your CLI, code that uses those things will no longer work. And, for all practical effects, renaming is the same as deleting, because that old version no longer exists.

!["Confused John Travolta looking for something"](/img/travolta.gif)

*Where is the method that was here?*

There are other types of breaking changes, though, so let's review some of them.

### New Required Parameters

If you add new parameters to a method, and they are required, then all existing code that calls the method will now fail to compile. The solution here would be to add new parameters as optional, or even create a new method.

### Removed optional parameters or made them required

This is a logical continuation of the previous one. If you remove an optional parameter, code that calls that method padding the parameter will now break. On the other hand, if you make an optional parameter required, the opposite happens: now all of the places that don't pass the parameter will break.

### New Members Added To An Interface

Here I'm talking specifically about statically typed languages that have the concept of an interface in which you define behaviors that client classes need to implement. 

Adding a new member to an interface is a breaking change because now all classes that implement it wouldn't have implemented the new member.

Recently-ish, the C# team solved this problem in a way that sparked some controversy: adding the possibility of [implementing methods on the interfaces themselves!](https://devblogs.microsoft.com/dotnet/default-implementations-in-interfaces/)

### Changed the Type of a Method Parameter

If you change the type of a parameter from, say, `string` to `int`, you're making sure that a lot of client code will break.

### Changed return type of a method or function

Again, depending on the old and new types, this might not even break, but it's still a breaking change in general.

### Changed parameter order

This one is interesting because it might break in a different way than the others. For most of the examples I've been giving so far, "breaking" means that the code that consumes your code will fail to compile.

With this one, you can do it in such a way that the code still compiles, but it fails to work properly.

For instance, see this code:

```csharp
public async Task<IReadOnlyList<Product>> GetProductsByCategory(int categoryId, int companyId)
{
// implementation
}
```

If you inverted the order between `categoryId` and `companyId`, the code would still compile but it wouldn't work properly. It'd still be a breaking change, but one that fails in a subtler way.

Of course if the two parameters are of different types, then it would fail in the sense of failing to compile. And that's why a lot of people argue that you shouldn't use primitives for things like ids, but create your own [tiny types](https://carlosschults.net/en/genai-tiny-types) for that.

### Modified error handling behavior (throwing different exceptions)

If your method used to throw a certain type of exception and now it throws a different one, that's a breaking change, because code that was written to catch that specific first exception won't work for the new one, unless it inherits from the first one.

### Made public methods or properties private

For the client this is, effectively, the same as deleting them, so it's an obvious breaking change.

### Added authentication requirements where none existed

Up until now, all of the examples were for libraries or packages. Now we're going to see a few examples for web APIs. The first one has to do with authentication: if a given endpoint didn't require authentication but now does, that's a breaking change, because existing code that used to call that will now get a [401 Unauthorized](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401) error.

### Added new required properties to a payload

That's akin to adding new required properties to a public method, right? If your endpoint now expects a different payload than what it did before, existing code will break, likely getting a [400 Bad Request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/400) error.

### Rename or delete an endpoint

This one is self explanatory.

## What to do about breaking changes?

This should be obvious by now but let's spell it out: breaking changes are A Bad Thing™. You should avoid them like the plague.

If you distribute any code of software publicly and there are people who depend on it, you won't want to keep breaking their workflows frequently, or they'll be mad at you, rightly so. 

Sometimes there's no use, though. You just need to do a breaking change, be it removing a method or class that has become obsolete, or changing the signature of a function.

When you have to do something like this, a few things are advised.

### Gradually Deprecation

Adding a breaking change is something that you shouldn't take lightly because it can dramatically disrupt the workflow of your users. Also, don't do it all of a sudden, out of the blue, and in one step.

Before removing obsolete classes/methods/etc, first publicly announce you're doing so, several versions in advance. Then, you mark that artifact as deprecated somehow, but still don't remove it. For instance, in C# you can use the [Obsolete](https://learn.microsoft.com/en-us/dotnet/api/system.obsoleteattribute?view=net-9.0) attribute.

Then, after a few versions, you then finally do your breaking change.

### Add Instructions to Your Release Notes

If you're publishing software publicly for third-party use, you probably have some sort of release notes where you communicate what were the changes in this new version. Leverage that.

When it's time to actually publish a version with a breaking change, use your release notes to describe, in detail, what the change is and how it will affect your users.

Usually, when a breaking change consists of retiring a method/class/endpoint, it comes accompanied by a new way of performing the same thing. After all, you wouldn't be retiring the old way just because.

In those cases, also use your release notes to explain in detail how users can adapt their code to migrate from the old to the new way of doing the task.

### Use Semantic Versioning

Finally, use [Semantic Versioning](https://semver.org/) and use the version number to communicate that this is a breaking change, by releasing a major version.

Semantic Versioning (or SemVer for short) is a standard for versioning in which you use a version number in this format: major.minor.patch.

When your new version only contains bug fixes, and they don't add breaking changes, you increment the patch component. 

For instance:

```
2.0.0 -> 2.0.1
```

If the version contains new functionality that doesn't break compatibility, then you increment the minor component and reset the patch component:

```
2.0.1 -> 2.1.0
```

Now comes the most important part. When your version contains breaking changes, either cause by new functionality, bug fixes, or both, you increment the major number and reset the other two:

```
2.1.0 -> 3.0.0
```

That way, you clearly communicate to your users the presence or absence of breaking changes in your newest release.

## Conclusion

In this post, I explained the concept of a breaking change, why it's usually bad, and what to do about it. Quick recap:

* Breaking changes are changes that break the code of your users, in the context of software that is distributed to third-party users.
* Avoid adding breaking changes to your software, because they harm the experience of your clients.
* Sometimes you can't help but add a breaking change. In those cases, use gradual deprecation, communicate clearly what changed and how to adapt, and use semantic versioning.

I think that's all. Thanks for reading, I hope this has been useful and I'll see you again in the next installment of this series, in which I'll probably go back to letter A, because I'm just weird like that.
