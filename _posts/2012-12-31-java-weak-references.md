---
layout: post
title: Java Reference Types - Strong, Weak, and Soft References
date: 2012-12-31 16:06:00
description: An overview of different reference types in Java, including strong, weak, and soft references, explaining their behavior with the garbage collector and common use cases like caching.
tags: java, references, garbage-collection, jvm, programming
categories: java-concepts
---

## Strong Reference

A strong reference is an ordinary Java reference. Typically, Java references are implemented as pointers, though this is not strictly required by the language specification. They might use an additional layer of indirection to facilitate garbage collection. References interact with the garbage collector. Specifically, if an object is reachable via a chain of strong references (i.e., it is strongly reachable), it is not eligible for garbage collection. This is usually the desired behavior.

## Weak Reference

One problem with strong references is caching, particularly with very large structures like images and sounds. Caches are a common source of memory leaks. Once an object reference is placed into a cache, it's easy to forget about it and leave it there long after it becomes irrelevant.

To address this, you might need to implement a cache where an entry remains relevant only as long as there are external references to its key, outside of the cache itself. Weak references leverage the garbage collector's ability to automatically determine reachability for you.

You can create and use a `WeakReference` like this (for an imaginary `Car` object and `car` object instance):

```java
// Create a weak car reference.
WeakReference<Car> weakCar = new WeakReference<Car>(car);

// Then, to get the actual car instance, use:
Car weakCarRef = weakCar.get();
```

A weak reference is not strong enough to prevent garbage collection. Therefore, you may find that `.get()` suddenly starts returning `null`. While this is often the desired behavior for specific use cases, `WeakReferences` are commonly used in conjunction with the `WeakHashMap` class.

In a `WeakHashMap`, entries are automatically removed once they become obsolete. Remember that `WeakHashMap` is particularly useful when the desired lifetime of cache entries is determined by external references to the _key_, not the _value_.

Using `WeakHashMap` is straightforward because it implements the standard `Map` interface, just like `HashMap` and other fundamental `Map` data structures in Java.

## Soft Reference

A soft reference is similar to a weak reference, but it is less aggressive in discarding the object it refers to. In practice, softly reachable objects are generally retained as long as memory is plentiful.

## Use it or not to use it?

Personally, I tend to avoid weak, soft, and phantom references because they essentially hand control of your program's object lifecycle to the garbage collector, allowing it to decide when to remove a reference, rather than you.

```

```
