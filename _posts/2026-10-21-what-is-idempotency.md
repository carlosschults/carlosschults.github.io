---
title: "What Is Idempotency?"
ref: what-is-idempotency
lang: en
layout: post
author: Carlos Schults
description: "Learn what idempotency means in software development: why it matters, common misconceptions, and how to implement it"
permalink: /en/what-is-idempotency
tags:
- from-a-to-z
- idempotency
- software-engineering
- distributed-systems
- best-practices
---

## Introduction

This post is part of a series in which I define important concepts in software development. The first post was about [breaking changes.](en/what-are-breaking-changes) This one is about **idempotency**.

Idempotency is a key concept for developers to understand, particularly if you live in the distributed systems space. Though it's a simple concept, there is some nuance to it, and there are common misconceptions people have. You will learn about some of those.

And when it comes to implementation, that's where things can get quite tricky. This post isn't a deep guide on implementation, but I'll talk briefly about it.


## What is idempotency?

In the simplest possible way, an operation is idempotent when you can execute it multiple times but its effects on the state of the system are the same as if it had been executed once.

Let's use a non-programming example to illustrate this. A while ago I was listening to the [Pragmatic Engineer Podcast episode with Sam Newman](https://www.youtube.com/watch?v=a0sZV0qIbI0)[^1]. He was talking about resiliency in distributed systems and, when asked to talk about idempotency, came up with a neat analogy.

If you press the "down" button to call the elevator, it becomes lit, but if you press it again and again, that causes no further changes in its state. It just stays lit. It's idempotent. On the other hand, most light switches are toggles. You press it, the light turns on. You press it again, the light turns off. They are not idempotent.

The classical programming example for idempotency is payment processing. Imagine you have an endpoint or microservice that processes payments. If, for some reason, it gets the same request twice, you shouldn't charge the customer twice. The service must be able to, somehow, deduplicate the request and only perform the side-effect once.

Idempotency, as a concept, applies to operations in general. For instance, SQL statements. A DELETE statement is naturally idempotent. Run `DELETE FROM users WHERE id = 5`, and there is no user with id 5. Run it again, and there is still no user with that id. That's idempotent.

An INSERT statement is typically not idempotent. Run it twice and you end up with two rows. The UPDATE statement might or might not be idempotent. Setting a column to a specific value is idempotent, while incrementing it based on the previous value is not.

```sql
UPDATE account SET balance = 4000 -- idempotent
UPDATE account SET balance = balance + 500 -- not idempotent
```

## Intended vs incidental effects

It's crucial here to make a distinction between intended and incidental effects in state. When it comes to idempotency, we typically care about the intended changes to the state of the server or system.

For instance, the payment processing endpoint above probably generates log entries for each request. This is certainly a change in state, and a side-effect. But when evaluating idempotency, logging and things like that are considered incidental effects, and we only care about the main end-goal of the operation.


## Why does idempotency matter?

I hope it became clear why idempotency is desirable, after the payment example. That's because often requests/messages can arrive more than once, and that could result in some serious side effects—a credit card being charged, a shipment being booked—happening more than once.

But why is it that messages can be duplicated? Why can't systems get their stuff together and just send one request?

I'll answer with more examples.


### Endpoints

Let's say you are posting to an endpoint that causes a side effect. What are some of the possible scenarios?

* You get back a 2xx success code, with the expected response. Everything is fine, you move on with your life.
* You get a 400 BAD REQUEST. Something isn't right with your request, go fix your code.
* 401 UNAUTHORIZED? Bad API key, expired token, etc. Again, go fix it.

The scenarios above are all clear. For the 2xx scenario, you know for sure that it worked, and for the other two, you know for sure it didn't work and you need to fix something.

Let's say now you got a 500 INTERNAL SERVER ERROR. You know this means something is wrong on their side and there is nothing you could reasonably do, except wait for some time and try again. Can you know for sure if it's ok to retry, though? The side-effect might have happened by the time their code reached the point where it broke.

What if you never get anything back? At some point your connection will time out, then what? How can you know if the intended effect was actually performed server side?

At the end of the day, when it comes to communicating over a network, there is an intrinsic ambiguity you can't escape. Sometimes, you simply can't know whether the side-effect has been performed or not. You have to retry.

The consequence of that is that the endpoint you're using needs to be friendly to retries. To be safe, it should assume by default that the same request can arrive multiple times, and then deduplicate them on their side.


### Asynchronous services

When it comes to message brokers, the duplication problem can also happen. If a consuming application reads a message from a queue or subscription, performs the work that generates a side-effect, and then crashes before acknowledging, the broker will deliver the message again.

Duplications can also start on the producer side. Imagine an endpoint which, when it gets a certain request, adds some data to its database and then publishes an event on a message bus, so that subscribers can react to it.

In a scenario like this, you need the database write and the message publishing to be atomic. That is to say, either both succeed or both fail. Otherwise you can find yourself in a situation where an event happened and you told no one, or you told everybody about an event that didn't happen.[^2]

One of the most well known approaches to solve that is the outbox pattern. Basically, you add a row both to the business table and to an outbox table, in a single transaction. A worker service then processes the outbox table, publishing its rows as messages and marking the rows as processed.

But what if the worker publishes the message to the bus and then fails to flip the processed flag? It will retry at a later moment and publish the same message again.

So, as you can see, the intrinsic ambiguity of communicating over the network makes guaranteeing exactly-once delivery generally out of reach. By implementing the outbox pattern and making sure the consumer services are idempotent we ensure effectively-once processing which is a powerful guarantee nonetheless.


## Common misconceptions

It's somewhat easy to mix up idempotency with other concepts, especially when you're first learning about it. Also, it doesn't help when people use the term as if it were interchangeable with terms like "safe", "readonly", etc, even if they know it's not. Semantic diffusion is a thing, after all.[^3]

Let's clarify some of those misconceptions now.


### Idempotent != Safe

First of all, "safe" here means something that doesn't cause effects to the state of the system. It's important to point out that here we're only talking about effects that the caller cares about. There could still be incidental changes, such as logs being generated. But the caller probably doesn't know and doesn't care about those effects, and from their point of view the call is essentially read-only.

People often use idempotent when they mean safe, which isn't accurate.

Not all idempotent operations are safe. Creating/updating/deleting a resource, requesting a payment processing, scheduling a shipment, all of these cause an observable effect to happen in the state of the system. They aren't safe, but could be idempotent, if implemented to be so.

However, all safe operations are by definition idempotent.


### Idempotent != "The response is always the same"

If you run a delete statement to delete the user with id 5, you'll get a result back saying "1 row affected", or something to that effect, depending on your choice of relational database system and client. If you run the same delete statement again, you'll then get back "0 rows affected", which makes sense.

The same could be true when using the DELETE method on a REST endpoint. The first time, you actually delete the resource and get back, typically, a 204 No Content. What about the second time? API designers don't always agree, but it'd be reasonable to return 404 Not Found. Because now the resource no longer exists, thus 404 makes semantic sense.

Both the SQL statement and the API endpoint are perfectly idempotent if we consider idempotent to be about state changes. The fact that they returned different responses doesn't change that.


### The HTTP verb doesn't guarantee idempotency

You might find people equating certain HTTP verbs/methods to idempotency or non-idempotency. "GET is always safe and idempotent", "POST is never idempotent", and so on. Things are more nuanced than that.

To clarify misconceptions, I always prefer to go to the most authoritative source I can find about the subject. Regarding the semantics of HTTP methods, this source is RFC 9110.[^4]

Here's what the document says about safe methods:

> Request methods are considered "safe" if their defined semantics are essentially read-only; i.e., the client does not request, and does not expect, any state change on the origin server as a result of applying a safe method to a target resource. Likewise, reasonable use of a safe method is not expected to cause any harm, loss of property, or unusual burden on the origin server.

A few paragraphs down, it goes on to say that the GET, HEAD, OPTIONS, and TRACE methods are safe.

Here's what it says about the idempotent methods:

> A request method is considered "idempotent" if the intended effect on the server of multiple identical requests with that method is the same as the effect for a single such request. Of the request methods defined by this specification, PUT, DELETE, and safe request methods are idempotent.

Those statements do not mean that those methods are idempotent and/or safe automatically. There's nothing stopping you from writing a GET endpoint which mutates state, or a DELETE one which, let's say, deletes random resources other than the one you intended to delete. Doing those things would be terrible, but it's not like the REST police is going to arrest you.

The HTTP semantics defined by the RFC are about the intended results of using those methods. The developer still must be responsible for implementing those correctly. The RFC even goes on to say:

> This definition of safe methods does not prevent an implementation from including behavior that is potentially harmful, that is not entirely read-only, or that causes side effects while invoking a safe method.

And the opposite of that is also true. By the RFC, POST isn't considered an idempotent method. But you can make it idempotent and communicate that clearly to your API's users, so they know that operation is friendly to retries.


## How to implement idempotency

Astute readers will have noticed that I've been talking about "the same request" without defining what that means. Also, when talking about microservices and the outbox pattern, I said that the consumers must be able to handle duplicate requests, without ever explaining how they detect a duplication.

Back to the original payment processing example, how do we distinguish between a duplicated request or a customer legitimately making a new purchase with the same value?

The typical solution for this is an idempotency key. This is a unique id the client/caller generates and attaches to every request. If a request must be retried, the same idempotency key is used.

When the endpoint gets a request, the code looks into the database to check if that particular key has already been processed.

If it hasn't, then the application goes on to process the payment and return the appropriate response. But if the idempotency key has already been processed, then the code does not process payment again. That way, from the caller's point of view, the process just works, transparently, regardless of whether it's the first or nth time the same request is being processed.

In order for the caller to handle things seamlessly, many implementations will store and replay the exact original response. Think of this practice as a "courtesy" to the caller: it makes their life easier, but it isn't a requirement for making something idempotent.


## Conclusion

This was a quick introduction to idempotency. Here are the main takeaways I'd like you to remember:

* An operation is idempotent when you can execute it multiple times, and the intended effects on state will be the same as if it had been executed only once
* Idempotency is necessary to make operations retry-friendly, since you often find yourself in situations where you would like to retry but the intended side-effect might have already happened
* HTTP methods don't guarantee idempotency. This is something that the application developer needs to implement on their own
* Exactly-once delivery is typically impossible to achieve in a distributed setting, but with idempotency keys and idempotent consumers, you can achieve effectively-once processing
* There are operations which are "naturally" idempotent, such as DELETE statements, while others can be made idempotent if you choose so

I've also explained briefly the implementation of idempotency for backend code. That was much simplified, so don't just assume what you've seen here is production-ready. Here's a list of the main points missing:

* What should you do with a request with an already used key, but different payload?
* How to handle race conditions with two concurrent requests?
* What if the application crashes mid-request?

Thankfully, these topics are well documented online. In particular, search for [Stripe's articles on idempotency](https://stripe.com/blog/idempotency). Stripe is a leading payment processor and their implementation has been considered the industry's reference for a while.

Thanks for reading.

[^1]: Sam Newman is a thought leader in the distributed services space, author of the [Building Microservices book](https://samnewman.io/books/building_microservices_2nd_edition/), among others.
[^2]: This problem is known as the dual write problem. That is, how to write to two independent targets—a database and a messaging bus, in our example—in an atomic way.
[^3]: "Semantic Diffusion" is the phenomenom of jargon/terms losing their meaning over time. Martin Fowler [wrote about it](https://martinfowler.com/bliki/SemanticDiffusion.html).
[^4]: RFC stands for "Request for Comments", a type of publication from the Internet Engineering Task Force (IETF) that defines standards and protocols for the internet. [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) specifically covers HTTP semantics.