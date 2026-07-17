---
title: Value and reference types in C#
ref: types
lang: en
layout: post
author: Carlos Schults
permalink: /en/value-reference-types-in-csharp/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1466341001/csharp-min_buiizq.png
tags:
- csharp
- beginners
- oop
- type-system
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1466341001/csharp-min_buiizq.png)

This is my first "real" post here on my blog, and I decided to talk about value types and reference types. This is somewhat of a basic subject, in the sense that it is something that you should already know if you write C# code for a living.But at the same time, it can be a little non-intuitive if you're not an experienced developer.
<!--more-->
I'll try to make this as simple and short as possible, so I won't talk about string immutability, boxing, unboxing, and some other things with fancy names.
I'll write about those in the future, but for today let's focus on the basics.

So, take a look at the following piece of code.

{% highlight c# %}
    int x = 10;
    int y = x;
    y++;
    Console.WriteLine($"The value of x is {x}"); // Outputs "The value of x is 10"
    Console.WriteLine($"The value of y is {y}"); // Outputs "The value of y is 11"
{% endhighlight %}

No surprises here, cause this is the exact behaviour you'd expect.<br />
Now, suppose we have a class like this:

{% highlight c# %}
    public class Person
    {
        public string Name { get; set; }
        public string Profession {get; set; }

        public Person(string name, string profession)
        {
            Name = name;
            Profession = profession;
        }

        public void SayHello()
        {
            Console.WriteLine($"Hello! My name is {Name} and I'm a {Profession}");
        }
    }
{% endhighlight %}

Now, you do this:<code> </code>

 {% highlight c# %}   
    var person = new Person("Mary", "programmer");    
    person.SayHello(); // outputs "Hello! My name is Mary and I'm a programmer"
    var person2 = person;
    person2.Name = "John";
    person2.Profession = "musician";    
    person2.SayHello(); // outputs "Hello! My name is John and I'm a musician "  
    person.SayHello();   // outputs "Hello! My name is John and I'm a musician " 
{% endhighlight %}

Now is the time when beginners sometimes get confused. "This doesn't make sense", they say. "I've changed the value of one of the variables, and the other also changed."

Well, that is the wrong way to look at it. As it turns out,**you didn't really change the value of the variable**, in this case. And that's the point.

Remember the first example? Let's take a look at it again, this time step by step:

<img alt="The figure show a sample of C# soure code, in which a variable is being declared and assigned the value 10" src="https://res.cloudinary.com/dz5ppacuo/image/upload/v1454161625/fig1_czxki5.png" style="height:158px; width:250px" />

We declare the first variable and assign the value 10 to it. Now, somewhere inside the computer's memory, there is a "box" labeled "x" which holds the value 10.

<a href="#"><img alt="The image show a sample of C# code, in which a variable y is being declared, and the value of x is assigned to it." src="https://res.cloudinary.com/dz5ppacuo/image/upload/v1454161628/fig2_m1gxsd.png" style="height:179px; width:250px" /></a>

We declare the second variable and assign the value of the first variable to it. Notice that the value is copied from x to y. Now we have two boxes, one labeled x, the other labeled y, and both of them hold the value 10.

<a href="#"><img alt="The image show a sample of C# code, in which a variable y gets incremented by 1." src="https://res.cloudinary.com/dz5ppacuo/image/upload/v1454161625/fig3_esck9i.png" style="height:172px; width:250px" /></a>

Finally, we increment the value of the variable y by 1. Notice that the value of x remained unchanged. Of course, because <strong>they have nothing to do with each other! </strong>

On the other hand, something very different happens when you're dealing with reference types. To understand that, let's review the second example, step by step:

<a href="#"><img alt="The image show a sample of C# code, in which a variable is assigned a new instance of the Person class" src="https://res.cloudinary.com/dz5ppacuo/image/upload/v1454161628/fig4_kxmmuk.png" style="height:257px; width:600px" /></a>

First, we create a variable called person and assign to it a new instance of the Person class. Now, somewhere inside the computer's memory, we have a box called "person". Notice, however, that our variable person stores <strong>a reference that points to the instance of Person, instead of storing the instance itself!</strong>

<a href="#"><img alt="The image show a sample of C# code, in which a variable person2 is created and receives the value of the variable person." src="https://res.cloudinary.com/dz5ppacuo/image/upload/v1454161623/fig5_aznix0.png" style="height:340px; width:600px" /></a>

In the second step, we create a variable called person2 and assign the value of the variable person to it. As in the previous example, the value from one variable is copied to the other. In this case, <strong>the value that is copied is the reference that points to the instance</strong>. So now we have two variables whose values are references that point to the same instance of Person.

Now, of course when you change the object's data (e.g. alter the person's name and/or profession), it seems that the two variables were altered. In fact, the variables's values remain exactly the same: what was really changed was the object to which they point to.

So, we could summarize that way: value types store data. When you assign the value of a value type variable to another, what gets copied is the data itself (like an integer, for example).<br />
This is similar to when you copy a file from one folder and paste it somewhere else. You made a copy, but from now on, they are independent files and have nothing to do with each other.

Reference types store a reference, that points to the data, which lives somewhere else in the machine's memory. When you assign the value of a reference type variable to another, what gets copied is the reference.It can be useful to think of them as shortcuts to files. If you have one or more shortcuts that point to a particular file, when you make changes in the original file, those changes will be visible through the shortcuts. Because they're just that, shortcuts.

## Which types are value types? ##

According to MSDN, the value types are:

- All numeric data types
- Boolean, Char, and Date
- All structures
- Enumerations

## Which types are reference types? ##

Again, acording to MSDN:

- String
- All arrays
- Classes
- Delegates

## Wait a minute! String is a reference type?! ##

Maybe you're surprised to see String listed as a reference type. After all, it seems to behave as a value type. 
Well, the reason for this is because String is an **immutable type**. As I said, I won't talk about this today, but soon we'll have a post all about System.String.

OK, that's it for today. I hope you guys enjoyed this post, and I'd love to hear your feedback.Have I expressed myself clearly enough? Have I said something innacurate - or even flat-out wrong?
Let me know in the comments, or [reach me on twitter](https://twitter.com/carlosschults).

## References: ##

- [https://jonskeet.uk/csharp/references.html](https://jonskeet.uk/csharp/references.html)
- [https://msdn.microsoft.com/en-us/library/t63sy5hs.aspx](https://msdn.microsoft.com/en-us/library/t63sy5hs.aspx)
