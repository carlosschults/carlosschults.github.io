---
title: Value and reference types in C#, Part 2 - Why can't a DateTime be null?
ref: types2
lang: en
layout: post
author: Carlos Schults
permalink: /en/value-reference-types-in-csharp-part-2/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1466341001/csharp-min_buiizq.png
tags:
- csharp
- beginners
- oop
- type-system
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1466341001/csharp-min_buiizq.png)

"Why is not allowed to assign `null` to a DateTime?" Again and again, this question keeps showing up on StackOverflow and similar sites. Different phrasing, maybe a different type [("Why type “int” is never equal to 'null'?")](https://stackoverflow.com/questions/6191339/why-type-int-is-never-equal-to-null), but the same question, in essence. Which is only natural, considering that probably thousands of developers join the field every year.
<!--more-->

The short answer is: because DateTime/int/float/whatever is a **value type**, and value types can never be `null`. Only reference types can be `null`.

That's great but...why???

I mean, at some point, the C# designers had to make that call. They deliberately decided that `null` can't be assigned to a value type. Is there something intrinsic to value types that prevent them from being `null`? Maybe it has something to do with the stack and the heap? 

Well, I think before we try to answer those questions, it'd be helpful to get a step back and think about other question.

## What exactly is 'null'?

You probably think of `null` as a way to represent a missing piece of information. Something that is unknown, absent or irrelevant. Maybe a piece of information that isn't where it's supposed to be *yet*, but it might be in the future.

[In the previous post about reference and value types](https://carlosschults.net/en/value-reference-types-in-csharp/), we learned that a variable of a reference type **contains a reference that points to an instance of that type**. But when `null` is assigned to the variable, what does the variable contain? Nothing?

Not exactly. Even though `null` basically means nothing, this "nothing" has to be represented in some way in the machine's memory.

In C#, the `null` keyword represents a **null reference**, which is a reference that doesn't point to any object. 
In practice, the `null` value is represented as all zero bits.

Of course, this is just an implementation detail. It could be implemented in different ways, so this isn't really relevant for us. What you need to understand is, you need something to represent nothing. You need some kind of special value that means "this value is missing" or "this value is unknown".

Once you understand this, it becomes easier to see what the problem is with value types.

## How would you represent null for a value type?

To understand why would be complicated to represent `null` using a value type, you must bear in mind that value types usually have a range of possible values that they're able to represent.

It's easier to get this with an example. So, consider the [byte](https://msdn.microsoft.com/pt-br/library/system.byte%28v=vs.110%29.aspx) value type.

This type can represent one byte of possible values. Since 2^8 = 256, it can represent 256 values. It is also unsigned, meaning it can only represent values greater than or equals to zero. Thus, the range of possible values that the byte type can represent is **0 to 255.**

    00000000 => 0
    00000001 => 1
    00000010 => 2
        .        .
        .        .
        .        .
    11111111 => 255

Now comes the tricky part. If the C# language designers wanted the byte type to be nullable, they'd have to pick a value from the range and elect it as the `null` value. Let's imagine they picked zero as the `null` value for `byte`. If that was the case, **we wouldn't be able to use zero as a valid value never again!** 

That's the whole point: for value types to be nullable, it is necessary to sacrifice one of the possible values of the range to represent the `null` value.

Jon Skeet, author of C# In Depth, puts it better than me:

 > You've got to be able to store the values 0-255 in that variable; otherwise it's useless for reading arbitrary binary data. With the 256 normal values
and one `null` value, you'd have to cope with a total of 257 values, and there's no way of squeezing that many values into a single byte. 
>
The designers could've decided that every value type would have an extra flag bit somewhere determining whether a value was `null` or contained real data, but the memory usage implications 
are horrible, not to mention the fact that you'd have to check the flag every time you wanted the use the value.

So, there is nothing **in principle** that prevents value types from being `null`. It'd just be so complicated that  the C# designers considered that the benefits of doing so don't outweigh the costs.

## But I really want/need a nullable value type. What can I do?

You now hopefully understand the complications involved in representing `null` for a value type, and why the C# developers decided against it. But, what if you really need to do this? One common scenario is when you're fetching data from a relational database. What should you do?

Well, thankfully, there's an easy solution. Even though "normal" value types can't be ``null``, C# 2 introduced the Nullable<T> structure, which allows you to assign `null` to pretty much anything. 

I'll talk about nullable types in the next article. As a bonus, you'll learn a bit about another nice feature called *generics*.

Stay tuned!
