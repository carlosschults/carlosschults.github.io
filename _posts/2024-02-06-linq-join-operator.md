---
title: "The LINQ Join Operator: A Complete Tutorial"
ref: linq-join-operator
lang: en
layout: post
author: Carlos Schults
description: LINQ provides a fluent, intuitive and consistent way to query data sets. See how LINQ join operations simplify queries on multiple data sets.
permalink: /en/linq-join-operator
canonical: https://stackify.com/the-linq-join-operator-a-complete-tutorial/
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1617641333/reduce-cyclomatic-complexity/reduce-cyclomatic-complexity-1038x437.jpg
tags:
- csharp
- linq
- dotnet
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1617641333/reduce-cyclomatic-complexity/reduce-cyclomatic-complexity-1038x437.jpg)

*Editorial note: I originally wrote this post for the Stackify blog.  You can [check out the original here, at their site]({{ page.canonical }}).*

I think most C# developers would agree that LINQ is an integral part of the experience of writing code with the language. LINQ provides a fluent, intuitive, and consistent way to query data sets. In this post, we’ll help in your LINQ-mastering quest by covering the LINQ join operator.

We’ll start the post with a definition of LINQ itself, so we’re all on the same page. After that, you’ll see an explanation of join operations in LINQ. Then, it’s time to roll up your sleeves and get practical with our hands-on guide to the join operator.

Let’s get started.

## What is LINQ?

[LINQ](https://learn.microsoft.com/en-us/dotnet/csharp/linq/) stands for Language Integrated Query. It’s a C# feature that offers a unique and consistent syntax for querying datasets, regardless of their origin. The main benefit of LINQ is that you can use the same syntax to query data in memory, from a database, XML files, and so on.

LINQ is available in two different flavors, the query syntax and the method syntax.

The query syntax leverages special keywords to create a syntax that is familiar to anyone who’s worked with SQL. Here’s an example that queries a sequence of numbers, filtering the ones greater than 5:

{% highlight c# %}
int[] numbers = { 2, 8, 4, 9, 3, 6, 1, 7, 5 };
var largerThanFive =
    from num in numbers
    where num > 5
    select num;
{% endhighlight %}

The method syntax allows you to use extension methods to perform the same query:

{% highlight c# %}
int[] numbers = { 2, 8, 4, 9, 3, 6, 1, 7, 5 };
var largerThanFive = numbers.Where(x => x > 5);
{% endhighlight %}

## What is The LINQ Join Operator?

When working with data, a common scenario is having two data sources that you want to combine based on some criteria. For instance, you might have a Books table and an Authors table in your database, with a one-to-many relationship between them—i.e., an author can author many books, but each book has only one author. If you need to compile a list of books containing their author’s name, you’d need to perform a join in order to match each line from the Books table to its counterpart in the Authors table.

A join in LINQ is essentially the same: an operation where you can merge two collections according to some criteria you define.

## The LINQ Join Operator in Practice-

Examples always make things clearer. So, let’s see how to use the join operator in practice.

### **Starting With a Problem**

Let’s say you have an e-commerce application with some data on categories:

|Id |Name       |
|---|-----------|
|1  |Electronics|
|4  |Toys       |
|5  |Stationery |
|7  |Books      |
|10 |Clothes    |


Okay, now let’s have some products:


|Id |Name               |Category_Id|
|---|-------------------|-----------|
|1  |Amazon Kindle      |1          |
|2  |Refactoring        |7          |
|3  |C# in Depth        |7          |
|4  |Legal Pad 50 sheets|5          |


You can see where this is leading, right? The next thing you’d want to do is to produce a single collection, having the list of products and the names of the categories they belong to. In other words, a view like this:


|Id |Name               |Category   |
|---|-------------------|-----------|
|1  |Amazon Kindle      |Electronics|
|2  |Refactoring        |Books      |
|3  |C# in Depth        |Books      |
|4  |Legal Pad 50 sheets|Stationery |


### Solving The Problem: Performing a LINQ Inner Join

What would that operation look like in code? First of all, we need code to represent our categories and products. Thanks to C#’s record feature, two lines of code suffice for that:

{% highlight c# %}
public record Product(int Id, string Name, int CategoryId);
public record Category(int Id, string Name);
{% endhighlight %}


Now, let’s have a list of each type:

{% highlight c# %}
var categories = new List<Category>
{
    new Category(1, "Electronics"),
    new Category(4, "Toys"),
    new Category(5, "Stationery"),
    new Category(7, "Books"),
    new Category(10, "Clothes")
};

var products = new List<Product>
{
    new Product(1, "Amazon Kindle", 1),
    new Product(2, "Refactoring", 7),
    new Product(3, "C# In Depth", 7),
    new Product(4, "Legal Pad 50 Sheets", 5),
    new Product(5, "Surgical Gloves", 12)
};
{% endhighlight %}


As you can see, the list of products has an additional product (surgical gloves) whose category id doesn’t match any of the available categories. Keep this in mind; it’ll be relevant in a moment.

Now, let’s write code to perform this join. I’ll show the code in one go and then explain it:

{% highlight c# %}
var query =
    from p in products
    join c in categories
    on p.CategoryId equals c.Id
    select new
    {
        Id = p.Id,
        Name = p.Name,
        Category = c.Name
    };

foreach (var line in query)
{
    Console.WriteLine(line);
}
{% endhighlight %}

Now, the explanation:

*   **from p in products** -> we’re defining the origin of one of our data sources
*   **join c in categories** -> Here, we’re saying that we want to join the previous collection with this one
*   **on p.CategoryId equals c.Id** -> This is the condition for the join: the CategoryId on each product should match the Id of a category
*   **select new…** \-> Here, we’re leveraging C#’s anonymous objects feature to create a new object on the fly, which has the properties we want

The result of this query is an `IEnumerable` of our anonymous object. We then iterate through each item of this collection, displaying it on the console. This is the result:
`
```
{ Id = 1, Name = Amazon Kindle, Category = Electronics }
{ Id = 2, Name = Refactoring, Category = Books }
{ Id = 3, Name = C# In Depth, Category = Books }
{ Id = 4, Name = Legal Pad 50 Sheets, Category = Stationery }
```

Those of you who remember your databases will notice that the LINQ join we performed is the equivalent of an inner join in SQL. In other words, only items that have a match are returned. In SQL, the equivalent query would look like this:

{% highlight sql %}
SELECT p.Id, p.Name, c.Name AS Category
FROM products AS p
JOIN categories AS c ON p.CategoryId = c.Id
{% endhighlight %}


### Performing a LINQ Outer Join

What if you wanted to perform the equivalent of a SQL outer join? That is, you want to retrieve all products, even the ones that don’t match any category. How to go about that?

Here’s the updated query:

{% highlight c# %}
var query =
    from p in products
    join c in categories
    on p.CategoryId equals c.Id into joinedCategories
    from c in joinedCategories.DefaultIfEmpty()
    select new
    {
        Id = p.Id,
        Name = p.Name,
        Category = c?.Name
    };
{% endhighlight %}


  It looks similar, but there are two differences:

*   **on p.CategoryId equals c.Id into joinedCategories** \-> here, after joining products with categories, we send the result, as a grouped sequence, to the **joinedCategories** range variable
*   **from c in joinedCategories.DefaultIfEmpty()** -> Then, we retrieve items from the groupedSequence, using the DefaultIfEmpty() method to return the default value when no matches are found
*   **Category = c?.Name** -> Finally, when assigning the category name to the Category property on our anonymous object, we have to use the null-conditional operator in order to avoid a null-reference exception (since the default value for Category is null because it’s a [reference type](https://carlosschults.net/en/value-reference-types-in-csharp/).)

The result is now different:

{% highlight json %}
{ Id = 1, Name = Amazon Kindle, Category = Electronics }
{ Id = 2, Name = Refactoring, Category = Books }
{ Id = 3, Name = C# In Depth, Category = Books }
{ Id = 4, Name = Legal Pad 50 Sheets, Category = Stationery }
{ Id = 5, Name = Surgical Gloves, Category =  }
{% endhighlight %}

As you can see, the “Surgical Gloves” product now appears, even if it doesn’t have a matching category.

### LINQ Inner Join With Where Condition

Performing a join with a where clause is quite easy. In this example, we’ll perform an inner join, filtering only the products whose id are equal to or greater than 3:

{% highlight c# %}
var query =
    from p in products
    where p.Id >= 3
    join c in categories
    on p.CategoryId equals c.Id
    select new
    {
        Id = p.Id,
        Name = p.Name,
        Category = c.Name
    };
{% endhighlight %}

### LINQ Inner Join With Multiple Conditions

If you want to use multiple conditions within your join, you can simply use more than one where clause. Let’s update our query once again:

{% highlight c# %}
var query =
    from p in products
    join c in categories
    on p.CategoryId equals c.Id
    where p.Id >= 3
    where c.Name.EndsWith('s')
    select new
    {
        Id = p.Id,
        Name = p.Name,
        Category = c.Name
    };
{% endhighlight %}

Here, we’re filtering only categories whose names end with the letter s.

### LINQ Join With Composite Key

Up until now, all of our examples have used single keys to perform the matching. You can also use composite keys—that is, more than one value—for the matching.

Suppose both our Product and Category classes gained a new property called Status, which is an enum that can vary between three states: Pending, Active, and Archived. Now, the Status property also needs to be used for the match.

All of our products are active, but not all of the categories:

{% highlight c# %}
var categories = new List<Category>
{
    new Category(1, "Electronics", Status.Active),
    new Category(4, "Toys", Status.Active),
    new Category(5, "Stationery", Status.Archived),
    new Category(7, "Books", Status.Pending),
    new Category(10, "Clothes", Status.Active)
};

var products = new List<Product>
{
    new Product(1, "Amazon Kindle", 1,  Status.Active),
    new Product(2, "Refactoring", 7,  Status.Active),
    new Product(3, "C# In Depth", 7,  Status.Active),
    new Product(4, "Legal Pad 50 Sheets", 5,  Status.Active),
    new Product(5, "Surgical Gloves", 12,  Status.Active)
};
{% endhighlight %}


This is what our updated query looks like now:

{% highlight c# %}
var query =
    from p in products
    join c in categories
    on new { Id = p.CategoryId, Status = p.Status }
    equals new { Id = c.Id, Status = c.Status }
    select new
    {
        Id = p.Id,
        Name = p.Name,
        Category = c.Name
    };
{% endhighlight %}

It’s not much more complicated than before. The difference is that now, we use an anonymous object to perform the comparison using both the id and the status properties.

A single result is displayed from this query:

{% highlight c# %}
{ Id = 1, Name = Amazon Kindle, Category = Electronics }
{% endhighlight %}


## Conclusion

As we’ve seen, LINQ is an essential part of working with C#. You can leverage LINQ in many different scenarios, from working with data in memory to XML to SQL. You can use LINQ in ORMs such as [NHibernate and Entity Framework.](https://stackify.com/entity-framework-core-nhibernate/)

Teams that wish to make their LINQ experiences even better can use the tools at their disposal. For instance, [Stackify’s Prefix](https://stackify.com/prefix/) and [Retrace](https://stackify.com/retrace-code-profiling/) offer powerful capabilities of tracing, profiling, and centralizing logging that helps teams inspect their code to find opportunities for performance improvements, which includes LINQ queries.
