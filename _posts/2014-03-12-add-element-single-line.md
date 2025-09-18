---
layout: post
title: Java - Passing Arrays and Collections as Method Arguments
date: 2014-03-12 16:21:00
description: A guide on how to pass array instances directly to methods in Java, and a technique using anonymous inner classes with instance initialization for collections.
tags: java, arrays, collections, programming, anonymous-classes
categories: java-concepts
---

Passing array instances as arguments in a single line of code is very useful. For example, you can do something like this:

```java
addNumbers(new int[] {1,2,3});
```

This works perfectly, but for **collections**, you cannot do that directly. However, by using anonymous inner classes with instance initialization, we can achieve a similar effect:

```java
addNumbers(new ArrayList<Integer>(3) {{ add(1); add(2); add(3); }});
```

Expanding this code makes its mechanism clearer:

```java
addNumbers(new ArrayList<Integer>(3) { // Anonymous class definition
  // Instance initialization block
  {
    add(1);
    add(2);
    add(3);
  }
});
```

For completeness, here are the `addNumbers` methods used in the examples:

```java
private static int addNumbers(int[] numbers) {
    int result = 0;
    for (int number : numbers) {
        result += number;
    }
    return result;
}

private static Integer addNumbers(Collection<Integer> numbers) {
    Integer result = 0;
    for (Integer number : numbers) {
        result += number;
    }
    return result;
}
```
