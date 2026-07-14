---
title: "PostgreSQL LIKE Operator: A Detailed Guide"
ref: postgresql-like-operator-guide
lang: en
layout: post
author: Carlos Schults
canonical: https://coderpad.io/blog/development/postgresql-like-operator-a-detailed-guide/
description: "A detailed guide to the PostgreSQL LIKE operator, covering how it works, how it differs from ILIKE, and practical examples including wildcards, negative matches, and escaping."
permalink: /en/postgresql-like-operator-guide
tags:
- databases
- postgresql
- sql
- tutorial
---

{% capture content %}
*Editorial note: I originally wrote this post for the CoderPad blog.  You can [check out the original here, at their site]({{ page.canonical }}).*
{% endcapture %}
{% include callout.html type="info" title="Info"  content=content %}

When using databases, searching for values that match a given pattern is a familiar necessity. You might want to retrieve all students whose last name starts with a given letter or update all products whose ids include a particular string. If you're a PostgreSQL user, you will use the PostgreSQL `LIKE` operator for that.

If you want to learn more about PostgreSQL `LIKE`, you've come to the right place, since this post is all about this operator. By the end of the post, you'll have learned:

- what PostgreSQL `LIKE` does, and why you'd want to use it
- how it differs from the `LIKE` operators in different database engines
- how it differs from the `ILIKE` operator

To paraphrase that famous movie, though, only theory and no practice make this a dull post. So, before wrapping up, we'll walk you through several examples of the `LIKE` operator in practice.

**Requirements**

If you want to follow along with the practical portion of the post, keep in mind that the post assumes the following:

- there is a functional instance of PostgreSQL installed on your machine
- you can connect to the said instance through a client
- you have at least a bit of experience with the PostgreSQL database and the SQL language

**PostgreSQL `LIKE`: The Fundamentals**

With the requirements out of the way, let's start by covering some fundamentals about today's topic.

**What Is PostgreSQL `LIKE`?**

PostgreSQL `LIKE` is PostgreSQL's implementation of the `LIKE` operator from the SQL language. You use LIKE when you want to retrieve rows in which one or more of their textual columns match a given pattern. In the introduction, I gave an example: retrieving students whose last name starts with a given letter. So, let's see a real query that does just that using PostgreSQL `LIKE`:

```sql
SELECT id, first_name, last_name, email FROM students WHERE last_name LIKE 'M%';
```

The query above retrieves some columns from the `students` table, but only the rows which match the condition: the value from the `last_name` column has to start with the letter "M". There are some interesting points to notice from this first example:

- You use the `LIKE` operator in the `WHERE` clause of a query
- It goes on the same spot you'd put any comparison operator such as "==", ">", "<", and so on
- The percentage character (%) is used as a wildcard to match any number of characters

What if you wanted only students whose first name ended with a "k"? Simple, just swap the letter and the wildcard:

```sql
SELECT id, first_name, last_name, email FROM students WHERE first_name LIKE '%k';
```

Another example: let's match students whose email addresses contain the word "gmail":

```sql
SELECT id, first_name, last_name, email FROM students WHERE email LIKE '%gmail%';
```

That's right: if you want to match values that contain a given string, you surround the string with percentage signs (`%`).

**What Is the Difference Between LIKE and ILIKE in Postgresql?**

When reviewing PostgreSQL code in the wild, you might encounter queries that use the `ILIKE` operator instead of `LIKE` and get confused. The difference is that the `LIKE` operator is case sensitive—i.e. it distinguishes between lowercase and uppercase letters. On the other hand, the `ILIKE` operator is case _insensitive_—hence the i. It does not distinguish between upper and lowercase letters, and therefore you should use it when you don't care about the case.

An important thing to keep in mind: the `ILIKE` operator doesn't exist in ANSI SQL; instead, it's a specific extension of PostgreSQL. That means that employing ILIKE makes your SQL code less portable, in case you have the need to change your database engine.

**PostgreSQL Like: Practical Use Cases**

Having covered the basics of PostgreSQL `LIKE`, let's now see several usage examples. We'll begin by preparing the database for the tests.

**Preparing the Database**

Using your preferred client, connect to your PostgreSQL instance, making sure there's a database you can connect to for the tests.

Let's start by creating a table and inserting some rows into it:

```sql
CREATE TABLE albums (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(250) NOT NULL,
  artist          VARCHAR(250) NOT NULL,
  release_year int NOT NULL);

INSERT INTO albums (title, artist, release_year) VALUES('Abbey Road', 'The Beatles', 1969);
INSERT INTO albums  (title, artist, release_year) VALUES('Construção', 'Chico Buarque', 1971);
INSERT INTO albums  (title, artist, release_year) VALUES('The Dark Side of the Moon', 'Pink Floyd', 1973);
INSERT INTO albums  (title, artist, release_year) VALUES('Reckless', 'Bryan Adams', 1984);
INSERT INTO albums  (title, artist, release_year) VALUES('Ryan Adams', 'Ryan Adams', 2014);
```

**Matching a Single Character**

As you've seen, the table now contains albums by both Bryan and Ryan Adams. That's not by coincidence. First, use the following query to retrieve albums by the two singers:

```sql
SELECT * FROM albums WHERE artist LIKE '%yan%';
```

The query above matches all artists which contain the string "yan" anywhere in their name. Here's what the result looks like to me:

```
 id |   title    |   artist    | release_year 
----+------------+-------------+--------------
  4 | Reckless   | Bryan Adams |         1984
  5 | Ryan Adams | Ryan Adams  |         2014
(2 rows)
```

The `LIKE` operator offers an additional wildcard, the underscore character (_) which matches a single character. That way, it's possible to rewrite the query in such a way that only Ryan Adams is returned:

```sql
SELECT * FROM albums WHERE artist LIKE '_yan%';
```

And here, again, is the result:

```
 id |   title    |   artist   | release_year 
----+------------+------------+--------------
  5 | Ryan Adams | Ryan Adams |         2014
(1 row)
```

**Negative Matches**

When working with database tables, you often need to retrieve data that doesn't match a given pattern. For that, you can use the `NOT LIKE` operator. For instance, let's get only artists that don't start with "The":

```sql
SELECT * FROM albums WHERE artist NOT LIKE 'The%';
```

Since the only artist starting with "The" are The Beatles, they won't be fetched by the query above.

**Matching Without Case Sensitivity**

As mentioned earlier, the `ILIKE` operator is a special PostgreSQL extension to `LIKE` that matches in a case-insensitive way. Let's see that in practice. First, let's use the `LIKE` operator to get all artists which contain an uppercase "A":

```sql
SELECT * FROM albums WHERE artist LIKE '%A%';
```

Only "Bryan Adams" and "Ryan Adams" are returned, which makes sense:

```
 id |   title    |   artist    | release_year 
----+------------+-------------+--------------
  4 | Reckless   | Bryan Adams |         1984
  5 | Ryan Adams | Ryan Adams  |         2014
(2 rows)
```

Let's now replace the `LIKE` operator with the `ILIKE` one and rerun the query:

```sql
SELECT * FROM albums WHERE artist ILIKE '%A%';
```

```
 id |   title    |    artist     | release_year 
----+------------+---------------+--------------
  1 | Abbey Road | The Beatles   |         1969
  2 | Construção | Chico Buarque |         1971
  4 | Reckless   | Bryan Adams   |         1984
  5 | Ryan Adams | Ryan Adams    |         2014
(4 rows)
```

Now, all artists are returned, except for Pink Floyd.

**Escaping the WildCards**

For this example, let's update two rows:

```sql
UPDATE albums SET artist = 'The%Beatles' WHERE id = 1;

UPDATE albums SET artist = 'Chico_Buarque' WHERE id = 2;
```

Now, let's say we want to retrieve albums from artists whose name contains a percentage sign or an underscore:

```sql
SELECT * FROM albums WHERE artist LIKE '%%%';

SELECT * FROM albums WHERE artist LIKE '%_%';
```

As you've probably imagined, both queries don't work: they return all rows. Fortunately, there's a way around this problem: it's possible to escape a wildcard so we can use it as a normal character. You simply put a backslash before the offending character:

```sql
SELECT * FROM albums WHERE artist LIKE '%\%%';
```

And here's the result:

```
 id |   title    |    artist     | release_year 
----+------------+---------------+--------------
  1 | Abbey Road | The Beatles   |         1969
(1 rows)
```

The same would work for the underscore character. But before wrapping up, let's complicate things just a bit more—because, why not?

First, let's update the "Abbey Road" row once more:

```sql
UPDATE albums SET artist = 'The\Beatles' WHERE id = 1;
```

Now, in order to use LIKE to retrieve a row containing the backslash character, you'd have to write this query:

```sql
SELECT * FROM albums WHERE artist LIKE '%\\%';
```

You have to escape the escape character. It's not that terrible, but you might want to write a more readable version. If that's the case, it's possible to choose a different character as the escape character: just use the `ESCAPE` clause:

```sql
SELECT * FROM albums WHERE artist LIKE '%$\%' ESCAPE '$';
```

With the `ESCAPE` clause, you can choose a different character as the escape character. That way—at least in my opinion—the resulting query is more explicit in the way it escapes the wildcard.   

**Conclusion: PostgreSQL LIKE: Learn It, Leverage It**

In this post, you've learned about the LIKE operator in PostgreSQL: what it is, what's used for, and how it works along several examples. As you've seen, the operator's working is quite easy once you understand how the wildcards work. We've also walked you through some usage examples, like matching against a single character and performing negative matches.

Where should you go now?  For starters, continue to learn about pattern matching on PostgreSQL. Here are some topic suggestions for you:

- `SIMILAR TO`, a more recent clause
- the `substring()` function
- the `regexp_like()` function

Thanks for reading, and until next time!