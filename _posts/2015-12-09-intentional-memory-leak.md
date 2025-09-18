---
layout: post
title: "Understanding Java Memory Leaks"
date: 2015-12-09 14:39:00
description: "This post delves into Java memory management, common types of OutOfMemoryError, and demonstrates how to create various memory leaks like byte, list, map key, and class leaks with practical examples."
tags: java, memory-management, memory-leak, outofmemoryerror, garbage-collection, permgen, heap-space, code-interview, programming
categories: java, memory
---

In Java, you might have the impression that you don't have to think about memory management. This is true for the majority of cases. However, there are limits. If you create too many objects of varying sizes too quickly, the garbage collector (GC) will work harder, leading to a slow application.

Memory can become more fragmented, which in turn forces the garbage collector to compact heap space, leading to long pauses or the dreaded `java.lang.OutOfMemoryError` exception. These long pause times are typically triggered when your Java program attempts to allocate a large object, such as an array.

Modern JVMs are very efficient and can deal effectively with rapid small object creation, but if you hit the limits, your application will either crash or become unresponsive.

The concept of a memory leak is simple: you introduce them by maintaining obsolete references to objects. An obsolete reference is simply one that will never be dereferenced again. This is often called a "simple memory leak."

There are also "true memory leaks." You introduce these leaks when you create objects that are inaccessible by running code but are still stored in memory.

One famous example of a true leak involves a concoction of a custom class loader, a long-running thread with thread-local variables, preferably within an application container. This scenario can be particularly tricky. This occurs because the `ThreadLocal` keeps a reference to the object, which keeps a reference to its `Class`, which in turn keeps a reference to its `ClassLoader`. The `ClassLoader`, in turn, keeps a reference to all the `Class`es it has loaded. With multiple redeployments, your application may fail with an unexpected permanent generation memory leak exception.

There are many types of `OutOfMemoryError`s. For more detailed descriptions, refer to the Oracle documentation on [memory leaks](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/memleaks002.html).

In practice, you will most often encounter these three types:

- `java.lang.OutOfMemoryError: Java heap space`
  - The Java heap space is exhausted.
- `java.lang.OutOfMemoryError: PermGen space`
  - The Permanent Generation space is full.
- `java.lang.OutOfMemoryError: GC Overhead limit exceeded`
  - The Garbage Collector is spending too much time collecting with little to no avail.

In this blog post, I've decided to demonstrate how easy it is to create memory leaks. These examples can be handy for code interviews or serve as good illustrations of what _not_ to do.

All examples are runnable. You simply need to clone the [`codingwithpassion/leaks` repository](https://github.com/spookysleeper/codingwithpassion/tree/master/leaks) and execute the Gradle script.

### Byte Leak

To run this example, type: `gradlew runByteTest`

This demonstrates a straightforward memory leak using an `ArrayList` and byte arrays. The list continuously grows, with each element holding a reference to a one-megabyte byte array. Arrays need to be allocated as contiguous chunks of memory within the heap space. If memory becomes fragmented, the JVM struggles and eventually throws a `java.lang.OutOfMemoryError: Java heap space` exception.

The code for this example is available as a Gist: [byteleak.js](https://gist.github.com/spookysleeper/9ac127b37334820272d6.js).

As you can see from the graph below, the Garbage Collector didn't stand a chance. It's a massacre!

![Byte Leak Heap Usage Graph](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhP3QoByMpEYiyHNF2D06bfEB7GVN4OS9SIvUGx7o50UkIsTjZO6oVkMm54pUMoff3mjtS7pUj2tjVZt-_SbAxt2OWUHdoxckCVoKsGivLYd2-h0YAfbYkVuUMjQyUlSMdA4Zro98SlCtNX/s400/byteleak.png)

### List Leak

To run this example, type: `gradlew runListTest`

The list leak is similar to the previous example. It creates a list of `BigDecimal` objects that are never dereferenced, making it simple and effective. `BigDecimal` is chosen because it is heavier than simpler types like `Integer` or `Float`.

The code for this example is available as a Gist: [listleak.js](https://gist.github.com/spookysleeper/37e96318216e32948690.js).

As the graph shows, the GC tries very hard to clean the heap but eventually fails.

![List Leak Heap Usage Graph](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjiyIpCLdKYJ_cCCtnhgvH_-kNDvU6kRHEVUI871dvkIcEMHSBIAN87QRxdh-nUGQqJzuzSditxvtvPRJ4pHjHR_J_ewPxePKP2gu1RO5YNN3b2dbLxa7ahI86tEMHom5mFaGFcvBCfXXf/s400/listleak.png)

### Map Key Leak

This next leak is a bit more sophisticated, but at its core, it's no different from the list leak. It demonstrates what happens when your `hashCode` implementation is poor. Elements will be added indefinitely, and each reference will remain active.

You can run this example by typing `gradlew runMapBadKeyTest`, or you can type `gradlew runMapGoodKeyTest` to test it with a correct key implementation.

The code for this example is available as a Gist: [mapleak.js](https://gist.github.com/spookysleeper/0bd5b80675ea4f736f76.js).

This time, the GC barely attempts to recover, possibly because `StringBuilder` objects with 100,000 elements are significantly heavier than `BigDecimal`, giving it no time to act.

![Map Key Leak Heap Usage Graph](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiF7klPDlLrXwWyA936Mq3jyarmtaPMOIkMBXurxv0KT8a4-YDj-68sAu7lYdBlUByJokY6TE0y2IiSUxF0rbrfm_MssvClgyJ4UNKHhLcw66TAKS-BOJi7DBcVueNy0GYxFvMpHOQxefSP/s400/mapleak.png)

### Class Leak

The Permanent Generation (PermGen) holds internal representations of Java classes, among other things (like class names, method data, and String literals). The simplest way to introduce a memory leak in this area is to create too many classes. Another more sophisticated example was mentioned earlier in this post as a "true memory leak."

To run this example, type: `gradlew runClassTest`

The code for this example is available as a Gist: [classleak.js](https://gist.github.com/spookysleeper/e314244ab1edf2b0b219.js).

As you can see, the situation escalates pretty quickly. Due to this rapid escalation, you might not always get a `PermGen` exception; the application might simply crash unexpectedly.

![Class Leak PermGen Usage Graph](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjthxfVot7F-nL0MI_DLym7xKK3k3nu7eCLVaR-j8KVdyrv8B_CuTMPVslhhVqQ8NZXJljBrSYjyqjgk_tTB46QUZbRRJJ517y6dRxVyxL7JF7sWA2RVut6uLOfikwLDkVT-IXpROhNl7EH/s400/classleak.png)

Thanks for reading! I hope you found this informative.
