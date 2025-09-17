```
---
layout: post
title: Introduction to Java 8 Stream API
date: 2015-07-25 15:16:00
description: An overview of the Java 8 Stream API, covering its definition, core characteristics like pipelining and internal iteration, and the distinction between intermediate and terminal operations, alongside its benefits for collection processing.
tags: java, java8, streams, api, functionalprogramming, collections
categories: java-concepts
---

## Introduction

Every application creates and processes collections. In Java, until recently, if you wanted to perform "finding" or "grouping" operations on collections, you had to code it yourself. This was often unexciting and repetitive by nature. **Groovy**, for example, offers great tools for transforming and managing collections. Check this [link](http://www.javaworld.com/article/2074145/core-java/ten-groovy-one-liners-to-impress-your-friends.html) for some great examples. Java 8 borrows some concepts from Groovy, but also goes one step further with **multi-core processing** and **stream** concepts.

In SQL, you don't need to implement *how* to calculate grouping or other operations; you simply describe your expectation (what you want to achieve). The Stream API in Java 8 is guided by the same philosophy.

## What is a Stream?

A stream is basically a sequence of elements from a source that supports aggregate operations. Let's break down this statement:

*   **Sequence of elements:** A stream provides an interface to a sequenced set of values. Implementations of this interface do not store values; values are calculated at runtime.
*   **Source:** This is where values are stored, such as collections, arrays, or I/O channels.
*   **Aggregate operations:** These include common SQL-like operations (group, count, sum) and functional programming language constructs (filter, map, reduce, find, match, sorted).

Streams also have two fundamental characteristics:

*   **Pipelining:** This allows operations on a stream to be chained into a large pipeline.
*   **Internal iteration:** While collections are iterated externally (explicit iteration), streams handle the iteration behind the scenes.

**Streams are not collections**! In a nutshell, collections are about data, and streams are about computations. The fundamental difference between collections and streams lies in when elements are computed. Every element in a collection must be computed before it can be added. In contrast, a stream is a conceptually fixed data structure where elements are computed on demand. **For example, in the following example, no work is actually done until `collect` is invoked**:

```java
List<Integer> numbers = Arrays.asList(1, 4, 1, 4, 2, 8, 5);
List<Integer> distinct = numbers.stream().map( i -> i*i).
      distinct().collect(Collectors.toList());
System.out.printf("integers: %s, squares : %s %n", numbers, distinct);
```

There are two types of stream operations:

*   **Intermediate:** These operations can be connected together because their return type is a `Stream`.
*   **Terminal:** These operations produce a result from a pipeline, such as a `List`, an `Integer`, or even `void` (any non-`Stream` type).

Intermediate operations do not perform any processing until a terminal operation is invoked on the stream pipeline; they are considered **lazy**.

Streams also utilize **short-circuiting**, where only part of the stream needs to be processed, not the entirety, to return a result. This is similar to evaluating a large Boolean expression chained with the `and` operator.

This was just a high-level overview without detailed examples of the Stream API. It is easy to find examples on other sources like [here](http://java67.blogspot.sk/2014/04/java-8-stream-api-examples-filter-map.html). In my opinion, the Stream API is a great and refreshing new feature in Java 8, especially with its lazy, short-circuiting, and multi-core features.
```