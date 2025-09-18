---
layout: post
title: "Java Collections - Converting to Arrays"
date: 2010-11-22 14:34:00
description: "This post explains how to convert Java Collections to typed arrays using the Collection.toArray(T[] a) method, avoiding explicit casting."
tags: java, collections, arrays, programming
categories: java-concepts
---

Often, you need to create dynamic data structures that hold data and then convert them into arrays.

The `Collection` interface possesses the method `T[] toArray(T[] a)`. We can use this method to convert a list or other collection into an array.

By default, the `toArray()` method returns an `Object` array (`Object[]`). If this is not what you want and you know the specific type of the array, you can provide your desired type to avoid explicit casting.

To achieve this, you need to provide the array type and an instance of that array type, like so:

```java
List<String> list = new ArrayList<String>();
String[] stringList = (String[]) list.toArray(new String[list.size()]);
```

Please see more details in the [Java API documentation](<http://download.oracle.com/javase/1.5.0/docs/api/java/util/Collection.html#toArray(T[])>) for `Collection.toArray(T[] a)`.
